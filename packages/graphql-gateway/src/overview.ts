import { findActiveOutcomes } from "@nevex/notification-service";
import { findAllAccounts, findAllDebts } from "@nevex/module-treasury/src/repository";
import { findAllHabits, findRecentCheckIns } from "@nevex/module-vitality/src/repository";
import { findAllWardrobeItems } from "@nevex/module-presence/src/repository";
import { findAllAssets } from "@nevex/module-environment/src/repository";
import {
  findAllSkills,
  findAllCertifications,
  findAllMilestones,
} from "@nevex/module-trajectory/src/repository";

export const overviewTypeDefs = `
  type DependencyOutcome {
    ruleId: String!
    triggeredByEventId: String!
    triggeredAt: String!
    status: String!
    action: OutcomeAction!
  }

  type OutcomeAction {
    type: String!
    targetDomain: String!
    key: String!
    message: String
  }

  type DomainSummary {
    slug:       String!
    label:      String!
    stats:      [DomainStat!]!
    lastActivity: String
  }

  type DomainStat {
    label: String!
    value: String!
  }

  type OverviewQuery {
    activeOutcomes:  [DependencyOutcome!]!
    domainSummaries: [DomainSummary!]!
  }
`;

async function treasurySummary() {
  const [accounts, debts] = await Promise.all([findAllAccounts(), findAllDebts()]);
  const totalDebt = debts.reduce((s, d) => s + d.balance.amount, 0);
  return {
    slug: "treasury", label: "Treasury",
    stats: [
      { label: "Accounts", value: String(accounts.length) },
      { label: "Open debts", value: String(debts.length) },
      { label: "Total debt", value: totalDebt > 0 ? `${(totalDebt / 100).toLocaleString()} MNT` : "Debt free 🎉" },
    ],
    lastActivity: accounts[accounts.length - 1]?.createdAt ?? null,
  };
}

async function vitalitySummary() {
  const [habits, checkIns] = await Promise.all([findAllHabits(), findRecentCheckIns(1)]);
  const topStreak = habits.reduce((max, h) => Math.max(max, h.streak), 0);
  return {
    slug: "vitality", label: "Vitality",
    stats: [
      { label: "Habits", value: String(habits.length) },
      { label: "Top streak", value: topStreak > 0 ? `${topStreak} days` : "—" },
      { label: "Last mood", value: checkIns[0] ? `${checkIns[0].moodScore}/5` : "—" },
    ],
    lastActivity: checkIns[0]?.createdAt ?? habits[habits.length - 1]?.updatedAt ?? null,
  };
}

async function presenceSummary() {
  const items = await findAllWardrobeItems();
  return {
    slug: "presence", label: "Presence",
    stats: [
      { label: "Wardrobe items", value: String(items.length) },
    ],
    lastActivity: items[items.length - 1]?.createdAt ?? null,
  };
}

async function environmentSummary() {
  const assets = await findAllAssets();
  const owned = assets.filter((a) => a.status === "owned").length;
  return {
    slug: "environment", label: "Environment",
    stats: [
      { label: "Assets", value: String(owned) },
      { label: "Planned", value: String(assets.filter((a) => a.status === "planned").length) },
    ],
    lastActivity: assets[assets.length - 1]?.createdAt ?? null,
  };
}

async function trajectorySummary() {
  const [skills, certs, milestones] = await Promise.all([
    findAllSkills(), findAllCertifications(), findAllMilestones(),
  ]);
  return {
    slug: "trajectory", label: "Trajectory",
    stats: [
      { label: "Skills", value: String(skills.length) },
      { label: "Certifications", value: String(certs.length) },
      { label: "Milestones", value: String(milestones.length) },
    ],
    lastActivity: milestones[0]?.createdAt ?? certs[certs.length - 1]?.createdAt ?? null,
  };
}

export const overviewResolvers = {
  OverviewQuery: {
    activeOutcomes: () => findActiveOutcomes(),
    domainSummaries: () =>
      Promise.all([
        treasurySummary(),
        vitalitySummary(),
        presenceSummary(),
        environmentSummary(),
        trajectorySummary(),
      ]),
  },
};
