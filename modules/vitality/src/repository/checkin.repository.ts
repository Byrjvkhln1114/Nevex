import { collection } from "@nevex/mongodb";
import type { VitalityWellbeingCheckIn } from "../types";
import { VitalityCollection } from "./collections";

function checkIns() {
  return collection<VitalityWellbeingCheckIn>(VitalityCollection.checkIns);
}

export async function createCheckIn(
  data: Omit<VitalityWellbeingCheckIn, "_id" | "createdAt">
): Promise<VitalityWellbeingCheckIn> {
  const doc: VitalityWellbeingCheckIn = {
    ...data,
    _id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  await checkIns().insertOne(doc as never);
  return doc;
}

export async function findRecentCheckIns(
  limit = 7
): Promise<VitalityWellbeingCheckIn[]> {
  return checkIns()
    .find()
    .sort({ occurredAt: -1 })
    .limit(limit)
    .toArray();
}
