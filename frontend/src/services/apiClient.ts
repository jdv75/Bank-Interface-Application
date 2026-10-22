const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8085";
const TOKEN_KEY = "neurobank.session";

export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
    const headers = new Headers(init.headers);
    headers.set("Content-Type", "application/json");

    const token = getToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);

    const res = await fetch(`${BASE_URL}${path}`, { ...init, headers });

    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const error = new Error(body.message ?? `HTTP ${res.status}`);
        (error as any).code = body.code ?? "SERVER_ERROR";
        (error as any).field = body.field;
        (error as any).status = res.status;
        throw error;
    }

    if (res.status === 204) {
        return undefined as T;
    }

    return res.json() as Promise<T>;
}

/**
 * Compatibility alias for bankService.ts (Juan's API layer).
 * Delegates to the JWT-aware `api()` function so protected
 * endpoints receive `Authorization: Bearer <token>`.
 * The `X-Username` header is no longer required — the backend
 * reads the username from the JWT via SecurityContextHolder.
 */
export const apiFetch = api;