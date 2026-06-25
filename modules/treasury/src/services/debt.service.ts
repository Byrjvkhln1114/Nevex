import { subtractMoney } from "@nevex/shared-kernel";
import { findDebtById, updateDebtBalance } from "../repository";
import { emitDebtBalanceReduced } from "../events";
import type { Money } from "@nevex/shared-kernel";

export async function makeDebtPayment(
  debtId: string,
  payment: Money
): Promise<void> {
  const debt = await findDebtById(debtId);
  if (!debt) throw new Error(`Debt ${debtId} not found`);

  const newBalance = subtractMoney(debt.balance, payment);

  if (newBalance.amount < 0) {
    throw new Error("Payment exceeds remaining debt balance");
  }

  await updateDebtBalance(debtId, newBalance);

  emitDebtBalanceReduced({
    debtId,
    amountPaid: payment,
    newBalance,
  });
}
