import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
  real,
  date,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============================================
// TABLES
// ============================================

export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const workouts = pgTable(
  "workouts",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 255 }).notNull(),
    date: date("date", { mode: "date" }).notNull(),
    startedAt: timestamp("started_at"),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("workouts_user_id_idx").on(table.userId),
    index("workouts_user_id_date_idx").on(table.userId, table.date),
  ]
);

export const workoutExercises = pgTable(
  "workout_exercises",
  {
    id: serial("id").primaryKey(),
    workoutId: integer("workout_id")
      .notNull()
      .references(() => workouts.id, { onDelete: "cascade" }),
    exerciseId: integer("exercise_id")
      .notNull()
      .references(() => exercises.id, { onDelete: "restrict" }),
    order: integer("order").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("workout_exercises_workout_id_idx").on(table.workoutId),
    index("workout_exercises_workout_order_idx").on(table.workoutId, table.order),
  ]
);

export const sets = pgTable(
  "sets",
  {
    id: serial("id").primaryKey(),
    workoutExerciseId: integer("workout_exercise_id")
      .notNull()
      .references(() => workoutExercises.id, { onDelete: "cascade" }),
    setNumber: integer("set_number").notNull(),
    weight: real("weight"),
    reps: integer("reps"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("sets_workout_exercise_id_idx").on(table.workoutExerciseId),
    index("sets_workout_exercise_set_number_idx").on(
      table.workoutExerciseId,
      table.setNumber
    ),
  ]
);

// ============================================
// RELATIONS
// ============================================

export const exercisesRelations = relations(exercises, ({ many }) => ({
  workoutExercises: many(workoutExercises),
}));

export const workoutsRelations = relations(workouts, ({ many }) => ({
  workoutExercises: many(workoutExercises),
}));

export const workoutExercisesRelations = relations(
  workoutExercises,
  ({ one, many }) => ({
    workout: one(workouts, {
      fields: [workoutExercises.workoutId],
      references: [workouts.id],
    }),
    exercise: one(exercises, {
      fields: [workoutExercises.exerciseId],
      references: [exercises.id],
    }),
    sets: many(sets),
  })
);

export const setsRelations = relations(sets, ({ one }) => ({
  workoutExercise: one(workoutExercises, {
    fields: [sets.workoutExerciseId],
    references: [workoutExercises.id],
  }),
}));
