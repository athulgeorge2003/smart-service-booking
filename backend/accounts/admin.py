from django.contrib import admin
from .models import CustomerProfile, WorkerProfile


@admin.register(CustomerProfile)
class CustomerProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone')
    search_fields = ('user__username', 'phone')


@admin.register(WorkerProfile)
class WorkerProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone', 'is_available')
    list_filter = ('is_available',)
    search_fields = ('user__username', 'phone')