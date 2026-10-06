import React from "react";
import { 
    Landmark, 
    ArrowLeftRight,
    ChartNoAxesCombined,
    ShieldCheck,
 } from 'lucide-react';
 import "./FeatureCards.css";

interface FeatureCardsProps {
    id: string;
    title: string;
    icon: React.ReactNode;
    description: string;
}

const FEATURES_DATA: FeatureCardsProps[] = [
    {
        id: "feature1",
        title: "Manage Your Accounts",
        icon: <Landmark />,
        description: "View balances, track activity, and organize your finances in one place.",
    },

    {
        id: "feature2",
        title: "Transfer Money",
        icon: <ArrowLeftRight />,
        description: "Send and receive money instantly with our fast and secure transfer service.",
    },
    {
        id: "feature3",
        title: "Track Your Spending",
        icon: <ChartNoAxesCombined />,
        description: "Stay on top of your spending with real-time transaction history and insights.",
    },
    {
        id: "feature4",
        title: "Secure Your Accounts",
        icon: <ShieldCheck />,
        description: "Protect your financial information with our advanced security features.",
    }
];

export default function FeatureCards() {
    return (
        <section className="feature-cards" id="features">
            <div className="features-grid">
                {FEATURES_DATA.map((feature) => (
                    <div className="feature-card" key={feature.id}>
                        <div className="feature-icon" aria-hidden="true">
                            {feature.icon}
                        </div>
                        <h3>{feature.title}</h3>
                        <p>{feature.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}