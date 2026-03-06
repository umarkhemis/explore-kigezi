

"""Views for reviews app."""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from .models import Review
from .serializers import ReviewSerializer, ReviewCreateSerializer, HostResponseSerializer
from apps.accounts.permissions import IsHost


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_review(request):
    """Tourist creates a review for a completed booking."""
    serializer = ReviewCreateSerializer(
        data=request.data, context={'request': request}
    )
    if serializer.is_valid():
        review = serializer.save()
        return Response(
            ReviewSerializer(review).data,
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])
def experience_reviews(request, experience_id):
    """List all reviews for a specific experience."""
    reviews = Review.objects.filter(
        experience_id=experience_id, is_verified=True
    ).select_related('tourist', 'experience')

    # Rating summary
    count = reviews.count()
    summary = {
        'total': count,
        'average': 0,
        'breakdown': {1: 0, 2: 0, 3: 0, 4: 0, 5: 0},
        'would_recommend_pct': 0,
    }
    if count > 0:
        total_rating = sum(r.overall_rating for r in reviews)
        summary['average'] = round(total_rating / count, 1)
        for r in reviews:
            summary['breakdown'][r.overall_rating] += 1
        recommend_count = reviews.filter(would_recommend=True).count()
        summary['would_recommend_pct'] = round(
            (recommend_count / count) * 100
        )

    return Response({
        'summary': summary,
        'reviews': ReviewSerializer(reviews, many=True).data,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_reviews(request):
    """List all reviews written by the current tourist."""
    reviews = Review.objects.filter(
        tourist=request.user
    ).select_related('experience')
    return Response(ReviewSerializer(reviews, many=True).data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsHost])
def respond_to_review(request, pk):
    """Host responds to a review on their experience."""
    try:
        review = Review.objects.get(
            pk=pk, experience__host=request.user
        )
    except Review.DoesNotExist:
        return Response(
            {'error': 'Review not found.'},
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = HostResponseSerializer(
        review, data=request.data, partial=True
    )
    if serializer.is_valid():
        review = serializer.save()
        return Response(ReviewSerializer(review).data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_review(request, pk):
    """Tourist deletes their own review."""
    try:
        review = Review.objects.get(pk=pk, tourist=request.user)
    except Review.DoesNotExist:
        return Response(
            {'error': 'Review not found.'},
            status=status.HTTP_404_NOT_FOUND
        )
    review.delete()
    return Response(
        {'message': 'Review deleted.'},
        status=status.HTTP_204_NO_CONTENT
    )