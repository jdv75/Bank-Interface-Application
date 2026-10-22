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
    loading: boolean;
    setAccount: (account: Account | null) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [account, setAccount] = useState<Account | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        authService.me().then((acct) => {
            setAccount(acct);
            setLoading(false);
        });
    }, []);

    function logout() {
        authService.logout();
        setAccount(null);
    }

    return (
        <AuthContext.Provider value={{ account, loading, setAccount, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
    return ctx;
}