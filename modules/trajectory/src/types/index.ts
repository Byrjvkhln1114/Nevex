export type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert";

export interface TrajectorySkill {
  readonly _id: string;
  readonly name: string;
  readonly category: string; // e.g. "programming", "design", "leadership"
  readonly level: SkillLevel;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface TrajectoryCertification {
  readonly _id: string;
  readonly title: string;
  readonly issuer: string;
  readonly earnedAt: string;
  readonly expiresAt?: string;
  readonly createdAt: string;
}

export interface TrajectoryMilestone {
  readonly _id: string;
  readonly title: string;
  readonly description?: string;
  readonly occurredAt: string;
  readonly createdAt: string;
}
