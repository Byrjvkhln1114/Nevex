import { findActiveOutcomes } from "@nevex/notification-service";

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

  type OverviewQuery {
    activeOutcomes: [DependencyOutcome!]!
  }
`;

export const overviewResolvers = {
  OverviewQuery: {
    activeOutcomes: () => findActiveOutcomes(),
  },
};
