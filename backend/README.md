# Backend

Express/TypeScript REST API for the blog application. It provides authentication, post CRUD, comments, tags, image uploads, Prisma/PostgreSQL persistence, and production Docker support.

## Stack

- Express `5`
- TypeScript
- Prisma `7`
- PostgreSQL
- `@prisma/adapter-pg` and `pg`
- JWT authentication with `jsonwebtoken`
- Password hashing with `bcrypt`
- File uploads with `multer`
- CORS, Helmet, Morgan
- Vitest and Supertest

## Source Layout

- `src/main.ts` - server entrypoint.
- `src/server.ts` - Express app setup, middleware, API mounting, static file serving.
- `src/routes/` - REST route modules.
- `src/middleware/` - auth, request validation, and upload middleware.
- `src/db/prisma.ts` - Prisma client factory using the PostgreSQL adapter.
- `src/common/constants/env.ts` - required environment variable validation.
- `prisma/schema.prisma` - relational data model.
- `prisma/migrations/` - database migrations.
- `tests/` - Vitest/Supertest test suite and helpers.

## Environment

Development scripts load `backend/config/.env.development` through `DOTENV_CONFIG_PATH`.

Create `config/.env.development`:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://blog-admin:blog-admin-password@localhost:5432/blog_db
JWT_SECRET=replace-with-a-local-secret
```

For tests, create `config/.env.test` with the same required variables and a test database URL.

## Scripts

```bash
npm run dev
npm run build
npm start
npm test
npm run type-check
npm run lint
npm run format
```

## API Base Path

All API routes are mounted under:

```text
/api/v1
```

## Main Endpoints

- `POST /api/v1/auth/register` - create user, hash password, return JWT.
- `POST /api/v1/auth/login` - validate credentials, return JWT.
- `GET /api/v1/auth/me` - return authenticated user profile.
- `GET /api/v1/posts` - list published posts.
- `GET /api/v1/posts/:slug` - get post by slug.
- `GET /api/v1/posts/id/:id` - get post by numeric ID.
- `GET /api/v1/posts/my-posts` - list authenticated user's posts.
- `POST /api/v1/posts` - create authenticated post.
- `PATCH /api/v1/posts/:id` - update authenticated post.
- `DELETE /api/v1/posts/:id` - delete authenticated post.
- `POST /api/v1/posts/upload` - upload post image.
- `GET /api/v1/posts/uploads` - list uploaded images.
- `POST /api/v1/comments` - create authenticated comment.
- `GET /api/v1/comments/post/:postId` - list comments for a post.
- `DELETE /api/v1/comments/:id` - delete own comment.
- `GET /api/v1/tags` - list tags with post counts.
- `GET /api/v1/tags/:name/posts` - list posts by tag.

Legacy user routes from the Express generator remain under `/api/v1/users`.

## Data Model

- `User` - unique email, optional name, password hash, posts, comments.
- `Post` - title, unique slug, text content, publication flag, optional image URL, author, comments, tags.
- `Comment` - text content, post relation, author relation.
- `Tag` - unique name with many-to-many post relation.

## Authentication

- Registration and login issue JWTs with `{ userId, email }` payloads.
- `authenticateToken` reads the Bearer token, verifies it with `JWT_SECRET`, and attaches decoded user data to the request.
- Protected routes use the decoded `userId` as the author or ownership reference.

## Uploads

- Multer stores files in `src/public/uploads` during local development and in the compiled public uploads directory in production.
- Filenames are UUID-based.
- Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`.
- Maximum file size: 5 MB.

## Prisma

Generate the Prisma client:

```bash
npx prisma generate
```

Apply migrations in development:

```bash
npx prisma migrate dev
```

Production startup runs:

```bash
npx prisma migrate deploy
```

before starting the compiled server.

## Docker

The backend Dockerfile uses a multi-stage build:

- builder stage installs dependencies, generates Prisma client, compiles TypeScript, and copies static assets.
- runtime stage installs production dependencies, copies compiled output and Prisma files, generates the production Prisma client, and starts via `start.sh`.

The root `docker-compose.yml` runs this service with PostgreSQL and persists uploaded files through the `uploads_data` volume.
