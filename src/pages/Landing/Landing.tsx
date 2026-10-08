import React, { useState } from "react";
import { MoveRight } from "lucide-react";
import { NavLink } from "react-router-dom";
import FeatureCards from "../../components/FeatureCards/FeatureCards";
import GlowingEffect from "../../components/GlowingEffect/GlowingEffect";
import heroMockup from "../../assets/images/demo.png";
import "./Landing.css";

// Image
import heroImage from "../../assets/images/Landing.png";

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

            <FeatureCards />
        </div>
    );
}

export default Landing;