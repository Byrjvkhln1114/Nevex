"use server";

import { revalidatePath } from "next/cache";
import { gql } from "@/lib/gql";

export async function addSkill(formData: FormData) {
  await gql(`
    mutation($input: AddSkillInput!) {
      trajectory { addSkill(input: $input) { id } }
    }
  `, {
    input: {
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      level: formData.get("level") as string,
    },
  });
  revalidatePath("/trajectory");
}

export async function addCertification(formData: FormData) {
  await gql(`
    mutation($input: AddCertificationInput!) {
      trajectory { addCertification(input: $input) { id } }
    }
  `, {
    input: {
      title: formData.get("title") as string,
      issuer: formData.get("issuer") as string,
      earnedAt: formData.get("earnedAt") as string,
      expiresAt: (formData.get("expiresAt") as string) || undefined,
    },
  });
  revalidatePath("/trajectory");
}

export async function addMilestone(formData: FormData) {
  await gql(`
    mutation($input: AddMilestoneInput!) {
      trajectory { addMilestone(input: $input) { id } }
    }
  `, {
    input: {
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || undefined,
      occurredAt: formData.get("occurredAt") as string,
    },
  });
  revalidatePath("/trajectory");
}
