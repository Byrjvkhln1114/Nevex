import { collection } from "@nevex/mongodb";
import { dependencyEngine, type DependencyOutcome } from "@nevex/dependency-engine";

function outcomeCol() {
  return collection<DependencyOutcome & { _id: string }>("dependency_state");
}

export async function findActiveOutcomes(): Promise<DependencyOutcome[]> {
  return outcomeCol().find({ status: "active" }).sort({ triggeredAt: -1 }).toArray();
}

export async function dismissOutcome(ruleId: string): Promise<void> {
  await outcomeCol().updateOne(
    { ruleId } as never,
    { $set: { status: "dismissed" } }
  );
}

// Call once at bootstrap — subscribes to engine outcomes and saves them to DB
export function startOutcomeStore(): void {
  dependencyEngine.onOutcome(async (outcome) => {
    await outcomeCol().updateOne(
      { ruleId: outcome.ruleId } as never,
      { $set: { ...outcome, _id: outcome.ruleId } },
      { upsert: true }
    );
  });
}
