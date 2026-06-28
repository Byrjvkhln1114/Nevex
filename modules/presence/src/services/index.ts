import { createWardrobeItem } from "../repository";
import { emitWardrobeUpgraded } from "../events";
import type { PresenceWardrobeItem } from "../types";

export async function addWardrobeItem(
  input: Omit<PresenceWardrobeItem, "_id" | "createdAt" | "updatedAt">
): Promise<PresenceWardrobeItem> {
  const item = await createWardrobeItem(input);
  emitWardrobeUpgraded({ itemId: item._id, itemName: item.name, category: item.category });
  return item;
}
