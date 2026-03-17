import uuid
from django.db import models
from django.conf import settings

class JobStatus(models.TextChoices):
    CREATED = 'CREATED', 'Created'
    QUEUED = 'QUEUED', 'Queued'
    RUNNING = 'RUNNING', 'Running'
    COMPLETED = 'COMPLETED', 'Completed'
    RETRY = 'RETRY', 'Retry'
    DEAD = 'DEAD', 'Dead'

class Job(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='jobs')
    type = models.CharField(max_length=255)
    payload = models.JSONField(default=dict)
    priority = models.IntegerField(default=0)
    timeout_ms = models.IntegerField(default=10000)
    max_attempts = models.IntegerField(default=3)
    attempts = models.IntegerField(default=0)
    status = models.CharField(
        max_length=20,
        choices=JobStatus.choices,
        default=JobStatus.CREATED
    )
    result = models.JSONField(null=True, blank=True)
    error = models.TextField(null=True, blank=True)
    idempotency_key = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["status"]),
            models.Index(fields=["priority"]),
            models.Index(fields=["created_at"]),
            models.Index(fields=["idempotency_key"]),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'type', 'idempotency_key'], 
                name='unique_job_type_idempotency_key'
            )
        ]

    def __str__(self):
        return f"{self.type} - {self.id} ({self.status})"
