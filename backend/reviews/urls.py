from django.urls import path
from .views import review_list, admin_reviews, service_reviews


urlpatterns = [
    path('', review_list, name='review-list'),
    path('admin/', admin_reviews, name='admin-reviews'),
    path('service/<int:service_id>/', service_reviews, name='service-reviews'),
]