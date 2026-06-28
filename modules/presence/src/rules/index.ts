import { ruleRegistry } from "@nevex/dependency-engine";

export function registerPresenceRules(): void {
  ruleRegistry.register({
    id: "presence:wardrobe-upgraded-boosts-confidence",
    description: "A wardrobe upgrade flags a confidence boost relevant to career goals",
    trigger: {
      domain: "presence",
      eventType: "WardrobeUpgraded",
    },
    action: {
      type: "flag",
      targetDomain: "trajectory",
      key: "ConfidenceBoost",
      message: "New wardrobe addition — looking sharp correlates with showing up stronger in professional settings.",
    },
  });
}
