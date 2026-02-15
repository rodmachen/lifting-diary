"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { updateWorkout, deleteWorkout } from "@/data/workouts";

const setSchema = z.object({
  weight: z.number().nullable(),
  reps: z.number().int().nullable(),
});

const exerciseEntrySchema = z.object({
  exerciseId: z.number().int().positive(),
  sets: z.array(setSchema).min(1),
});

const updateWorkoutSchema = z.object({
  workoutId: z.number().int().positive(),
  date: z.string().min(1),
  exercises: z.array(exerciseEntrySchema).min(1),
});

export async function updateWorkoutAction(data: {
  workoutId: number;
  date: string;
  exercises: {
    exerciseId: number;
    sets: { weight: number | null; reps: number | null }[];
  }[];
}) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const validated = updateWorkoutSchema.parse(data);
  const workoutDate = new Date(validated.date + "T00:00:00");

  await updateWorkout(
    validated.workoutId,
    userId,
    workoutDate,
    validated.exercises
  );

  redirect(`/dashboard?date=${validated.date}`);
}

export async function deleteWorkoutAction(workoutId: number) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const validated = z.number().int().positive().parse(workoutId);

  await deleteWorkout(validated, userId);

  redirect("/dashboard");
}
