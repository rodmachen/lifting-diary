# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Docs-First Workflow

**IMPORTANT**: Before generating any code, always check the `/docs` directory for relevant documentation files. These docs contain project-specific requirements, design specs, and conventions that must be followed. Read and reference the applicable docs file(s) before writing or modifying code.

## Code Generation Guidelines

Before writing or modifying code, consult the relevant documentation files listed below:

- `/docs/auth.md` - Authentication standards using Clerk; no custom auth implementations
- `/docs/data-fetching.md` - Data fetching conventions; server components only
- `/docs/data-mutations.md` - Data mutation conventions; server actions only
- `/docs/routing.md` - Route structure; all app routes live under /dashboard
- `/docs/ui.md` - UI standards using shadcn/ui as the sole component library

## Project Overview

This is a Next.js 16 application (React 19, TypeScript 5) using the App Router architecture. It was bootstrapped with create-next-app and uses Tailwind CSS 4 for styling.

## Development Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

- **App Router**: All routes live in `src/app/` using Next.js App Router conventions
- **Path Aliases**: `@/*` maps to `./src/*` for imports
- **Styling**: Tailwind CSS 4 with dark mode support via CSS variables in `globals.css`
- **Fonts**: Geist and Geist Mono loaded via next/font
- **Authentication**: Clerk (`@clerk/nextjs`) with `clerkMiddleware()` in `src/proxy.ts`

## Key Files

- `src/app/layout.tsx` - Root layout with ClerkProvider and auth UI components
- `src/proxy.ts` - Clerk middleware for route protection
- `src/app/page.tsx` - Home page
- `src/app/globals.css` - Global styles and Tailwind imports

## Authentication

Uses Clerk for authentication. Key components available from `@clerk/nextjs`:
- `<SignedIn>`, `<SignedOut>` - Conditional rendering based on auth state
- `<SignInButton>`, `<SignUpButton>`, `<UserButton>` - Pre-built UI components
- `auth()` from `@clerk/nextjs/server` - Server-side auth (async/await required)
