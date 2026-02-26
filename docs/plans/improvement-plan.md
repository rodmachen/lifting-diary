# Codebase Improvement Plan — All 12 Items

## Context

A skills-based audit of the codebase identified 12 improvements across data integrity, React performance, code quality, and UX. This plan implements all 12, grouped into 4 phases to minimize conflicts and respect dependencies.

---

## Phase 1: Shared Utilities (Items 1–2)

Later phases depend on these new shared modules.

### Item 1 — Extract shared Zod schemas

**Create** `src/lib/schemas.ts` with `setSchema`, `exerciseEntrySchema`, and `workoutMutationSchema`.

**Modify** both action files to import from `@/lib/schemas` and delete their local copies:
- `src/app/dashboard/workout/new/actions.ts`
- `src/app/dashboard/workout/[workoutId]/actions.ts`

### Item 2 — Add `parseDateString` utility

**Modify** `src/lib/utils.ts` — add `parseDateString(dateString: string): Date` (wraps `new Date(dateString + "T00:00:00")`).

**Replace** the 5 occurrences of `new Date(... + "T00:00:00")` in:
- `src/app/dashboard/page.tsx:17`
- `src/app/dashboard/dashboard-client.tsx:35`
- `src/components/workout-form.tsx:73`
- `src/app/dashboard/workout/new/actions.ts:34`
- `src/app/dashboard/workout/[workoutId]/actions.ts:36`

---

## Phase 2: Data Layer (Items 3–5)

All changes in a single file: **`src/data/workouts.ts`**

### Item 3 — Wrap createWorkout in a transaction

Wrap `createWorkout` body in `db.transaction(async (tx) => { ... })`. Replace all `db.` calls with `tx.` inside the transaction. (neon-http driver supports `db.transaction()` via Neon's HTTP batch protocol.)

### Item 4 — Batch set inserts

Collect all set data while inserting workout exercises, then do a single `tx.insert(sets).values(allSetsData)` at the end instead of one insert per exercise.

### Item 5 — Wrap updateWorkout in a transaction

Same pattern — the existing delete-and-reinsert approach stays, but now runs atomically inside a transaction with the batch optimization from item 4.

---

## Phase 3: Client Components (Items 6–10)

### Item 6 — Stable keys in workout-form

**Modify** `src/components/workout-form.tsx`:
- Add `id: string` to `SetEntry` and `ExerciseEntry` types
- Generate `crypto.randomUUID()` on all new entries (initial state, addExercise, addSet)
- Map incoming `initialExerciseEntries` to add IDs
- Replace `key={exerciseIndex}` → `key={entry.id}`, `key={setIndex}` → `key={set.id}`

### Item 7 — Remove redundant router.refresh()

**Modify** `src/app/dashboard/dashboard-client.tsx:41` — delete `router.refresh()`.

### Item 8 — Error feedback in form

**Modify** `src/components/workout-form.tsx`:
- Add `const [error, setError] = useState<string | null>(null)`
- Clear error on submit, set it in catch block
- Render error banner (red border, red text with dark mode support) above the submit buttons

### Item 9 — Preserve date on delete redirect

**Modify** `src/app/dashboard/workout/[workoutId]/actions.ts`:
- Change `deleteWorkoutAction(workoutId)` → `deleteWorkoutAction(workoutId, dateString)`
- Redirect to `/dashboard?date=${dateString}`

**Modify** `src/app/dashboard/workout/[workoutId]/edit-workout-form.tsx`:
- Pass `format(workout.date, "yyyy-MM-dd")` as the second arg to `deleteWorkoutAction`

### Item 10 — Form validation hint

**Modify** `src/components/workout-form.tsx`:
- Derive `hasSelectedExercise = exerciseEntries.some(e => e.exerciseId !== "")`
- Disable submit button when `!hasSelectedExercise`
- Show "Select at least one exercise" hint when empty

---

## Phase 4: Layout & Loading (Items 11–12)

### Item 11 — Dashboard layout

**Create** `src/app/dashboard/layout.tsx` with the shared wrapper (`min-h-screen`, `bg-zinc-50`, `dark:bg-black`, `max-w-3xl`).

**Modify** 3 files to remove their duplicate wrappers:
- `src/app/dashboard/dashboard-client.tsx` — remove outer `<div>` + `<main>` (lines 47-48, 125-126)
- `src/app/dashboard/workout/new/page.tsx` — remove lines 21-22, 27-28
- `src/app/dashboard/workout/[workoutId]/page.tsx` — remove lines 26-27, 33-34

### Item 12 — Loading skeleton

**Install** shadcn skeleton component: `npx shadcn@latest add skeleton`

**Create** `src/app/dashboard/loading.tsx` with skeleton cards matching the dashboard layout (renders inside the dashboard layout from item 11).

---

## Files Summary

| Action | File |
|--------|------|
| Create | `src/lib/schemas.ts` |
| Create | `src/app/dashboard/layout.tsx` |
| Create | `src/app/dashboard/loading.tsx` |
| Install | `src/components/ui/skeleton.tsx` (via shadcn CLI) |
| Modify | `src/lib/utils.ts` |
| Modify | `src/data/workouts.ts` |
| Modify | `src/components/workout-form.tsx` |
| Modify | `src/app/dashboard/page.tsx` |
| Modify | `src/app/dashboard/dashboard-client.tsx` |
| Modify | `src/app/dashboard/workout/new/page.tsx` |
| Modify | `src/app/dashboard/workout/new/actions.ts` |
| Modify | `src/app/dashboard/workout/[workoutId]/page.tsx` |
| Modify | `src/app/dashboard/workout/[workoutId]/actions.ts` |
| Modify | `src/app/dashboard/workout/[workoutId]/edit-workout-form.tsx` |

---

## Verification

1. `npm run build` — confirm no TypeScript errors
2. `npm run lint` — confirm no ESLint errors
3. `npm run dev` — manual testing:
   - Create a workout → verify it saves (transaction works)
   - Edit a workout → verify changes persist
   - Delete a workout → verify redirect preserves the date in the URL
   - Navigate dates on dashboard → verify no flash/double-load
   - Add/remove exercises and sets → verify no key-related rendering bugs
   - Submit with no exercise selected → verify button is disabled and hint shows
   - Trigger a network error → verify error banner appears
   - Refresh the dashboard → verify skeleton loading state appears
