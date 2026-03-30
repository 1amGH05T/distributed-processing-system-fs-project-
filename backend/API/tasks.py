from celery import shared_task
from .job_router import route_job, UnknownJobTypeError
from django.utils import timezone
from django.db import transaction
from .models import Job, JobStatus


import logging
logger = logging.getLogger(__name__)

@shared_task(bind=True)
def execute_job(self, job_id):
    try:
        with transaction.atomic():
            job = Job.objects.select_for_update().get(id=job_id)

            # Check if still valid to run
            if job.status != JobStatus.QUEUED:
                logger.warning(f"Job {job_id} status {job.status}, skipping")
                return {"skipped": True}

            job.status = JobStatus.RUNNING
            job.attempts += 1
            job.save(update_fields=["status", "attempts"])

        # Process outside the lock so the transaction doesn't hold it during work
        result = route_job(job)

        with transaction.atomic():
            job.refresh_from_db()
            job.status = JobStatus.COMPLETED
            job.result = result
            job.updated_at = timezone.now()
            job.save(update_fields=["status", "result", "updated_at"])

        logger.info(f"Job {job_id} completed")
        return result

    except Job.DoesNotExist:
        logger.error(f"Job {job_id} not found")
        return {"error": "Job not found"}

    except UnknownJobTypeError as e:
        # Job type has no handler — mark DEAD immediately, do not retry
        job.error = str(e)
        job.status = JobStatus.DEAD
        job.save(update_fields=["status", "error"])
        logger.error(f"Job {job_id} has unknown type, marked DEAD: {e}")
        return {"error": str(e)}

    except (ValueError, TimeoutError) as e:
        job.error = str(e)
        if job.attempts < job.max_attempts:
            countdown = min(300, 5 ** job.attempts)  # Exponential backoff, max 5min
            job.status = JobStatus.RETRY
            job.save(update_fields=["status", "error"])
            logger.warning(f"Job {job_id} retry {job.attempts}/{job.max_attempts}: {e}")
            raise self.retry(exc=e, countdown=countdown)
        else:
            job.status = JobStatus.DEAD
            job.save(update_fields=["status", "error"])
            logger.error(f"Job {job_id} failed permanently: {e}")
            raise

    except Exception as e:
        logger.error(f"Unexpected error in job {job_id}: {e}")
        raise
