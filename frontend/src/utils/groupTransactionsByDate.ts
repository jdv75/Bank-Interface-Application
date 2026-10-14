import type { Transaction } from "../types/transaction";

export function groupTransactionsByDate(transactions: Transaction[]): Map<string, Transaction[]> {
    const transactionsByDate = new Map<string, Transaction[]>();
    for (const transaction of transactions) {
        const date: string = new Date(transaction.created_at).toLocaleDateString();
        let dayTransactions = transactionsByDate.get(date) || [];
        if (!dayTransactions.length) {
            transactionsByDate.set(date, dayTransactions)
        }
        dayTransactions.push(transaction)
    }
    return transactionsByDate;
}