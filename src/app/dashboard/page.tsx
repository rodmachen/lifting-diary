import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { getWorkoutsByDate } from "@/data/workouts";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const { date: dateParam } = await searchParams;
  const dateString = dateParam || format(new Date(), "yyyy-MM-dd");
  const date = new Date(dateString + "T00:00:00");

  const workouts = await getWorkoutsByDate(userId, date);

  return (
    <DashboardClient workouts={workouts} initialDateString={dateString} />
  );
}
