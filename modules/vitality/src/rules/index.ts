import { ruleRegistry } from "@nevex/dependency-engine";
import type { HabitStreakAchievedPayload, EnergyLevelImprovedPayload } from "../events";

export function registerVitalityRules(): void {
  ruleRegistry.register({
    id: "vitality:exercise-streak-boosts-trajectory",
    description: "30-day exercise streak flags a productivity boost in career domain",
    trigger: {
      domain: "vitality",
      eventType: "HabitStreakAchieved",
      condition: (payload: unknown) => {
        const p = payload as HabitStreakAchievedPayload;
        return p.habitName.toLowerCase().includes("exercise") && p.streakLength >= 30;
      },
    },
    action: {
      type: "flag",
      targetDomain: "trajectory",
      key: "ProductivityBoost",
      message: `30-day exercise streak — your energy and focus are at a high point. Good time to push on a career goal.`,
    },
  });

  ruleRegistry.register({
    id: "vitality:habit-streak-suggests-gym-budget",
    description: "7-day habit streak suggests allocating a gym budget in Treasury",
    trigger: {
      domain: "vitality",
      eventType: "HabitStreakAchieved",
      condition: (payload: unknown) => {
        const p = payload as HabitStreakAchievedPayload;
        return p.streakLength >= 7;
      },
    },
    action: {
      type: "suggest",
      targetDomain: "treasury",
      key: "GymMembershipBudget",
      message: "You've built a 7-day streak — worth budgeting for a gym membership?",
    },
  });

  ruleRegistry.register({
    id: "vitality:energy-improved-unlocks-trajectory",
    description: "Sustained energy improvement unlocks a new learning plan suggestion",
    trigger: {
      domain: "vitality",
      eventType: "EnergyLevelImproved",
      condition: (payload: unknown) => {
        const p = payload as EnergyLevelImprovedPayload;
        return p.currentAvg >= 4 && p.periodDays >= 14;
      },
    },
    action: {
      type: "unlock",
      targetDomain: "trajectory",
      key: "NewLearningPlan",
      message: "Your energy has been consistently high — a good time to start a new learning plan.",
    },
  });
}
