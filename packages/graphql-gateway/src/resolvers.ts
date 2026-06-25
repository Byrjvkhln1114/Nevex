import { treasuryResolvers } from "@nevex/module-treasury/resolvers";
import { vitalityResolvers } from "@nevex/module-vitality/resolvers";

export const resolvers = {
  ...treasuryResolvers,
  ...vitalityResolvers,
  Query: {
    treasury: () => ({}),
    vitality: () => ({}),
  },
  Mutation: {
    treasury: () => ({}),
    vitality: () => ({}),
  },
};
