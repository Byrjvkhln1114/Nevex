import { dependencyEngine } from "@nevex/dependency-engine";
import { registerTreasuryRules } from "./rules";

export function bootstrapTreasury(): void {
  registerTreasuryRules();
  dependencyEngine.start();
}

export * from "./types";
export * from "./events";
export * from "./services";
export * from "./repository";
