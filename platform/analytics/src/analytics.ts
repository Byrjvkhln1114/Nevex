import { collection } from "@nevex/mongodb";
import type { DomainSlug } from "@nevex/shared-kernel";

interface StoredEvent {
  _id: string;
  type: string;
  domain: DomainSlug;
  payload: unknown;
  occurredAt: string;
}

function eventsCol() {
  return collection<StoredEvent>("events");
}

export interface TrendPoint {
  date: string;   // YYYY-MM-DD
  value: number;
}

export interface DomainAnalytics {
  domain: DomainSlug;
  eventCounts: TrendPoint[];          // events per day (last 30 days)
  topEventTypes: { type: string; count: number }[];
}

function isoToDate(iso: string): string {
  return iso.slice(0, 10);
}

function last30Days(): string[] {
  const days: string[] = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

export async function getDomainAnalytics(domain: DomainSlug): Promise<DomainAnalytics> {
  const since = new Date();
  since.setDate(since.getDate() - 30);

  const events = await eventsCol()
    .find({ domain, occurredAt: { $gte: since.toISOString() } } as never)
    .toArray();

  // Build events-per-day map
  const countByDay = new Map<string, number>();
  const countByType = new Map<string, number>();

  for (const e of events) {
    const day = isoToDate(e.occurredAt);
    countByDay.set(day, (countByDay.get(day) ?? 0) + 1);
    countByType.set(e.type, (countByType.get(e.type) ?? 0) + 1);
  }

  const eventCounts = last30Days().map((date) => ({
    date,
    value: countByDay.get(date) ?? 0,
  }));

  const topEventTypes = [...countByType.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([type, count]) => ({ type, count }));

  return { domain, eventCounts, topEventTypes };
}

export async function getAllDomainAnalytics(): Promise<DomainAnalytics[]> {
  const domains: DomainSlug[] = ["treasury", "vitality", "presence", "environment", "trajectory"];
  return Promise.all(domains.map(getDomainAnalytics));
}

// Specific treasury trend: debt balance reduction over time
export interface DebtTrendPoint {
  date: string;
  debtId: string;
  newBalance: number;
  currency: string;
}

export async function getDebtReductionTrend(debtId?: string): Promise<DebtTrendPoint[]> {
  const filter: Record<string, unknown> = { domain: "treasury", type: "DebtBalanceReduced" };
  if (debtId) filter["payload.debtId"] = debtId;

  const events = await eventsCol()
    .find(filter as never)
    .sort({ occurredAt: 1 })
    .toArray();

  return events.map((e) => {
    const p = e.payload as { debtId: string; newBalance: { amount: number; currency: string } };
    return {
      date: isoToDate(e.occurredAt),
      debtId: p.debtId,
      newBalance: p.newBalance.amount,
      currency: p.newBalance.currency,
    };
  });
}
