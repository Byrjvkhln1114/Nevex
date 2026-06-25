import { ruleRegistry } from "@nevex/dependency-engine";
import type { DebtBalanceReducedPayload, BudgetSurplusDetectedPayload } from "../events";

export function registerTreasuryRules(): void {
  ruleRegistry.register({
    id: "treasury:debt-cleared-unlocks-investment",
    description: "When a debt reaches zero, unlock the investment opportunity feature",
    trigger: {
      domain: "treasury",
      eventType: "DebtBalanceReduced",
      condition: (payload: unknown) =>
        (payload as DebtBalanceReducedPayload).newBalance.amount === 0,
    },
    action: {
      type: "unlock",
      targetDomain: "treasury",
      key: "InvestmentOpportunity",
      message: "Debt cleared — redirect that monthly payment to investments?",
    },
  });

  ruleRegistry.register({
    id: "treasury:surplus-unlocks-presence",
    description: "When discretionary budget has surplus over $200, suggest wardrobe upgrade",
    trigger: {
      domain: "treasury",
      eventType: "BudgetSurplusDetected",
      condition: (payload: unknown) => {
        const p = payload as BudgetSurplusDetectedPayload;
        return p.category === "discretionary" && p.surplusAmount.amount >= 20000; // stored in cents
      },
    },
    action: {
      type: "suggest",
      targetDomain: "presence",
      key: "WardrobeUpgrade",
      message: "You have a budget surplus — a good time for a wardrobe upgrade?",
    },
  });
}
