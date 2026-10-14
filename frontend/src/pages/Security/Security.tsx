import type { ReactNode } from "react";
import {
    Lock,
    KeyRound,
    Activity,
    EyeOff,
    ShieldAlert,
    SlidersHorizontal,
    Check,
} from "lucide-react";
import PageHero from "../../components/LandingPageHero/PageHero";
import InfoCard from "../../components/InfoCards/InfoCards";
import CallToAction from "../../components/CallToAction/CallToAction";
import { CardProps } from "../../types/landing";
import "./Security.css";
 
const ICON = { size: 26, strokeWidth: 1.75 };
 
// TODO: make sure every claim here is true for your app before you ship it
const PILLARS: CardProps[] = [
    {
        title: "Encrypted Connections",
        description: "Data traveling between your device and NeuroBank is protected with industry-standard encryption.",
        icon: <Lock {...ICON} />,
        tone: "blue",
    },
    {
        title: "Secure Sign-In",
        description: "Passwords are never stored in plain text, and sessions are protected against takeover.",
        icon: <KeyRound {...ICON} />,
        tone: "purple",
    },
    {
        title: "Activity Monitoring",
        description: "Unusual sign-ins and transactions are flagged so problems are caught early.",
        icon: <Activity {...ICON} />,
        tone: "green",
    },
    {
        title: "Privacy by Design",
        description: "We collect only what we need to run your account and never sell your personal data.",
        icon: <EyeOff {...ICON} />,
        tone: "blue",
    },
    {
        title: "Fraud Protection",
        description: "Alerts and account controls help you react quickly if something does not look right.",
        icon: <ShieldAlert {...ICON} />,
        tone: "purple",
    },
    {
        title: "You Stay in Control",
        description: "Review activity, manage your profile, and update your security settings at any time.",
        icon: <SlidersHorizontal {...ICON} />,
        tone: "green",
    },
];
 
const TIPS = [
    "Use a strong, unique password that you do not use anywhere else.",
    "Never share your password or one-time codes. NeuroBank will never ask for them.",
    "Check your recent transactions regularly and report anything unfamiliar.",
    "Log out when you use a shared or public device.",
];
 
export default function Security() {
    return (
        <div className="security-page">
            <PageHero
                eyebrow="Security"
                title="Your money, protected by"
                accent="design."
                subtitle="Security is built into every part of NeuroBank, from how you sign in to how your information is stored and shared."
            />
 
            <section className="page-section">
                <div className="page-section__inner">
                    <div className="card-grid">
                        {PILLARS.map((pillar) => (
                            <InfoCard
                                key={pillar.title}
                                icon={pillar.icon}
                                title={pillar.title}
                                description={pillar.description}
                                tone={pillar.tone}
                            />
                        ))}
                    </div>
                </div>
            </section>
 
            <section className="page-section">
                <div className="page-section__inner security-split">
                    <div>
                        <h2 className="section-title">Staying safe is a team effort</h2>
                        <p className="section-lead security-lead">
                            We protect your account on our side. A few simple habits on yours make it
                            even stronger.
                        </p>
                    </div>
 
                    <ul className="tips">
                        {TIPS.map((tip) => (
                            <li className="tip" key={tip}>
                                <span className="tip__check" aria-hidden="true">
                                    <Check size={18} strokeWidth={2.5} />
                                </span>
                                <span>{tip}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
 
            <CallToAction
                title="Bank with confidence"
                text="Open an account today, or reach out if you have questions about how we keep you safe."
                primary={{ label: "Get Started", to: "/signup" }}
                secondary={{ label: "Contact Us", to: "/contact" }}
            />
        </div>
    );
}
