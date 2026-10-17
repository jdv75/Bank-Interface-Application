import type { ReactNode } from "react";
import {
    Landmark,
    ArrowLeftRight,
    ChartNoAxesCombined,
    CreditCard,
    BellRing,
    Target,
} from "lucide-react";
import PageHero from "../../components/LandingPageHero/PageHero";
import CallToAction from "../../components/CallToAction/CallToAction";
import InfoCard from "../../components/InfoCards/InfoCards";
import { CardProps } from "../../types/landing";
import "./Features.css";
 
const ICON = { size: 28, strokeWidth: 1.75 };
 
// TODO: edit this list so it matches what your app actually does
const FEATURES: CardProps[] = [
    {
        title: "Manage Your Accounts",
        description: "View balances, track activity, and organize all of your accounts in one clear dashboard.",
        icon: <Landmark {...ICON} />,
        tone: "blue",
    },
    {
        title: "Transfer Money Easily",
        description: "Move money between your accounts or send it to trusted recipients quickly and securely.",
        icon: <ArrowLeftRight {...ICON} />,
        tone: "purple",
    },
    {
        title: "Track Your Spending",
        description: "Real-time transaction history and spending breakdowns show where your money goes.",
        icon: <ChartNoAxesCombined {...ICON} />,
        tone: "green",
    },
    {
        title: "Card Controls",
        description: "Lock and unlock cards, review activity, and stay in charge of how your cards are used.",
        icon: <CreditCard {...ICON} />,
        tone: "blue",
    },
    {
        title: "Instant Alerts",
        description: "Get notified about deposits, withdrawals, and unusual activity as soon as it happens.",
        icon: <BellRing {...ICON} />,
        tone: "purple",
    },
    {
        title: "Savings Goals",
        description: "Set targets for what matters to you and watch your progress grow over time.",
        icon: <Target {...ICON} />,
        tone: "green",
    },
];
 
const STEPS = [
    {
        title: "Create your account",
        text: "Sign up in minutes with your email and a secure password.",
    },
    {
        title: "Add your accounts",
        text: "Set up checking, savings, and more so everything lives in one place.",
    },
    {
        title: "Take control",
        text: "Move money, follow your spending, and work toward your goals.",
    },
];
 
export default function Features() {
    return (
        <div className="features-page">
            <PageHero
                eyebrow="Features"
                title="Everything you need to"
                accent="bank smarter."
                subtitle="NeuroBank brings your accounts, transfers, and spending insights together in one simple, secure, and modern experience."
            />
 
            <section className="page-section">
                <div className="page-section__inner">
                    <div className="card-grid">
                        {FEATURES.map((feature) => (
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
            </section>
 
            <section className="page-section">
                <div className="page-section__inner">
                    <h2 className="section-title">How it works</h2>
                    <p className="section-lead">
                        Getting started takes just a few minutes. Here is what to expect.
                    </p>
 
                    <ol className="steps">
                        {STEPS.map((step, index) => (
                            <li className="step" key={step.title}>
                                <span className="step__number" aria-hidden="true">{index + 1}</span>
                                <h3>{step.title}</h3>
                                <p>{step.text}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>
 
            <CallToAction
                title="Ready to bank smarter?"
                text="Create your free NeuroBank account and see everything in one place."
                primary={{ label: "Get Started", to: "/signup" }}
                secondary={{ label: "Learn About Security", to: "/security" }}
            />
        </div>
    );
}
