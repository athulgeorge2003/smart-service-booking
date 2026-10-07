from django.contrib import admin

from .models import Service


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'price',
        'duration',
        'is_available',
        'created_at',
    )

    list_filter = (
        'is_available',
    )

    search_fields = (
        'name',
    )

    filter_horizontal = (
        'workers',
    )