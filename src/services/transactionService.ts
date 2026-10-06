import transactionsData from "../data/transactions.json";
import type { Transaction } from "../types/transaction";
import accountsData from "../data/accounts.json";
import type { Account } from "../types/account";


export function getTransactions(accountId: string, limit?: number): Transaction[] {
    // mock fetch from json
    const sortedTransactions = [...transactionsData.sort((a, b) => b.created_at.localeCompare(a.created_at))] as Transaction[];
    const slicedTransactions = limit ? sortedTransactions.slice(0, limit) : sortedTransactions;
    return slicedTransactions;

    // TODO: refactor to fetch from api
}

export function getAccounts(userId: string): Account[] {
    return (accountsData as Account[]).filter(
        (account) => account.user_id === userId
    );
}

function validateAccount(account: Account | undefined): asserts account is Account {
    if (!account) {
        throw new Error("Account not found");
    }
}

export function deposit(accountId: string, amount: number): void {
    const account = (accountsData as Account[]).find(
        (account) => account.id === accountId
    );

    validateAccount(account);
    if (amount <= 0) {
        throw new Error("Deposit amount must be positive");
    }

    account.balance += amount;
}

export function withdraw(accountId: string, amount: number): void {
    const account = (accountsData as Account[]).find(
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

