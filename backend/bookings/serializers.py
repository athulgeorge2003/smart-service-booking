from django.utils import timezone
from rest_framework import serializers

from .models import Booking


class BookingSerializer(serializers.ModelSerializer):
    customer = serializers.ReadOnlyField(
        source='customer.username'
    )

    service_name = serializers.ReadOnlyField(
        source='service.name'
    )

    assigned_worker_name = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = [
            'id',
            'customer',
            'service',
            'service_name',
            'assigned_worker',
            'assigned_worker_name',
            'booking_date',
            'booking_time',
            'address',
            'phone',
            'notes',
            'status',
            'payment_status',
            'created_at',
        ]

        read_only_fields = [
            'customer',
            'service_name',
            'assigned_worker_name',
            'status',
            'payment_status',
            'created_at',
        ]

    def get_assigned_worker_name(self, obj):
        if obj.assigned_worker:
            return obj.assigned_worker.user.get_full_name()

        return None

    def validate(self, data):
        service = data.get('service')
        booking_date = data.get('booking_date')
        booking_time = data.get('booking_time')

        # Service must be available
        if not service.is_available:
            raise serializers.ValidationError({
                'service': 'This service is currently unavailable.'
            })

        today = timezone.localdate()

        # Prevent past dates
        if booking_date < today:
            raise serializers.ValidationError({
                'booking_date': 'You cannot select a past date.'
            })

        # Prevent past time when booking for today
        if booking_date == today:
            current_time = timezone.localtime().time()

            if booking_time <= current_time:
                raise serializers.ValidationError({
                    'booking_time': 'Please select a future time.'
                })

        # Workers qualified for this service
        qualified_workers = service.workers.filter(
            is_available=True
        )

        worker_capacity = qualified_workers.count()

        if worker_capacity == 0:
            raise serializers.ValidationError({
                'service': (
                    'No workers are currently available '
                    'for this service.'
                )
            })

        # Active bookings for the same service/date/time
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

        if active_bookings >= worker_capacity:
            raise serializers.ValidationError({
                'booking_time': (
                    'No workers are available for this '
                    'service at the selected date and time.'
                )
            })

        return data


class AdminBookingSerializer(serializers.ModelSerializer):
    customer = serializers.ReadOnlyField(
        source='customer.username'
    )

    service_name = serializers.ReadOnlyField(
        source='service.name'
    )

    assigned_worker_name = serializers.SerializerMethodField()
    available_workers = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = [
            'id',
            'customer',
            'service',
            'service_name',
            'assigned_worker',
            'assigned_worker_name',
            'available_workers',
            'booking_date',
            'booking_time',
            'address',
            'phone',
            'notes',
            'status',
            'payment_status',
            'created_at',
        ]

    def get_assigned_worker_name(self, obj):
        if obj.assigned_worker:
            return obj.assigned_worker.user.get_full_name()

        return None

    def get_available_workers(self, obj):
        active_statuses = [
            'Pending',
            'Confirmed',
            'Assigned',
            'In Progress',
        ]

        qualified_workers = obj.service.workers.filter(
            is_available=True
        )

        busy_worker_ids = Booking.objects.filter(
            booking_date=obj.booking_date,
            booking_time=obj.booking_time,
            status__in=active_statuses,
            assigned_worker__in=qualified_workers
        ).exclude(
            id=obj.id
        ).values_list(
            'assigned_worker_id',
            flat=True
        )

        available_workers = qualified_workers.exclude(
            id__in=busy_worker_ids
        )

        workers = []

        for worker in available_workers:
            workers.append({
                'id': worker.id,
                'name': worker.user.get_full_name()
            })

        # Keep the current worker visible
        if obj.assigned_worker:
            already_added = any(
                worker['id'] == obj.assigned_worker.id
                for worker in workers
            )

            if not already_added:
                workers.append({
                    'id': obj.assigned_worker.id,
                    'name': obj.assigned_worker.user.get_full_name()
                })

        return workers