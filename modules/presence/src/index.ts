import { dependencyEngine } from "@nevex/dependency-engine";
import { registerPresenceRules } from "./rules";

export function bootstrapPresence(): void {
  registerPresenceRules();
  dependencyEngine.start();
}

export * from "./types";
export * from "./events";
export * from "./services";
export * from "./repository";
