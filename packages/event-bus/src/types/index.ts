import type { DomainSlug } from "@nevex/shared-kernel";

export interface DomainEvent<TPayload = unknown> {
  readonly id: string;
  readonly type: string;          // e.g. "DebtBalanceReduced"
  readonly domain: DomainSlug;    // e.g. "treasury"
  readonly payload: TPayload;
  readonly occurredAt: string;    // ISO 8601
}

export type EventHandler<TPayload = unknown> = (
  event: DomainEvent<TPayload>
) => void | Promise<void>;

export type Unsubscribe = () => void;
