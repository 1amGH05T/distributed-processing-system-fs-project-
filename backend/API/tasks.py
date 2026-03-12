from celery import shared_task
import time

@shared_task
def test_job():
    print("Starting background job...")
    time.sleep(5)
    print("Job finished!")
    return "done"