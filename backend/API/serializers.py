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
        extra_kwargs = {'password': {'write_only': True}}

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
    class Meta:
        model = Job
        fields = ['type', 'payload', 'priority', 'timeout_ms', 'max_attempts', 'idempotency_key']
