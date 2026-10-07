from django.db import models
from django.contrib.auth.models import User
from services.models import Service
from accounts.models import WorkerProfile


class Booking(models.Model):

    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Confirmed', 'Confirmed'),
        ('Assigned', 'Assigned'),
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed'),
        ('Cancelled', 'Cancelled'),
    ]

    PAYMENT_STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Paid', 'Paid'),
        ('Failed', 'Failed'),
    ]

    customer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='bookings'
    )

    service = models.ForeignKey(
        Service,
        on_delete=models.CASCADE,
        related_name='bookings'
    )
    assigned_worker = models.ForeignKey(
    WorkerProfile,
    on_delete=models.SET_NULL,
    related_name='assigned_bookings',
    blank=True,
    null=True
)

    booking_date = models.DateField()
    booking_time = models.TimeField()

    address = models.TextField()
    phone = models.CharField(max_length=15)
    notes = models.TextField(blank=True, null=True)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='Pending'
    )

    payment_status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS_CHOICES,
        default='Pending'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.customer.username} - {self.service.name}"