# Auth Coding Standards

## Authentication Provider

This project uses **Clerk** (`@clerk/nextjs`) for all authentication. Do not use any other auth library or custom auth implementation.

## Key Setup

- `<ClerkProvider>` wraps the entire app in `src/app/layout.tsx`.
- `clerkMiddleware()` is configured in `src/proxy.ts` and runs on all non-static routes.
- Clerk API keys are stored in `.env` (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`).

## Client Components

Use Clerk's built-in components for all auth UI:

- `<SignedIn>` / `<SignedOut>` for conditional rendering based on auth state.
- `<SignInButton>` / `<SignUpButton>` for triggering auth flows (use `mode="modal"`).
- `<UserButton>` for the signed-in user's account menu.

All components are imported from `@clerk/nextjs`.

## Server-Side Auth

Use `auth()` from `@clerk/nextjs/server` to access the current user in server components and API routes. This is an async function and must be awaited.

```ts
import { auth } from "@clerk/nextjs/server";

const { userId } = await auth();
```

## Data Isolation

All database queries that return user-specific data **must** be scoped to the authenticated user's ID. Never expose one user's data to another.

```ts
const { userId } = await auth();

// Always filter by userId
const workouts = await db.query("SELECT * FROM workouts WHERE user_id = $1", [userId]);
```
