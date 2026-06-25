import type { DomainSlug } from "../tag";
import type { Timeframe } from "../timeframe";
import type { Money } from "../money";

export type InitiativeStatus = "planned" | "active" | "completed" | "abandoned";

export interface Initiative {
  readonly id: string;
  readonly domain: DomainSlug;
  readonly title: string;
  readonly description?: string;
  readonly status: InitiativeStatus;
  readonly timeframe?: Timeframe;
  readonly budget?: Money;       // optional financial allocation for this goal
  readonly tagIds: string[];
  readonly createdAt: string;    // ISO 8601
  readonly updatedAt: string;
}
