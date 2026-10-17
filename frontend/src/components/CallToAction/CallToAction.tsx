import { MoveRight } from "lucide-react";
import { NavLink } from "react-router-dom";
import { CallToActionProps, CtaLink } from "../../types/landing";
import "./CallToAction.css";
 

 
export default function CallToAction({ title, text, primary, secondary }: CallToActionProps) {
    return (
        <section className="cta">
            <div className="cta__panel">
                <h2 className="cta__title">{title}</h2>
                <p className="cta__text">{text}</p>
                <div className="cta__actions">
                    <NavLink to={primary.to} className="btn btn-primary btn-lg">
                        {primary.label} <MoveRight size={22} aria-hidden="true" />
                    </NavLink>
                    {secondary && (
                        <NavLink to={secondary.to} className="btn btn-outline btn-lg">
                            {secondary.label}
                        </NavLink>
                    )}
                </div>
            </div>
        </section>
    );
}
