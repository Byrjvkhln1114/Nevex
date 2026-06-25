import type { DomainEvent, EventHandler, Unsubscribe } from "../types";

// Wildcard key for subscribers that want every event regardless of type
const WILDCARD = "*";

class EventBus {
  private handlers = new Map<string, Set<EventHandler>>();

  publish<TPayload>(event: DomainEvent<TPayload>): void {
    const key = `${event.domain}:${event.type}`;
    this.dispatch(key, event);
    this.dispatch(WILDCARD, event);
  }

  subscribe<TPayload>(
    domain: DomainEvent["domain"],
    type: DomainEvent["type"],
    handler: EventHandler<TPayload>
  ): Unsubscribe {
    const key = `${domain}:${type}`;
    return this.addHandler(key, handler as EventHandler);
  }

  // Subscribe to every event emitted across all domains
  subscribeAll(handler: EventHandler): Unsubscribe {
    return this.addHandler(WILDCARD, handler);
  }

  private addHandler(key: string, handler: EventHandler): Unsubscribe {
    if (!this.handlers.has(key)) {
      this.handlers.set(key, new Set());
    }
    this.handlers.get(key)!.add(handler);
    return () => this.handlers.get(key)?.delete(handler);
  }

  private dispatch(key: string, event: DomainEvent): void {
    this.handlers.get(key)?.forEach((handler) => handler(event));
  }
}

// Single shared instance for the entire app
export const eventBus = new EventBus();
