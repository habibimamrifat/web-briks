## Frontend Setup

### 1. Go to the frontend directory

```bash
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env.local`

Create:

```text
frontend/.env.local
```

Add:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

> `NEXT_PUBLIC_API_URL` is the URL of the backend API.

### 4. Start the development server

```bash
npm run dev
```

The frontend will be available at:

```text
http://localhost:3001
```

---

## Frontend Environment Variables

| Variable              | Description     |
| --------------------- | --------------- |
| `NEXT_PUBLIC_API_URL` | Backend API URL |

### Local

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Production

For Render deployment:

```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

---

## Running Frontend with Docker

From the project root:

```bash
docker compose up --build
```

The frontend will be available at:

```text
http://localhost:3001
```

The frontend Dockerfile receives the API URL during the Next.js build:

```dockerfile
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build
```

This is important because Next.js `NEXT_PUBLIC_*` environment variables are included in the frontend bundle during the build process.

---

## Production Deployment — Render

Create a **Web Service** on Render using the same GitHub repository.

Use these settings:

```text
Root Directory: frontend
Language: Docker
Dockerfile Path: Dockerfile
Branch: main
```

Add the environment variable:

```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

Then deploy the service.

The frontend communicates with the backend through:

```text
Frontend
   ↓
NEXT_PUBLIC_API_URL
   ↓
Backend API
   ↓
PostgreSQL
```

### Important

Do not put secrets such as database passwords, JWT secrets, SMTP passwords, or Cloudinary secrets in the frontend environment.

Only variables that are safe to expose to the browser should use the `NEXT_PUBLIC_` prefix.
