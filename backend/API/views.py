from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from django.contrib.auth.models import User
from .models import Job
from .tasks import execute_job
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
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreateJobSerializer
        return JobSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # Idempotency check: get existing job or create a new one scoped to this user
        job, created = Job.objects.get_or_create(
            type=serializer.validated_data['type'],
            idempotency_key=serializer.validated_data['idempotency_key'],
            user=self.request.user,
            defaults=serializer.validated_data
        )
        if created:
            job.status = "QUEUED"
            job.save(update_fields=["status"])
            
            queue = "default"

            if job.priority >= 8:
                queue = "high"
            elif job.priority <= 2:
                queue = "low"

            execute_job.apply_async(args=[str(job.id)], queue=queue)
        # Return existing job as-is for idempotent requests
        response_serializer = JobSerializer(job)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

class JobDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticated]
    
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
