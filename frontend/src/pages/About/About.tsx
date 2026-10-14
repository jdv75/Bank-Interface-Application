import { Sparkles, ShieldCheck, Eye, Users } from "lucide-react";
import PageHero from "../../components/LandingPageHero/PageHero";
import InfoCard from "../../components/InfoCards/InfoCards";
import CallToAction from "../../components/CallToAction/CallToAction";
import "./About.css";
 
const ICON = { size: 28, strokeWidth: 1.75 };
 
// TODO: replace the story and values with your own
const VALUES = [
    {
        title: "Simplicity",
        description: "Banking should be clear. We cut the clutter so you can see what matters.",
        icon: <Sparkles {...ICON} />,
        tone: "blue" as const,
    },
    {
        title: "Security First",
        description: "Protecting your money and your information comes before every new feature.",
        icon: <ShieldCheck {...ICON} />,
        tone: "purple" as const,
    },
    {
        title: "Transparency",
        description: "No surprises. You always know where your money is and what is happening to it.",
        icon: <Eye {...ICON} />,
        tone: "green" as const,
    },
    {
        title: "Built for Everyone",
        description: "A modern experience that is easy to use, whatever your experience with money.",
        icon: <Users {...ICON} />,
        tone: "blue" as const,
    },
];
 
export default function About() {
    return (
        <div className="about-page">
            <PageHero
                eyebrow="About NeuroBank"
                title="Banking built for the"
                accent="way you live."
                subtitle="We started NeuroBank to make everyday banking simple, secure, and modern for everyone."
            />
 
            <section className="page-section">
                <div className="page-section__inner about-split">
                    <div className="about-story">
                        <h2 className="section-title">Our story</h2>
                        <p>
                            Managing money has too often meant confusing screens, hidden details, and
                            tools that feel decades old. NeuroBank was created to change that.
                        </p>
                        <p>
                            We bring your accounts, transfers, and spending insights into a single,
                            clean experience, so you can spend less time figuring out your finances
                            and more time acting on them.
                        </p>
                        <p>
                            Every decision we make starts with one question: does this make banking
                            simpler and safer for the people who use it?
                        </p>
                    </div>
 
                    <aside className="mission-card">
                        <p className="mission-card__label">Our mission</p>
                        <p className="mission-card__text">
                            Give everyone a simple, secure, and modern way to manage their money
                            and take control of their financial future.
                        </p>
                    </aside>
                </div>
            </section>
 
            <section className="page-section">
                <div className="page-section__inner">
                    <h2 className="section-title">What we believe</h2>
                    <p className="section-lead">
                        These principles guide how we design, build, and support NeuroBank.
                    </p>
                    <div className="card-grid">
                        {VALUES.map((value) => (
                            <InfoCard
                                key={value.title}
                                icon={value.icon}
                                title={value.title}
                                description={value.description}
                                tone={value.tone}
                            />
                        ))}
                    </div>
                </div>
            </section>
 
            <CallToAction
                title="Join us on the journey"
                text="See what smarter banking feels like, or get in touch with the team."
                primary={{ label: "Get Started", to: "/signup" }}
                secondary={{ label: "Contact Us", to: "/contact" }}
            />
        </div>
    );
}
