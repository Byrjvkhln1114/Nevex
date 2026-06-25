import { eventBus } from "@nevex/event-bus";
import type { Money } from "@nevex/shared-kernel";

export interface DebtBalanceReducedPayload {
  debtId: string;
  amountPaid: Money;
  newBalance: Money;
}

export interface BudgetSurplusDetectedPayload {
  category: string;
  period: string;
  surplusAmount: Money;
}

export function emitDebtBalanceReduced(
  payload: DebtBalanceReducedPayload
): void {
  eventBus.publish({
    id: crypto.randomUUID(),
    type: "DebtBalanceReduced",
    domain: "treasury",
    payload,
    occurredAt: new Date().toISOString(),
  });
}

export function emitBudgetSurplusDetected(
  payload: BudgetSurplusDetectedPayload
): void {
  eventBus.publish({
    id: crypto.randomUUID(),
    type: "BudgetSurplusDetected",
    domain: "treasury",
    payload,
    occurredAt: new Date().toISOString(),
  });
}
