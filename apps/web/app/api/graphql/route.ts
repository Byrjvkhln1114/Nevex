import { createYoga } from "graphql-yoga";
import { buildSchema } from "@nevex/graphql-gateway";
import { connectDb } from "@nevex/mongodb";
import { bootstrapTreasury } from "@nevex/module-treasury";
import { bootstrapVitality } from "@nevex/module-vitality";
import { bootstrapPresence } from "@nevex/module-presence";
import { bootstrapEnvironment } from "@nevex/module-environment";
import { bootstrapTrajectory } from "@nevex/module-trajectory";
import { startOutcomeStore } from "@nevex/notification-service";
import { startEventStore } from "@nevex/event-store";

let bootstrapped = false;

async function ensureBootstrapped() {
  if (bootstrapped) return;
  await connectDb();
  startEventStore();
  startOutcomeStore();
  bootstrapTreasury();
  bootstrapVitality();
  bootstrapPresence();
  bootstrapEnvironment();
  bootstrapTrajectory();
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
