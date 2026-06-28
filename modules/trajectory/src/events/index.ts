import { eventBus } from "@nevex/event-bus";

export interface CertificationEarnedPayload { certId: string; title: string; issuer: string; }
export interface SkillLevelledUpPayload { skillId: string; skillName: string; newLevel: string; }

export function emitCertificationEarned(payload: CertificationEarnedPayload): void {
  eventBus.publish({ id: crypto.randomUUID(), type: "CertificationEarned", domain: "trajectory", payload, occurredAt: new Date().toISOString() });
}

export function emitSkillLevelledUp(payload: SkillLevelledUpPayload): void {
  eventBus.publish({ id: crypto.randomUUID(), type: "SkillLevelledUp", domain: "trajectory", payload, occurredAt: new Date().toISOString() });
}
