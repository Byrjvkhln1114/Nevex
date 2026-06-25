import { readFileSync } from "fs";
import { join } from "path";
import { overviewTypeDefs } from "./overview";

const rootTypeDefs = `
  type Query {
    treasury: TreasuryQuery
    vitality: VitalityQuery
    overview: OverviewQuery
  }

  type Mutation {
    treasury: TreasuryMutation
    vitality: VitalityMutation
  }
`;

function loadSchema(modulePath: string, fileName: string): string {
  return readFileSync(join(modulePath, fileName), "utf-8");
}

export function buildTypeDefs(): string {
  const modulesDir = join(process.cwd(), "../../modules");

  const treasurySchema = loadSchema(join(modulesDir, "treasury/schema"), "treasury.graphql");
  const vitalitySchema = loadSchema(join(modulesDir, "vitality/schema"), "vitality.graphql");

  return [rootTypeDefs, overviewTypeDefs, treasurySchema, vitalitySchema].join("\n");
}
