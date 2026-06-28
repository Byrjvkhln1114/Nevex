import { ruleRegistry } from "@nevex/dependency-engine";

export function registerEnvironmentRules(): void {
  ruleRegistry.register({
    id: "environment:workspace-upgrade-boosts-trajectory",
    description: "Acquiring a workspace asset flags a productivity opportunity in Trajectory",
    trigger: { domain: "environment", eventType: "AssetAcquired" },
    action: {
      type: "flag",
      targetDomain: "trajectory",
      key: "WorkspaceUpgraded",
      message: "Your workspace improved — a better environment supports deeper focus and better output.",
    },
  });
}
