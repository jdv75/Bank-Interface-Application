import transactionsData from "../data/transactions.json";
import type { Transaction } from "../types/transaction";
import { mockRequest } from "./mockApi";

// TODO: replace with the logged-in user's selected account
export const MOCK_ACCOUNT_ID = "acc_001";

const transactions = transactionsData as Transaction[];

export type GetTransactionsOptions = {
    page?: number;
    pageSize?: number;
    type?: Transaction["type"];
};

export type TransactionPage = {
    transactions: Transaction[];
    total: number;
};

export function getTransactions(
    accountId: string,
    { page = 1, pageSize = 20, type }: GetTransactionsOptions = {}
): Promise<TransactionPage> {
    // mock fetch from json
    const matching = transactions
        .filter((t) => t.account_id === accountId || (t.type === "transfer" && t.to_account_id === accountId))
        .filter((t) => !type || t.type === type)
        .sort((a, b) => b.created_at.localeCompare(a.created_at));

    const start = (page - 1) * pageSize;
    return mockRequest({
        transactions: matching.slice(start, start + pageSize),
        total: matching.length
    });

    // TODO: refactor to fetch from api
}
