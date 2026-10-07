from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status

from .models import Booking
from .serializers import BookingSerializer, AdminBookingSerializer

from accounts.models import WorkerProfile

from services.models import Service


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def booking_list(request):

    if request.method == 'GET':
        bookings = Booking.objects.filter(
            customer=request.user
        ).order_by('-created_at')

        serializer = BookingSerializer(bookings, many=True)

        return Response(serializer.data)

    if request.method == 'POST':
        serializer = BookingSerializer(data=request.data)

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

@api_view(['GET', 'DELETE'])
@permission_classes([IsAuthenticated])
def booking_detail(request, pk):

    try:
        booking = Booking.objects.get(
            pk=pk,
            customer=request.user
        )
    except Booking.DoesNotExist:
        return Response(
            {'error': 'Booking not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    if request.method == 'GET':
        serializer = BookingSerializer(booking)
        return Response(serializer.data)

    if request.method == 'DELETE':

        if booking.status != 'Pending':
            return Response(
                {
                    'error': 'Only pending bookings can be cancelled.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        booking.status = 'Cancelled'
        booking.save()

        return Response(
            {'message': 'Booking cancelled successfully.'},
            status=status.HTTP_200_OK
        )

@api_view(['GET', 'PATCH'])
@permission_classes([IsAdminUser])
def admin_booking_list(request):

    active_statuses = [
        'Pending',
        'Confirmed',
        'Assigned',
        'In Progress',
    ]

    if request.method == 'GET':
        bookings = Booking.objects.all().order_by('-created_at')

        serializer = AdminBookingSerializer(
            bookings,
            many=True
        )

        return Response(serializer.data)

    booking_id = request.data.get('booking_id')
    new_status = request.data.get('status')
    worker_id = request.data.get('worker_id')

    if not booking_id:
        return Response(
            {'error': 'booking_id is required.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        booking = Booking.objects.get(id=booking_id)
    except Booking.DoesNotExist:
        return Response(
            {'error': 'Booking not found.'},
            status=status.HTTP_404_NOT_FOUND
        )

    if booking.status in ['Completed', 'Cancelled']:
        if worker_id is not None:
            return Response(
                {
                    'error': (
                        'Workers cannot be assigned to a '
                        'completed or cancelled booking.'
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

    if new_status:
        valid_statuses = [
            'Pending',
            'Confirmed',
            'Assigned',
            'In Progress',
            'Completed',
            'Cancelled',
        ]

        if new_status not in valid_statuses:
            return Response(
                {'error': 'Invalid booking status.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        booking.status = new_status

    if worker_id is not None:

        try:
            worker = WorkerProfile.objects.get(
                id=worker_id
            )
        except WorkerProfile.DoesNotExist:
            return Response(
                {'error': 'Worker not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Worker must be qualified for this service
        is_qualified = booking.service.workers.filter(
            id=worker.id
        ).exists()

        if not is_qualified:
            return Response(
                {
                    'error': (
                        'This worker is not assigned '
                        'to this service.'
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Worker must be available
        if not worker.is_available:
            return Response(
                {
                    'error': (
                        'Selected worker is currently unavailable.'
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check whether this worker is already busy
        worker_is_busy = Booking.objects.filter(
            assigned_worker=worker,
            booking_date=booking.booking_date,
            booking_time=booking.booking_time,
            status__in=active_statuses
        ).exclude(
            id=booking.id
        ).exists()

        if worker_is_busy:
            return Response(
                {
                    'error': (
                        'This worker is already assigned '
                        'to another booking at this date and time.'
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        booking.assigned_worker = worker

        if not new_status:
            booking.status = 'Assigned'

    booking.save()

    serializer = AdminBookingSerializer(booking)

    return Response(serializer.data)


@api_view(['GET'])
def booking_capacity(request, service_id):
    booking_date = request.query_params.get('date')
    booking_time = request.query_params.get('time')

    if not booking_date or not booking_time:
        return Response(
            {
                'error': 'date and time are required.'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        service = Service.objects.get(id=service_id)
    except Service.DoesNotExist:
        return Response(
            {'error': 'Service not found.'},
            status=status.HTTP_404_NOT_FOUND
        )

    qualified_workers = service.workers.filter(
        is_available=True
    )

    total_workers = qualified_workers.count()

    active_bookings = Booking.objects.filter(
        service=service,
        booking_date=booking_date,
        booking_time=booking_time,
        status__in=[
            'Pending',
            'Confirmed',
            'Assigned',
            'In Progress',
        ]
    ).count()

    remaining_slots = max(
        total_workers - active_bookings,
        0
    )

    return Response({
        'service_id': service.id,
        'service_name': service.name,
        'date': booking_date,
        'time': booking_time,
        'total_workers': total_workers,
        'active_bookings': active_bookings,
        'remaining_slots': remaining_slots,
        'available': remaining_slots > 0,
    })    