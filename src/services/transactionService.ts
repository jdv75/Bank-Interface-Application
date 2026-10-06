import transactionsData from "../data/transactions.json";
import type { Transaction } from "../types/transaction";

export function getTransactions(accountId: string, limit?: number): Transaction[] {
    // mock fetch from json
    const sortedTransactions = [...transactionsData.sort((a, b) => b.created_at.localeCompare(a.created_at))] as Transaction[];
    const slicedTransactions = limit ? sortedTransactions.slice(0, limit) : sortedTransactions;
    return slicedTransactions;

    // TODO: refactor to fetch from api
}

