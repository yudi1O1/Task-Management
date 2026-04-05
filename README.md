# Task Management System

A beginner-friendly full stack task management system built with:

- Backend: Node.js, Express, TypeScript, Prisma, SQLite, JWT
- Frontend: Next.js (App Router), TypeScript

## Project structure

- `backend` - API, authentication, database, task routes
- `frontend` - Web app for login, registration, and task management

## Quick start

1. Install dependencies:

```bash
npm install
```

2. Create the backend environment file:

```bash
copy backend\\.env.example backend\\.env
```

3. Create the database:

```bash
npm run prisma:generate --workspace backend
npm run prisma:migrate --workspace backend -- --name init
```

4. Start the backend:

```bash
npm run dev:backend
```

5. Start the frontend in another terminal:

```bash
npm run dev:frontend
```
