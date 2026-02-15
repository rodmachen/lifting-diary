import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { getAllExercises } from "@/data/workouts";
import { NewWorkoutForm } from "./new-workout-form";

export default async function NewWorkoutPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const { date: dateParam } = await searchParams;
  const dateString = dateParam || format(new Date(), "yyyy-MM-dd");

  const exercises = await getAllExercises();

  return (
    <div className="flex min-h-screen justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-3xl px-4 py-8 sm:px-16">
        <h1 className="mb-8 text-2xl font-semibold tracking-tight">
          New Workout
        </h1>
        <NewWorkoutForm exercises={exercises} initialDate={dateString} />
      </main>
    </div>
  );
}
