# Task Management System

A beginner-friendly full stack task management system built with:

- Backend: Node.js, Express, TypeScript, Prisma, MySQL, JWT
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

3. Update `backend/.env` with your MySQL username, password, host, port, and database name.

Example:

```env
DATABASE_URL="mysql://root:password@localhost:3306/task_management"
```

4. Create the database in MySQL if it does not already exist.

5. Generate Prisma client and run migrations:

```bash
npm run prisma:generate --workspace backend
npm run prisma:migrate --workspace backend -- --name init
```

6. Start the backend:

```bash
npm run dev:backend
```

7. Start the frontend in another terminal:

```bash
npm run dev:frontend
```
