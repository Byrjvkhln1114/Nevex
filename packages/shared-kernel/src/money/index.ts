export type Currency = "MNT" | "USD" | "EUR";

export interface Money {
  readonly amount: number; // stored in minor units (e.g. cents, munge)
  readonly currency: Currency;
}

export function money(amount: number, currency: Currency): Money {
  return { amount: Math.round(amount), currency };
}

export function addMoney(a: Money, b: Money): Money {
  if (a.currency !== b.currency) {
    throw new Error(`Cannot add ${a.currency} and ${b.currency}`);
  }
  return money(a.amount + b.amount, a.currency);
}

export function subtractMoney(a: Money, b: Money): Money {
  if (a.currency !== b.currency) {
    throw new Error(`Cannot subtract ${a.currency} from ${b.currency}`);
  }
  return money(a.amount - b.amount, a.currency);
}

export function formatMoney(m: Money): string {
  const major = m.amount / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: m.currency,
  }).format(major);
}
