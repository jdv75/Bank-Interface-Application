export interface Account {
    accountId: string;
    balance: number;
    createdAt: string;
}

export interface AuthError {
    code: "INVALID_CREDENTIALS" | "VALIDATION_ERROR" | "SERVER_ERROR";
    message: string;
    field?: keyof Account | "password" | "confirmPassword";
}

export type AuthResponse<T> =
    | { success: true; data: T }
    | { success: false; error: AuthError };

interface StoredAccount {
    account: Account;
    password: string;   // was: pin
}

const accounts = new Map<string, StoredAccount>();

accounts.set("demo", {
    account: {
        accountId: "demo",
        balance: 1500,
        createdAt: new Date().toISOString(),
    },
    password: "Password1!",   // was: "123456" when it was a pin
});

const SESSION_KEY = "neurobank.session";

function delay<T>(value: T, ms = 400): Promise<T> {
    return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export const authService = {
    async login(accountId: string, password: string): Promise<AuthResponse<Account>> {
        const key = accountId.trim().toLowerCase();
        const rec = accounts.get(key);

        if (!rec || rec.password !== password) {
            return delay({
                success: false,
                error: {
                    code: "INVALID_CREDENTIALS",
                    message: "Incorrect account ID or password.",
                },
            });
        }

        localStorage.setItem(SESSION_KEY, key);
        return delay({ success: true, data: rec.account });
    },

    async register(
        accountId: string,
        password: string,
        confirmPassword: string,
    ): Promise<AuthResponse<Account>> {
        const key = accountId.trim().toLowerCase();

        if (password !== confirmPassword) {
            return delay({
                success: false,
                error: {
                    code: "VALIDATION_ERROR",
                    message: "Passwords do not match.",
                    field: "confirmPassword",
                },
            });
        }

        if (accounts.has(key)) {
            return delay({
                success: false,
                error: {
                    code: "VALIDATION_ERROR",
                    message: "That account ID is already taken.",
                    field: "accountId",
                },
            });
        }

        const account: Account = {
            accountId: key,
            balance: 0,
            createdAt: new Date().toISOString(),
        };
        accounts.set(key, { account, password });
        localStorage.setItem(SESSION_KEY, key);
        return delay({ success: true, data: account });
    },

    logout(): void {
        localStorage.removeItem(SESSION_KEY);
    },

    currentAccountId(): string | null {
        return localStorage.getItem(SESSION_KEY);
    },

    getAccount(accountId: string): Account | null {
        return accounts.get(accountId)?.account ?? null;
    },
};