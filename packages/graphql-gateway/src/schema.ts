import { readFileSync } from "fs";
import { join } from "path";

// Root schema — wires domain namespaces into top-level Query/Mutation
const rootTypeDefs = `
  type Query {
    treasury: TreasuryQuery
  }

  type Mutation {
    treasury: TreasuryMutation
  }
`;

function loadSchema(modulePath: string, fileName: string): string {
  return readFileSync(join(modulePath, fileName), "utf-8");
}

export function buildTypeDefs(): string {
  const treasurySchema = loadSchema(
    join(process.cwd(), "../../modules/treasury/schema"),
    "treasury.graphql"
  );

  return [rootTypeDefs, treasurySchema].join("\n");
}
