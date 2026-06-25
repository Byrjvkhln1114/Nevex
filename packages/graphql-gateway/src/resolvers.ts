import { treasuryResolvers } from "@nevex/module-treasury/resolvers";

export const resolvers = {
  ...treasuryResolvers,
  Query: {
    treasury: () => ({}),
  },
  Mutation: {
    treasury: () => ({}),
  },
};
