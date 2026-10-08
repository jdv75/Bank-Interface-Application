import type { Account, Transaction, TransactionType, User } from "../types/bank";
import { db } from "./bankStore";
import { mockRequest } from "./mockApi";

export type TransactionsByType = Record<TransactionType, Transaction[]>;

function sortByDateDesc(items: Transaction[]): Transaction[] {
    return [...items].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export const bankService = {
    getCurrentUser(): Promise<User> {
        const { password, ...user } = db.users[0];

        return mockRequest(user);
    },

    getAccounts(): Promise<Account[]> {
        return mockRequest(db.accounts);
    },

    getRecentTransactions(limit = 5): Promise<Transaction[]> {
        return mockRequest(sortByDateDesc(db.transactions).slice(0, limit));
    },

    getTransactionsByType(limitPerType = 4): Promise<TransactionsByType> {
        const sorted = sortByDateDesc(db.transactions);

        function pickFirst(type: TransactionType): Transaction[] {
            return sorted.filter((item) => item.type === type).slice(0, limitPerType);
        }

        return mockRequest({
            deposit: pickFirst("deposit"),
            withdraw: pickFirst("withdraw"),
            transfer: pickFirst("transfer")
        });
    }
};
