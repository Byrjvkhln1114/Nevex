import { createSkill, createCertification, createMilestone } from "../repository";
import { emitCertificationEarned, emitSkillLevelledUp } from "../events";
import type { TrajectorySkill, TrajectoryCertification, TrajectoryMilestone } from "../types";

export async function addSkill(input: Omit<TrajectorySkill, "_id" | "createdAt" | "updatedAt">): Promise<TrajectorySkill> {
  return createSkill(input);
}

export async function addCertification(input: Omit<TrajectoryCertification, "_id" | "createdAt">): Promise<TrajectoryCertification> {
  const cert = await createCertification(input);
  emitCertificationEarned({ certId: cert._id, title: cert.title, issuer: cert.issuer });
  return cert;
}

export async function addMilestone(input: Omit<TrajectoryMilestone, "_id" | "createdAt">): Promise<TrajectoryMilestone> {
  return createMilestone(input);
}
