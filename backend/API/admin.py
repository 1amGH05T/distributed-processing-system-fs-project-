from django.contrib import admin
from .models import Job

@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ('id', 'type', 'user', 'status', 'created_at')
    list_filter = ('status', 'user')
    search_fields = ('type', 'idempotency_key', 'user__username')
