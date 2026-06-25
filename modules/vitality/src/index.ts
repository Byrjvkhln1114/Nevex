import { dependencyEngine } from "@nevex/dependency-engine";
import { registerVitalityRules } from "./rules";

export function bootstrapVitality(): void {
  registerVitalityRules();
  dependencyEngine.start();
}

export * from "./types";
export * from "./events";
export * from "./services";
export * from "./repository";
