import { dependencyEngine } from "@nevex/dependency-engine";
import { registerEnvironmentRules } from "./rules";

export function bootstrapEnvironment(): void {
  registerEnvironmentRules();
  dependencyEngine.start();
}

export * from "./types";
export * from "./events";
export * from "./services";
export * from "./repository";
