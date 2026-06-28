import { gql } from "@/lib/gql";
import { addSkill, addCertification, addMilestone } from "@/app/actions/trajectory";

interface Skill { id: string; name: string; category: string; level: string }
interface Certification { id: string; title: string; issuer: string; earnedAt: string; expiresAt: string | null }
interface Milestone { id: string; title: string; description: string | null; occurredAt: string }

async function fetchTrajectory() {
  const data = await gql<{ trajectory: { skills: Skill[]; certifications: Certification[]; milestones: Milestone[] } }>(`{
    trajectory {
      skills { id name category level }
      certifications { id title issuer earnedAt expiresAt }
      milestones { id title description occurredAt }
    }
  }`);
  return data.trajectory;
}

const LEVEL_STYLE: Record<string, string> = {
  beginner:     "text-slate-400",
  intermediate: "text-blue-400",
  advanced:     "text-violet-400",
  expert:       "text-amber-400",
};

const LEVEL_BAR: Record<string, number> = {
  beginner: 1, intermediate: 2, advanced: 3, expert: 4,
};

const input = "w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-slate-500";
const label = "block text-xs text-slate-400 mb-1";
const btn = "px-4 py-2 bg-slate-700 hover:bg-slate-600 text-sm text-slate-100 rounded-lg transition-colors";
const select = "w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-slate-500";

export default async function TrajectoryPage() {
  const { skills, certifications, milestones } = await fetchTrajectory();

  const skillsByCategory: Record<string, Skill[]> = {};
  for (const s of skills) {
    (skillsByCategory[s.category] ??= []).push(s);
  }

  return (
    <main className="p-8">
      <div className="max-w-5xl mx-auto space-y-10">

        <div>
          <h1 className="text-2xl font-bold">🎯 Trajectory</h1>
          <p className="text-slate-400 text-sm mt-1">Skills, certifications, and career milestones</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 text-center">
            <div className="text-2xl font-bold text-violet-400">{skills.length}</div>
            <div className="text-xs text-slate-500 mt-1">Skills</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{certifications.length}</div>
            <div className="text-xs text-slate-500 mt-1">Certifications</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 text-center">
            <div className="text-2xl font-bold text-amber-400">{milestones.length}</div>
            <div className="text-xs text-slate-500 mt-1">Milestones</div>
          </div>
        </div>

        {/* Skills */}
        <section className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500">Skills</h2>
          {skills.length === 0 ? (
            <p className="text-slate-600 text-sm">No skills yet.</p>
          ) : (
            Object.entries(skillsByCategory).map(([cat, items]) => (
              <div key={cat}>
                <h3 className="text-sm text-slate-400 mb-2 capitalize">{cat}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {items.map((s) => (
                    <div key={s.id} className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-3 flex items-center gap-3">
                      <div className="flex-1">
                        <div className="font-medium text-slate-100 text-sm">{s.name}</div>
                        <div className={`text-xs mt-0.5 capitalize ${LEVEL_STYLE[s.level] ?? "text-slate-500"}`}>
                          {s.level}
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4].map((n) => (
                          <div
                            key={n}
                            className={`w-1.5 h-4 rounded-sm ${n <= (LEVEL_BAR[s.level] ?? 0) ? "bg-violet-500" : "bg-slate-700"}`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}

          <details className="rounded-xl border border-slate-800 bg-slate-900">
            <summary className="px-5 py-3 text-sm text-slate-400 cursor-pointer hover:text-slate-200 select-none">
              + Add skill
            </summary>
            <form action={addSkill} className="px-5 pb-5 pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={label}>Skill name</label>
                <input name="name" required placeholder="TypeScript" className={input} />
              </div>
              <div>
                <label className={label}>Category</label>
                <input name="category" required placeholder="Programming" className={input} />
              </div>
              <div>
                <label className={label}>Level</label>
                <select name="level" className={select}>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
              <div className="flex items-end">
                <button type="submit" className={btn}>Add skill</button>
              </div>
            </form>
          </details>
        </section>

        {/* Certifications */}
        <section className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500">Certifications</h2>
          {certifications.length === 0 ? (
            <p className="text-slate-600 text-sm">No certifications yet.</p>
          ) : (
            <div className="space-y-2">
              {certifications.map((c) => (
                <div key={c.id} className="rounded-xl border border-slate-800 bg-slate-900 px-5 py-3 flex items-center gap-4">
                  <div className="flex-1">
                    <div className="font-medium text-slate-100">{c.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{c.issuer}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">{new Date(c.earnedAt).toLocaleDateString()}</div>
                    {c.expiresAt && (
                      <div className="text-xs text-amber-500">exp. {new Date(c.expiresAt).toLocaleDateString()}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <details className="rounded-xl border border-slate-800 bg-slate-900">
            <summary className="px-5 py-3 text-sm text-slate-400 cursor-pointer hover:text-slate-200 select-none">
              + Add certification
            </summary>
            <form action={addCertification} className="px-5 pb-5 pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={label}>Title</label>
                <input name="title" required placeholder="AWS Solutions Architect" className={input} />
              </div>
              <div>
                <label className={label}>Issuing organization</label>
                <input name="issuer" required placeholder="Amazon Web Services" className={input} />
              </div>
              <div>
                <label className={label}>Earned date</label>
                <input name="earnedAt" type="date" required className={input} />
              </div>
              <div>
                <label className={label}>Expiry date (optional)</label>
                <input name="expiresAt" type="date" className={input} />
              </div>
              <div className="flex items-end">
                <button type="submit" className={btn}>Add certification</button>
              </div>
            </form>
          </details>
        </section>

        {/* Milestones */}
        <section className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500">Milestones</h2>
          {milestones.length === 0 ? (
            <p className="text-slate-600 text-sm">No milestones yet.</p>
          ) : (
            <div className="relative border-l border-slate-800 ml-3 space-y-4 pl-6">
              {milestones.map((m) => (
                <div key={m.id} className="relative">
                  <div className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full border-2 border-amber-500 bg-slate-950" />
                  <div className="font-medium text-slate-100">{m.title}</div>
                  {m.description && <p className="text-sm text-slate-400 mt-0.5">{m.description}</p>}
                  <p className="text-xs text-slate-600 mt-1">{new Date(m.occurredAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}

          <details className="rounded-xl border border-slate-800 bg-slate-900">
            <summary className="px-5 py-3 text-sm text-slate-400 cursor-pointer hover:text-slate-200 select-none">
              + Add milestone
            </summary>
            <form action={addMilestone} className="px-5 pb-5 pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={label}>Title</label>
                <input name="title" required placeholder="First freelance project shipped" className={input} />
              </div>
              <div className="sm:col-span-2">
                <label className={label}>Description (optional)</label>
                <input name="description" placeholder="Details about what this milestone represents" className={input} />
              </div>
              <div>
                <label className={label}>Date</label>
                <input name="occurredAt" type="date" required className={input} />
              </div>
              <div className="flex items-end">
                <button type="submit" className={btn}>Add milestone</button>
              </div>
            </form>
          </details>
        </section>

      </div>
    </main>
  );
}
