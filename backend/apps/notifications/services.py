

"""SMS notification service using Africa's Talking."""
import logging
from django.conf import settings

logger = logging.getLogger(__name__)


def get_sms_client():
    """Get Africa's Talking SMS client."""
    try:
        import africastalking
        africastalking.initialize(
            username=settings.AFRICASTALKING_USERNAME,
            api_key=settings.AFRICASTALKING_API_KEY,
        )
        return africastalking.SMS
    except Exception as e:
        logger.warning(f"Africa's Talking not available: {e}")
        return None


def send_sms(phone_number, message):
    """Send an SMS via Africa's Talking."""
    if not phone_number:
        return False
    # Normalize Uganda phone number
    phone = phone_number.strip().replace(' ', '').replace('-', '')
    if phone.startswith('0'):
        phone = f'+256{phone[1:]}'
    elif phone.startswith('256'):
        phone = f'+{phone}'
    elif not phone.startswith('+'):
        phone = f'+256{phone}'

    sms = get_sms_client()
    if not sms:
        logger.info(f"[SMS MOCK] To: {phone} | Message: {message}")
        return True

    try:
        response = sms.send(message, [phone], sender_id='ExploreKig')
        logger.info(f"SMS sent to {phone}: {response}")
        return True
    except Exception as e:
        logger.error(f"SMS failed to {phone}: {e}")
        return False


def send_booking_notification(booking):
    """Notify host of a new booking via SMS."""
    host = booking.experience.host
    if not host.phone:
        return False

    message = (
        f"New Booking! 🎉\n"
        f"Ref: {booking.booking_reference}\n"
        f"Guest: {booking.tourist_name}\n"
        f"Experience: {booking.experience.title}\n"
        f"Date: {booking.booking_date.strftime('%d %b %Y')}\n"
        f"Group: {booking.group_size} person(s)\n"
        f"Amount: UGX {int(booking.total_price):,}\n"
        f"Your payout: UGX {int(booking.host_payout_amount):,}\n"
        f"Log in to Explore Kigezi to confirm."
    )
    return send_sms(host.phone, message)


def send_booking_confirmation_to_tourist(booking):
    """Send booking confirmation SMS to tourist."""
    if not booking.tourist_phone:
        return False
    message = (
        f"Booking Confirmed! ✅\n"
        f"Explore Kigezi\n"
        f"Ref: {booking.booking_reference}\n"
        f"Experience: {booking.experience.title}\n"
        f"Date: {booking.booking_date.strftime('%d %b %Y')}\n"
        f"Meeting point: {booking.experience.meeting_point}\n"
        f"Show this reference on arrival."
    )
    return send_sms(booking.tourist_phone, message)


def send_review_notification(review):
    """Notify host of a new review."""
    host = review.experience.host
    if not host.phone:
        return False
    stars = '★' * review.overall_rating + '☆' * (5 - review.overall_rating)
    message = (
        f"New Review {stars}\n"
        f"For: {review.experience.title}\n"
        f"By: {review.tourist_name}\n"
        f'"{review.comment[:80]}..."\n'
        f"Log in to Explore Kigezi to respond."
    )
    return send_sms(host.phone, message)