# Data Fetching

## Server Components Only

All data fetching in this app must be done in server components. Do not use route handlers (API routes) for data fetching.

## Database Queries

All database queries must be implemented as helper functions in the `src/data/` directory. These functions:

- Must use **Drizzle ORM** for all database interactions
- Must **not** use raw SQL
- Are called directly from server components
