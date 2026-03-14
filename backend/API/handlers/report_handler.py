def handle(job):

    payload = job.payload

    report_type = payload.get("report_type", "summary")

    # simulate report generation
    result = {
        "status": "report_generated",
        "type": report_type
    }

    return result