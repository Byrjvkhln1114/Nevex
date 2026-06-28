import { eventBus } from "@nevex/event-bus";

export interface AssetAcquiredPayload { assetId: string; assetName: string; category: string; }

export function emitAssetAcquired(payload: AssetAcquiredPayload): void {
  eventBus.publish({ id: crypto.randomUUID(), type: "AssetAcquired", domain: "environment", payload, occurredAt: new Date().toISOString() });
}
