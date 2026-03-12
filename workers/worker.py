import os
import time
import redis
import json
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

REDIS_URL = os.environ.get('REDIS_URL', 'redis://localhost:6379')

def main():
    logger.info("Starting worker node...")
    r = redis.from_url(REDIS_URL)

    # Simple polling loop example
    while True:
        try:
            # Pop job from queue
            job_data = r.lpop('jobs_queue')
            if job_data:
                job = json.loads(job_data)
                logger.info(f"Processing job: {job.get('id')} of type {job.get('type')}")
                # Simulate processing
                time.sleep(1)
                logger.info(f"Finished job: {job.get('id')}")
            else:
                time.sleep(2) # Backoff
        except Exception as e:
            logger.error(f"Error processing job: {e}")
            time.sleep(5)

if __name__ == '__main__':
    main()
