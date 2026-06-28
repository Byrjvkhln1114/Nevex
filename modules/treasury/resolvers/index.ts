import { findAllAccounts, findAllDebts } from "../src/repository";
import { makeDebtPayment, createTreasuryAccount, createTreasuryDebt } from "../src/services";
import { money } from "@nevex/shared-kernel";
import type { Currency } from "@nevex/shared-kernel";
import type { TreasuryAccount } from "../src/types";

export const treasuryResolvers = {
  TreasuryQuery: {
    accounts: () => findAllAccounts(),
    debts: () => findAllDebts(),
  },
  TreasuryMutation: {
    createAccount: (_: unknown, args: { input: {
      name: string; type: TreasuryAccount["type"];
      balanceAmount: number; currency: Currency;
    }}) => createTreasuryAccount(args.input),

    createDebt: (_: unknown, args: { input: {
      accountId: string; label: string; principalAmount: number;
      currency: Currency; interestRate: number;
      minimumPaymentAmount: number; payoffTarget?: string;
    }}) => createTreasuryDebt(args.input),

    makeDebtPayment: async (
      _: unknown,
      args: { debtId: string; amount: number; currency: Currency }
    ) => {
      await makeDebtPayment(args.debtId, money(args.amount, args.currency));
      return true;
    },
  },
  TreasuryAccount: {
    id: (account: { _id: string }) => account._id,
  },
  TreasuryDebt: {
    id: (debt: { _id: string }) => debt._id,
  },
};
