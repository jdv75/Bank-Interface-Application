import type { ReactNode } from "react";

import LandingHeader from "../components/LandingBar/LandingHeader";
import FeatureCards from "../components/FeatureCards/FeatureCards";

interface LandingLayoutProps {
    children: ReactNode;
}

function LandingLayout({ children }: LandingLayoutProps) {
    return (
        <div className="landing-layout">
            <div className="landing-background" aria-hidden="true" />
            
            <LandingHeader />

            <main className="landing-content">
                {children}
            </main>
        </div>
    );
}

export default LandingLayout;