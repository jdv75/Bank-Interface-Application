import React, { useState } from "react";
import { 
    MoveRight,
    Landmark, 
    ArrowLeftRight,
    ChartNoAxesCombined,
    ShieldCheck,
 } from "lucide-react";
import { NavLink } from "react-router-dom";
import FeatureCards from "../../components/FeatureCards/FeatureCards";
import GlowingEffect from "../../components/GlowingEffect/GlowingEffect";
import heroMockup from "../../assets/images/demo.png";
import "./Landing.css";
import heroImage from "../../assets/images/Landing.png";
import { CardProps } from "../../types/landing";
import InfoCard from "../../components/InfoCards/InfoCards";



const FEATURES_DATA: CardProps[] = [
    {
        title: "Manage Your Accounts",
        icon: <Landmark />,
        tone: "blue",
        description: "View balances, track activity, and organize your finances in one place.",
    },

    {
        title: "Transfer Money",
        icon: <ArrowLeftRight />,
        tone: "purple",
        description: "Send and receive money instantly with our fast and secure transfer service.",
    },
    {
        title: "Track Your Spending",
        icon: <ChartNoAxesCombined />,
        tone: "green",
        description: "Stay on top of your spending with real-time transaction history and insights.",
    },
    {
        title: "Secure Your Accounts",
        icon: <ShieldCheck />,
        tone: "blue",
        description: "Protect your financial information with our advanced security features.",
    }
];

function Landing() {
    return (
        <div className="landing-page">            
            <section className="landing-hero">
                               
                <div className="landing-container">
                    <div className="landing-blurb">
                        <p className="tagline">SECURE • MODERN • BUILT FOR YOU</p>
                        <h1 className="title">NeuroBank</h1>
                        <h2 className="slogan">Where <span className="gradient-text">Smarter<br />
                            Banking</span> Begins</h2>
                        <p className="description">
                            Manage your money, track your goals, and take control of your financial 
                            future with NeuroBank. A simple, secure, and modern banking experience.
                        </p>
                    
                        <nav className="landing-actions">
                            <NavLink to="/register" className="btn signup large">
                                Get Started  <MoveRight aria-hidden="true" />
                            </NavLink>
                            <NavLink to="/login" className="btn login large">Login</NavLink>                
                        </nav>
                    </div>

                    <div className="landing-visual">
                        <div className="glow-effect" aria-hiden="true" /> 
                          {/* Image */}
                        <img src={heroImage} alt="NeuroBank app preview" className="landing-hero-image"/>       
                    </div>
                </div>
            </section>

            <div className="features-grid">
                {FEATURES_DATA.map((feature) => (
                    <InfoCard
                        key={feature.title}
                        icon={feature.icon}
                        title={feature.title}
                        description={feature.description}
                        tone={feature.tone}
                    />
                ))}
            </div>

        </div>
    );
}

export default Landing;