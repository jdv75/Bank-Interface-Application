import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Mail, Phone, MapPin, Clock, Send, CircleCheck } from "lucide-react";
import PageHero from "../../components/LandingPageHero/PageHero";
import "./Contact.css";
 
interface FormValues {
    name: string;
    email: string;
    topic: string;
    message: string;
}
 
type FormErrors = Partial<Record<keyof FormValues, string>>;
type Status = "idle" | "sending" | "sent";
 
const INITIAL_VALUES: FormValues = { name: "", email: "", topic: "general", message: "" };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 
const TOPICS = [
    { value: "general", label: "General question" },
    { value: "support", label: "Account support" },
    { value: "feedback", label: "Feedback" },
    { value: "partnership", label: "Partnership" },
];
 
// TODO: replace with your real contact details
const CONTACT_ITEMS = [
    { icon: <Mail size={22} />, label: "Email", value: "support@neurobank.com" },
    { icon: <Phone size={22} />, label: "Phone", value: "1-800-555-0100" },
    { icon: <MapPin size={22} />, label: "Address", value: "123 Main Street, New York, NY" },
    { icon: <Clock size={22} />, label: "Hours", value: "Mon to Fri, 9am to 6pm" },
];
 
function validate(values: FormValues): FormErrors {
    const errors: FormErrors = {};
    if (!values.name.trim()) errors.name = "Please enter your name.";
    if (!values.email.trim()) errors.email = "Please enter your email.";
    else if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = "Please enter a valid email address.";
    if (values.message.trim().length < 10) errors.message = "Please write at least 10 characters.";
    return errors;
}
 
export default function Contact() {
    const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
    const [errors, setErrors] = useState<FormErrors>({});
    const [status, setStatus] = useState<Status>("idle");
 
    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setValues((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
        if (status === "sent") setStatus("idle");
    };
 
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
 
        const nextErrors = validate(values);
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) return;
 
        setStatus("sending");
        // TODO: replace this fake delay with a real API call, e.g.
        // await fetch("/api/contact", { method: "POST", body: JSON.stringify(values) });
        await new Promise((resolve) => setTimeout(resolve, 800));
 
        setValues(INITIAL_VALUES);
        setStatus("sent");
    };
 
    return (
        <div className="contact-page">
            <PageHero
                eyebrow="Contact"
                title="We would love to"
                accent="hear from you."
                subtitle="Questions, feedback, or need a hand with your account? Send us a message and we will get back to you."
            />
 
            <section className="page-section contact-section">
                <div className="page-section__inner contact-grid">
                    <ul className="contact-info">
                        {CONTACT_ITEMS.map((item) => (
                            <li className="contact-item" key={item.label}>
                                <span className="contact-item__icon" aria-hidden="true">{item.icon}</span>
                                <div>
                                    <p className="contact-item__label">{item.label}</p>
                                    <p className="contact-item__value">{item.value}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
 
                    <div className="contact-card">
                        <h2 className="contact-card__title">Send us a message</h2>
                        <p className="contact-card__intro">
                            Fill out the form and we will get back to you.
                        </p>
 
                        {status === "sent" && (
                            <div className="form-success" role="status">
                                <CircleCheck size={22} aria-hidden="true" />
                                <span>Thanks! Your message has been sent. We will reply soon.</span>
                            </div>
                        )}
 
                        <form onSubmit={handleSubmit} noValidate>
                            <div className="form-row">
                                <div className="field">
                                    <label htmlFor="name">Name</label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        autoComplete="name"
                                        placeholder="Jane Doe"
                                        value={values.name}
                                        onChange={handleChange}
                                        aria-invalid={Boolean(errors.name)}
                                        aria-describedby={errors.name ? "name-error" : undefined}
                                    />
                                    {errors.name && <p className="field-error" id="name-error">{errors.name}</p>}
                                </div>
 
                                <div className="field">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        placeholder="you@example.com"
                                        value={values.email}
                                        onChange={handleChange}
                                        aria-invalid={Boolean(errors.email)}
                                        aria-describedby={errors.email ? "email-error" : undefined}
                                    />
                                    {errors.email && <p className="field-error" id="email-error">{errors.email}</p>}
                                </div>
                            </div>
 
                            <div className="field">
                                <label htmlFor="topic">Topic</label>
                                <select id="topic" name="topic" value={values.topic} onChange={handleChange}>
                                    {TOPICS.map((topic) => (
                                        <option key={topic.value} value={topic.value}>
                                            {topic.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
 
                            <div className="field">
                                <label htmlFor="message">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={6}
                                    placeholder="How can we help?"
                                    value={values.message}
                                    onChange={handleChange}
                                    aria-invalid={Boolean(errors.message)}
                                    aria-describedby={errors.message ? "message-error" : undefined}
                                />
                                {errors.message && <p className="field-error" id="message-error">{errors.message}</p>}
                            </div>
 
                            <button type="submit" className="btn btn-primary btn-lg" disabled={status === "sending"}>
                                {status === "sending" ? "Sending..." : "Send Message"}
                                <Send size={20} aria-hidden="true" />
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
}
