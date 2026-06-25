import { collection } from "@nevex/mongodb";
import type { TreasuryAccount } from "../types";
import { TreasuryCollection } from "./collections";

function accounts() {
  return collection<TreasuryAccount>(TreasuryCollection.accounts);
}

export async function findAccountById(
  id: string
): Promise<TreasuryAccount | null> {
  return accounts().findOne({ _id: id } as never);
}

export async function findAllAccounts(): Promise<TreasuryAccount[]> {
  return accounts().find().toArray();
}

export async function createAccount(
  account: Omit<TreasuryAccount, "_id" | "createdAt" | "updatedAt">
): Promise<TreasuryAccount> {
  const now = new Date().toISOString();
  const doc: TreasuryAccount = {
    ...account,
    _id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  await accounts().insertOne(doc as never);
  return doc;
}
