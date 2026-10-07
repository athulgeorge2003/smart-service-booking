from rest_framework import serializers
from django.contrib.auth.models import User
from .models import CustomerProfile


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    phone = serializers.CharField(write_only=True)
    address = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'username',
            'email',
            'password',
            'first_name',
            'last_name',
            'phone',
            'address',
        ]

    def create(self, validated_data):
        phone = validated_data.pop('phone')
        address = validated_data.pop('address')
        password = validated_data.pop('password')

        user = User.objects.create_user(
            password=password,
            **validated_data
        )

        CustomerProfile.objects.create(
            user=user,
            phone=phone,
            address=address
        )

        return user

class CustomerProfileSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    email = serializers.ReadOnlyField(source='user.email')
    first_name = serializers.ReadOnlyField(source='user.first_name')
    last_name = serializers.ReadOnlyField(source='user.last_name')

    class Meta:
        model = CustomerProfile
        fields = [
            'username',
            'email',
            'first_name',
            'last_name',
            'phone',
            'address',
            'profile_image',
        ]        