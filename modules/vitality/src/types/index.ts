export type HabitFrequency = "daily" | "weekly";

export interface VitalityHabit {
  readonly _id: string;
  readonly name: string;
  readonly frequency: HabitFrequency;
  readonly streak: number;
  readonly longestStreak: number;
  readonly lastCompletedAt?: string; // ISO 8601
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface VitalityHabitLog {
  readonly _id: string;
  readonly habitId: string;
  readonly completedAt: string; // ISO 8601
  readonly note?: string;
}

export interface VitalityWorkoutSession {
  readonly _id: string;
  readonly type: string;        // e.g. "running", "lifting", "yoga"
  readonly durationMinutes: number;
  readonly intensityLevel: 1 | 2 | 3 | 4 | 5;
  readonly note?: string;
  readonly occurredAt: string;
  readonly createdAt: string;
}

export interface VitalityWellbeingCheckIn {
  readonly _id: string;
  readonly moodScore: 1 | 2 | 3 | 4 | 5;
  readonly energyScore: 1 | 2 | 3 | 4 | 5;
  readonly sleepHours: number;
  readonly note?: string;
  readonly occurredAt: string;
  readonly createdAt: string;
}
