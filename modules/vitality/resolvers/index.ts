import { findAllHabits, findRecentCheckIns } from "../src/repository";
import { completeHabit, createVitalityHabit, createWellbeingCheckIn } from "../src/services";
import type { VitalityHabit, VitalityWellbeingCheckIn } from "../src/types";

export const vitalityResolvers = {
  VitalityQuery: {
    habits: () => findAllHabits(),
    recentCheckIns: () => findRecentCheckIns(),
  },
  VitalityMutation: {
    createHabit: (_: unknown, args: { input: { name: string; frequency: VitalityHabit["frequency"] } }) =>
      createVitalityHabit(args.input),

    createCheckIn: (_: unknown, args: { input: {
      moodScore: VitalityWellbeingCheckIn["moodScore"];
      energyScore: VitalityWellbeingCheckIn["energyScore"];
      sleepHours: number;
      note?: string;
    }}) => createWellbeingCheckIn(args.input),

    completeHabit: async (_: unknown, args: { habitId: string; note?: string }) => {
      await completeHabit(args.habitId, args.note);
      return true;
    },
  },
  VitalityHabit: {
    id: (h: { _id: string }) => h._id,
  },
  VitalityWellbeingCheckIn: {
    id: (c: { _id: string }) => c._id,
  },
};
