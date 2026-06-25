import { treasuryResolvers } from "@nevex/module-treasury/resolvers";
import { vitalityResolvers } from "@nevex/module-vitality/resolvers";
import { overviewResolvers } from "./overview";

export const resolvers = {
  ...treasuryResolvers,
  ...vitalityResolvers,
  ...overviewResolvers,
  Query: {
    treasury: () => ({}),
    vitality: () => ({}),
    overview: () => ({}),
  },
  Mutation: {
    treasury: () => ({}),
    vitality: () => ({}),
  },
};
