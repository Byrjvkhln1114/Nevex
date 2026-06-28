import { gql } from "@/lib/gql";
import { createAccount, createDebt, makeDebtPayment } from "@/app/actions/treasury";

interface Money { amount: number; currency: string }
interface Account { id: string; name: string; type: string; balance: Money }
interface Debt { id: string; label: string; balance: Money; minimumPayment: Money; interestRate: number }

async function fetchTreasury() {
  const data = await gql<{ treasury: { accounts: Account[]; debts: Debt[] } }>(`{
    treasury {
      accounts { id name type balance { amount currency } }
      debts { id label balance { amount currency } minimumPayment { amount currency } interestRate }
    }
  }`);
  return data.treasury;
}

function fmt(m: Money) {
  return `${(m.amount / 100).toLocaleString()} ${m.currency}`;
}

const input = "w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-slate-500";
const label = "block text-xs text-slate-400 mb-1";
const btn = "px-4 py-2 bg-slate-700 hover:bg-slate-600 text-sm text-slate-100 rounded-lg transition-colors";
const select = "w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-slate-500";

export default async function TreasuryPage() {
  const { accounts, debts } = await fetchTreasury();

  return (
    <main className="p-8">
      <div className="max-w-5xl mx-auto space-y-10">

        <div>
          <h1 className="text-2xl font-bold">💰 Treasury</h1>
          <p className="text-slate-400 text-sm mt-1">Accounts, debts, and financial health</p>
        </div>

        {/* Accounts */}
        <section className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500">Accounts</h2>
          {accounts.length === 0 ? (
            <p className="text-slate-600 text-sm">No accounts yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {accounts.map((a) => (
                <div key={a.id} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                  <div className="font-medium text-slate-100">{a.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{a.type}</div>
                  <div className="text-lg font-semibold mt-2 text-emerald-400">{fmt(a.balance)}</div>
                </div>
              ))}
            </div>
          )}

          <details className="rounded-xl border border-slate-800 bg-slate-900">
            <summary className="px-5 py-3 text-sm text-slate-400 cursor-pointer hover:text-slate-200 select-none">
              + Add account
            </summary>
            <form action={createAccount} className="px-5 pb-5 pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={label}>Name</label>
                <input name="name" required placeholder="Main checking" className={input} />
              </div>
              <div>
                <label className={label}>Type</label>
                <select name="type" className={select}>
                  <option value="bank">Bank</option>
                  <option value="credit_card">Credit card</option>
                  <option value="cash">Cash</option>
                  <option value="investment">Investment</option>
                  <option value="loan">Loan</option>
                </select>
              </div>
              <div>
                <label className={label}>Balance</label>
                <input name="balanceAmount" type="number" step="0.01" required placeholder="0.00" className={input} />
              </div>
              <div>
                <label className={label}>Currency</label>
                <select name="currency" className={select}>
                  <option value="MNT">MNT</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <button type="submit" className={btn}>Create account</button>
              </div>
            </form>
          </details>
        </section>

        {/* Debts */}
        <section className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500">Debts</h2>
          {debts.length === 0 ? (
            <p className="text-slate-600 text-sm">No debts. Debt free!</p>
          ) : (
            <div className="space-y-3">
              {debts.map((d) => (
                <div key={d.id} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-medium text-slate-100">{d.label}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{d.interestRate}% interest · Min {fmt(d.minimumPayment)}/mo</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-rose-400">{fmt(d.balance)}</div>
                      <div className="text-xs text-slate-500">remaining</div>
                    </div>
                  </div>
                  {d.balance.amount > 0 && (
                    <form action={makeDebtPayment} className="mt-3 flex gap-2 items-end">
                      <input type="hidden" name="debtId" value={d.id} />
                      <input type="hidden" name="currency" value={d.balance.currency} />
                      <div className="flex-1">
                        <label className={label}>Payment amount</label>
                        <input name="amount" type="number" step="0.01" required placeholder={String(d.minimumPayment.amount / 100)} className={input} />
                      </div>
                      <button type="submit" className={`${btn} shrink-0`}>Pay</button>
                    </form>
                  )}
                </div>
              ))}
            </div>
          )}

          <details className="rounded-xl border border-slate-800 bg-slate-900">
            <summary className="px-5 py-3 text-sm text-slate-400 cursor-pointer hover:text-slate-200 select-none">
              + Add debt
            </summary>
            <form action={createDebt} className="px-5 pb-5 pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={label}>Label</label>
                <input name="label" required placeholder="Student loan" className={input} />
              </div>
              <div>
                <label className={label}>Account ID</label>
                <select name="accountId" className={select}>
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={label}>Currency</label>
                <select name="currency" className={select}>
                  <option value="MNT">MNT</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
              <div>
                <label className={label}>Principal amount</label>
                <input name="principalAmount" type="number" step="0.01" required placeholder="0.00" className={input} />
              </div>
              <div>
                <label className={label}>Interest rate (%)</label>
                <input name="interestRate" type="number" step="0.01" required placeholder="0" className={input} />
              </div>
              <div>
                <label className={label}>Minimum monthly payment</label>
                <input name="minimumPaymentAmount" type="number" step="0.01" required placeholder="0.00" className={input} />
              </div>
              <div className="sm:col-span-2">
                <button type="submit" className={btn}>Add debt</button>
              </div>
            </form>
          </details>
        </section>

      </div>
    </main>
  );
}
