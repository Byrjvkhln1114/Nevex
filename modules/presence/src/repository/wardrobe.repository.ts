import { collection } from "@nevex/mongodb";
import type { PresenceWardrobeItem } from "../types";
import { PresenceCollection } from "./collections";

function items() {
  return collection<PresenceWardrobeItem>(PresenceCollection.wardrobeItems);
}

export async function findAllWardrobeItems(): Promise<PresenceWardrobeItem[]> {
  return items().find().toArray();
}

export async function createWardrobeItem(
  item: Omit<PresenceWardrobeItem, "_id" | "createdAt" | "updatedAt">
): Promise<PresenceWardrobeItem> {
  const now = new Date().toISOString();
  const doc: PresenceWardrobeItem = { ...item, _id: crypto.randomUUID(), createdAt: now, updatedAt: now };
  await items().insertOne(doc as never);
  return doc;
}
