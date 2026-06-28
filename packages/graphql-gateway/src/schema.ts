import { readFileSync } from "fs";
import { join } from "path";
import { overviewTypeDefs } from "./overview";

const rootTypeDefs = `
  type Query {
    treasury:    TreasuryQuery
    vitality:    VitalityQuery
    presence:    PresenceQuery
    environment: EnvironmentQuery
    trajectory:  TrajectoryQuery
    overview:    OverviewQuery
  }

  type Mutation {
    treasury:    TreasuryMutation
    vitality:    VitalityMutation
    presence:    PresenceMutation
    environment: EnvironmentMutation
    trajectory:  TrajectoryMutation
  }
`;

function loadSchema(modulePath: string, fileName: string): string {
  return readFileSync(join(modulePath, fileName), "utf-8");
}

export function buildTypeDefs(): string {
  const modulesDir = join(process.cwd(), "../../modules");
  const load = (domain: string) =>
    loadSchema(join(modulesDir, `${domain}/schema`), `${domain}.graphql`);

  return [
    rootTypeDefs,
    overviewTypeDefs,
    load("treasury"),
    load("vitality"),
    load("presence"),
    load("environment"),
    load("trajectory"),
  ].join("\n");
}
