from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Job

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True},
            'username': {'required': True},
            'email': {'required': True},
        }

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError('Username already taken.')
        return value

    def validate_email(self, value):
        if not value:
            raise serializers.ValidationError('Email is required.')
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError('An account with this email already exists.')
        return value.lower()

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user


class JobSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Job
        fields = '__all__'
        read_only_fields = ['id', 'status', 'attempts', 'user', 'username', 'created_at', 'updated_at']

class CreateJobSerializer(serializers.ModelSerializer):
    priority = serializers.IntegerField(required=False, default=0)
    timeout_ms = serializers.IntegerField(required=False, default=10000)
    max_attempts = serializers.IntegerField(required=False, default=3)
    payload = serializers.JSONField(required=False, default=dict)
    
    class Meta:
        model = Job
        fields = ['type', 'payload', 'priority', 'timeout_ms', 'max_attempts', 'idempotency_key']

    # Idempotency now handled atomically in view
