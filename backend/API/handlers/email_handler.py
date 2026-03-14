def handle(job):

    payload = job.payload

    recipient = payload.get("to")

    # simulate email send
    result = {
        "status": "email_sent",
        "recipient": recipient
    }

    return result