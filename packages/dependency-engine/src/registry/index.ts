import type { DependencyRule } from "../types";

class RuleRegistry {
  private rules = new Map<string, DependencyRule>();

  register(rule: DependencyRule): void {
    if (this.rules.has(rule.id)) {
      throw new Error(`Rule "${rule.id}" is already registered`);
    }
    this.rules.set(rule.id, rule);
  }

  getByTrigger(domain: string, eventType: string): DependencyRule[] {
    return Array.from(this.rules.values()).filter(
      (r) => r.trigger.domain === domain && r.trigger.eventType === eventType
    );
  }

  getAll(): DependencyRule[] {
    return Array.from(this.rules.values());
  }
}

export const ruleRegistry = new RuleRegistry();
