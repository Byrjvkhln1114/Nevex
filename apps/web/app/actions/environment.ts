"use server";

import { revalidatePath } from "next/cache";
import { gql } from "@/lib/gql";

export async function acquireAsset(formData: FormData) {
  await gql(`
    mutation($input: AcquireAssetInput!) {
      environment { acquireAsset(input: $input) { id } }
    }
  `, {
    input: {
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      status: formData.get("status") as string,
      note: (formData.get("note") as string) || undefined,
      purchasedAt: (formData.get("purchasedAt") as string) || undefined,
    },
  });
  revalidatePath("/environment");
}
