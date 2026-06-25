import { makeExecutableSchema } from "@graphql-tools/schema";
import { buildTypeDefs } from "./schema";
import { resolvers } from "./resolvers";

export function buildSchema() {
  return makeExecutableSchema({
    typeDefs: buildTypeDefs(),
    resolvers,
  });
}

export { buildTypeDefs } from "./schema";
export { resolvers } from "./resolvers";
