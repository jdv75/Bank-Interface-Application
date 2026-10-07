import logo from "../../assets/images/NeuroBank.png";
import Search from "lucide-react";
import { NavLink } from "react-router-dom";
import "./LandingHeader.css";

interface NavLinkItem {
    label: string;
    to: string;
}

const NAV_LINKS: NavLinkItem[] = [
    { label: "Dashboard", to: "/" },
    { label: "Features", to: "/features" },
    { label: "Security", to: "/security" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
];

function LandingHeader() {
    return (
        <header className="landing-header">
            <nav className="logo" aria-label="NeuroBank Home">
                <NavLink to="/">
                    <img src={logo} alt="NeuroBank Logo" />
                    <h2 className="logo-text" aria-hidden="true">NeuroBank</h2>
                </NavLink>                
            </nav>

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
                <NavLink to="/signup" className="btn signup large">Sign Up</NavLink>             
            </nav>
        </header>
    );
}

export default LandingHeader;