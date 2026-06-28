"use server";

import { revalidatePath } from "next/cache";
import { gql } from "@/lib/gql";

export async function createAccount(formData: FormData) {
  await gql(`
    mutation($input: CreateAccountInput!) {
      treasury { createAccount(input: $input) { id } }
    }
  `, {
    input: {
      name: formData.get("name") as string,
      type: formData.get("type") as string,
      balanceAmount: Math.round(Number(formData.get("balanceAmount")) * 100),
      currency: formData.get("currency") as string,
    },
  });
  revalidatePath("/treasury");
}

export async function createDebt(formData: FormData) {
  await gql(`
    mutation($input: CreateDebtInput!) {
      treasury { createDebt(input: $input) { id } }
    }
  `, {
    input: {
      accountId: formData.get("accountId") as string,
      label: formData.get("label") as string,
      principalAmount: Math.round(Number(formData.get("principalAmount")) * 100),
      currency: formData.get("currency") as string,
      interestRate: Number(formData.get("interestRate")),
      minimumPaymentAmount: Math.round(Number(formData.get("minimumPaymentAmount")) * 100),
    },
  });
  revalidatePath("/treasury");
}

export async function makeDebtPayment(formData: FormData) {
  await gql(`
    mutation($debtId: ID!, $amount: Int!, $currency: Currency!) {
      treasury { makeDebtPayment(debtId: $debtId, amount: $amount, currency: $currency) }
    }
  `, {
    debtId: formData.get("debtId") as string,
    amount: Math.round(Number(formData.get("amount")) * 100),
    currency: formData.get("currency") as string,
  });
  revalidatePath("/treasury");
}
