import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { getWorkoutById, getAllExercises } from "@/data/workouts";
import { EditWorkoutForm } from "./edit-workout-form";

export default async function EditWorkoutPage({
  params,
}: {
  params: Promise<{ workoutId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const { workoutId: workoutIdParam } = await params;
  const workoutId = parseInt(workoutIdParam);
  if (isNaN(workoutId)) notFound();

  const [workout, exercises] = await Promise.all([
    getWorkoutById(workoutId, userId),
    getAllExercises(),
  ]);

  if (!workout) notFound();

  return (
    <div className="flex min-h-screen justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-3xl px-4 py-8 sm:px-16">
        <h1 className="mb-8 text-2xl font-semibold tracking-tight">
          Edit Workout
        </h1>
        <EditWorkoutForm workout={workout} exercises={exercises} />
      </main>
    </div>
  );
}
