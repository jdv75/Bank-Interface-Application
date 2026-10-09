import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import { Menu, X } from "lucide-react";
import logo from "../../assets/images/NeuroBank.png";
import Search from "lucide-react";
import { NavLink } from "react-router-dom";
import "./LandingHeader.css";

interface NavLinkItem {
    label: string;
    to: string;
}

const NAV_LINKS: NavLinkItem[] = [
    { label: "Home", to: "/" },
    { label: "Features", to: "/features" },
    { label: "Security", to: "/security" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
];

function LandingHeader() {
    const [menuOpen, setMenuOpen] = useState(false);
 
    // Close the mobile menu with the Escape key
    useEffect(() => {
        if (!menuOpen) return;
 
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setMenuOpen(false);
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [menuOpen]);
 
    // Close the mobile menu after any link inside it is clicked
    const handleMenuClick = (e: MouseEvent<HTMLDivElement>) => {
        if ((e.target as HTMLElement).closest("a")) setMenuOpen(false);
    };

    return (
        <header className="landing-header">
            <nav className="logo" aria-label="NeuroBank Home">
                <NavLink to="/">
                    <img src={logo} alt="NeuroBank Logo" />
                    <h2 className="logo-text" aria-hidden="true">NeuroBank</h2>
                </NavLink>                
            </nav>

            <button
                type="button"
                className="menu-toggle"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                aria-controls="header-menu"
                onClick={() => setMenuOpen((open) => !open)}
            >
                {menuOpen ? <X size={26} aria-hidden="true" /> : <Menu size={26} aria-hidden="true" />}
            </button>


            <div
                id="header-menu"
                className={`header-menu${menuOpen ? " is-open" : ""}`}
                onClick={handleMenuClick}
            >
                <nav className="nav-links" aria-label="Main Navigation">
                    {NAV_LINKS.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className="nav-link"
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                <nav className="user-actions">
                    <NavLink to="/login" className="btn login large">Login</NavLink>
                    <NavLink to="/register" className="btn signup large">Sign Up</NavLink>             
                </nav>
            </div>
        </header>
    );
}

export default LandingHeader;