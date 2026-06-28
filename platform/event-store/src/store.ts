import { collection } from "@nevex/mongodb";
import { eventBus, type DomainEvent } from "@nevex/event-bus";
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

export function startEventStore(): void {
  eventBus.subscribeAll(async (event: DomainEvent) => {
    await eventsCol().updateOne(
      { _id: event.id } as never,
      { $setOnInsert: { _id: event.id, type: event.type, domain: event.domain, payload: event.payload, occurredAt: event.occurredAt } },
      { upsert: true }
    );
  });
}

export async function findEventsByDomain(domain: DomainSlug, limit = 100): Promise<StoredEvent[]> {
  return eventsCol()
    .find({ domain } as never)
    .sort({ occurredAt: -1 })
    .limit(limit)
    .toArray();
}

export async function findEventsByType(type: string, limit = 100): Promise<StoredEvent[]> {
  return eventsCol()
    .find({ type } as never)
    .sort({ occurredAt: -1 })
    .limit(limit)
    .toArray();
}

export async function countEventsByType(domain: DomainSlug, type: string, since?: string): Promise<number> {
  const filter: Record<string, unknown> = { domain, type };
  if (since) filter["occurredAt"] = { $gte: since };
  return eventsCol().countDocuments(filter as never);
}
