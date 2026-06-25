import { eventBus } from "@nevex/event-bus";

export interface HabitStreakAchievedPayload {
  habitId: string;
  habitName: string;
  streakLength: number;
}

export interface EnergyLevelImprovedPayload {
  previousAvg: number;
  currentAvg: number;
  periodDays: number;
}

export function emitHabitStreakAchieved(
  payload: HabitStreakAchievedPayload
): void {
  eventBus.publish({
    id: crypto.randomUUID(),
    type: "HabitStreakAchieved",
    domain: "vitality",
    payload,
    occurredAt: new Date().toISOString(),
  });
}

export function emitEnergyLevelImproved(
  payload: EnergyLevelImprovedPayload
): void {
  eventBus.publish({
    id: crypto.randomUUID(),
    type: "EnergyLevelImproved",
    domain: "vitality",
    payload,
    occurredAt: new Date().toISOString(),
  });
}
