import type { DomainSlug } from "@nevex/shared-kernel";
import type { DomainEvent } from "@nevex/event-bus";

export type ActionType = "unlock" | "suggest" | "flag" | "notify";

export interface DependencyAction {
  readonly type: ActionType;
  readonly targetDomain: DomainSlug;
  readonly key: string;       // e.g. "WardrobeUpgrade", "InvestmentReadiness"
  readonly message?: string;  // human-readable description of what happened
}

export interface DependencyRule<TPayload = unknown> {
  readonly id: string;
  readonly description: string;
  readonly trigger: {
    readonly domain: DomainSlug;
    readonly eventType: string;
    readonly condition?: (payload: TPayload) => boolean;
  };
  readonly action: DependencyAction;
}

export interface DependencyOutcome {
  readonly ruleId: string;
  readonly triggeredByEventId: string;
  readonly action: DependencyAction;
  readonly triggeredAt: string; // ISO 8601
  status: "active" | "dismissed";
}

export type OutcomeHandler = (outcome: DependencyOutcome) => void;
