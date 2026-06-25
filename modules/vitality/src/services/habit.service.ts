import {
  findHabitById,
  logHabitCompletion,
  updateHabitStreak,
} from "../repository";
import { emitHabitStreakAchieved } from "../events";

const STREAK_MILESTONES = [7, 14, 30, 60, 90, 180, 365];

export async function completeHabit(
  habitId: string,
  note?: string
): Promise<void> {
  const habit = await findHabitById(habitId);
  if (!habit) throw new Error(`Habit ${habitId} not found`);

  const now = new Date().toISOString();
  const newStreak = habit.streak + 1;
  const newLongest = Math.max(newStreak, habit.longestStreak);

  await logHabitCompletion(habitId, note);
  await updateHabitStreak(habitId, newStreak, newLongest, now);

  // Emit event at every milestone so rules can react
  if (STREAK_MILESTONES.includes(newStreak)) {
    emitHabitStreakAchieved({
      habitId,
      habitName: habit.name,
      streakLength: newStreak,
    });
  }
}
