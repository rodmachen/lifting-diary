import { eq, and, inArray } from "drizzle-orm";
import { db } from "@/db";
import { workouts, workoutExercises, sets } from "@/db/schema";

export async function getWorkoutsByDate(userId: string, date: Date) {
  return db.query.workouts.findMany({
    where: and(eq(workouts.userId, userId), eq(workouts.date, date)),
    with: {
      workoutExercises: {
        orderBy: (workoutExercises, { asc }) => [asc(workoutExercises.order)],
        with: {
          exercise: true,
          sets: {
            orderBy: (sets, { asc }) => [asc(sets.setNumber)],
          },
        },
      },
    },
  });
}

export async function getAllExercises() {
  return db.query.exercises.findMany({
    orderBy: (exercises, { asc }) => [asc(exercises.name)],
  });
}

export async function createWorkout(
  userId: string,
  date: Date,
  exerciseEntries: {
    exerciseId: number;
    sets: { weight: number | null; reps: number | null }[];
  }[]
) {
  const [workout] = await db
    .insert(workouts)
    .values({ userId, date })
    .returning();

  for (let i = 0; i < exerciseEntries.length; i++) {
    const entry = exerciseEntries[i];
    const [we] = await db
      .insert(workoutExercises)
      .values({
        workoutId: workout.id,
        exerciseId: entry.exerciseId,
        order: i + 1,
      })
      .returning();

    if (entry.sets.length > 0) {
      await db.insert(sets).values(
        entry.sets.map((s, j) => ({
          workoutExerciseId: we.id,
          setNumber: j + 1,
          weight: s.weight,
          reps: s.reps,
        }))
      );
    }
  }

  return workout;
}

export async function getWorkoutById(workoutId: number, userId: string) {
  return db.query.workouts.findFirst({
    where: and(eq(workouts.id, workoutId), eq(workouts.userId, userId)),
    with: {
      workoutExercises: {
        orderBy: (workoutExercises, { asc }) => [asc(workoutExercises.order)],
        with: {
          exercise: true,
          sets: {
            orderBy: (sets, { asc }) => [asc(sets.setNumber)],
          },
        },
      },
    },
  });
}

export async function updateWorkout(
  workoutId: number,
  userId: string,
  date: Date,
  exerciseEntries: {
    exerciseId: number;
    sets: { weight: number | null; reps: number | null }[];
  }[]
) {
  // Verify ownership
  const existing = await db.query.workouts.findFirst({
    where: and(eq(workouts.id, workoutId), eq(workouts.userId, userId)),
    with: { workoutExercises: true },
  });

  if (!existing) throw new Error("Workout not found");

  // Update workout date
  await db
    .update(workouts)
    .set({ date, updatedAt: new Date() })
    .where(eq(workouts.id, workoutId));

  // Delete old workout exercises (cascades to sets)
  const oldWeIds = existing.workoutExercises.map((we) => we.id);
  if (oldWeIds.length > 0) {
    await db
      .delete(workoutExercises)
      .where(inArray(workoutExercises.id, oldWeIds));
  }

  // Insert new exercises and sets
  for (let i = 0; i < exerciseEntries.length; i++) {
    const entry = exerciseEntries[i];
    const [we] = await db
      .insert(workoutExercises)
      .values({
        workoutId,
        exerciseId: entry.exerciseId,
        order: i + 1,
      })
      .returning();

    if (entry.sets.length > 0) {
      await db.insert(sets).values(
        entry.sets.map((s, j) => ({
          workoutExerciseId: we.id,
          setNumber: j + 1,
          weight: s.weight,
          reps: s.reps,
        }))
      );
    }
  }
}

export async function deleteWorkout(workoutId: number, userId: string) {
  const existing = await db.query.workouts.findFirst({
    where: and(eq(workouts.id, workoutId), eq(workouts.userId, userId)),
  });

  if (!existing) throw new Error("Workout not found");

  await db.delete(workouts).where(eq(workouts.id, workoutId));
}
