import { ruleRegistry } from "@nevex/dependency-engine";

export function registerTrajectoryRules(): void {
  ruleRegistry.register({
    id: "trajectory:certification-suggests-salary-review",
    description: "Earning a certification suggests negotiating a salary bump in Treasury",
    trigger: { domain: "trajectory", eventType: "CertificationEarned" },
    action: {
      type: "suggest",
      targetDomain: "treasury",
      key: "SalaryNegotiation",
      message: "New certification earned — a good time to revisit your income goals.",
    },
  });

  ruleRegistry.register({
    id: "trajectory:skill-levelled-suggests-career-goal",
    description: "Advancing a skill suggests creating a new career milestone",
    trigger: { domain: "trajectory", eventType: "SkillLevelledUp" },
    action: {
      type: "suggest",
      targetDomain: "trajectory",
      key: "NewCareerMilestone",
      message: "Skill levelled up — a good moment to set the next career milestone.",
    },
  });
}
