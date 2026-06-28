import { createCheckIn } from "../repository";
import { emitEnergyLevelImproved } from "../events";
import { findRecentCheckIns } from "../repository";
import type { VitalityWellbeingCheckIn } from "../types";

export async function createWellbeingCheckIn(input: {
  moodScore: VitalityWellbeingCheckIn["moodScore"];
  energyScore: VitalityWellbeingCheckIn["energyScore"];
  sleepHours: number;
  note?: string;
}): Promise<VitalityWellbeingCheckIn> {
  const checkIn = await createCheckIn({
    ...input,
    occurredAt: new Date().toISOString(),
  });

  // After each check-in, recalculate 14-day energy average
  await evaluateEnergyTrend();

  return checkIn;
}

async function evaluateEnergyTrend(): Promise<void> {
  const recent = await findRecentCheckIns(14);
  if (recent.length < 14) return;

  const currentAvg = recent.slice(0, 7).reduce((s, c) => s + c.energyScore, 0) / 7;
  const previousAvg = recent.slice(7, 14).reduce((s, c) => s + c.energyScore, 0) / 7;

  if (currentAvg > previousAvg && currentAvg >= 4) {
    emitEnergyLevelImproved({ previousAvg, currentAvg, periodDays: 14 });
  }
}
