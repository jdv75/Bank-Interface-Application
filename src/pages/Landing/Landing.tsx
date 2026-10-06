import React, { useState } from "react";
import { MoveRight } from "lucide-react";
import { NavLink } from "react-router-dom";
import FeatureCards from "../../components/FeatureCards/FeatureCards";
import "./Landing.css";

function Landing() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = () => {
        // Simulate a login action
        setIsLoggedIn(true);
    }  

    const handleLogout = () => {
        // Simulate a logout action
        setIsLoggedIn(false);
    }

    return (
        <section className="landing-page">
            <div className="landing-blurb">
                <p className="tagline">SECURE • MODERN • BUILT FOR YOU</p>
                <h1 className="title">NeuroBank</h1>
                <h1 className="slogan">Where Smarter<br />
                    Banking Begins</h1>
                <p className="description">
                    Manage your money, track your goals, and take control of your financial 
                    future with NeuroBank. A simple, secure, and modern banking experience.
                </p>
            </div>
            <nav>
                <div className="landing-actions">
                    <button className="landing-signup-button"><NavLink to="/signup">Get Started <MoveRight /></NavLink></button>
                    <button className="landing-login-button"><NavLink to="/login">Login</NavLink></button>
                </div>
            </nav>

            <FeatureCards />
        </section>
    );
}

export default Landing;