type ActionType = "unlock" | "suggest" | "flag" | "notify";

interface OutcomeAction {
  type: ActionType;
  targetDomain: string;
  key: string;
  message?: string;
}

interface DependencyOutcome {
  ruleId: string;
  triggeredAt: string;
  status: string;
  action: OutcomeAction;
}

async function getActiveOutcomes(): Promise<DependencyOutcome[]> {
  const res = await fetch("http://localhost:3000/api/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `{
        overview {
          activeOutcomes {
            ruleId
            triggeredAt
            status
            action { type targetDomain key message }
          }
        }
      }`,
    }),
    cache: "no-store",
  });
  const json = await res.json();
  return json.data?.overview?.activeOutcomes ?? [];
}

const ACTION_STYLES: Record<ActionType, { badge: string; border: string; icon: string }> = {
  unlock: { badge: "bg-emerald-100 text-emerald-800", border: "border-emerald-200", icon: "🔓" },
  suggest: { badge: "bg-blue-100 text-blue-800",    border: "border-blue-200",    icon: "💡" },
  flag:    { badge: "bg-amber-100 text-amber-800",   border: "border-amber-200",   icon: "🚩" },
  notify:  { badge: "bg-slate-100 text-slate-800",   border: "border-slate-200",   icon: "🔔" },
};

export default async function OverviewPage() {
  const outcomes = await getActiveOutcomes();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-3xl mx-auto">

        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight">Nevex</h1>
          <p className="text-slate-400 mt-1">Your life operating system</p>
        </div>

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500 mb-4">
            Active Signals
          </h2>

          {outcomes.length === 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-500">
              No signals yet. Complete habits or make debt payments to see cross-domain insights appear here.
            </div>
          ) : (
            <ul className="space-y-3">
              {outcomes.map((o) => {
                const style = ACTION_STYLES[o.action.type] ?? ACTION_STYLES.notify;
                return (
                  <li
                    key={o.ruleId}
                    className={`rounded-xl border ${style.border} bg-slate-900 p-5 flex gap-4 items-start`}
                  >
                    <span className="text-2xl">{style.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${style.badge}`}>
                          {o.action.type}
                        </span>
                        <span className="text-xs text-slate-500">→ {o.action.targetDomain}</span>
                        <span className="text-xs font-mono text-slate-600">{o.action.key}</span>
                      </div>
                      {o.action.message && (
                        <p className="mt-2 text-sm text-slate-300">{o.action.message}</p>
                      )}
                      <p className="mt-1 text-xs text-slate-600">
                        {new Date(o.triggeredAt).toLocaleString()}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="mt-10 grid grid-cols-2 gap-4">
          {(["treasury", "vitality", "presence", "trajectory"] as const).map((domain) => (
            <div
              key={domain}
              className="rounded-xl border border-slate-800 bg-slate-900 p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">
                {domain}
              </p>
              <p className="text-slate-600 text-sm">Coming soon</p>
            </div>
          ))}
        </section>

      </div>
    </main>
  );
}
