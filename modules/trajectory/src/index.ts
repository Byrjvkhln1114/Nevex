import { dependencyEngine } from "@nevex/dependency-engine";
import { registerTrajectoryRules } from "./rules";

export function bootstrapTrajectory(): void {
  registerTrajectoryRules();
  dependencyEngine.start();
}

export * from "./types";
export * from "./events";
export * from "./services";
export * from "./repository";
