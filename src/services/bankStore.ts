import bankData from "../data/bank.json";
import type { BankDatabase } from "../types/bank";

export const db: BankDatabase = structuredClone(bankData as BankDatabase);
