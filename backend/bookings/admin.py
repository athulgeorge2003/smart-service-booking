from django.contrib import admin
from .models import Booking


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = (
        'customer',
        'service',
        'assigned_worker',
        'booking_date',
        'booking_time',
        'status',
        'payment_status',
    )

    list_filter = (
        'status',
        'payment_status',
        'booking_date',
    )

    search_fields = (
        'customer__username',
        'service__name',
        'phone',
    )