

"""Views for experiences app."""
from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Category, Experience, ExperienceImage
from .serializers import (
    CategorySerializer, ExperienceListSerializer,
    ExperienceDetailSerializer, ExperienceCreateUpdateSerializer,
)
from .filters import ExperienceFilter
from apps.accounts.permissions import IsHost, IsPlatformAdmin


class ExperiencePagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = 'page_size'
    max_page_size = 48


# ── PUBLIC ENDPOINTS ──────────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([AllowAny])
def category_list(request):
    """List all categories."""
    categories = Category.objects.all()
    return Response(CategorySerializer(categories, many=True).data)


@api_view(['GET'])
@permission_classes([AllowAny])
def experience_list(request):
    """List approved experiences with filtering and search."""
    queryset = Experience.objects.filter(
        is_active=True, is_approved=True
    ).select_related('host', 'category')

    # Filter
    f = ExperienceFilter(request.GET, queryset=queryset)
    queryset = f.qs

    # Search
    search = request.GET.get('search', '').strip()
    if search:
        queryset = queryset.filter(
            title__icontains=search
        ) | queryset.filter(
            description__icontains=search
        ) | queryset.filter(
            location__icontains=search
        )

    # Sort
    ordering = request.GET.get('ordering', '-total_bookings')
    valid_orderings = [
        'price_per_person', '-price_per_person',
        '-average_rating', '-total_bookings',
        '-created_at', 'created_at',
    ]
    if ordering in valid_orderings:
        queryset = queryset.order_by(ordering)

    paginator = ExperiencePagination()
    page = paginator.paginate_queryset(queryset, request)
    serializer = ExperienceListSerializer(page, many=True)
    return paginator.get_paginated_response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def experience_detail(request, pk):
    """Get full detail of a single experience."""
    try:
        exp = Experience.objects.select_related(
            'host', 'category'
        ).prefetch_related('images').get(
            pk=pk, is_active=True, is_approved=True
        )
    except Experience.DoesNotExist:
        return Response(
            {'error': 'Experience not found.'},
            status=status.HTTP_404_NOT_FOUND
        )
    return Response(ExperienceDetailSerializer(exp).data)


@api_view(['GET'])
@permission_classes([AllowAny])
def featured_experiences(request):
    """Return top 6 featured or highest-rated experiences."""
    queryset = Experience.objects.filter(
        is_active=True, is_approved=True
    ).order_by('-is_featured', '-average_rating', '-total_bookings')[:6]
    return Response(ExperienceListSerializer(queryset, many=True).data)


@api_view(['GET'])
@permission_classes([AllowAny])
def similar_experiences(request, pk):
    """Return experiences similar to the given one (same category)."""
    try:
        exp = Experience.objects.get(pk=pk)
    except Experience.DoesNotExist:
        return Response([])
    similar = Experience.objects.filter(
        category=exp.category, is_active=True, is_approved=True
    ).exclude(pk=pk).order_by('-average_rating')[:3]
    return Response(ExperienceListSerializer(similar, many=True).data)


# ── HOST ENDPOINTS ────────────────────────────────────────────────────────────

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def host_experience_list_create(request):
    """List host's own experiences or create a new one."""
    if request.method == 'GET':
        if not request.user.is_host:
            return Response(
                {'error': 'Only hosts can access this.'},
                status=status.HTTP_403_FORBIDDEN
            )
        exps = Experience.objects.filter(
            host=request.user
        ).select_related('category')
        return Response(ExperienceDetailSerializer(exps, many=True).data)

    # POST — create
    if not request.user.is_host:
        return Response(
            {'error': 'Only hosts can create experiences.'},
            status=status.HTTP_403_FORBIDDEN
        )
    serializer = ExperienceCreateUpdateSerializer(data=request.data)
    if serializer.is_valid():
        exp = serializer.save(host=request.user, is_approved=False)
        return Response(
            ExperienceDetailSerializer(exp).data,
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def host_experience_detail(request, pk):
    """Retrieve, update, or delete a host's experience."""
    try:
        exp = Experience.objects.get(pk=pk, host=request.user)
    except Experience.DoesNotExist:
        return Response(
            {'error': 'Experience not found.'},
            status=status.HTTP_404_NOT_FOUND
        )

    if request.method == 'GET':
        return Response(ExperienceDetailSerializer(exp).data)

    if request.method in ['PUT', 'PATCH']:
        serializer = ExperienceCreateUpdateSerializer(
            exp, data=request.data,
            partial=(request.method == 'PATCH')
        )
        if serializer.is_valid():
            exp = serializer.save()
            return Response(ExperienceDetailSerializer(exp).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        exp.delete()
        return Response(
            {'message': 'Experience deleted.'},
            status=status.HTTP_204_NO_CONTENT
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_experience_images(request, pk):
    """Add image URLs to an experience."""
    try:
        exp = Experience.objects.get(pk=pk, host=request.user)
    except Experience.DoesNotExist:
        return Response(
            {'error': 'Experience not found.'},
            status=status.HTTP_404_NOT_FOUND
        )
    images_data = request.data.get('images', [])
    created = []
    for i, img in enumerate(images_data):
        obj = ExperienceImage.objects.create(
            experience=exp,
            image_url=img.get('url', ''),
            caption=img.get('caption', ''),
            order=i,
        )
        created.append({'id': obj.id, 'image_url': obj.image_url})
    return Response(
        {'message': f'{len(created)} images added.', 'images': created},
        status=status.HTTP_201_CREATED
    )


# ── ADMIN ENDPOINTS ───────────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsPlatformAdmin])
def admin_experience_list(request):
    """Admin: list all experiences including unapproved."""
    exps = Experience.objects.all().select_related('host', 'category')
    return Response(ExperienceListSerializer(exps, many=True).data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsPlatformAdmin])
def admin_approve_experience(request, pk):
    """Admin: approve an experience."""
    try:
        exp = Experience.objects.get(pk=pk)
    except Experience.DoesNotExist:
        return Response(
            {'error': 'Experience not found.'},
            status=status.HTTP_404_NOT_FOUND
        )
    exp.is_approved = True
    exp.save()
    return Response({'message': f'"{exp.title}" has been approved.'})