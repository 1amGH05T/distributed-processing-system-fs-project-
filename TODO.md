# TODO

## Fix: “failed to create job” (validation + UI hardening)

- [ ] Patch `backend/API/serializers.py` to validate `type` and enforce non-blank `idempotency_key` and payload object.
- [ ] Patch `frontend/processing-system/src/components/JobForm.jsx` to include `timeout_ms` input and block empty `idempotency_key` with a clear inline error.
- [ ] Run backend/server + frontend tests (or at least a manual create-job request) and verify success.

