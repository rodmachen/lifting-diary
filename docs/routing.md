# Routing

## Route Structure

All application routes live under `/dashboard`. The root `/` page is a public landing page and should not contain app functionality.

```
src/app/
  page.tsx                              # Public landing page
  dashboard/
    page.tsx                            # Main dashboard (protected)
    workout/
      new/page.tsx                      # Create workout (protected)
      [workoutId]/page.tsx              # View/edit workout (protected)
```

## Route Protection

All `/dashboard` routes are protected and require an authenticated user.

- **Middleware**: Clerk middleware in `src/proxy.ts` runs on all matched routes via `clerkMiddleware()`.
- **Server-side guard**: Each protected page must call `auth()` from `@clerk/nextjs/server` and redirect unauthenticated users to `/`.

```ts
const { userId } = await auth();
if (!userId) redirect("/");
```

Both layers are required. The middleware handles session validation at the edge; the server-side guard ensures pages never render without a valid `userId`.

## Conventions

- New app routes must be nested under `src/app/dashboard/`.
- Dynamic segments use the `[param]` folder convention (e.g., `[workoutId]`).
- Do not add authenticated functionality to the root `/` page.
