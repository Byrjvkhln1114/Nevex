import { collection } from "@nevex/mongodb";
import type { TrajectorySkill, TrajectoryCertification, TrajectoryMilestone } from "../types";
import { TrajectoryCollection } from "./collections";

function skills() { return collection<TrajectorySkill>(TrajectoryCollection.skills); }
function certs() { return collection<TrajectoryCertification>(TrajectoryCollection.certifications); }
function milestones() { return collection<TrajectoryMilestone>(TrajectoryCollection.milestones); }

export async function findAllSkills(): Promise<TrajectorySkill[]> { return skills().find().toArray(); }
export async function findAllCertifications(): Promise<TrajectoryCertification[]> { return certs().find().toArray(); }
export async function findAllMilestones(): Promise<TrajectoryMilestone[]> { return milestones().find().sort({ occurredAt: -1 }).toArray(); }

export async function createSkill(skill: Omit<TrajectorySkill, "_id" | "createdAt" | "updatedAt">): Promise<TrajectorySkill> {
  const now = new Date().toISOString();
  const doc: TrajectorySkill = { ...skill, _id: crypto.randomUUID(), createdAt: now, updatedAt: now };
  await skills().insertOne(doc as never);
  return doc;
}

export async function createCertification(cert: Omit<TrajectoryCertification, "_id" | "createdAt">): Promise<TrajectoryCertification> {
  const doc: TrajectoryCertification = { ...cert, _id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  await certs().insertOne(doc as never);
  return doc;
}

export async function createMilestone(m: Omit<TrajectoryMilestone, "_id" | "createdAt">): Promise<TrajectoryMilestone> {
  const doc: TrajectoryMilestone = { ...m, _id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  await milestones().insertOne(doc as never);
  return doc;
}
