"use server";

import { revalidatePath } from "next/cache";
import { gql } from "@/lib/gql";

export async function addWardrobeItem(formData: FormData) {
  await gql(`
    mutation($input: AddWardrobeItemInput!) {
      presence { addWardrobeItem(input: $input) { id } }
    }
  `, {
    input: {
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      condition: formData.get("condition") as string,
      brand: (formData.get("brand") as string) || undefined,
      color: (formData.get("color") as string) || undefined,
    },
  });
  revalidatePath("/presence");
}
