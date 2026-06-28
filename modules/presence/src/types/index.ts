export type ClothingCategory = "tops" | "bottoms" | "outerwear" | "shoes" | "accessories";
export type WardrobeItemCondition = "new" | "good" | "worn" | "retired";

export interface PresenceWardrobeItem {
  readonly _id: string;
  readonly name: string;
  readonly category: ClothingCategory;
  readonly brand?: string;
  readonly color?: string;
  readonly condition: WardrobeItemCondition;
  readonly tagIds: string[];
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface PresenceGroomingRoutine {
  readonly _id: string;
  readonly name: string;
  readonly steps: string[];
  readonly frequencyDays: number; // every N days
  readonly lastDoneAt?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface PresenceStyleGoal {
  readonly _id: string;
  readonly title: string;
  readonly description?: string;
  readonly targetDate?: string;
  readonly completed: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}
