import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import logo from "../assets/images/NeuroBank.png";
import "./AuthLayout.css";

interface AuthLayoutProps {
    children: ReactNode;
    hero: ReactNode;
    topRightPrompt: string;    // "Don't have an account?"
    topRightLinkText: string;  // "Sign up"
    topRightLinkTo: string;    // "/register"
}

function AuthLayout({
    children,
    hero,
    topRightPrompt,
    topRightLinkText,
    topRightLinkTo,
}: AuthLayoutProps) {
    return (
        <div className="auth-shell">
            <header className="auth-nav">
                <Link to="/" className="auth-brand">
                    <img src={logo} alt="NeuroBank logo" />
                    <span>NeuroBank</span>
                </Link>

                <div className="auth-nav-right">
                    <span>{topRightPrompt}</span>
                    <Link to={topRightLinkTo} className="auth-nav-link">
                        {topRightLinkText}
                    </Link>
                </div>
            </header>

            <main className="auth-grid">
                <section className="auth-form-col">{children}</section>
                <section className="auth-hero-col">{hero}</section>
            </main>
        </div>
    );
}

export default AuthLayout;