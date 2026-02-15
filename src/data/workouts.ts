import { eq, and } from "drizzle-orm";
import { db } from "@/db";
import { workouts, workoutExercises, sets, exercises } from "@/db/schema";

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
