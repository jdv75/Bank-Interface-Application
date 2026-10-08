import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import { authService, type Account } from "../services/authService";

interface AuthContextValue {
    account: Account | null;
    setAccount: (account: Account | null) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [account, setAccount] = useState<Account | null>(() => {
        const id = authService.currentAccountId();
        return id ? authService.getAccount(id) : null;
    });

    // keep the in-memory account fresh across tabs (nice-to-have)
    useEffect(() => {
        const onStorage = () => {
            const id = authService.currentAccountId();
            setAccount(id ? authService.getAccount(id) : null);
        };
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    function logout() {
        authService.logout();
        setAccount(null);
    }

    return (
        <AuthContext.Provider value={{ account, setAccount, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
    return ctx;
}