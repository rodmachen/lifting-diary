"use client";

import { WorkoutForm, WorkoutFormData } from "@/components/workout-form";
import { createWorkoutAction } from "./actions";

type Exercise = {
  id: number;
  name: string;
};

export function NewWorkoutForm({
  exercises,
  initialDate,
}: {
  exercises: Exercise[];
  initialDate: string;
}) {
  async function handleSubmit(data: WorkoutFormData) {
    await createWorkoutAction(data);
  }

  return (
    <WorkoutForm
      exercises={exercises}
      initialDate={initialDate}
      submitLabel="Save Workout"
      onSubmit={handleSubmit}
    />
  );
}
