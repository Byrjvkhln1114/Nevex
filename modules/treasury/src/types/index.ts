import type { Money } from "@nevex/shared-kernel";

export type AccountType = "bank" | "credit_card" | "loan" | "investment" | "cash";
export type TransactionKind = "income" | "expense" | "transfer";

export interface TreasuryAccount {
  readonly _id: string;
  readonly name: string;
  readonly type: AccountType;
  readonly balance: Money;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface TreasuryTransaction {
  readonly _id: string;
  readonly accountId: string;
  readonly kind: TransactionKind;
  readonly amount: Money;
  readonly description: string;
  readonly category: string;
  readonly tagIds: string[];
  readonly occurredAt: string;
  readonly createdAt: string;
}

export interface TreasuryDebt {
  readonly _id: string;
  readonly accountId: string; // the credit_card or loan account this debt belongs to
  readonly label: string;
  readonly principal: Money;  // original amount owed
  readonly balance: Money;    // current remaining balance
  readonly interestRate: number; // annual percentage rate
  readonly minimumPayment: Money;
  readonly payoffTarget?: string; // ISO 8601 target date
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface TreasuryBudget {
  readonly _id: string;
  readonly period: string;   // e.g. "2026-06" (year-month)
  readonly category: string;
  readonly allocated: Money;
  readonly spent: Money;
  readonly createdAt: string;
  readonly updatedAt: string;
}
