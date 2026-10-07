from rest_framework import serializers
from django.contrib.auth.models import User
from .models import WorkerProfile


class WorkerSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    email = serializers.EmailField(source='user.email')
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')

    class Meta:
        model = WorkerProfile
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'phone',
            'address',
            'profile_image',
            'is_available',
        ]


class WorkerCreateSerializer(serializers.Serializer):
    username = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    phone = serializers.CharField()
    address = serializers.CharField()
    is_available = serializers.BooleanField(default=True)

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
        )

        worker = WorkerProfile.objects.create(
            user=user,
            phone=validated_data['phone'],
            address=validated_data['address'],
            is_available=validated_data['is_available'],
        )

        return worker