from django.urls import path
from .views import (register,login,profile,admin_dashboard,admin_workers,admin_worker_update)

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', login, name='login'),
    path('profile/', profile, name='profile'),
    path('admin-dashboard/', admin_dashboard, name='admin-dashboard'),
    path('admin/workers/', admin_workers, name='admin-workers'),
    path('admin/workers/<int:pk>/', admin_worker_update, name='admin-worker-update'),
]