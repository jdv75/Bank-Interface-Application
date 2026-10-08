import "./PageHero.css";
import { PageHeroProps } from "../../types/landing";
 
export default function PageHero({ eyebrow, title, accent, subtitle }: PageHeroProps) {
    return (
        <section className="page-hero">
            <div className="page-hero__inner">
                <p className="page-eyebrow">{eyebrow}</p>
                <h1 className="page-title">
                    {title}
                    {accent && (
                        <>
                            {" "}
                            <span className="accent-text">{accent}</span>
                        </>
                    )}
                </h1>
                <p className="page-subtitle">{subtitle}</p>
            </div>
        </section>
    );
}
