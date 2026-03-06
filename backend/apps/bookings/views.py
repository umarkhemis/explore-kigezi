

"""Views for bookings app."""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from .models import Booking
from .serializers import BookingSerializer, BookingCreateSerializer
from apps.accounts.permissions import IsHost, IsPlatformAdmin
from apps.notifications.services import send_booking_notification


# ── TOURIST BOOKING ENDPOINTS ─────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([AllowAny])
def create_booking(request):
    """Create a new booking (tourists + guests)."""
    serializer = BookingCreateSerializer(
        data=request.data, context={'request': request}
    )
    if serializer.is_valid():
        booking = serializer.save()

        # Send SMS notification to host
        try:
            send_booking_notification(booking)
        except Exception:
            pass  # Don't fail booking if notification fails

        return Response(
            BookingSerializer(booking).data,
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_bookings(request):
    """List all bookings for the authenticated tourist."""
    bookings = Booking.objects.filter(
        tourist=request.user
    ).select_related('experience', 'experience__category', 'experience__host')
    status_filter = request.GET.get('status')
    if status_filter:
        bookings = bookings.filter(status=status_filter)
    return Response(BookingSerializer(bookings, many=True).data)


@api_view(['GET'])
@permission_classes([AllowAny])
def booking_by_reference(request, reference):
    """Get booking details by reference number."""
    try:
        booking = Booking.objects.select_related(
            'experience', 'experience__host', 'experience__category'
        ).get(booking_reference=reference)
    except Booking.DoesNotExist:
        return Response(
            {'error': 'Booking not found.'},
            status=status.HTTP_404_NOT_FOUND
        )
    return Response(BookingSerializer(booking).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def booking_detail(request, pk):
    """Get booking detail by ID."""
    try:
        booking = Booking.objects.select_related(
            'experience', 'experience__host'
        ).get(pk=pk)
        # Only tourist or host or admin can view
        is_tourist = booking.tourist == request.user
        is_host = booking.experience.host == request.user
        is_admin = request.user.is_platform_admin
        if not (is_tourist or is_host or is_admin):
            return Response(
                {'error': 'Not authorized.'},
                status=status.HTTP_403_FORBIDDEN
            )
    except Booking.DoesNotExist:
        return Response(
            {'error': 'Booking not found.'},
            status=status.HTTP_404_NOT_FOUND
        )
    return Response(BookingSerializer(booking).data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def cancel_booking(request, pk):
    """Cancel a booking."""
    try:
        booking = Booking.objects.get(pk=pk)
        is_tourist = booking.tourist == request.user
        is_admin = request.user.is_platform_admin
        if not (is_tourist or is_admin):
            return Response(
                {'error': 'Not authorized.'},
                status=status.HTTP_403_FORBIDDEN
            )
    except Booking.DoesNotExist:
        return Response(
            {'error': 'Booking not found.'},
            status=status.HTTP_404_NOT_FOUND
        )

    if not booking.can_be_cancelled():
        return Response(
            {'error': 'This booking cannot be cancelled.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    booking.status = 'cancelled'
    booking.save()
    return Response({'message': 'Booking cancelled successfully.'})


# ── HOST BOOKING ENDPOINTS ────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsHost])
def host_bookings(request):
    """List all bookings for the host's experiences."""
    bookings = Booking.objects.filter(
        experience__host=request.user
    ).select_related('experience', 'tourist')
    status_filter = request.GET.get('status')
    if status_filter:
        bookings = bookings.filter(status=status_filter)
    return Response(BookingSerializer(bookings, many=True).data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsHost])
def confirm_booking(request, pk):
    """Host confirms a pending booking."""
    try:
        booking = Booking.objects.get(
            pk=pk, experience__host=request.user
        )
    except Booking.DoesNotExist:
        return Response(
            {'error': 'Booking not found.'},
            status=status.HTTP_404_NOT_FOUND
        )

    if booking.status != 'pending':
        return Response(
            {'error': f'Cannot confirm a {booking.status} booking.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    booking.status = 'confirmed'
    booking.save()
    return Response({
        'message': 'Booking confirmed.',
        'booking': BookingSerializer(booking).data,
    })


@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsHost])
def complete_booking(request, pk):
    """Host marks a booking as completed."""
    try:
        booking = Booking.objects.get(
            pk=pk, experience__host=request.user
        )
    except Booking.DoesNotExist:
        return Response(
            {'error': 'Booking not found.'},
            status=status.HTTP_404_NOT_FOUND
        )

    if booking.status != 'confirmed':
        return Response(
            {'error': 'Only confirmed bookings can be marked as completed.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    booking.status = 'completed'
    booking.save()
    return Response({
        'message': 'Booking marked as completed. Payout will be processed.',
        'booking': BookingSerializer(booking).data,
    })


# ── ADMIN BOOKING ENDPOINTS ───────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsPlatformAdmin])
def admin_all_bookings(request):
    """Admin: list all bookings with optional filters."""
    bookings = Booking.objects.all().select_related(
        'experience', 'experience__host', 'tourist'
    )
    status_filter = request.GET.get('status')
    if status_filter:
        bookings = bookings.filter(status=status_filter)
    return Response(BookingSerializer(bookings, many=True).data)