# UI Coding Standards

## Component Library

This project uses **shadcn/ui** as the sole component library. All UI must be built exclusively with shadcn/ui components.

- **Do not** create custom components. Use only shadcn/ui primitives and compositions.
- If a needed UI pattern is not available in shadcn/ui, compose existing shadcn/ui components to achieve it.
- Follow shadcn/ui conventions for theming, variants, and props.

## Date Formatting

All dates must be formatted using **date-fns**.

Use the following format string:

```ts
import { format } from "date-fns";

format(date, "do MMM yyyy");
```

This produces dates like:

- 1st Sep 2025
- 2nd Aug 2025
- 3rd Jan 2026
- 4th Jun 2024
