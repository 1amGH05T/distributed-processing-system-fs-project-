from celery import shared_task
from .job_router import route_job
from django.utils import timezone
from .models import Job, JobStatus


@shared_task(bind=True)
def execute_job(self, job_id):

    job = Job.objects.get(id=job_id)

    job.status = JobStatus.RUNNING
    job.attempts += 1
    job.save(update_fields=["status", "attempts"])

    try:

        # simulate processing
        result = route_job(job)

        job.status = JobStatus.COMPLETED
        job.result = result
        job.updated_at = timezone.now()

        job.save(update_fields=["status", "result", "updated_at"])

        return result

    except Exception as e:

        job.error = str(e)

        if job.attempts < job.max_attempts:

            job.status = JobStatus.RETRY
            job.save(update_fields=["status", "error"])

            raise self.retry(exc=e, countdown=5)

        job.status = JobStatus.DEAD
        job.save(update_fields=["status", "error"])

        raise