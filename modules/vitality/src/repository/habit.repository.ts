import { collection } from "@nevex/mongodb";
import type { VitalityHabit, VitalityHabitLog } from "../types";
import { VitalityCollection } from "./collections";

function habits() {
  return collection<VitalityHabit>(VitalityCollection.habits);
}

function habitLogs() {
  return collection<VitalityHabitLog>(VitalityCollection.habitLogs);
}

export async function findHabitById(id: string): Promise<VitalityHabit | null> {
  return habits().findOne({ _id: id } as never);
}

export async function findAllHabits(): Promise<VitalityHabit[]> {
  return habits().find().toArray();
}

export async function createHabit(
  habit: Omit<VitalityHabit, "_id" | "streak" | "longestStreak" | "createdAt" | "updatedAt">
): Promise<VitalityHabit> {
  const now = new Date().toISOString();
  const doc: VitalityHabit = {
    ...habit,
    _id: crypto.randomUUID(),
    streak: 0,
    longestStreak: 0,
    createdAt: now,
    updatedAt: now,
  };
  await habits().insertOne(doc as never);
  return doc;
}

export async function updateHabitStreak(
  id: string,
  streak: number,
  longestStreak: number,
  lastCompletedAt: string
): Promise<void> {
  await habits().updateOne(
    { _id: id } as never,
    {
      $set: {
        streak,
        longestStreak,
        lastCompletedAt,
        updatedAt: new Date().toISOString(),
      },
    }
  );
}

export async function logHabitCompletion(
  habitId: string,
  note?: string
): Promise<VitalityHabitLog> {
  const doc: VitalityHabitLog = {
    _id: crypto.randomUUID(),
    habitId,
    completedAt: new Date().toISOString(),
    note,
  };
  await habitLogs().insertOne(doc as never);
  return doc;
}
