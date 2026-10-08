import transactionsData from "../data/transactions.json";
import type { Transaction } from "../types/transaction";
import type { Account } from "../types/bank";
import { db } from "./bankStore";


export function getTransactions(accountId: string, limit?: number): Transaction[] {
    // mock fetch from json
    const sortedTransactions = [...transactionsData.sort((a, b) => b.created_at.localeCompare(a.created_at))] as Transaction[];
    const slicedTransactions = limit ? sortedTransactions.slice(0, limit) : sortedTransactions;
    return slicedTransactions;

    // TODO: refactor to fetch from api
}

export function getAccounts(): Account[] {
    return db.accounts;
}

function validateAccount(account: Account | undefined): asserts account is Account {
    if (!account) {
        throw new Error("Account not found");
    }
}

export function deposit(accountId: string, amount: number): void {
    const account = db.accounts.find(
        (account) => account.id === accountId
    );

    validateAccount(account);
    if (amount <= 0) {
        throw new Error("Deposit amount must be positive");
    }

    account.balance += amount;
}

export function withdraw(accountId: string, amount: number): void {
    const account = db.accounts.find(
        (account) => account.id === accountId
    );

    validateAccount(account);
    if (amount > account.balance) {
        throw new Error("Withdraw amount exceeds current account balance");
    }
    if (amount <= 0) {
        throw new Error("Withdraw amount must be positive");
    }

    account.balance -= amount;
}

// function createTransactionId(transactions: Transaction[]): string {
//     const highestId = transactions.reduce((highest, transaction) => {
//         const match = /^txn_(\d+)$/.exec(transaction.id);
//         return match ? Math.max(highest, Number(match[1])) : highest;
//     }, 0);

//     return `txn_${String(highestId + 1).padStart(3, "0")}`;
// }

// export function addTransaction(userId: string, accountId: string, transactionType: Transaction["type"], createdAt: string, transactionAmount: number): void {
//     const newId = createTransactionId(getTransactions(userId));
//     const transaction: Transaction = {
//         type: transactionType,
//         amount: transactionAmount,
//         created_at: createdAt,
//         id: newId,
//         account_id: accountId
//     }


// }

