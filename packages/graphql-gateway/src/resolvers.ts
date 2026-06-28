import { treasuryResolvers } from "@nevex/module-treasury/resolvers";
import { vitalityResolvers } from "@nevex/module-vitality/resolvers";
import { presenceResolvers } from "@nevex/module-presence/resolvers";
import { environmentResolvers } from "@nevex/module-environment/resolvers";
import { trajectoryResolvers } from "@nevex/module-trajectory/resolvers";
import { overviewResolvers } from "./overview";

export const resolvers = {
  ...treasuryResolvers,
  ...vitalityResolvers,
  ...presenceResolvers,
  ...environmentResolvers,
  ...trajectoryResolvers,
  ...overviewResolvers,
  Query: {
    treasury:    () => ({}),
    vitality:    () => ({}),
    presence:    () => ({}),
    environment: () => ({}),
    trajectory:  () => ({}),
    overview:    () => ({}),
  },
  Mutation: {
    treasury:    () => ({}),
    vitality:    () => ({}),
    presence:    () => ({}),
    environment: () => ({}),
    trajectory:  () => ({}),
  },
};
