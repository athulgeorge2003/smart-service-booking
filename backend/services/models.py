from django.db import models


class Service(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration = models.CharField(max_length=50)
    image = models.ImageField(
        upload_to='services/',
        blank=True,
        null=True
    )
    is_available = models.BooleanField(default=True)

    workers = models.ManyToManyField(
        'accounts.WorkerProfile',
        blank=True,
        related_name='services'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name