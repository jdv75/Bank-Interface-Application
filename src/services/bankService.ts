import type {
    Account,
    CreateTransferRequest,
    Transaction,
    TransactionType,
    TransferResult,
    User
} from "../types/bank";
import { db } from "./bankStore";
import { mockRequest } from "./mockApi";

export type TransactionsByType = Record<TransactionType, Transaction[]>;

const scheduledTransfers: TransferResult[] = [];

function sortByDateDesc(items: Transaction[]): Transaction[] {
    return [...items].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
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

export const bankService = {
    getCurrentUser(): Promise<User> {
        const { password, ...user } = db.users[0];

        return mockRequest(user);
    },

    getAccounts(): Promise<Account[]> {
        const accounts = db.accounts.map((account) => ({
            ...account,
            pendingTransferAmount: getPendingTransferAmount(account.id)
        }));

        return mockRequest(accounts);
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

        return mockRequest(transfer);
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
