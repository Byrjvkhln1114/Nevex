type ActionType = "unlock" | "suggest" | "flag" | "notify";

interface DependencyOutcome {
  ruleId: string;
  triggeredAt: string;
  action: { type: ActionType; targetDomain: string; key: string; message?: string };
}

interface DomainStat  { label: string; value: string }
interface DomainSummary {
  slug: string;
  label: string;
  stats: DomainStat[];
  lastActivity?: string;
}

async function fetchOverview(): Promise<{
  outcomes: DependencyOutcome[];
  domains: DomainSummary[];
}> {
  const res = await fetch("http://localhost:3000/api/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `{
        overview {
          activeOutcomes {
            ruleId triggeredAt
            action { type targetDomain key message }
          }
          domainSummaries {
            slug label lastActivity
            stats { label value }
          }
        }
      }`,
    }),
    cache: "no-store",
  });
  const json = await res.json();
  return {
    outcomes: json.data?.overview?.activeOutcomes ?? [],
    domains:  json.data?.overview?.domainSummaries ?? [],
  };
}

const ACTION_STYLE: Record<ActionType, { badge: string; border: string; icon: string }> = {
  unlock: { badge: "bg-emerald-100 text-emerald-800", border: "border-emerald-200", icon: "🔓" },
  suggest: { badge: "bg-blue-100 text-blue-800",     border: "border-blue-200",     icon: "💡" },
  flag:    { badge: "bg-amber-100 text-amber-800",    border: "border-amber-200",    icon: "🚩" },
  notify:  { badge: "bg-slate-100 text-slate-800",    border: "border-slate-200",    icon: "🔔" },
};

const DOMAIN_ICON: Record<string, string> = {
  treasury:    "💰",
  vitality:    "🏃",
  presence:    "👔",
  environment: "🖥️",
  trajectory:  "🎯",
};

export default async function OverviewPage() {
  const { outcomes, domains } = await fetchOverview();

  return (
    <main className="p-8">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Domain summaries */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">Domains</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {domains.map((d) => (
              <div key={d.slug} className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{DOMAIN_ICON[d.slug] ?? "📦"}</span>
                  <span className="font-semibold text-slate-100">{d.label}</span>
                </div>
                <div className="space-y-1">
                  {d.stats.map((s) => (
                    <div key={s.label} className="flex justify-between text-sm">
                      <span className="text-slate-500">{s.label}</span>
                      <span className="text-slate-200 font-medium">{s.value}</span>
                    </div>
                  ))}
                </div>
                {d.lastActivity && (
                  <p className="text-xs text-slate-600">
                    Last activity {new Date(d.lastActivity).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Active signals */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">
            Active Signals ({outcomes.length})
          </h2>
          {outcomes.length === 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-500">
              No signals yet. Complete habits, make debt payments, or add certifications to see cross-domain insights appear here.
            </div>
          ) : (
            <ul className="space-y-3">
              {outcomes.map((o) => {
                const style = ACTION_STYLE[o.action.type] ?? ACTION_STYLE.notify;
                return (
                  <li key={o.ruleId} className={`rounded-xl border ${style.border} bg-slate-900 p-5 flex gap-4 items-start`}>
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

      </div>
    </main>
  );
}
