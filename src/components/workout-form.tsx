"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Exercise = {
  id: number;
  name: string;
};

type SetEntry = {
  weight: string;
  reps: string;
};

type ExerciseEntry = {
  exerciseId: string;
  sets: SetEntry[];
};

export type WorkoutFormData = {
  date: string;
  exercises: {
    exerciseId: number;
    sets: { weight: number | null; reps: number | null }[];
  }[];
};

export function WorkoutForm({
  exercises,
  initialDate,
  initialExerciseEntries,
  submitLabel,
  onSubmit,
  extraActions,
}: {
  exercises: Exercise[];
  initialDate: string;
  initialExerciseEntries?: ExerciseEntry[];
  submitLabel: string;
  onSubmit: (data: WorkoutFormData) => Promise<void>;
  extraActions?: React.ReactNode;
}) {
  const router = useRouter();
  const [dateString, setDateString] = useState(initialDate);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [exerciseEntries, setExerciseEntries] = useState<ExerciseEntry[]>(
    initialExerciseEntries ?? [
      { exerciseId: "", sets: [{ weight: "", reps: "" }] },
    ]
  );

  const date = new Date(dateString + "T00:00:00");

  function handleDateSelect(day: Date | undefined) {
    if (day) {
      setDateString(format(day, "yyyy-MM-dd"));
    }
    setCalendarOpen(false);
  }

  function addExercise() {
    setExerciseEntries([
      ...exerciseEntries,
      { exerciseId: "", sets: [{ weight: "", reps: "" }] },
    ]);
  }

  function removeExercise(index: number) {
    setExerciseEntries(exerciseEntries.filter((_, i) => i !== index));
  }

  function updateExerciseId(index: number, exerciseId: string) {
    const updated = [...exerciseEntries];
    updated[index] = { ...updated[index], exerciseId };
    setExerciseEntries(updated);
  }

  function addSet(exerciseIndex: number) {
    const updated = [...exerciseEntries];
    updated[exerciseIndex] = {
      ...updated[exerciseIndex],
      sets: [
        ...updated[exerciseIndex].sets,
        { ...updated[exerciseIndex].sets[updated[exerciseIndex].sets.length - 1] },
      ],
    };
    setExerciseEntries(updated);
  }

  function removeSet(exerciseIndex: number, setIndex: number) {
    const updated = [...exerciseEntries];
    updated[exerciseIndex] = {
      ...updated[exerciseIndex],
      sets: updated[exerciseIndex].sets.filter((_, i) => i !== setIndex),
    };
    setExerciseEntries(updated);
  }

  function updateSet(
    exerciseIndex: number,
    setIndex: number,
    field: "weight" | "reps",
    value: string
  ) {
    const updated = [...exerciseEntries];
    updated[exerciseIndex] = {
      ...updated[exerciseIndex],
      sets: updated[exerciseIndex].sets.map((s, i) =>
        i === setIndex ? { ...s, [field]: value } : s
      ),
    };
    setExerciseEntries(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const data: WorkoutFormData = {
      date: dateString,
      exercises: exerciseEntries
        .filter((entry) => entry.exerciseId !== "")
        .map((entry) => ({
          exerciseId: parseInt(entry.exerciseId),
          sets: entry.sets.map((s) => ({
            weight: s.weight ? parseFloat(s.weight) : null,
            reps: s.reps ? parseInt(s.reps) : null,
          })),
        })),
    };

    try {
      await onSubmit(data);
    } catch {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <CardTitle>Date</CardTitle>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  {format(date, "do MMM yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
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
        </CardHeader>
      </Card>

      {exerciseEntries.map((entry, exerciseIndex) => (
        <Card key={exerciseIndex}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CardTitle>Exercise {exerciseIndex + 1}</CardTitle>
                <Select
                  value={entry.exerciseId}
                  onValueChange={(value) =>
                    updateExerciseId(exerciseIndex, value)
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select an exercise" />
                  </SelectTrigger>
                  <SelectContent>
                    {exercises.map((exercise) => (
                      <SelectItem
                        key={exercise.id}
                        value={exercise.id.toString()}
                      >
                        {exercise.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {exerciseEntries.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeExercise(exerciseIndex)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Sets</Label>
              <div className="space-y-2">
                {entry.sets.map((set, setIndex) => (
                  <div key={setIndex} className="flex items-center gap-2">
                    <span className="text-muted-foreground w-8 text-sm">
                      {setIndex + 1}.
                    </span>
                    <Input
                      type="number"
                      placeholder="Weight (lbs)"
                      value={set.weight}
                      onChange={(e) =>
                        updateSet(
                          exerciseIndex,
                          setIndex,
                          "weight",
                          e.target.value
                        )
                      }
                      step="any"
                    />
                    <Input
                      type="number"
                      placeholder="Reps"
                      value={set.reps}
                      onChange={(e) =>
                        updateSet(
                          exerciseIndex,
                          setIndex,
                          "reps",
                          e.target.value
                        )
                      }
                    />
                    {entry.sets.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSet(exerciseIndex, setIndex)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={() => addSet(exerciseIndex)}
              >
                <Plus className="h-3 w-3" />
                Add Set
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="gap-1"
          onClick={addExercise}
        >
          <Plus className="h-4 w-4" />
          Add Exercise
        </Button>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : submitLabel}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/dashboard?date=${dateString}`)}
        >
          Cancel
        </Button>
        {extraActions}
      </div>
    </form>
  );
}
