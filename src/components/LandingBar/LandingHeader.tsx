import logo from "../../assets/images/NeuroBank.png";
import Search from "lucide-react";
import { NavLink } from "react-router-dom";
import "./LandingHeader.css";

function LandingHeader() {
    return (
        <header className="landing-header"><nav>
            <div className="logo" aria-label="NeuroBank Logo">
                <NavLink to="/">
                    <img src={logo} alt="NeuroBank Logo" />
                    <h1>NeuroBank</h1>
                </NavLink>
            </div>
            <div className="pages" aria-label="Navigation Links">
                <ul>
                    <li><NavLink to="/">Dashboard</NavLink></li>
                    <li><NavLink to="/features">Features</NavLink></li>
                    <li><NavLink to="/security">Security</NavLink></li>
                    <li><NavLink to="/about">About</NavLink></li>
                    <li><NavLink to="/contact">Contact</NavLink></li>
                </ul>
            </div>
            <div className="user-actions">
                <button className="btn header-login-btn"><NavLink to="/login">Login</NavLink></button>
                <button className="btn header-signup-btn"><NavLink to="/signup">Sign Up</NavLink></button>
            </div>
        </nav>
        </header>
    );
}

export default LandingHeader;