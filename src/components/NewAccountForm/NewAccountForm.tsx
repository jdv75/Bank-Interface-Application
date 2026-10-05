import { useState, type FormEvent } from "react";
import "./NewAccountForm.css";

type NewAccountFormProps = {
    onClose: () => void;
};

function NewAccountForm({ onClose }: NewAccountFormProps) {
    const [accountType, setAccountType] = useState("Checking");
    const [accountName, setAccountName] = useState("");
    const [pin, setPin] = useState("");

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        onClose();
    }

    return (
        <form className="new-account-form" id="new-account-form" onSubmit={handleSubmit}>
            <div className="new-account-form-header">
                <h2>Open a New Account</h2>
                <button type="button" onClick={onClose}>
                    Close
                </button>
            </div>

            <div className="account-type-picker">
                <span>Account type</span>
                <div>
                    {["Checking", "Savings", "Investment"].map((type) => (
                        <button
                            key={type}
                            type="button"
                            className={accountType === type ? `selected ${type.toLowerCase()}` : type.toLowerCase()}
                            onClick={() => setAccountType(type)}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            <label>
                Account name
                <input
                    type="text"
                    value={accountName}
                    onChange={(event) => setAccountName(event.target.value)}
                    placeholder="Everyday checking"
                    required
                />
            </label>

            <label>
                PIN
                <input
                    type="password"
                    inputMode="numeric"
                    autoComplete="new-password"
                    value={pin}
                    onChange={(event) => setPin(event.target.value.replace(/\D/g, "").slice(0, 4))}
                    placeholder="4 digits"
                    minLength={4}
                    maxLength={4}
                    pattern="[0-9]{4}"
                    required
                />
            </label>

            <div className="new-account-form-actions">
                <button type="button" className="cancel" onClick={onClose}>
                    Cancel
                </button>
                <button type="submit">Create account</button>
            </div>
        </form>
    );
}

export default NewAccountForm;
