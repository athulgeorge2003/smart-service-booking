from rest_framework import serializers
from .models import Service
from accounts.models import WorkerProfile


class ServiceSerializer(serializers.ModelSerializer):
    workers = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=WorkerProfile.objects.all(),
        required=False
    )

    class Meta:
        model = Service
        fields = [
            'id',
            'name',
            'description',
            'price',
            'duration',
            'image',
            'is_available',
            'workers',
            'created_at',
        ]

        read_only_fields = [
            'id',
            'created_at',
        ]