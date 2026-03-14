# JobBox — Shared Folder

This folder contains resources shared across the frontend and backend of the distributed job processing system.

```
shared/
├── constants/
│   └── job_statuses.js     # Job status enums + helpers — import in frontend components
└── api-contract/
    └── openapi.json        # Full OpenAPI 3.0 spec — the authoritative API contract
```

---

## `constants/job_statuses.js`

A JavaScript module that mirrors the backend `JobStatus` Django `TextChoices` enum from `backend/API/models.py`. Import these in frontend components instead of hardcoding status strings.

```js
import { JOB_STATUS, TERMINAL_STATUSES, JOB_STATUS_PROGRESS } from '../../../../shared/constants/job_statuses';

// Use in filters:
const done = jobs.filter(j => TERMINAL_STATUSES.includes(j.status));

// Use in progress bar:
const pct = JOB_STATUS_PROGRESS[job.status]; // → 0, 10, 60, 100, etc.
```

> **Keep in sync:** any time you add a new `JobStatus` to `models.py`, add it here too.

---

## `api-contract/openapi.json`

Full OpenAPI 3.0 specification for all API endpoints. This is the single source of truth for the contract between frontend and backend.

**Endpoints covered:**

| Method   | Path                | Auth      | Description                          |
|----------|---------------------|-----------|--------------------------------------|
| `POST`   | `/auth/register`    | None      | Register a new user                  |
| `POST`   | `/auth/login`       | None      | Get JWT access + refresh tokens      |
| `GET`    | `/auth/check-admin` | JWT       | Returns `{ is_admin: bool }`         |
| `GET`    | `/jobs`             | JWT       | List jobs (admin=all, user=own)      |
| `POST`   | `/jobs`             | JWT       | Create job (idempotent)              |
| `GET`    | `/jobs/{id}`        | JWT       | Get job detail                       |
| `DELETE` | `/jobs/{id}`        | JWT       | Delete a job                         |
| `GET`    | `/users`            | JWT+Admin | List all users                       |
| `DELETE` | `/users/{id}`       | JWT+Admin | Delete user + their jobs             |

**Tip:** you can paste `openapi.json` into [Swagger Editor](https://editor.swagger.io) or [Stoplight](https://stoplight.io) to get interactive API docs instantly.
