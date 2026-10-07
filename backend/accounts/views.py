from django.contrib.auth import authenticate

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from rest_framework_simplejwt.tokens import RefreshToken

from .models import CustomerProfile
from .serializers import RegisterSerializer, CustomerProfileSerializer

from rest_framework.permissions import IsAdminUser
from django.contrib.auth.models import User
from services.models import Service
from bookings.models import Booking
from accounts.models import WorkerProfile

from rest_framework.permissions import IsAdminUser
from .worker_serializers import WorkerSerializer, WorkerCreateSerializer
from .models import WorkerProfile


@api_view(['POST'])
def register(request):
    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.save()

        return Response(
            {
                'message': 'Registration successful',
                'user_id': user.id,
                'username': user.username,
            },
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(
        username=username,
        password=password
    )

    if user is None:
        return Response(
            {'error': 'Invalid username or password'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    refresh = RefreshToken.for_user(user)

    return Response({
        'message': 'Login successful',
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'user_id': user.id,
        'username': user.username,
        'is_staff': user.is_staff,

    })


@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def profile(request):

    try:
        customer_profile = CustomerProfile.objects.get(
            user=request.user
        )
    except CustomerProfile.DoesNotExist:
        return Response(
            {'error': 'Customer profile not found.'},
            status=status.HTTP_404_NOT_FOUND
        )

    if request.method == 'GET':
        serializer = CustomerProfileSerializer(customer_profile)
        return Response(serializer.data)

    if request.method == 'PATCH':
        serializer = CustomerProfileSerializer(
            customer_profile,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_dashboard(request):

    total_customers = User.objects.filter(
        is_staff=False
    ).count()

    total_services = Service.objects.count()

    total_bookings = Booking.objects.count()

    pending_bookings = Booking.objects.filter(
        status='Pending'
    ).count()

    completed_bookings = Booking.objects.filter(
        status='Completed'
    ).count()

    total_workers = WorkerProfile.objects.count()

    return Response({
        'total_customers': total_customers,
        'total_services': total_services,
        'total_bookings': total_bookings,
        'pending_bookings': pending_bookings,
        'completed_bookings': completed_bookings,
        'total_workers': total_workers,
    })        

@api_view(['GET', 'POST'])
@permission_classes([IsAdminUser])
def admin_workers(request):

    if request.method == 'GET':
        workers = WorkerProfile.objects.all().order_by('user__username')
        serializer = WorkerSerializer(workers, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = WorkerCreateSerializer(data=request.data)

        if serializer.is_valid():
            worker = serializer.save()

            return Response(
                WorkerSerializer(worker).data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def admin_worker_update(request, pk):

    try:
        worker = WorkerProfile.objects.get(pk=pk)
    except WorkerProfile.DoesNotExist:
        return Response(
            {'error': 'Worker not found.'},
            status=status.HTTP_404_NOT_FOUND
        )

    if 'is_available' in request.data:
        worker.is_available = request.data['is_available']
        worker.save()

    return Response(
        WorkerSerializer(worker).data
    )            