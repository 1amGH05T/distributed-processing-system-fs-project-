VALID_REPORT_TYPES = {"summary", "detailed", "analytics"}

def handle(job):
    payload = job.payload

    # SEC-4: Validate payload fields
    report_type = payload.get("report_type", "summary")
    if report_type not in VALID_REPORT_TYPES:
        raise ValueError(
            f"report.generate payload 'report_type' must be one of "
            f"{sorted(VALID_REPORT_TYPES)}, got: {report_type!r}"
        )

    # Simulate report generation
    result = {
        "status": "report_generated",
        "type": report_type
    }

    return result