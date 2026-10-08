export type AccountType = "checking" | "savings" | "investment";
export type TransactionType = "deposit" | "withdraw" | "transfer";

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
    routingNumber?: string;
    interestRate?: number;
    ytdReturn?: number;
    pendingTransferAmount?: number;
}

export type TransferDestination =
    | {
        type: "internal";
        accountId: string;
    }
    | {
        type: "external";
        accountNumber: string;
        routingNumber: string;
    };

export interface CreateTransferRequest {
    fromAccountId: string;
    destination: TransferDestination;
    amount: number;
    note?: string;
    scheduledFor?: string;
}

export interface TransferResult extends CreateTransferRequest {
    id: string;
    status: "completed" | "scheduled";
    createdAt: string;
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
