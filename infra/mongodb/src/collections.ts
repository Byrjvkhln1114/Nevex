import type { Collection, Document } from "mongodb";
import { getDb } from "./client";

// Typed helper so every collection call gets the right document shape
export function collection<T extends Document>(name: string): Collection<T> {
  return getDb().collection<T>(name);
}

// Platform-owned collection names (shared kernel — no domain owns these)
export const CollectionName = {
  // Append-only event store — source of truth for all domain events
  events: "events",

  // Dependency rule definitions registered by each module
  dependencyRules: "dependency_rules",

  // Derived unlock/flag/suggest state produced by the dependency engine
  dependencyState: "dependency_state",

  // Base initiative records (domain-specific goals reference these by id)
  initiatives: "initiatives",

  // Cross-domain tags
  tags: "tags",

  // In-app notifications
  notifications: "notifications",

  // Single user document (single-user system, modeled multi-user-ready)
  users: "users",
} as const;

export type CollectionName = (typeof CollectionName)[keyof typeof CollectionName];
