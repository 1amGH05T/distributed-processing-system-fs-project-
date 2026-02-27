
# Distributed Task & Job Processing System

A **production-ready distributed task and job processing system** built with a **queue-based, asynchronous architecture**.
Designed for **scalability, reliability, and fault tolerance**, with independent workers and full job lifecycle tracking.

---

## Overview

This system decouples **job creation** from **job execution** using Redis-backed queues and stateless workers.

**High-level flow:**

```
Client → API → Queue → Workers → Database
```

* Jobs are submitted via a REST API
* Jobs are queued asynchronously
* Workers process jobs independently
* Job states are persisted and observable
* Failures are retried or routed to a Dead Letter Queue (DLQ)

---

## Features

* Asynchronous background job processing
* Horizontal scaling with multiple workers
* Job retries with exponential backoff
* Dead Letter Queue (DLQ) for failed jobs
* Idempotent job execution
* Persistent job state tracking
* JWT-secured API
* Structured logging & metrics
* Fully Dockerized setup

---

## Technology Stack

### Frontend

* React (Vite)
* TypeScript
* Axios
* Tailwind CSS

### Backend API

* Node.js + TypeScript
* Express
* PostgreSQL
* Prisma ORM
* Redis
* BullMQ
* JWT Authentication
* Zod (validation)

### Workers

* Node.js + TypeScript
* BullMQ Workers
* Graceful shutdown support

### Infrastructure

* Docker & Docker Compose
* Environment-based configuration
* Prometheus-ready metrics
* Structured JSON logging

---

## 📁 Project Structure

```
.
├── frontend/      # Web UI & dashboard
├── backend/       # REST API & job producer
├── workers/       # Distributed job workers
├── shared/        # Shared schemas & constants
└── docker-compose.yml
```

---

## 🔄 Job Lifecycle

```
PENDING → PROCESSING → COMPLETED
                 ↘
                  FAILED → RETRY → DLQ
```

* Jobs are retried automatically
* Poison jobs are isolated in DLQ
* All states are persisted in the database

---

## 🔌 API Endpoints

* `POST /jobs` – submit a new job
* `GET /jobs/:id` – fetch job status
* `GET /jobs?status=` – list jobs
* `GET /health` – service health check

---

## 🛡 Reliability Guarantees

* At-least-once delivery
* Crash-safe worker recovery
* Visibility timeouts
* Bounded retries
* Idempotent job handling

---

## 🐳 Running Locally

```bash
docker-compose up --build
```

This starts:

* API server
* Worker services
* PostgreSQL
* Redis

---

## 📌 Status

🚧 In active development
✅ Architecture designed for real production workloads

---

## 📄 License

MIT License

---


