from .handlers.email_handler import handle as email_handler
from .handlers.report_handler import handle as report_handler


JOB_ROUTER = {
    "email.send": email_handler,
    "report.generate": report_handler,
}


def route_job(job):

    handler = JOB_ROUTER.get(job.type)

    if not handler:
        raise Exception(f"No handler registered for job type: {job.type}")

    return handler(job)