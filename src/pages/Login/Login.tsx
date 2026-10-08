import { useState, type FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";

import AuthLayout from "../../layouts/AuthLayout";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";
import { validateLogin, type FieldErrors } from "../../utils/validation";

function Login() {
    // 1. Router hooks first
    const location = useLocation();
    const navigate = useNavigate();

    // 2. Derived values from those hooks
    const justRegistered = location.state as
        | { registered?: boolean; accountId?: string }
        | null;

    // 3. State — initializers may safely read `justRegistered`
    const [accountId, setAccountId] = useState(justRegistered?.accountId ?? "");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<FieldErrors>({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(
        justRegistered?.registered
            ? "Account created successfully. Please log in."
            : null
    );

    // 4. Auth context
    const { setAccount } = useAuth();
    
    

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setSuccessMessage(null);
        setErrors({});

        const v = validateLogin(accountId, password);
        if (v) {
            setErrors(v);
            return;
        }

        setLoading(true);
        const res = await authService.login(accountId, password);
        setLoading(false);

        if (!res.success) {
            setErrors({ form: res.error.message });
            return;
        }

        setAccount(res.data);
        navigate("/dashboard");
    }

    return (
        <AuthLayout
            topRightPrompt="Don't have an account?"
            topRightLinkText="Sign up"
            topRightLinkTo="/register"
            hero={<LoginHero />}
        >
            <div className="auth-card">
                <h1>Log In</h1>
                <p className="auth-subtitle">Welcome back to your account.</p>

                <form className="auth-form" onSubmit={handleSubmit} noValidate>
                    {successMessage && (
                        <div className="auth-success" role="status">
                            {successMessage}
                        </div>
                    )}

                    {errors.form && (
                        <div className="auth-alert" role="alert">
                            {errors.form}
                        </div>
                    )}

                    <div className="auth-field">
                        <label htmlFor="login-accountId">Account ID</label>
                        <div className={`auth-field-control ${errors.accountId ? "invalid" : ""}`}>
                            <Mail />
                            <input
                                id="login-accountId"
                                type="text"
                                autoComplete="username"
                                placeholder="e.g. demo"
                                value={accountId}
                                onChange={(e) => setAccountId(e.target.value)}
                            />
                        </div>
                        {errors.accountId && (
                            <span className="auth-field-error">{errors.accountId}</span>
                        )}
                    </div>

                    <div className="auth-field">
                        <label htmlFor="login-password">Password</label>
                        <div className={`auth-field-control ${errors.password ? "invalid" : ""}`}>
                            <Lock />
                            <input
                                id="login-password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="auth-icon-button"
                                onClick={() => setShowPassword((s) => !s)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff /> : <Eye />}
                            </button>
                        </div>
                        {errors.password && (
                            <span className="auth-field-error">{errors.password}</span>
                        )}
                    </div>

                    <div className="auth-row-end">
                        <Link to="/forgot-password" className="auth-link">
                            Forgot password?
                        </Link>
                    </div>

                    <button type="submit" className="auth-primary-btn" disabled={loading}>
                        {loading ? <span className="auth-spinner" /> : "Log In"}
                    </button>

                    {/* 
                    <div className="auth-divider"><span>or</span></div>

                    <button type="button" className="auth-social-btn">
                        <GoogleIcon /> Continue with Google
                    </button>
                    <button type="button" className="auth-social-btn">
                        <AppleIcon /> Continue with Apple
                    </button>*/}

                    <div className="auth-secure-note">
                        <ShieldCheck size={14} />
                        Your information is encrypted and secure.
                    </div>
                </form>
            </div>
        </AuthLayout>
    );
}

/* ----------------------- Hero ----------------------- */
function LoginHero() {
    return (
        <div className="auth-hero">
            <div className="auth-hero-tagline">
                <span>SECURE</span><span className="dot">•</span>
                <span>FAST</span><span className="dot">•</span>
                <span>MODERN</span>
            </div>

            <h2 className="auth-hero-title">
                Banking<br />
                for a smarter<br />
                <span className="accent">tomorrow.</span>
            </h2>

            <p className="auth-hero-sub">
                Manage your money, track your goals, and take control of your
                financial future — all in one place.
            </p>

            <div className="auth-hero-art">
                <div className="auth-phone">
                    <div className="auth-phone-notch" />
                    <div className="auth-phone-label">Total Balance</div>
                    <div className="auth-phone-amount">$12,340.00</div>
                    <svg className="auth-phone-spark" viewBox="0 0 200 60" preserveAspectRatio="none">
                        <polyline
                            points="0,45 30,38 60,42 90,25 120,30 150,15 180,20 200,10"
                            fill="none"
                            stroke="#2F80FF"
                            strokeWidth="2"
                        />
                    </svg>
                    <ul className="auth-phone-tx">
                        <li><span>Salary Deposit</span><b className="pos">+$1,200</b></li>
                        <li><span>Grocery Store</span><b className="neg">-$85.23</b></li>
                        <li><span>Transfer</span><b className="neg">-$300.00</b></li>
                    </ul>
                </div>

                <div className="auth-credit-card">
                    <div className="auth-credit-card-top">NeuroBank</div>
                    <div className="auth-credit-card-chip" />
                    <div className="auth-credit-card-bottom">
                        <span className="auth-credit-card-number">•••• 0224</span>
                        <span className="auth-mc">
                            <span className="red" />
                            <span className="yellow" />
                        </span>
                    </div>
                </div>

                <div className="auth-pills">
                    <AuthPill label="Track your spending" />
                    <AuthPill label="Bank with confidence" />
                    <AuthPill label="Reach your goals" />
                </div>
            </div>
        </div>
    );
}

/* ----------------------- Small helpers ----------------------- */
export function AuthPill({ label }: { label: string }) {
    return (
        <div className="auth-pill">
            <span className="auth-pill-icon">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none"
                     stroke="currentColor" strokeWidth="1.8">
                    <path d="M4 18L10 12l4 4 6-8" strokeLinecap="round" />
                </svg>
            </span>
            {label}
        </div>
    );
}

export const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18">
        <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.4 14.6 2.5 12 2.5A9.5 9.5 0 0 0 2.5 12 9.5 9.5 0 0 0 12 21.5c5.5 0 9.1-3.8 9.1-9.2 0-.6-.1-1.1-.2-1.6H12z" />
    </svg>
);

export const AppleIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M16.4 12.7c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.6.9s-1.9-.9-3.1-.9c-1.6 0-3 .9-3.9 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 3 2.4 1.2 0 1.7-.8 3.1-.8 1.4 0 1.9.8 3.1.8 1.3 0 2.1-1.2 2.9-2.3.9-1.3 1.3-2.6 1.3-2.7-.1 0-2.6-1-2.6-3.4zM14.1 5.4c.7-.8 1.1-1.9 1-3-1 0-2.2.6-2.9 1.5-.6.7-1.1 1.9-1 3 1.1.1 2.2-.6 2.9-1.5z" />
    </svg>
);

export default Login;