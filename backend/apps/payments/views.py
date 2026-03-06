

"""Payment views — initiate, verify, webhook."""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt

from .models import Payment
from .services import initiate_mobile_money_payment, verify_payment
from apps.bookings.models import Booking


@api_view(['POST'])
@permission_classes([AllowAny])
def initiate_payment(request):
    """Initiate a mobile money payment for a booking."""
    booking_reference = request.data.get('booking_reference')
    phone_number = request.data.get('phone_number')
    provider = request.data.get('provider', 'mtn')  # mtn or airtel

    if not booking_reference or not phone_number:
        return Response(
            {'error': 'booking_reference and phone_number are required.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        booking = Booking.objects.get(booking_reference=booking_reference)
    except Booking.DoesNotExist:
        return Response(
            {'error': 'Booking not found.'},
            status=status.HTTP_404_NOT_FOUND
        )

    if booking.payment_status == 'paid':
        return Response(
            {'error': 'This booking is already paid.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    result = initiate_mobile_money_payment(booking, phone_number, provider)

    # Record payment attempt
    Payment.objects.create(
        booking=booking,
        amount=booking.total_price,
        currency='UGX',
        payment_method=provider,
        tx_ref=result['tx_ref'],
        status='pending',
        phone_number=phone_number,
        flutterwave_response=result.get('data', {}),
    )

    if result['success']:
        return Response({
            'message': (
                'Payment initiated. Please check your phone for '
                'a prompt to enter your PIN.'
            ),
            'tx_ref': result['tx_ref'],
            'status': 'pending',
        })
    else:
        return Response({
            'message': result.get('message', 'Payment initiation failed.'),
            'tx_ref': result['tx_ref'],
            'status': 'failed',
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_payment_view(request):
    """Verify payment status and update booking."""
    tx_ref = request.data.get('tx_ref')
    if not tx_ref:
        return Response(
            {'error': 'tx_ref is required.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    result = verify_payment(tx_ref)

    try:
        payment = Payment.objects.get(tx_ref=tx_ref)
        if result.get('verified'):
            payment.status = 'successful'
            payment.provider_tx_id = result.get('tx_id', '')
            payment.flutterwave_response = result.get('data', {})
            payment.save()

            # Update booking
            booking = payment.booking
            booking.payment_status = 'paid'
            booking.status = 'confirmed'
            booking.flutterwave_tx_ref = tx_ref
            booking.flutterwave_tx_id = result.get('tx_id', '')
            booking.save()

            return Response({
                'verified': True,
                'message': 'Payment successful! Your booking is confirmed.',
                'booking_reference': booking.booking_reference,
            })
        else:
            payment.status = 'failed'
            payment.save()
            return Response({
                'verified': False,
                'message': 'Payment not yet confirmed. Please try again.',
            })
    except Payment.DoesNotExist:
        return Response(
            {'error': 'Payment record not found.'},
            status=status.HTTP_404_NOT_FOUND
        )


@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def flutterwave_webhook(request):
    """Handle Flutterwave payment webhook."""
    import hmac
    import hashlib
    from django.conf import settings

    # Verify webhook signature
    secret_hash = settings.FLUTTERWAVE_SECRET_KEY
    signature = request.headers.get('verif-hash', '')
    if signature != secret_hash:
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    payload = request.data
    event = payload.get('event')

    if event == 'charge.completed':
        tx_ref = payload.get('data', {}).get('tx_ref', '')
        tx_status = payload.get('data', {}).get('status', '')

        if tx_status == 'successful':
            try:
                payment = Payment.objects.get(tx_ref=tx_ref)
                payment.status = 'successful'
                payment.flutterwave_response = payload.get('data', {})
                payment.save()

                booking = payment.booking
                booking.payment_status = 'paid'
                booking.status = 'confirmed'
                booking.save()
            except Payment.DoesNotExist:
                pass

    return Response({'status': 'ok'})