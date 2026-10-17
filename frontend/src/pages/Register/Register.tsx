import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";

import AuthLayout from "../../layouts/AuthLayout";
//import { useAuth } from "../../context/AuthContext"; outdated (sends to login page on success)
import { authService } from "../../services/authService";
import {
    validateRegister,
    passwordRules,
    type FieldErrors,
} from "../../utils/validation";
import { AuthPill, GoogleIcon, AppleIcon } from "../Login/Login";
import "./Register.css";
import register from "../../assets/images/SignUp.png";

function Register() {
    const [accountId, setAccountId] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [agree, setAgree] = useState(false);
    const [errors, setErrors] = useState<FieldErrors>({});
    const [loading, setLoading] = useState(false);

    //const { setAccount } = useAuth(); outdated (sends to login page on success)
    const navigate = useNavigate();

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setErrors({});

        const v = validateRegister(accountId, password, confirmPassword);
        if (v) {
            setErrors(v);
            return;
        }

        if (!agree) {
            setErrors({
                form: "You must agree to the Terms of Service and Privacy Policy.",
            });
            return;
        }

        setLoading(true);
        const res = await authService.register(accountId, password, confirmPassword);
        setLoading(false);

        if (!res.success) {
            const field =
                res.error.field === "confirmPassword" ? "confirmPassword"
                : res.error.field === "accountId"     ? "accountId"
                : "form";
            setErrors({ [field]: res.error.message });
            return;
        }

        // Success — send them to login with a one-shot flag
        navigate("/login", { state: { registered: true, accountId } });
    }

    return (
        <AuthLayout
            topRightPrompt="Already have an account?"
            topRightLinkText="Log in"
            topRightLinkTo="/login"
            hero={<RegisterHero />}
        >
            <div className="auth-card">
                <h1>Create Your Account</h1>
                <p className="auth-subtitle">
                    Join NeuroBank and take control of your financial future.
                </p>

                <form className="auth-form" onSubmit={handleSubmit} noValidate>
                    {errors.form && (
                        <div className="auth-alert" role="alert">
                            {errors.form}
                        </div>
                    )}

                    <div className="auth-field">
                        <label htmlFor="reg-accountId">Account ID</label>
                        <div className={`auth-field-control ${errors.accountId ? "invalid" : ""}`}>
                            <Mail />
                            <input
                                id="reg-accountId"
                                type="text"
                                autoComplete="username"
                                placeholder="Pick an account ID"
                                value={accountId}
                                onChange={(e) => setAccountId(e.target.value)}
                            />
                        </div>
                        {errors.accountId && (
                            <span className="auth-field-error">{errors.accountId}</span>
                        )}
                    </div>

                    <div className="register-two-col">
                        <div className="auth-field">
                            <label htmlFor="reg-password">Password</label>
                            <div className={`auth-field-control ${errors.password ? "invalid" : ""}`}>
                                <Lock />
                                <input
                                    id="reg-password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    placeholder="Create a password"
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

                        <div className="auth-field">
                            <label htmlFor="reg-confirm">Confirm Password</label>
                            <div className={`auth-field-control ${errors.confirmPassword ? "invalid" : ""}`}>
                                <Lock />
                                <input
                                    id="reg-confirm"
                                    type={showConfirm ? "text" : "password"}
                                    autoComplete="new-password"
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="auth-icon-button"
                                    onClick={() => setShowConfirm((s) => !s)}
                                    aria-label={showConfirm ? "Hide password" : "Show password"}
                                >
                                    {showConfirm ? <EyeOff /> : <Eye />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <span className="auth-field-error">{errors.confirmPassword}</span>
                            )}
                        </div>
                    </div>

                    <ul className="register-password-rules">
                        {passwordRules.map((rule, i) => {
                            const passed = rule.test(password);
                            return (
                                <li key={i} className={passed ? "rule passed" : "rule"}>
                                    <span className="rule-dot" />
                                    {rule.label}
                                </li>
                            );
                        })}
                    </ul>

                    <label className="register-checkbox">
                        <input
                            type="checkbox"
                            checked={agree}
                            onChange={(e) => setAgree(e.target.checked)}
                        />
                        <span className="register-checkbox-box" />
                        <span className="register-checkbox-text">
                            I agree to the <a href="/terms">Terms of Service</a> and{" "}
                            <a href="/privacy">Privacy Policy</a>.
                        </span>
                    </label>

                    <button type="submit" className="auth-primary-btn" disabled={loading}>
                        {loading ? <span className="auth-spinner" /> : "Create Account"}
                    </button>

                    {/*
                    <div className="auth-divider"><span>or</span></div>

                    <button type="button" className="auth-social-btn">
                        <GoogleIcon /> Continue with Google
                    </button>
                    <button type="button" className="auth-social-btn">
                        <AppleIcon /> Continue with Apple
                    </button>

                    <div className="auth-secure-note">
                        <ShieldCheck size={14} />
                        Your information is encrypted and secure.
                    </div>*/}
                </form>
            </div>
        </AuthLayout>
    );
}

function RegisterHero() {
    return (
        <div className="auth-hero">
            <div className="auth-hero-tagline">
                <span>SAFE</span><span className="dot">•</span>
                <span>SIMPLE</span><span className="dot">•</span>
                <span>SMART</span>
            </div>

            <div className="auth-hero-title-wrap register-hero-wrap">
                <h2 className="auth-hero-title">
                    A smarter way<br />
                    to manage<br />
                    <span className="accent">your money.</span>
                </h2>
                <img
                    src={register}
                    alt="NeuroBank sign up preview"
                    className="auth-hero-image register-hero-image"
                />
            </div>

            <p className="auth-hero-sub">
                Open an account in minutes and get access to powerful tools to
                help you save, spend, and grow.
            </p>
        
            <div className="auth-hero-art">
                    {/* <div className="auth-credit-card">
                        <div className="auth-credit-card-top">NeuroBank</div>
                        <div className="auth-credit-card-chip" />
                        <div className="auth-credit-card-bottom">
                            <span className="auth-credit-card-number">•••• 0224</span>
                            <span className="auth-mc">
                                <span className="red" />
                                <span className="yellow" />
                            </span>
                        </div>
                    </div> */}

                    {/* <div className="auth-pills">
                        <AuthPill label="Track your spending" />
                        <AuthPill label="Bank with confidence" />
                        <AuthPill label="Reach your goals" />
                    </div> */}
            </div> 
        </div>
    );
}

export default Register;