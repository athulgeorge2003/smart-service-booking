from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status

from .models import Review
from .serializers import ReviewSerializer

from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from django.db.models import Avg


# Customer reviews
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def review_list(request):

    if request.method == 'GET':
        reviews = Review.objects.all().order_by('-created_at')
        serializer = ReviewSerializer(reviews, many=True)

        return Response(serializer.data)

    if request.method == 'POST':
        serializer = ReviewSerializer(data=request.data,context={'request': request})
        if serializer.is_valid():
            serializer.save(customer=request.user)

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


# Admin review management
@api_view(['GET', 'DELETE'])
@permission_classes([IsAdminUser])
def admin_reviews(request):

    if request.method == 'GET':
        reviews = Review.objects.all().order_by('-created_at')
        serializer = ReviewSerializer(reviews, many=True)

        return Response(serializer.data)

    if request.method == 'DELETE':
        review_id = request.data.get('review_id')

        if not review_id:
            return Response(
                {'error': 'review_id is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            review = Review.objects.get(id=review_id)
        except Review.DoesNotExist:
            return Response(
                {'error': 'Review not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        review.delete()

        return Response(
            {'message': 'Review deleted successfully.'},
            status=status.HTTP_200_OK
        )

@api_view(['GET'])
@permission_classes([AllowAny])
def service_reviews(request, service_id):

    reviews = Review.objects.filter(
        service_id=service_id
    ).order_by('-created_at')

    average_rating = reviews.aggregate(
        average=Avg('rating')
    )['average']

    serializer = ReviewSerializer(
        reviews,
        many=True,
        context={'request': request}
    )

    return Response({
        'average_rating': round(average_rating, 1)
        if average_rating else 0,
        'review_count': reviews.count(),
        'reviews': serializer.data,
    })        