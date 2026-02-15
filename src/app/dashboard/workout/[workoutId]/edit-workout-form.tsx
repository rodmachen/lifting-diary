"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { WorkoutForm, WorkoutFormData } from "@/components/workout-form";
import { updateWorkoutAction, deleteWorkoutAction } from "./actions";

type Exercise = {
  id: number;
  name: string;
};

type Workout = {
  id: number;
  date: Date;
  workoutExercises: {
    id: number;
    exercise: { id: number; name: string };
    sets: { setNumber: number; reps: number | null; weight: number | null }[];
  }[];
};

export function EditWorkoutForm({
  workout,
  exercises,
}: {
  workout: Workout;
  exercises: Exercise[];
}) {
  const [deleting, setDeleting] = useState(false);

  async function handleSubmit(data: WorkoutFormData) {
    await updateWorkoutAction({ workoutId: workout.id, ...data });
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteWorkoutAction(workout.id);
    } catch {
      setDeleting(false);
    }
  }

  return (
    <WorkoutForm
      exercises={exercises}
      initialDate={format(workout.date, "yyyy-MM-dd")}
      initialExerciseEntries={workout.workoutExercises.map((we) => ({
        exerciseId: we.exercise.id.toString(),
        sets: we.sets.map((s) => ({
          weight: s.weight !== null ? s.weight.toString() : "",
          reps: s.reps !== null ? s.reps.toString() : "",
        })),
      }))}
      submitLabel="Update Workout"
      onSubmit={handleSubmit}
      extraActions={
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              disabled={deleting}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Workout</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete this workout and all its exercises
                and sets. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      }
    />
  );
}
