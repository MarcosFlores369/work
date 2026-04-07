# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Three-service web application consuming JSONPlaceholder API, orchestrated with Docker Compose:

- **Frontend** (React + TypeScript + Vite + Tailwind + React Router) — port 3000
- **Backend Node.js / BFF** (Fastify + Zod + fetch) — validates inputs, proxies to Python backend
- **Backend Python / Data Layer** (FastAPI + Uvicorn) — fetches from JSONPlaceholder API

Request flow: `Frontend → BFF (Node) → Data Layer (Python) → JSONPlaceholder`

## Build & Run

```bash
docker compose up --build        # Start all services
docker compose up --build -d     # Start detached
docker compose down              # Stop all services
```

Individual services (for local dev without Docker):

```bash
# Frontend
cd frontend && npm install && npm run dev

# Backend Node
cd backend-node && npm install && npm run dev

# Backend Python
cd backend-python && pip install -r requirements.txt && uvicorn app.main:app --reload
```

## Expected Project Structure

```
frontend/          # React + Vite + Tailwind + TypeScript
backend-node/      # Fastify BFF — Zod validation, fetch to Python backend
backend-python/    # FastAPI data layer — httpx/requests to JSONPlaceholder
docker-compose.yml
```

## Architecture Notes

- The BFF (Node) must validate all route params with Zod (e.g., `id` is a positive integer) before forwarding requests to the Python backend.
- The frontend only talks to the BFF, never directly to the Python backend or JSONPlaceholder.
- Service-to-service URLs should use environment variables configured in docker-compose.yml.
- Frontend routes: `/` (user list), `/users/:id` (user detail + posts), `/posts/:id` (post detail + comments).
- Each frontend screen needs loading and error states.
