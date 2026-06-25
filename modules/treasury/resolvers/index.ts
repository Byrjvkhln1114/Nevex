import { findAllAccounts, findAllDebts } from "../src/repository";
import { makeDebtPayment } from "../src/services";
import { money } from "@nevex/shared-kernel";
import type { Currency } from "@nevex/shared-kernel";

export const treasuryResolvers = {
  TreasuryQuery: {
    accounts: () => findAllAccounts(),
    debts: () => findAllDebts(),
  },
  TreasuryMutation: {
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
