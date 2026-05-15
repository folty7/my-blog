# Frontend

React/Vite single-page application for the blog client. It consumes the backend REST API, manages authenticated author flows, renders public posts and comments, and provides post creation/editing screens with image upload support.

## Stack

- React `19`
- TypeScript
- Vite
- React Router DOM `7`
- TanStack React Query `5`
- Zustand with persisted auth state
- Axios API client with request/response interceptors
- React Hook Form and Zod
- Framer Motion
- Three.js
- Lucide React

## Source Layout

- `src/App.tsx` - route tree, protected route nesting, page transition wrapper.
- `src/main.tsx` - React root and TanStack Query provider.
- `src/api/` - Axios client and API service wrappers.
- `src/store/authStore.ts` - persisted user/token state.
- `src/pages/` - route-level screens.
- `src/components/` - layout, auth guards, comments, image picker, skeletons, and WebGL background.
- `src/types/` - shared frontend TypeScript models.

## Environment

Create a local `.env` file when the backend URL differs from the default:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

If unset, `src/api/client.ts` falls back to `http://localhost:3000/api/v1`.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Routing

- `/` - public post feed.
- `/post/:slug` - public post detail with comments.
- `/login` - login form.
- `/register` - registration form.
- `/dashboard` - protected author dashboard.
- `/create-post` - protected post creation.
- `/edit-post/:id` - protected post editing.
- `*` - not found page.

## State and API Flow

- Auth state is stored in Zustand and persisted to localStorage under `auth-storage`.
- Axios attaches the JWT from the Zustand store to outgoing requests.
- HTTP `401` responses clear the persisted auth state.
- TanStack Query handles post/comment fetching and mutation invalidation.

## Forms

- Login, registration, create post, and edit post forms use React Hook Form.
- Zod schemas define frontend validation constraints.
- Create/edit post forms convert comma-separated tag input into string arrays for the API.

## Media Handling

- Post forms can upload new hero images through the backend upload endpoint.
- `ImagePickerModal` lists previously uploaded images and allows selecting one for a post.
- Uploaded image URLs are stored as backend-relative paths and rendered by prefixing the API origin.

## Deployment

`vercel.json` rewrites all routes to `index.html` so client-side routing works on Vercel.
