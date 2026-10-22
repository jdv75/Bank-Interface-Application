const API_BASE_URL = "http://localhost:8085";
import { TOKEN_KEY } from "./authService";

export async function apiFetch<T>(path: string, options: RequestInit = {}) : Promise<T> {
    const headers = new Headers(options.headers);
    headers.set("Content-Type", "application/json");

    const token = localStorage.getItem(TOKEN_KEY);
    if(token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

    if(!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.message ?? `Request failed with status ${response.status}`);
    }

    if(response.status === 204) {
        return undefined as T;
    }

    return response.json() as Promise<T>;
}