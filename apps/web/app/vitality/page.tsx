import { gql } from "@/lib/gql";
import { createHabit, createCheckIn, completeHabit } from "@/app/actions/vitality";

interface Habit { id: string; name: string; frequency: string; streak: number; longestStreak: number; lastCompletedAt: string | null }
interface CheckIn { id: string; moodScore: number; energyScore: number; sleepHours: number; note: string | null; occurredAt: string }

async function fetchVitality() {
  const data = await gql<{ vitality: { habits: Habit[]; recentCheckIns: CheckIn[] } }>(`{
    vitality {
      habits { id name frequency streak longestStreak lastCompletedAt }
      recentCheckIns { id moodScore energyScore sleepHours note occurredAt }
    }
  }`);
  return data.vitality;
}

const input = "w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-slate-500";
const label = "block text-xs text-slate-400 mb-1";
const btn = "px-4 py-2 bg-slate-700 hover:bg-slate-600 text-sm text-slate-100 rounded-lg transition-colors";
const select = "w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-slate-500";

function moodEmoji(score: number) {
  return ["", "😞", "😕", "😐", "🙂", "😄"][score] ?? "—";
}

export default async function VitalityPage() {
  const { habits, recentCheckIns } = await fetchVitality();
  const today = new Date().toISOString().slice(0, 10);

  return (
    <main className="p-8">
      <div className="max-w-5xl mx-auto space-y-10">

        <div>
          <h1 className="text-2xl font-bold">🏃 Vitality</h1>
          <p className="text-slate-400 text-sm mt-1">Habits, energy, and wellbeing check-ins</p>
        </div>

        {/* Habits */}
        <section className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500">Habits</h2>
          {habits.length === 0 ? (
            <p className="text-slate-600 text-sm">No habits yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {habits.map((h) => {
                const doneToday = h.lastCompletedAt?.slice(0, 10) === today;
                return (
                  <div key={h.id} className="rounded-xl border border-slate-800 bg-slate-900 p-4 flex items-start gap-4">
                    <div className="flex-1">
                      <div className="font-medium text-slate-100">{h.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{h.frequency}</div>
                      <div className="flex gap-3 mt-2 text-sm">
                        <span className="text-amber-400 font-semibold">{h.streak} day streak</span>
                        <span className="text-slate-600">best: {h.longestStreak}</span>
                      </div>
                    </div>
                    {!doneToday && (
                      <form action={completeHabit}>
                        <input type="hidden" name="habitId" value={h.id} />
                        <button type="submit" className="px-3 py-1.5 text-xs bg-emerald-800 hover:bg-emerald-700 text-emerald-100 rounded-lg transition-colors">
                          Done
                        </button>
                      </form>
                    )}
                    {doneToday && (
                      <span className="text-xs text-emerald-500 mt-1">✓ Done</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <details className="rounded-xl border border-slate-800 bg-slate-900">
            <summary className="px-5 py-3 text-sm text-slate-400 cursor-pointer hover:text-slate-200 select-none">
              + Add habit
            </summary>
            <form action={createHabit} className="px-5 pb-5 pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={label}>Habit name</label>
                <input name="name" required placeholder="Morning run" className={input} />
              </div>
              <div>
                <label className={label}>Frequency</label>
                <select name="frequency" className={select}>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <button type="submit" className={btn}>Create habit</button>
              </div>
            </form>
          </details>
        </section>

        {/* Check-ins */}
        <section className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500">Recent Check-ins</h2>
          {recentCheckIns.length === 0 ? (
            <p className="text-slate-600 text-sm">No check-ins yet.</p>
          ) : (
            <div className="space-y-2">
              {recentCheckIns.slice(0, 7).map((c) => (
                <div key={c.id} className="rounded-xl border border-slate-800 bg-slate-900 px-5 py-3 flex items-center gap-6">
                  <span className="text-xl">{moodEmoji(c.moodScore)}</span>
                  <div className="flex-1">
                    <div className="flex gap-4 text-sm">
                      <span className="text-slate-400">Mood <span className="text-slate-100 font-medium">{c.moodScore}/5</span></span>
                      <span className="text-slate-400">Energy <span className="text-slate-100 font-medium">{c.energyScore}/5</span></span>
                      <span className="text-slate-400">Sleep <span className="text-slate-100 font-medium">{c.sleepHours}h</span></span>
                    </div>
                    {c.note && <p className="text-xs text-slate-500 mt-0.5">{c.note}</p>}
                  </div>
                  <span className="text-xs text-slate-600">{new Date(c.occurredAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}

          <details className="rounded-xl border border-slate-800 bg-slate-900">
            <summary className="px-5 py-3 text-sm text-slate-400 cursor-pointer hover:text-slate-200 select-none">
              + Log check-in
            </summary>
            <form action={createCheckIn} className="px-5 pb-5 pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={label}>Mood (1–5)</label>
                <input name="moodScore" type="number" min="1" max="5" required className={input} />
              </div>
              <div>
                <label className={label}>Energy (1–5)</label>
                <input name="energyScore" type="number" min="1" max="5" required className={input} />
              </div>
              <div>
                <label className={label}>Sleep hours</label>
                <input name="sleepHours" type="number" step="0.5" min="0" max="24" required placeholder="7.5" className={input} />
              </div>
              <div>
                <label className={label}>Note (optional)</label>
                <input name="note" placeholder="Feeling good today" className={input} />
              </div>
              <div className="sm:col-span-2">
                <button type="submit" className={btn}>Log check-in</button>
              </div>
            </form>
          </details>
        </section>

      </div>
    </main>
  );
}
