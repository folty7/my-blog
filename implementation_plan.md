# Medior-Level Fullstack Blog Project Plan

This document outlines the architecture, suggested enhancements, and a step-by-step roadmap for building a fullstack blog project designed to showcase medior-level software engineering skills. 

## 🚀 Suggested Enhancements for a Medior Role

To stand out for a medior (mid-level) position, your project needs to go beyond a basic CRUD application. You should demonstrate knowledge of production-readiness, scalability, testing, and modern tooling. Here are some key enhancements to consider adding to your stack:

### 1. Backend & Architecture
- **ORM / Query Builder:** We will use **Prisma** with Postgres. This shows you understand modern data modeling, type-safe database interactions, and migrations.
- **Data Validation (Fundamentals vs. Standard):** While you can write "vanilla" validation manually (e.g., `if (typeof req.body.email !== 'string')`), it becomes largely unmaintainable and repetitive at scale. **Zod** is the modern industry standard for TypeScript validation. 
  - *Implementation strategy:* We can write a custom validation middleware from scratch to sharpen fundamentals for your first few Auth endpoints, but migrate to **Zod** for the rest of the application to demonstrate you know how to build at scale. A medior engineer knows *when* to use a library versus building something themselves!
- **Containerization:** Use **Docker & Docker Compose** for local development (running Postgres and the Node app) to ensure an identical environment across machines.
- **Caching & Rate Limiting (Bonus):** Implement **Redis** to cache frequently accessed blog posts and to rate-limit login attempts (a great security best practice to mention in interviews).
- **Logging:** Use a structured logger like **Pino** or **Winston** instead of `console.log`, and set up global error-handling.

### 2. Frontend
- **Framework Choice (React + Vite):** As per your request to focus on Node.js backend fundamentals and conservative technologies, we will use a **Plain React SPA (Single Page Application)** built with **Vite**, React Router, TanStack Query, and Zustand. We'll use tools like React Helmet to handle basic SEO meta tags to compensate for the lack of Server-Side Rendering.
- **Rich Text Editor:** Integrate a modern headless editor like **TipTap** or **Slate** for writing posts, rather than a basic textarea. It shows you can handle complex frontend state synchronization.
- **Accessibility (a11y):** Ensure proper ARIA labels, semantic HTML, and keyboard navigation. Using unstyled accessible component libraries like **Radix UI** or **Headless UI** with Tailwind can be a huge plus.

### 3. Testing & DevOps
- **Automated Testing:** Medior engineers test their code. 
  - *Backend:* Unit & Integration tests using **Vitest** or **Jest**.
  - *Frontend:* E2E tests using **Playwright** or **Cypress** to test the critical paths (e.g., registering and publishing a post).
- **CI/CD Pipeline:** Set up **GitHub Actions** to automatically lint, test, and build your code on every pull request. 
- **Infrastructure:** Using a **Monorepo** allows you to share Prisma types seamlessly between the frontend and the backend.

---

## 🗺️ Project Roadmap & Tasks

Here is a structured roadmap broken down into logical phases.

### Phase 1: Project Setup & Infrastructure
- [x] Initialize Git repository and setup a **Monorepo** structure (using NPM workspaces, with `frontend` and `backend` folders).
- [x] **Backend:** Init Node.js + TypeScript, configure ESLint & Prettier.
- [x] **Frontend:** Init React (Vite) + TypeScript, TailwindCSS, configure ESLint & Prettier.
- [x] Create `docker-compose.yml` for a local PostgreSQL database.
- [ ] Setup GitHub Actions pipeline for basic linting and type checking on PRs.

### Phase 2: Database & Backend Foundation
- [x] Install and configure Prisma and connect to the local Postgres database.
- [x] Design Database Schema: `User`, `Post`, `Comment`, `Tag` models.
- [x] Run initial database migrations.
- [x] Setup Express server with global error handling, logging, and CORS.
- [x] Implement our hybrid approach: custom validation middleware for fundamentals, paving the way for Zod later.

### Phase 3: Authentication & Authorization
- [x] Implement User Registration endpoint (hash passwords securely with bcrypt or argon2).
- [x] Implement Login endpoint (generate and return JWT).
- [x] Create Auth Middleware to protect sensitive routes.
- [x] **Frontend:** Setup Zustand store for user session/auth state management.
- [x] **Frontend:** Create Login and Register pages.

### Phase 4: Core Blog Functionality (Backend)
- [x] Implement CRUD API endpoints for Blog Posts.
- [ ] Implement endpoints for Comments (adding, deleting).
- [ ] Implement Tag management for categorizing posts.
- [ ] Write integration tests for Post and Auth endpoints.

### Phase 5: Core Blog Functionality (Frontend)
- [ ] Setup TanStack Query for data fetching, caching, and state synchronization.
- [ ] Create Home page with an infinite-scroll or paginated list of posts.
- [ ] Create a standalone Post reading page (focus heavily on typography and readability using Tailwind Typography plugin).
- [ ] Integrate a Rich Text Editor cleanly in a "Create Post" protected dashboard.
- [ ] Implement Optimistic UI updates with TanStack Query.

### Phase 6: Polish & Testing
- [ ] Implement Dark Mode toggle dynamically using TailwindCSS.
- [ ] Add accessible UI skeleton loaders for loading states.
- [ ] Write Playwright E2E tests for the critical path: `Login -> Create Post -> Validate Post exists`.

### Phase 7: Azure Deployment
- [ ] **Database:** Provision Azure Database for PostgreSQL (Flexible Server).
- [ ] **Backend:** Provision **Azure App Service** (Linux/Node.js) to host your Express Server API.
- [ ] **Frontend:** Provision **Azure Static Web Apps (SWA)**. SWA is optimized specifically for SPAs, provides free SSL, edge caching, and automatically integrates with GitHub Actions for deployment from a monorepo context.
- [ ] Configure Environment Variables safely across both platforms.
