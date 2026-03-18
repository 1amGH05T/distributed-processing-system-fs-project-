# Full-Stack Job Processing System Fixes - Approved Plan
Status: In Progress

## Breakdown of Steps (Sequential)

1. [x] Update backend/main/settings.py (security: SECRET_KEY, ALLOWED_HOSTS, DATABASES, throttling)
2. [x] Clean backend/requirements.txt (remove dups/FastAPI)
3. [x] Fix backend/API/serializers.py (typo, remove invalid validate)
4. [x] Update backend/API/models.py (add idempotency index)
5. [x] Fix backend/API/views.py (transaction, pagination, queue logic)
6. [x] Secure backend/API/tasks.py (select_for_update, narrow except, backoff)
7. [x] Update frontend/processing-system/src/App.jsx (polling cleanup)
8. [x] Update frontend/processing-system/src/components/AdminDashboard.jsx (delete safety)
9. [x] Update .gitignore (add db.sqlite3)
10. [ ] Run migrations: cd backend && python manage.py makemigrations && python manage.py migrate
11. [ ] Test backend/frontend
12. [ ] Complete

## Progress Tracking
- Mark [x] when done.
- After all, run followups.

