from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.pagination import PageNumberPagination
from django.contrib.auth.models import User
from django.db import transaction
from .models import Job, JobStatus
from .tasks import execute_job
from .serializers import JobSerializer, CreateJobSerializer, RegisterSerializer, UserSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

class JobListCreatePagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100

class JobListCreateView(generics.ListCreateAPIView):
    pagination_class = JobListCreatePagination

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

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = self.request.user
        validated_data = serializer.validated_data.copy()

        # Atomically find or create — the DB UniqueConstraint on
        # (user, type, idempotency_key) is the real guard.
        # select_for_update locks the row so concurrent requests wait.
        defaults = {k: v for k, v in validated_data.items()
                    if k not in ('type', 'idempotency_key')}
        defaults['user'] = user

        job, created = Job.objects.select_for_update().get_or_create(
            user=user,
            type=validated_data['type'],
            idempotency_key=validated_data['idempotency_key'],
            defaults=defaults,
        )

        if created:
            job.status = JobStatus.QUEUED
            job.save(update_fields=["status"])

            # Queue routing by priority
            if job.priority >= 7:
                queue = "high"
            elif job.priority <= 3:
                queue = "low"
            else:
                queue = "default"

            execute_job.apply_async(args=[str(job.id)], queue=queue)

        response_serializer = JobSerializer(job)
        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
        )

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
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return User.objects.all()

    def destroy(self, request, *args, **kwargs):
        # SEC-7: Prevent an admin from deleting their own account
        instance = self.get_object()
        if instance == request.user:
            return Response(
                {"detail": "You cannot delete your own account."},
                status=status.HTTP_400_BAD_REQUEST
            )
        return super().destroy(request, *args, **kwargs)

class CheckAdminView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        return Response({"is_admin": request.user.is_staff}, status=status.HTTP_200_OK)
