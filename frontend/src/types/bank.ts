export type AccountType = "checking" | "savings" | "investment";
export type TransactionType = "deposit" | "withdraw" | "transfer";
export type TransactionStatus = "scheduled" | "completed" | "failed";

export type TransactionCategory = 
    | "payroll" 
    | "mobile-check" 
    | "bank-transfer" 
    | "cash" | "atm" 
    | "groceries" | "dining" 
    | "shopping" 
    | "internal-transfer";

export interface User {
    id: string;
    name: string;
    email: string;
}

// The password only lives in the mock, it will never live in the model
export interface UserRecord extends User {
    password: string;
}

export interface Account {
    id: string;
    type: AccountType;
    name: string;
    last4: string;
    balance: number;
    routingNumber: string | null;
    interestRate?: number;
    ytdReturn?: number;
    pendingTransferAmount: number;
}

export type TransferDestination =
    | {
        type: "internal";
        destinationAccountId: number;
    }
    | {
        type: "external";
        destinationAccountId: number;
        routingNumber: number;
    };

export interface CreateTransferRequest {
    originAccountId: number;
    destination: TransferDestination;
    amount: number;
    transactionNote?: string;
    scheduledFor?: string;
}

export interface TransferResult {
    transactionId: number;
    createdAt: string;
    status: TransactionStatus;
    originAccountId: number;
    destination: TransferDestination;
    amount: number;
    transactionNote: string | null;
    scheduledFor: string | null;
}

export interface Transaction {
    id: string;
    accountId: string;
    type: TransactionType;
    category: TransactionCategory;
    name: string;
    detail: string;
    amount: number;
    createdAt: string;
    status: TransactionStatus;
    note: string | null;
    scheduledFor: string | null;
}

export interface ApiError {
    message: string;
    code?: string;
}

// JSON form of the data
export interface BankDatabase {
    users: UserRecord[];
    accounts: Account[];
    transactions: Transaction[];
}
