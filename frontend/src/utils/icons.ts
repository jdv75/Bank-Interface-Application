import {
    ArrowLeft,
    ArrowRight,
    ArrowRightLeft,
    Banknote,
    Camera,
    ChartColumn,
    CreditCard,
    Landmark,
    PiggyBank,
    ShoppingBag,
    ShoppingCart,
    Utensils,
    type LucideIcon
} from "lucide-react";

import type { AccountType, Transaction, TransactionCategory } from "../types/bank";

const transactionIcons: Record<TransactionCategory, LucideIcon> = {
    payroll: Landmark,
    "mobile-check": Camera,
    "bank-transfer": ArrowRight,
    cash: Banknote,
    atm: CreditCard,
    groceries: ShoppingCart,
    dining: Utensils,
    shopping: ShoppingBag,
    "internal-transfer": ArrowRightLeft
};

const accountIcons: Record<AccountType, LucideIcon> = {
    checking: CreditCard,
    savings: PiggyBank,
    investment: ChartColumn
};

export function getTransactionIcon(transaction: Transaction): LucideIcon {
    if (transaction.category === "internal-transfer") {
        return transaction.amount > 0 ? ArrowLeft : ArrowRight;
    }

    return transactionIcons[transaction.category];
}

export function getAccountIcon(type: AccountType): LucideIcon {
    return accountIcons[type];
}
