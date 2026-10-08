import transactionsData from "../data/transactions.json";
import type { Transaction } from "../types/transaction";
import { mockRequest } from "./mockApi";
import type { Account } from "../types/bank";
import { db } from "./bankStore";


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

function createTransactionId(transactions: Transaction[]): string {
    const highestId = transactions.reduce((highest, transaction) => {
        const match = /^txn_(\d+)$/.exec(transaction.id);
        return match ? Math.max(highest, Number(match[1])) : highest;
    }, 0);

    return `txn_${String(highestId + 1).padStart(3, "0")}`;
}

export function addTransaction(accountId: string, transactionType: Exclude<Transaction["type"], "transfer">, createdAt: string, transactionAmount: number): void {
    const transaction: Transaction = {
        type: transactionType,
        amount: transactionAmount,
        created_at: createdAt,
        id: createTransactionId(transactions),
        account_id: accountId
    }

    transactions.push(transaction);


}

