import { collection } from "@nevex/mongodb";
import type { TreasuryDebt } from "../types";
import { TreasuryCollection } from "./collections";

function debts() {
  return collection<TreasuryDebt>(TreasuryCollection.debts);
}

export async function findDebtById(id: string): Promise<TreasuryDebt | null> {
  return debts().findOne({ _id: id } as never);
}

export async function findAllDebts(): Promise<TreasuryDebt[]> {
  return debts().find().toArray();
}

export async function createDebt(
  debt: Omit<TreasuryDebt, "_id" | "createdAt" | "updatedAt">
): Promise<TreasuryDebt> {
  const now = new Date().toISOString();
  const doc: TreasuryDebt = {
    ...debt,
    _id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  await debts().insertOne(doc as never);
  return doc;
}

export async function updateDebtBalance(
  id: string,
  newBalance: TreasuryDebt["balance"]
): Promise<void> {
  await debts().updateOne(
    { _id: id } as never,
    { $set: { balance: newBalance, updatedAt: new Date().toISOString() } }
  );
}
