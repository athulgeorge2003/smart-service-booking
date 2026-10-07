from django.db import models
from django.contrib.auth.models import User
from services.models import Service


class Review(models.Model):
    RATING_CHOICES = [
        (1, '1 Star'),
        (2, '2 Stars'),
        (3, '3 Stars'),
        (4, '4 Stars'),
        (5, '5 Stars'),
    ]

    customer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='reviews'
    )

    service = models.ForeignKey(
        Service,
        on_delete=models.CASCADE,
        related_name='reviews'
    )

    rating = models.PositiveSmallIntegerField(
        choices=RATING_CHOICES
    )

    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['customer', 'service'],
                name='unique_customer_service_review'
            )
        ]

    def __str__(self):
        return f"{self.customer.username} - {self.service.name} - {self.rating}"