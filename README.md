# My Blog

Full-stack TypeScript blog application with a React/Vite single-page frontend and an Express/Prisma REST API. The app supports public article browsing, authenticated author workflows, comments, tags, and image uploads backed by PostgreSQL.

## Repository Structure

- `frontend/` - React 19 SPA built with Vite, React Router, TanStack Query, Zustand, React Hook Form, Zod, Framer Motion, and Three.js.
- `backend/` - Express 5 API written in TypeScript, using Prisma 7, PostgreSQL, JWT authentication, bcrypt, and Multer uploads.
- `docker-compose.yml` - Local PostgreSQL and backend runtime configuration.
- `SECURITY_FEATURES.md` - Planned security and moderation roadmap.

## Core Features

- Public post feed and post detail pages.
- User registration and login with JWT-based authentication.
- Protected dashboard for creating, editing, and deleting posts.
- Tag normalization through Prisma `connectOrCreate`.
- Authenticated comments with ownership checks on deletion.
- Image upload and existing image selection for post hero images.
- Custom Three.js/WebGL animated background component in the frontend.

## Requirements

- Node.js 20 recommended.
- npm with workspace support.
- PostgreSQL, or Docker for the included PostgreSQL service.

## Install

```bash
npm install
```

The root package uses npm workspaces for `frontend` and `backend`.

## Environment

Backend scripts expect environment files under `backend/config/`.

Example `backend/config/.env.development`:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://blog-admin:blog-admin-password@localhost:5432/blog_db
JWT_SECRET=replace-with-a-local-secret
```

Frontend environment:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

## Local Development

Start PostgreSQL with Docker:

```bash
docker compose up postgres
```

Run the backend:

```bash
cd backend
npm run dev
```

Run the frontend:

```bash
cd frontend
npm run dev
```

The frontend defaults to `http://localhost:5173`; the API defaults to `http://localhost:3000/api/v1` when `VITE_API_URL` is not provided.

## Docker

Run PostgreSQL and the backend:

```bash
docker compose up --build
```

The compose file exposes the backend on host port `3000` and PostgreSQL on host port `5432`.

## Useful Commands

```bash
cd frontend && npm run build
cd backend && npm run build
cd backend && npm test
cd backend && npm run type-check
```

## Data Model

- `User` - authentication identity, authored posts, authored comments.
- `Post` - blog content, slug, publication state, optional image URL, author, comments, tags.
- `Comment` - post discussion entries linked to user and post.
- `Tag` - unique tag names linked to posts.

## Deployment Notes

- Frontend includes `vercel.json` SPA rewrites to serve `index.html` for client routes.
- Backend Docker image runs Prisma migrations before starting the compiled server.
- Uploaded files are stored under the backend public uploads directory and persisted in Docker through `uploads_data`.
