# Data Mutations

## Server Actions Only

All data mutations in this app must be done via **server actions**. Do not use route handlers (API routes) for mutations.

## Server Action Files

Server actions must be defined in co-located files named `actions.ts` using the `"use server"` directive. Place the `actions.ts` file alongside the page or feature that uses it.

## Database Mutations

All database mutations must be implemented as helper functions in the `src/data/` directory. These functions:

- Must use **Drizzle ORM** for all database interactions
- Must **not** use raw SQL
- Are called from server actions, not directly from components

## Typed Parameters

All server action parameters must be explicitly typed. Do **not** use the `FormData` type as a parameter. Define a typed object for each action's input.

```ts
// Bad
async function createWorkout(formData: FormData) { ... }

// Good
async function createWorkout(data: { name: string; date: string }) { ... }
```

## Zod Validation

All server actions must validate their arguments using **Zod** before processing. Define a Zod schema for each action's input and parse the arguments at the top of the function.

```ts
import { z } from "zod";

const createWorkoutSchema = z.object({
  name: z.string().min(1),
  date: z.string().min(1),
});

async function createWorkout(data: { name: string; date: string }) {
  const validated = createWorkoutSchema.parse(data);
  // ... call data helper function
}
```
