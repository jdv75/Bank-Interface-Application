import TransactionItem from "../components/TransactionItem/TransactionItem";
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

const scheduledTransfers: TransferResult[] = [];

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

function getPendingTransferAmount(accountId: string): number {
    return scheduledTransfers
        .filter((transfer) => transfer.fromAccountId === accountId)
        .reduce((total, transfer) => total + transfer.amount, 0);
}

function getAvailableBalance(account: Account): number {
    return account.balance - getPendingTransferAmount(account.id);
}

function getTransferId(): string {
    return `transfer-${Date.now()}`;
}

function getAccountLabel(account: Account): string {
    return account.name.replace(/\s+Account$/, "");
}

function formatScheduledDate(date: string): string {
    const [year, month, day] = date.split("-").map(Number);

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC"
    }).format(new Date(Date.UTC(year, month - 1, day)));
}

function addTransferTransaction(
    transfer: TransferResult,
    sourceAccount: Account,
    destinationAccount?: Account
): void {
    const isScheduled = transfer.status === "scheduled";
    const note = transfer.note ? ` · ${transfer.note}` : "";
    const scheduledDetail = isScheduled
        ? `Scheduled for ${formatScheduledDate(transfer.scheduledFor!)}`
        : "";

    db.transactions.push({
        id: `${transfer.id}-out`,
        accountId: sourceAccount.id,
        type: "transfer",
        category: "internal-transfer",
        name: destinationAccount
            ? `To ${getAccountLabel(destinationAccount)}`
            : "External Transfer",
        detail: `${isScheduled ? scheduledDetail : `To ${destinationAccount ? getAccountLabel(destinationAccount) : "external"}`}${note}`,
        amount: -transfer.amount,
        createdAt: transfer.createdAt
    });

    if(destinationAccount && !isScheduled) {
        db.transactions.push({
            id: `${transfer.id}-in`,
            accountId: destinationAccount.id,
            type: "transfer",
            category: "internal-transfer",
            name: `From ${getAccountLabel(sourceAccount)}`,
            detail: `From ${getAccountLabel(sourceAccount)}${note}`,
            amount: transfer.amount,
            createdAt: transfer.createdAt
        });
    }
    
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

    getScheduledTransfers(): Promise<TransferResult[]> {
        return mockRequest(scheduledTransfers);
    },

    createTransfer(request: CreateTransferRequest): Promise<TransferResult> {
        const sourceAccount = db.accounts.find((account) => account.id === request.fromAccountId);

        if (!sourceAccount) {
            return Promise.reject(new Error("Source account was not found."));
        }

        if (!Number.isFinite(request.amount) || request.amount <= 0 || !Number.isInteger(request.amount * 100)) {
            return Promise.reject(new Error("Enter an amount with no more than two decimal places."));
        }

        if (request.amount > getAvailableBalance(sourceAccount)) {
            return Promise.reject(new Error("Transfer amount exceeds the available balance."));
        }

        let destinationAccount: Account | undefined;

        if (request.destination.type === "internal") {
            const destinationAccountId = request.destination.accountId;
            destinationAccount = db.accounts.find((account) => account.id === destinationAccountId);

            if (!destinationAccount) {
                return Promise.reject(new Error("Destination account was not found."));
            }

            if (destinationAccount.id === sourceAccount.id) {
                return Promise.reject(new Error("Choose two different accounts."));
            }
        }

        const transfer: TransferResult = {
            ...request,
            id: getTransferId(),
            status: request.scheduledFor ? "scheduled" : "completed",
            createdAt: new Date().toISOString()
        };

        if (transfer.status === "scheduled") {
            scheduledTransfers.push(transfer);
        } else {
            sourceAccount.balance = Number((sourceAccount.balance - request.amount).toFixed(2));

            if (destinationAccount) {
                destinationAccount.balance = Number((destinationAccount.balance + request.amount).toFixed(2));
            }
        }

        addTransferTransaction(transfer, sourceAccount, destinationAccount);

        return mockRequest(transfer);
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
