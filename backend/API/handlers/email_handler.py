def handle(job):
    payload = job.payload

    # SEC-4: Validate required payload fields
    recipient = payload.get("to")
    if not recipient:
        raise ValueError("email.send payload missing required field: 'to'")
    if not isinstance(recipient, str) or "@" not in recipient:
        raise ValueError(f"email.send payload 'to' is not a valid email address: {recipient!r}")

    # Simulate email send
    result = {
        "status": "email_sent",
        "recipient": recipient
    }

    return result