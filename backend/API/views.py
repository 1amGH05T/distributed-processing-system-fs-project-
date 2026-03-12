from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from django.contrib.auth.models import User
from .models import Job
from .serializers import JobSerializer, CreateJobSerializer, RegisterSerializer, UserSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

class JobListCreateView(generics.ListCreateAPIView):
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Job.objects.all().order_by('-created_at')
        return Job.objects.filter(user=user).order_by('-created_at')
    # permission_classes = [IsAuthenticated] # Assuming JWT is setup

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreateJobSerializer
        return JobSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # Idempotency check handled by unique constraint or here custom logic
        job, created = Job.objects.get_or_create(
            type=serializer.validated_data['type'],
            idempotency_key=serializer.validated_data['idempotency_key'],
            user=self.request.user, # Ensure the correct user is checked
            defaults=serializer.validated_data
        )
        # If the job was not created, we want to update it if needed or just return it
        # Assuming we just return the existing job for idempotency
        response_serializer = JobSerializer(job)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class JobDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = JobSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Job.objects.all()
        return Job.objects.filter(user=user)

class UserListView(generics.ListAPIView):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

class UserDetailView(generics.RetrieveDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

class CheckAdminView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        return Response({"is_admin": request.user.is_staff}, status=status.HTTP_200_OK)
