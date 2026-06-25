import { createYoga } from "graphql-yoga";
import { buildSchema } from "@nevex/graphql-gateway";
import { connectDb } from "@nevex/mongodb";
import { bootstrapTreasury } from "@nevex/module-treasury";

let bootstrapped = false;

async function ensureBootstrapped() {
  if (bootstrapped) return;
  await connectDb();
  bootstrapTreasury();
  bootstrapped = true;
}

const yoga = createYoga({
  schema: buildSchema(),
  graphqlEndpoint: "/api/graphql",
  fetchAPI: { Response },
});

export async function GET(request: Request) {
  await ensureBootstrapped();
  return yoga.fetch(request);
}

export async function POST(request: Request) {
  await ensureBootstrapped();
  return yoga.fetch(request);
}
