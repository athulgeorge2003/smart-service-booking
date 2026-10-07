from django.urls import path
from .views import contact_message, admin_contact_messages


urlpatterns = [
    path('', contact_message, name='contact-message'),
    path(
        'admin/',
        admin_contact_messages,
        name='admin-contact-messages'
    ),
]