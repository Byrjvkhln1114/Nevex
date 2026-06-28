import { money } from "@nevex/shared-kernel";
import { createAccount } from "../repository";
import type { Currency } from "@nevex/shared-kernel";
import type { TreasuryAccount } from "../types";

export async function createTreasuryAccount(input: {
  name: string;
  type: TreasuryAccount["type"];
  balanceAmount: number;
  currency: Currency;
}): Promise<TreasuryAccount> {
  return createAccount({
    name: input.name,
    type: input.type,
    balance: money(input.balanceAmount, input.currency),
  });
}
