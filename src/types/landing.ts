export type CardTone = "blue" | "purple" | "green";

export interface CardProps {
    title: string;
    icon: React.ReactNode;
    tone: CardTone;
    description: string;
}

export interface PageHeroProps {
    eyebrow: string;
    title: string;
    accent?: string;
    subtitle: string;
}

export interface CtaLink {
    label: string;
    to: string;
}
 
export interface CallToActionProps {
    title: string;
    text: string;
    primary: CtaLink;
    secondary?: CtaLink;
}
