import { findAllHabits, findRecentCheckIns } from "../src/repository";
import { completeHabit } from "../src/services";

export const vitalityResolvers = {
  VitalityQuery: {
    habits: () => findAllHabits(),
    recentCheckIns: () => findRecentCheckIns(),
  },
  VitalityMutation: {
    completeHabit: async (
      _: unknown,
      args: { habitId: string; note?: string }
    ) => {
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
