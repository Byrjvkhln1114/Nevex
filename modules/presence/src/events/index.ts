import { eventBus } from "@nevex/event-bus";

export interface WardrobeUpgradedPayload {
  itemId: string;
  itemName: string;
  category: string;
}

export function emitWardrobeUpgraded(payload: WardrobeUpgradedPayload): void {
  eventBus.publish({
    id: crypto.randomUUID(),
    type: "WardrobeUpgraded",
    domain: "presence",
    payload,
    occurredAt: new Date().toISOString(),
  });
}
