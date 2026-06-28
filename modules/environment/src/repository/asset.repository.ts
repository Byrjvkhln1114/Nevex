import { collection } from "@nevex/mongodb";
import type { EnvironmentAsset } from "../types";
import { EnvironmentCollection } from "./collections";

function assets() { return collection<EnvironmentAsset>(EnvironmentCollection.assets); }

export async function findAllAssets(): Promise<EnvironmentAsset[]> {
  return assets().find().toArray();
}

export async function createAsset(
  asset: Omit<EnvironmentAsset, "_id" | "createdAt" | "updatedAt">
): Promise<EnvironmentAsset> {
  const now = new Date().toISOString();
  const doc: EnvironmentAsset = { ...asset, _id: crypto.randomUUID(), createdAt: now, updatedAt: now };
  await assets().insertOne(doc as never);
  return doc;
}
