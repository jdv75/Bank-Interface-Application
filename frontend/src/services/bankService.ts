import type {
    Account,
    AccountType,
    CreateTransferRequest,
    Transaction,
    TransactionType,
    TransferResult,
    User
} from "../types/bank";
import { db } from "./bankStore";
import { mockRequest } from "./mockApi";
import { apiFetch } from "./apiClient";

export type TransactionsByType = Record<TransactionType, Transaction[]>;

export type TransactionHistoryOptions = {
    accountId: string;
    page?: number;
    pageSize?: number;
    type?: TransactionType;
};

export type TransactionHistoryPage = {
    transactions: Transaction[];
    total: number;
};

function sortByDateDesc(items: Transaction[]): Transaction[] {
    return [...items].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

async function getRecentForUser(accounts: Account[], limit: number, type?: TransactionType): Promise<Transaction[]> {
    const pages = await Promise.all(
        accounts.map((account) =>
            bankService
                .getTransactionHistory({ accountId: account.id, page: 1, pageSize: limit, type })
                .then((page) => page.transactions)
                // One account failing shouldn't blank the whole dashboard
                .catch(() => [] as Transaction[])
        )
    );

    const byId = new Map<string, Transaction>();
    for (const transaction of pages.flat()) {
        const existing = byId.get(transaction.id);
        if (!existing || transaction.amount < 0) {
            byId.set(transaction.id, transaction);
        }
    }

    return sortByDateDesc([...byId.values()]).slice(0, limit);
}

export const bankService = {
    getCurrentUser(): Promise<User> {
        const { password, ...user } = db.users[0];

        return mockRequest(user);
    },

    getAccounts(): Promise<Account[]> {
        return apiFetch<Account[]>("/api/accounts");
    },

    deleteAccount(accountId: string): Promise<void> {
        return apiFetch<void>(`/api/accounts/${accountId}`, { method: "DELETE"});
    },

    createAccount(input: {type: AccountType; pin: string }) : Promise<Account> {
        return apiFetch<Account>("/api/accounts", {
            method: "POST",
            body: JSON.stringify(input)
        });
    },

    createTransfer(request: CreateTransferRequest): Promise<TransferResult> {
        return apiFetch<TransferResult>("/api/transfers", {
            method: "POST",
            body: JSON.stringify(request)
        });
    },

    async getRecentTransactions(limit = 5): Promise<Transaction[]> {
        const accounts = await bankService.getAccounts();
        return getRecentForUser(accounts, limit);
    },

    async getTransactionsByType(limitPerType = 4): Promise<TransactionsByType> {
        const accounts = await bankService.getAccounts();

        const [deposit, withdraw, transfer] = await Promise.all([
            getRecentForUser(accounts, limitPerType, "deposit"),
            getRecentForUser(accounts, limitPerType, "withdraw"),
            getRecentForUser(accounts, limitPerType, "transfer")
        ]);

        return { deposit, withdraw, transfer };
    },

    getTransactionHistory({
        accountId,
        page = 1,
        pageSize = 20,
        type
    }: TransactionHistoryOptions): Promise<TransactionHistoryPage> {
        const params = new URLSearchParams({
            page: String(page),
            page_size: String(pageSize)
        });

        if (type) {
            params.set("type", type);
        }

        return apiFetch<TransactionHistoryPage>(
            `/api/accounts/${encodeURIComponent(accountId)}/transactions?${params}`
        );
    }
};
