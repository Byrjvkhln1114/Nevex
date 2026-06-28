import { gql } from "@/lib/gql";
import { addWardrobeItem } from "@/app/actions/presence";

interface WardrobeItem { id: string; name: string; category: string; brand: string | null; color: string | null; condition: string }

async function fetchPresence() {
  const data = await gql<{ presence: { wardrobeItems: WardrobeItem[] } }>(`{
    presence {
      wardrobeItems { id name category brand color condition }
    }
  }`);
  return data.presence;
}

const CONDITION_STYLE: Record<string, string> = {
  new:     "text-emerald-400",
  good:    "text-blue-400",
  worn:    "text-amber-400",
  retired: "text-slate-500",
};

const CATEGORY_ICON: Record<string, string> = {
  tops: "👕", bottoms: "👖", outerwear: "🧥", shoes: "👟", accessories: "⌚",
};

const input = "w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-slate-500";
const label = "block text-xs text-slate-400 mb-1";
const btn = "px-4 py-2 bg-slate-700 hover:bg-slate-600 text-sm text-slate-100 rounded-lg transition-colors";
const select = "w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-slate-500";

export default async function PresencePage() {
  const { wardrobeItems } = await fetchPresence();

  const byCategory: Record<string, WardrobeItem[]> = {};
  for (const item of wardrobeItems) {
    (byCategory[item.category] ??= []).push(item);
  }

  return (
    <main className="p-8">
      <div className="max-w-5xl mx-auto space-y-10">

        <div>
          <h1 className="text-2xl font-bold">👔 Presence</h1>
          <p className="text-slate-400 text-sm mt-1">Wardrobe and personal appearance</p>
        </div>

        {/* Wardrobe */}
        <section className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Wardrobe ({wardrobeItems.length} items)
          </h2>

          {wardrobeItems.length === 0 ? (
            <p className="text-slate-600 text-sm">No wardrobe items yet.</p>
          ) : (
            Object.entries(byCategory).map(([cat, items]) => (
              <div key={cat}>
                <h3 className="text-sm text-slate-400 mb-2 flex items-center gap-2">
                  <span>{CATEGORY_ICON[cat] ?? "👗"}</span>
                  <span className="capitalize">{cat}</span>
                  <span className="text-slate-600">({items.length})</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {items.map((item) => (
                    <div key={item.id} className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-3">
                      <div className="font-medium text-slate-100 text-sm">{item.name}</div>
                      <div className="flex items-center gap-2 mt-1">
                        {item.brand && <span className="text-xs text-slate-500">{item.brand}</span>}
                        {item.color && <span className="text-xs text-slate-600">{item.color}</span>}
                        <span className={`text-xs ml-auto ${CONDITION_STYLE[item.condition] ?? "text-slate-500"}`}>
                          {item.condition}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}

          <details className="rounded-xl border border-slate-800 bg-slate-900">
            <summary className="px-5 py-3 text-sm text-slate-400 cursor-pointer hover:text-slate-200 select-none">
              + Add wardrobe item
            </summary>
            <form action={addWardrobeItem} className="px-5 pb-5 pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={label}>Item name</label>
                <input name="name" required placeholder="White Oxford shirt" className={input} />
              </div>
              <div>
                <label className={label}>Category</label>
                <select name="category" className={select}>
                  <option value="tops">Tops</option>
                  <option value="bottoms">Bottoms</option>
                  <option value="outerwear">Outerwear</option>
                  <option value="shoes">Shoes</option>
                  <option value="accessories">Accessories</option>
                </select>
              </div>
              <div>
                <label className={label}>Condition</label>
                <select name="condition" className={select}>
                  <option value="new">New</option>
                  <option value="good">Good</option>
                  <option value="worn">Worn</option>
                  <option value="retired">Retired</option>
                </select>
              </div>
              <div>
                <label className={label}>Brand (optional)</label>
                <input name="brand" placeholder="Uniqlo" className={input} />
              </div>
              <div>
                <label className={label}>Color (optional)</label>
                <input name="color" placeholder="White" className={input} />
              </div>
              <div className="sm:col-span-2">
                <button type="submit" className={btn}>Add to wardrobe</button>
              </div>
            </form>
          </details>
        </section>

      </div>
    </main>
  );
}
