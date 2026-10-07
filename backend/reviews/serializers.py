from rest_framework import serializers

from .models import Review
from bookings.models import Booking


class ReviewSerializer(serializers.ModelSerializer):
    customer = serializers.ReadOnlyField(source='customer.username')

    class Meta:
        model = Review
        fields = [
            'id',
            'customer',
            'service',
            'rating',
            'comment',
            'created_at',
        ]

        read_only_fields = [
            'customer',
            'created_at',
        ]

    def validate(self, data):
        customer = self.context['request'].user
        service = data.get('service')

        completed_booking = Booking.objects.filter(
            customer=customer,
            service=service,
            status='Completed'
        ).exists()

        if not completed_booking:
            raise serializers.ValidationError(
                'You can review a service only after completing a booking.'
            )

        already_reviewed = Review.objects.filter(
            customer=customer,
            service=service
        ).exists()

        if already_reviewed:
            raise serializers.ValidationError(
                'You have already reviewed this service.'
            )

        return data