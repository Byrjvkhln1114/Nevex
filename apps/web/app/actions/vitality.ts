"use server";

import { revalidatePath } from "next/cache";
import { gql } from "@/lib/gql";

export async function createHabit(formData: FormData) {
  await gql(`
    mutation($input: CreateHabitInput!) {
      vitality { createHabit(input: $input) { id } }
    }
  `, {
    input: {
      name: formData.get("name") as string,
      frequency: formData.get("frequency") as string,
    },
  });
  revalidatePath("/vitality");
}

export async function createCheckIn(formData: FormData) {
  await gql(`
    mutation($input: CreateCheckInInput!) {
      vitality { createCheckIn(input: $input) { id } }
    }
  `, {
    input: {
      moodScore: Number(formData.get("moodScore")),
      energyScore: Number(formData.get("energyScore")),
      sleepHours: Number(formData.get("sleepHours")),
      note: (formData.get("note") as string) || undefined,
    },
  });
  revalidatePath("/vitality");
}

export async function completeHabit(formData: FormData) {
  await gql(`
    mutation($habitId: ID!) {
      vitality { completeHabit(habitId: $habitId) }
    }
  `, { habitId: formData.get("habitId") as string });
  revalidatePath("/vitality");
}
