import { findAllWardrobeItems } from "../src/repository";
import { addWardrobeItem } from "../src/services";
import type { PresenceWardrobeItem } from "../src/types";

export const presenceResolvers = {
  PresenceQuery: {
    wardrobeItems: () => findAllWardrobeItems(),
  },
  PresenceMutation: {
    addWardrobeItem: (_: unknown, args: { input: Omit<PresenceWardrobeItem, "_id" | "createdAt" | "updatedAt"> }) =>
      addWardrobeItem({ ...args.input, tagIds: [] }),
  },
  PresenceWardrobeItem: {
    id: (item: { _id: string }) => item._id,
  },
};
