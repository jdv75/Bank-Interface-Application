import type { ReactNode } from "react";
import "./InfoCards.css";
 
export type CardTone = "blue" | "purple" | "green";
 
interface InfoCardProps {
    icon: ReactNode;
    title: string;
    description: string;
    tone?: CardTone;
}
 
export default function InfoCard({ icon, title, description, tone = "blue" }: InfoCardProps) {
    return (
        <article className="info-card">
            <div className={`info-icon info-icon--${tone}`} aria-hidden="true">
                {icon}
            </div>
            <h3>{title}</h3>
            <p>{description}</p>
        </article>
    );
}
