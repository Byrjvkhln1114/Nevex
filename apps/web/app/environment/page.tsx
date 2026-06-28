import { gql } from "@/lib/gql";
import { acquireAsset } from "@/app/actions/environment";

interface Asset { id: string; name: string; category: string; status: string; note: string | null; purchasedAt: string | null }

async function fetchEnvironment() {
  const data = await gql<{ environment: { assets: Asset[] } }>(`{
    environment {
      assets { id name category status note purchasedAt }
    }
  }`);
  return data.environment;
}

const STATUS_STYLE: Record<string, { badge: string; label: string }> = {
  owned:   { badge: "bg-emerald-900/50 text-emerald-300", label: "Owned" },
  planned: { badge: "bg-blue-900/50 text-blue-300",       label: "Planned" },
  sold:    { badge: "bg-slate-800 text-slate-500",         label: "Sold" },
};

const CATEGORY_ICON: Record<string, string> = {
  workspace: "🏢", hardware: "💻", software: "📦", furniture: "🛋️", other: "📦",
};

const input = "w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-slate-500";
const label = "block text-xs text-slate-400 mb-1";
const btn = "px-4 py-2 bg-slate-700 hover:bg-slate-600 text-sm text-slate-100 rounded-lg transition-colors";
const select = "w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-slate-500";

export default async function EnvironmentPage() {
  const { assets } = await fetchEnvironment();

  const owned   = assets.filter((a) => a.status === "owned");
  const planned = assets.filter((a) => a.status === "planned");
  const sold    = assets.filter((a) => a.status === "sold");

  function AssetList({ items }: { items: Asset[] }) {
    if (items.length === 0) return <p className="text-slate-600 text-sm">None.</p>;
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((a) => {
          const s = STATUS_STYLE[a.status] ?? STATUS_STYLE.other;
          return (
            <div key={a.id} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span>{CATEGORY_ICON[a.category] ?? "📦"}</span>
                  <span className="font-medium text-slate-100">{a.name}</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${s.badge}`}>{s.label}</span>
              </div>
              <div className="text-xs text-slate-500 mt-1 capitalize">{a.category}</div>
              {a.note && <p className="text-xs text-slate-400 mt-2">{a.note}</p>}
              {a.purchasedAt && (
                <p className="text-xs text-slate-600 mt-1">
                  {new Date(a.purchasedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <main className="p-8">
      <div className="max-w-5xl mx-auto space-y-10">

        <div>
          <h1 className="text-2xl font-bold">🖥️ Environment</h1>
          <p className="text-slate-400 text-sm mt-1">Workspace assets and lifestyle infrastructure</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 text-center">
            <div className="text-2xl font-bold text-emerald-400">{owned.length}</div>
            <div className="text-xs text-slate-500 mt-1">Owned</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{planned.length}</div>
            <div className="text-xs text-slate-500 mt-1">Planned</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 text-center">
            <div className="text-2xl font-bold text-slate-400">{sold.length}</div>
            <div className="text-xs text-slate-500 mt-1">Sold</div>
          </div>
        </div>

        {["owned", "planned", "sold"].map((status) => {
          const items = { owned, planned, sold }[status as "owned" | "planned" | "sold"];
          const s = STATUS_STYLE[status];
          return (
            <section key={status} className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500">{s.label}</h2>
              <AssetList items={items} />
            </section>
          );
        })}

        <details className="rounded-xl border border-slate-800 bg-slate-900">
          <summary className="px-5 py-3 text-sm text-slate-400 cursor-pointer hover:text-slate-200 select-none">
            + Add asset
          </summary>
          <form action={acquireAsset} className="px-5 pb-5 pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={label}>Asset name</label>
              <input name="name" required placeholder="Standing desk" className={input} />
            </div>
            <div>
              <label className={label}>Category</label>
              <select name="category" className={select}>
                <option value="workspace">Workspace</option>
                <option value="hardware">Hardware</option>
                <option value="software">Software</option>
                <option value="furniture">Furniture</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className={label}>Status</label>
              <select name="status" className={select}>
                <option value="owned">Owned</option>
                <option value="planned">Planned</option>
                <option value="sold">Sold</option>
              </select>
            </div>
            <div>
              <label className={label}>Note (optional)</label>
              <input name="note" placeholder="For home office" className={input} />
            </div>
            <div>
              <label className={label}>Purchased at (optional)</label>
              <input name="purchasedAt" type="date" className={input} />
            </div>
            <div className="sm:col-span-2">
              <button type="submit" className={btn}>Add asset</button>
            </div>
          </form>
        </details>

      </div>
    </main>
  );
}
