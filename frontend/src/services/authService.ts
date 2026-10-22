import { api, setToken, clearToken, getToken } from "./apiClient";

export interface Account {
    accountId: string;
    balance?: number;
    createdAt?: string;
}

export interface AuthError {
    code: "INVALID_CREDENTIALS" | "VALIDATION_ERROR" | "SERVER_ERROR";
    message: string;
    field?: "accountId" | "password" | "confirmPassword";
}

export type AuthResponse<T> =
    | { success: true; data: T }
    | { success: false; error: AuthError };

export const authService = {
    async login(accountId: string, password: string): Promise<AuthResponse<{ account: Account; token: string }>> {
        try {
            const res = await api<{ token: string; account: Account }>("/api/auth/login", {
                method: "POST",
                body: JSON.stringify({ accountId, password }),
            });
            setToken(res.token);
            return { success: true, data: res };
        } catch (e: any) {
            return {
                success: false,
                error: {
                    code: e.code ?? "SERVER_ERROR",
                    message: e.message ?? "Login failed.",
                },
            };
        }
    },

    async register(accountId: string, password: string, confirmPassword: string): Promise<AuthResponse<Account>> {
        if (password !== confirmPassword) {
            return {
                success: false,
                error: { code: "VALIDATION_ERROR", message: "Passwords do not match.", field: "confirmPassword" },
            };
        }

        try {
            const res = await api<Account>("/api/auth/register", {
                method: "POST",
                body: JSON.stringify({ accountId, password }),
            });
            return { success: true, data: res };
        } catch (e: any) {
            return {
                success: false,
                error: {
                    code: e.code ?? "SERVER_ERROR",
                    message: e.message ?? "Registration failed.",
                    field: e.field,
                },
            };
        }
    },

    async me(): Promise<Account | null> {
        if (!getToken()) return null;
        try {
            return await api<Account>("/api/auth/me");
        } catch {
            clearToken();
            return null;
        }
    },

    logout(): void {
        clearToken();
    },
};