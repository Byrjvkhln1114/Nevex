import { findAllSkills, findAllCertifications, findAllMilestones } from "../src/repository";
import { addSkill, addCertification, addMilestone } from "../src/services";
import type { TrajectorySkill, TrajectoryCertification, TrajectoryMilestone } from "../src/types";

export const trajectoryResolvers = {
  TrajectoryQuery: {
    skills: () => findAllSkills(),
    certifications: () => findAllCertifications(),
    milestones: () => findAllMilestones(),
  },
  TrajectoryMutation: {
    addSkill: (_: unknown, args: { input: Omit<TrajectorySkill, "_id" | "createdAt" | "updatedAt"> }) => addSkill(args.input),
    addCertification: (_: unknown, args: { input: Omit<TrajectoryCertification, "_id" | "createdAt"> }) => addCertification(args.input),
    addMilestone: (_: unknown, args: { input: Omit<TrajectoryMilestone, "_id" | "createdAt"> }) => addMilestone(args.input),
  },
  TrajectorySkill: { id: (s: { _id: string }) => s._id },
  TrajectoryCertification: { id: (c: { _id: string }) => c._id },
  TrajectoryMilestone: { id: (m: { _id: string }) => m._id },
};
