## Application link: 

- https://task-management-frontend-five-red.vercel.app/

# Task Management System 

This is my Task Management System application.

In this application, users can register, log in, and manage their personal tasks in a simple and secure way.


## Tech Stack Used

- Frontend: Next.js, TypeScript
- Backend: Node.js, Express, TypeScript
- Database: MySQL with Prisma ORM
- Authentication: JWT and bcrypt

## Application Structure

- `frontend` - the Next.js user interface
- `backend` - the API, authentication, and database logic

## Main Features

- User registration
- User login and logout
- Refresh token based authentication
- Task CRUD operations
- Mark task as completed or pending
- Search tasks by title
- Filter tasks by status
- Pagination for task list

## How To Run This Application Locally

1. Install dependencies:

```bash
npm install
```

2. Create the backend environment file:

```bash
copy backend\\.env.example backend\\.env
```

3. Update `backend/.env` with your MySQL connection string.

Example:

```env
DATABASE_URL="mysql://root:yourpassword@localhost:3306/task_managment"
```

4. Generate Prisma client:

```bash
npm run prisma:generate --workspace backend
```

5. Run database migration:

```bash
npx prisma migrate deploy --schema backend/prisma/schema.prisma
```

6. Start the backend:

```bash
npm run dev:backend
```

7. Start the frontend in another terminal:

```bash
npm run dev:frontend
```

## Deployment

This application is deployed with:

- Frontend on Vercel
- Backend on Vercel
- MySQL database on Railway

