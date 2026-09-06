# Web Briks

A full-stack Kanban board application built with **Next.js**, **NestJS**, **PostgreSQL**, **Prisma**, and **Docker**.

---

# Prerequisites

Make sure you have installed:

* Node.js 20+
* npm
* PostgreSQL
* Docker & Docker Compose
* Git

---

# Backend Setup

## 1. Navigate to the backend

```bash
cd backend
```

## 2. Install dependencies

```bash
npm install
```

## 3. Create environment file

Create:

```text
backend/development.env
```

Add:

```env
NODE_ENV=development

PORT=3000

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/web_briks

FRONTEND_URL=http://localhost:3001

JWT_SECRET=your_jwt_secret
JWT_RESET_SECRET=your_reset_secret

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_gmail_address
SMTP_PASSWORD=your_gmail_app_password
SMTP_FROM=your_gmail_address

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

> Never commit your environment file or SMTP credentials to Git.

## 4. Generate Prisma Client

```bash
npx prisma generate
```

## 5. Run database migrations

```bash
npx prisma migrate deploy
```

For local development when creating a new migration:

```bash
npx prisma migrate dev
```

## 6. Start the backend

```bash
npm run start:dev
```

Backend:

```text
http://localhost:3000
```

API documentation:

```text
http://localhost:3000/api/v1
```

---

# Frontend Setup

## 1. Navigate to the frontend

From the project root:

```bash
cd frontend
```

## 2. Install dependencies

```bash
npm install
```

## 3. Create environment file

Create:

```text
frontend/.env.local
```

Add:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

> `NEXT_PUBLIC_*` variables are exposed to the browser. Do not put secrets in them.

## 4. Start the frontend

```bash
npm run dev
```

Frontend:

```text
http://localhost:3001
```

---

# Docker Setup

The project includes Docker Compose for running the complete application locally.

From the project root:

```bash
docker compose up --build
```

This starts:

```text
Frontend    → http://localhost:3001
Backend     → http://localhost:3000
PostgreSQL  → localhost:5432
```

To stop the containers:

```bash
docker compose down
```

To stop the containers and remove the database volume:

```bash
docker compose down -v
```

> Removing the volume deletes the local PostgreSQL data.

---

# Gmail SMTP Configuration

The application uses **Gmail SMTP with Nodemailer** for sending emails.

For Gmail SMTP over port `587`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
```

`SMTP_PASSWORD` must be a **Google App Password**, not your normal Gmail account password.

Example:

```env
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-16-character-app-password
SMTP_FROM=your-email@gmail.com
```

---

# Production Deployment

The application is deployed on **Render** using Docker.

## Backend

Create a Render Web Service with:

```text
Repository: web-briks
Root Directory: backend
Environment: Docker
Dockerfile: Dockerfile
Branch: main
```

Configure the following environment variables in Render:

```env
NODE_ENV=production

PORT=3000

DATABASE_URL=your_render_postgresql_internal_database_url

FRONTEND_URL=https://your-frontend.onrender.com

JWT_SECRET=your_jwt_secret
JWT_RESET_SECRET=your_reset_secret

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_gmail_address
SMTP_PASSWORD=your_gmail_app_password
SMTP_FROM=your_gmail_address

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

The backend Docker container runs Prisma migrations before starting the NestJS application.

Backend:

```text
https://your-backend.onrender.com
```

API documentation:

```text
https://your-backend.onrender.com/api/v1
```

---

# Frontend Production Deployment

Create a second Render Web Service.

Use:

```text
Repository: web-briks
Root Directory: frontend
Environment: Docker
Dockerfile: Dockerfile
Branch: main
```

Add:

```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

> `NEXT_PUBLIC_API_URL` is required during the Next.js build, so changing this variable requires a new frontend deployment/build.

Frontend:

```text
https://your-frontend.onrender.com
```

---

# Production Architecture

```text
                    ┌──────────────────────┐
                    │      Next.js         │
                    │      Frontend        │
                    │       Render         │
                    └──────────┬───────────┘
                               │
                               │ HTTP API
                               ▼
                    ┌──────────────────────┐
                    │      NestJS          │
                    │      Backend         │
                    │       Render         │
                    └──────┬───────┬───────┘
                           │       │
                ┌──────────┘       └──────────────┐
                ▼                                 ▼
       ┌─────────────────┐              ┌─────────────────┐
       │   PostgreSQL    │              │    Cloudinary   │
       │     Render      │              │  Image Storage  │
       └─────────────────┘              └─────────────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │   Gmail SMTP    │
                  │   Port 587      │
                  └─────────────────┘
```

---

# Environment Variables

## Backend

The following variables are server-side and must never be exposed publicly:

```text
DATABASE_URL
JWT_SECRET
JWT_RESET_SECRET
SMTP_PASSWORD
CLOUDINARY_API_SECRET
```

## Frontend

The frontend only requires:

```env
NEXT_PUBLIC_API_URL=...
```

Do not place private credentials inside `NEXT_PUBLIC_*` variables.

---

# Run Everything Locally

The easiest way to run the complete application is:

```bash
docker compose up --build
```

Then access:

```text
Frontend:
http://localhost:3001

Backend:
http://localhost:3000

API Documentation:
http://localhost:3000/api/v1
```

To stop:

```bash
docker compose down
```
