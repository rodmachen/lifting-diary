"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import Link from "next/link";
import { CalendarIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Workout = {
  id: number;
  workoutExercises: {
    id: number;
    exercise: { name: string };
    sets: { setNumber: number; reps: number | null; weight: number | null }[];
  }[];
};

export function DashboardClient({
  workouts,
  initialDateString,
}: {
  workouts: Workout[];
  initialDateString: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const date = new Date(initialDateString + "T00:00:00");

  function handleDateSelect(day: Date | undefined) {
    if (day) {
      const dateStr = format(day, "yyyy-MM-dd");
      router.push(`/dashboard?date=${dateStr}`);
      router.refresh();
    }
    setOpen(false);
  }

  return (
    <div className="flex min-h-screen justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-3xl px-4 py-8 sm:px-16">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <div className="flex items-center gap-2">
            <Button
              onClick={() =>
                router.push(`/dashboard/workout/new?date=${initialDateString}`)
              }
              className="gap-1"
            >
              <Plus className="h-4 w-4" />
              Add Workout
            </Button>
            <Button variant="outline" onClick={() => handleDateSelect(new Date())}>
              Today
            </Button>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  {format(date, "do MMM yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={date}
                  defaultMonth={date}
                  onSelect={handleDateSelect}
                  autoFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {workouts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">
                No workouts logged for {format(date, "do MMM yyyy")}.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {workouts.map((workout) => (
              <Link
                key={workout.id}
                href={`/dashboard/workout/${workout.id}`}
                className="block"
              >
                <Card className="transition-colors hover:bg-accent">
                  <CardHeader>
                    <CardTitle>Workout</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {workout.workoutExercises.map((we) => (
                        <div key={we.id}>
                          <h3 className="mb-1 font-medium">{we.exercise.name}</h3>
                          <div className="space-y-1 text-sm">
                            {we.sets.map((set) => (
                              <p key={set.setNumber} className="text-muted-foreground">
                                Set {set.setNumber}: {set.reps ?? 0} reps @ {set.weight ?? 0} lbs
                              </p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
