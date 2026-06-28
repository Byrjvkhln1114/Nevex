import { money, subtractMoney } from "@nevex/shared-kernel";
import { findDebtById, updateDebtBalance, createDebt } from "../repository";
import { emitDebtBalanceReduced } from "../events";
import type { Money, Currency } from "@nevex/shared-kernel";
import type { TreasuryDebt } from "../types";

export async function makeDebtPayment(
  debtId: string,
  payment: Money
): Promise<void> {
  const debt = await findDebtById(debtId);
  if (!debt) throw new Error(`Debt ${debtId} not found`);

  const newBalance = subtractMoney(debt.balance, payment);
  if (newBalance.amount < 0) throw new Error("Payment exceeds remaining balance");

  await updateDebtBalance(debtId, newBalance);
  emitDebtBalanceReduced({ debtId, amountPaid: payment, newBalance });
}

export async function createTreasuryDebt(input: {
  accountId: string;
  label: string;
  principalAmount: number;
  currency: Currency;
  interestRate: number;
  minimumPaymentAmount: number;
  payoffTarget?: string;
}): Promise<TreasuryDebt> {
  return createDebt({
    accountId: input.accountId,
    label: input.label,
    principal: money(input.principalAmount, input.currency),
    balance: money(input.principalAmount, input.currency),
    interestRate: input.interestRate,
    minimumPayment: money(input.minimumPaymentAmount, input.currency),
    payoffTarget: input.payoffTarget,
  });
}
