import { eventBus, type DomainEvent } from "@nevex/event-bus";
import { ruleRegistry } from "../registry";
import type { DependencyOutcome, OutcomeHandler } from "../types";

class DependencyEngine {
  private outcomeHandlers = new Set<OutcomeHandler>();
  private started = false;

  start(): void {
    if (this.started) return;
    this.started = true;

    eventBus.subscribeAll((event) => {
      this.evaluate(event);
    });
  }

  onOutcome(handler: OutcomeHandler): () => void {
    this.outcomeHandlers.add(handler);
    return () => this.outcomeHandlers.delete(handler);
  }

  private evaluate(event: DomainEvent): void {
    const matchingRules = ruleRegistry.getByTrigger(event.domain, event.type);

    for (const rule of matchingRules) {
      const conditionMet =
        !rule.trigger.condition || rule.trigger.condition(event.payload);

      if (!conditionMet) continue;

      const outcome: DependencyOutcome = {
        ruleId: rule.id,
        triggeredByEventId: event.id,
        action: rule.action,
        triggeredAt: new Date().toISOString(),
        status: "active",
      };

      this.outcomeHandlers.forEach((handler) => handler(outcome));
    }
  }
}

export const dependencyEngine = new DependencyEngine();
