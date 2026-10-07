from django.urls import path
from .views import (
    booking_list,
    booking_detail,
    admin_booking_list,
    booking_capacity,
)


urlpatterns = [
    path('', booking_list, name='booking-list'),
    path('<int:pk>/', booking_detail, name='booking-detail'),
    path('admin/', admin_booking_list, name='admin-booking-list'),
    path(
        'capacity/<int:service_id>/',
        booking_capacity,
        name='booking-capacity'
    ),
]