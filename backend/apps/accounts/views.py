

"""Views for accounts — auth, host, admin."""
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from .models import User
from .serializers import (
    UserSerializer, RegisterSerializer, LoginSerializer,
    HostRegisterSerializer, UpdateProfileSerializer,
)
from .permissions import IsPlatformAdmin, IsHost

User = get_user_model()


# ── AUTH ──────────────────────────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'Account created successfully.',
            'user': UserSerializer(user).data,
            'tokens': {'access': str(refresh.access_token), 'refresh': str(refresh)},
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'Login successful.',
            'user': UserSerializer(user).data,
            'tokens': {'access': str(refresh.access_token), 'refresh': str(refresh)},
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        token = RefreshToken(request.data.get('refresh'))
        token.blacklist()
    except (TokenError, Exception):
        pass
    return Response({'message': 'Logged out successfully.'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    return Response(UserSerializer(request.user).data)


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    serializer = UpdateProfileSerializer(request.user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({
            'message': 'Profile updated.',
            'user': UserSerializer(request.user).data,
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ── HOST ────────────────────────────���─────────────────────────────────────────

@api_view(['POST'])
@permission_classes([AllowAny])
def host_register(request):
    serializer = HostRegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'Host application submitted. You will be notified within 48 hours.',
            'user': UserSerializer(user).data,
            'tokens': {'access': str(refresh.access_token), 'refresh': str(refresh)},
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsHost])
def host_dashboard(request):
    from apps.bookings.models import Booking
    from apps.experiences.models import Experience
    from apps.reviews.models import Review
    from apps.bookings.serializers import BookingSerializer
    from apps.reviews.serializers import ReviewSerializer
    from django.db.models import Sum
    from django.utils import timezone
    import datetime

    host = request.user
    bookings = Booking.objects.filter(experience__host=host)
    now = timezone.now()
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    month_earnings = bookings.filter(
        created_at__gte=month_start, status__in=['confirmed', 'completed']
    ).aggregate(total=Sum('host_payout_amount'))['total'] or 0

    upcoming = bookings.filter(
        booking_date__gte=now.date(), status__in=['pending', 'confirmed']
    ).order_by('booking_date').select_related('experience')[:10]

    recent_reviews = Review.objects.filter(
        experience__host=host
    ).order_by('-created_at')[:3]

    # Monthly earnings chart (last 6 months)
    monthly_data = []
    for i in range(5, -1, -1):
        d = now - datetime.timedelta(days=i * 30)
        ms = d.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        me = (ms.replace(month=ms.month % 12 + 1, day=1) if ms.month < 12
              else ms.replace(year=ms.year + 1, month=1, day=1))
        amt = bookings.filter(
            created_at__gte=ms, created_at__lt=me,
            status__in=['confirmed', 'completed']
        ).aggregate(total=Sum('host_payout_amount'))['total'] or 0
        monthly_data.append({'month': d.strftime('%b'), 'earnings': float(amt)})

    experiences = Experience.objects.filter(host=host)
    ratings = [e.average_rating for e in experiences if e.average_rating]
    avg_rating = round(sum(ratings) / len(ratings), 1) if ratings else 0

    return Response({
        'stats': {
            'total_bookings': bookings.filter(status__in=['confirmed', 'completed']).count(),
            'this_month_earnings': float(month_earnings),
            'upcoming_bookings_count': upcoming.count(),
            'average_rating': avg_rating,
            'total_experiences': experiences.filter(is_active=True).count(),
        },
        'upcoming_bookings': BookingSerializer(upcoming, many=True).data,
        'recent_reviews': ReviewSerializer(recent_reviews, many=True).data,
        'monthly_earnings': monthly_data,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsHost])
def host_earnings(request):
    from apps.bookings.models import Booking
    from apps.bookings.serializers import BookingSerializer
    from django.db.models import Sum

    bookings = Booking.objects.filter(
        experience__host=request.user, status='completed'
    )
    return Response({
        'total_earnings': float(
            bookings.aggregate(total=Sum('host_payout_amount'))['total'] or 0
        ),
        'total_completed_bookings': bookings.count(),
        'recent_completed_bookings': BookingSerializer(
            bookings.order_by('-created_at')[:20], many=True
        ).data,
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def host_public_profile(request, host_id):
    try:
        host = User.objects.get(id=host_id, role='host')
    except User.DoesNotExist:
        return Response({'error': 'Host not found.'}, status=status.HTTP_404_NOT_FOUND)
    return Response(UserSerializer(host).data)


# ── ADMIN ─────────────────────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsPlatformAdmin])
def admin_all_hosts(request):
    status_filter = request.query_params.get('status', 'all')
    hosts = User.objects.filter(role='host')
    if status_filter == 'approved':
        hosts = hosts.filter(is_verified=True, is_active=True)
    elif status_filter == 'pending':
        hosts = hosts.filter(is_verified=False, is_active=True)
    elif status_filter == 'rejected':
        hosts = hosts.filter(is_active=False)
    return Response(UserSerializer(hosts, many=True).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsPlatformAdmin])
def admin_pending_hosts(request):
    hosts = User.objects.filter(role='host', is_verified=False, is_active=True)
    return Response(UserSerializer(hosts, many=True).data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsPlatformAdmin])
def admin_approve_host(request, host_id):
    try:
        host = User.objects.get(id=host_id, role='host')
    except User.DoesNotExist:
        return Response({'error': 'Host not found.'}, status=status.HTTP_404_NOT_FOUND)
    host.is_verified = True
    host.save()
    return Response({'message': f'{host.get_full_name()} approved as a host.'})


@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsPlatformAdmin])
def admin_reject_host(request, host_id):
    try:
        host = User.objects.get(id=host_id, role='host')
    except User.DoesNotExist:
        return Response({'error': 'Host not found.'}, status=status.HTTP_404_NOT_FOUND)
    host.is_active = False
    host.save()
    return Response({'message': 'Host application rejected.'})


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsPlatformAdmin])
def admin_stats(request):
    from apps.bookings.models import Booking
    from apps.experiences.models import Experience
    from django.db.models import Sum
    return Response({
        'total_bookings': Booking.objects.filter(
            status__in=['confirmed', 'completed']
        ).count(),
        'total_revenue': float(
            Booking.objects.filter(status='completed', payment_status='paid')
            .aggregate(total=Sum('total_price'))['total'] or 0
        ),
        'platform_commission': float(
            Booking.objects.filter(status='completed', payment_status='paid')
            .aggregate(total=Sum('platform_commission'))['total'] or 0
        ),
        'active_hosts': User.objects.filter(role='host', is_verified=True).count(),
        'pending_hosts': User.objects.filter(
            role='host', is_verified=False, is_active=True
        ).count(),
        'total_tourists': User.objects.filter(role='tourist').count(),
        'active_experiences': Experience.objects.filter(
            is_active=True, is_approved=True
        ).count(),
    })