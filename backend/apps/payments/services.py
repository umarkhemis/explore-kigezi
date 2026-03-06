

"""Flutterwave payment service."""
import uuid
import requests
from django.conf import settings


FLUTTERWAVE_BASE_URL = 'https://api.flutterwave.com/v3'


def get_headers():
    return {
        'Authorization': f'Bearer {settings.FLUTTERWAVE_SECRET_KEY}',
        'Content-Type': 'application/json',
    }


def generate_tx_ref(booking_reference):
    """Generate unique transaction reference."""
    return f"EK-{booking_reference}-{uuid.uuid4().hex[:8].upper()}"


def initiate_mobile_money_payment(booking, phone_number, provider):
    """
    Initiate MTN or Airtel mobile money payment via Flutterwave.
    Returns: dict with tx_ref, status, message
    """
    tx_ref = generate_tx_ref(booking.booking_reference)

    network_map = {'mtn': 'MTN', 'airtel': 'AIRTEL'}
    network = network_map.get(provider, 'MTN')

    payload = {
        'phone_number': phone_number,
        'amount': str(booking.total_price),
        'currency': 'UGX',
        'email': booking.tourist_email,
        'tx_ref': tx_ref,
        'order_id': booking.booking_reference,
        'network': network,
    }

    try:
        response = requests.post(
            f'{FLUTTERWAVE_BASE_URL}/charges?type=mobile_money_uganda',
            json=payload,
            headers=get_headers(),
            timeout=30,
        )
        data = response.json()
        return {
            'success': data.get('status') == 'success',
            'tx_ref': tx_ref,
            'message': data.get('message', ''),
            'data': data,
        }
    except requests.RequestException as e:
        return {
            'success': False,
            'tx_ref': tx_ref,
            'message': str(e),
            'data': {},
        }


def verify_payment(tx_ref):
    """
    Verify payment status from Flutterwave.
    Returns: dict with status and transaction data
    """
    try:
        response = requests.get(
            f'{FLUTTERWAVE_BASE_URL}/transactions/verify_by_reference'
            f'?tx_ref={tx_ref}',
            headers=get_headers(),
            timeout=30,
        )
        data = response.json()
        if data.get('status') == 'success':
            tx_data = data.get('data', {})
            return {
                'verified': tx_data.get('status') == 'successful',
                'amount': tx_data.get('amount', 0),
                'currency': tx_data.get('currency', 'UGX'),
                'tx_id': str(tx_data.get('id', '')),
                'data': tx_data,
            }
        return {'verified': False, 'data': data}
    except requests.RequestException as e:
        return {'verified': False, 'error': str(e)}