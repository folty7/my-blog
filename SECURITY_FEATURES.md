# Security & Business Logic Features Roadmap

## Core Access Control
- [ ] **Role-based access control (RBAC)**
  - [ ] Add `role` field to User model (ADMIN | USER)
  - [ ] Update post creation endpoint to require ADMIN role
  - [ ] Add role checks to post update/delete endpoints
  - [ ] Create role enforcement middleware

## Spam & Content Protection
- [ ] **Akismet integration for comment spam filtering**
  - [ ] Sign up for Akismet API key
  - [ ] Integrate akismet library into backend
  - [ ] Add spam check before saving comments
  - [ ] Handle spam flag in comment endpoint

- [ ] **Comment reporting system**
  - [ ] Add `reported: boolean` flag to Comment model
  - [ ] Add `reportCount: int` to track multiple reports
  - [ ] Create endpoint for users to report comments
  - [ ] Add admin dashboard to view reported comments

## Rate Limiting
- [ ] **Endpoint rate limiting**
  - [ ] Implement rate limiting middleware (express-rate-limit)
  - [ ] Apply to `/auth/register` endpoint (prevent account spam)
  - [ ] Apply to `/auth/login` endpoint (prevent brute force)
  - [ ] Apply to `/posts/*/comments` (prevent comment spam)
  - [ ] Configure reasonable limits per endpoint

## Authentication Enhancement
- [ ] **OAuth integration (Google & GitHub)**
  - [ ] Set up OAuth apps on Google Cloud Console
  - [ ] Set up OAuth app on GitHub
  - [ ] Implement OAuth flow backend (passport.js or similar)
  - [ ] Add Google login button to frontend
  - [ ] Add GitHub login button to frontend
  - [ ] Handle OAuth user creation/linking
  - [ ] Store OAuth provider info in User model

## Admin Dashboard
- [ ] **Admin dashboard UI**
  - [ ] Create admin route guard (ADMIN role only)
  - [ ] Dashboard landing page
  - [ ] User management page (view, ban, promote)
  - [ ] Reported comments moderation page
  - [ ] Post management page (view, unpublish, delete)
  - [ ] Basic analytics (signups, posts per week, comments per post)

## Open Source Preparation
- [ ] **Git history cleanup**
  - [ ] Use git-filter-repo to remove .env files from history
  - [ ] Verify no secrets remain in any commit

- [ ] **Documentation**
  - [ ] Create SECURITY.md with vulnerability reporting instructions
  - [ ] Create .env.example with all required environment variables
  - [ ] Update README.md with setup instructions
  - [ ] Add contribution guidelines (CONTRIBUTING.md)

- [ ] **Licensing & metadata**
  - [ ] Add LICENSE file (MIT)
  - [ ] Update package.json with repository, author, license fields
  - [ ] Add meaningful .gitignore entries

## Implementation Order (Recommended)
1. Role-based access control (foundation for everything else)
2. Rate limiting on auth endpoints (quick security win)
3. Akismet integration (protects content)
4. Comment reporting (gives you control)
5. OAuth (nice-to-have UX improvement)
6. Admin dashboard (quality of life)
7. Open source prep (final polish before publishing)