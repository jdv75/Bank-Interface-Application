import { useState } from "react";
import type { FormEvent } from "react";
import { ChevronDown, CreditCard, Landmark } from "lucide-react";
import "./DepositWithdrawForm.css";

export type TransactionType = "deposit" | "withdraw";

export interface Account {
    id: string;
    name: string;
    last4: string;
    balance: number;
}

export interface TransactionSubmission {
    accountId: string;
    amount: number;
    method: string;
}

interface DepositWithdrawFormProps {
    type: TransactionType;
}

const QUICK_AMOUNTS = [50, 100, 250, 500];

const CONFIG = {
    deposit: {
        title: "Deposit Details",
        amountLabel: "Deposit Amount",
        methodLabel: "Deposit Method",
        submitLabel: "Deposit Funds",
        methods: [
            { id: "bank", label: "Bank Transfer", description: "From an external bank account", icon: Landmark },
            { id: "card", label: "Debit Card", description: "Use a linked debit card", icon: CreditCard },
        ],
    },
    withdraw: {
        title: "Withdrawal Details",
        amountLabel: "Withdrawal Amount",
        methodLabel: "Withdrawal Method",
        submitLabel: "Withdraw Funds",
        methods: [
            { id: "bank", label: "Bank Transfer", description: "To an external bank account", icon: Landmark },
            { id: "card", label: "Debit Card", description: "To a linked debit card", icon: CreditCard },
        ],
    },
} as const;

const formatCurrency = (value: number) =>
    value.toLocaleString("en-US", { style: "currency", currency: "USD" });

function DepositWithdrawForm({ type }: DepositWithdrawFormProps) {
    const config = CONFIG[type];
    const [amount, setAmount] = useState("");
    const [method, setMethod] = useState<string>(config.methods[0].id);
    const [error, setError] = useState("");


    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const value = parseFloat(amount);


        setError("");
        setAmount("");
    };

    return (
        <form className="dw-form" onSubmit={handleSubmit}>
            <h2 className="dw-title">{config.title}</h2>

            <label className="dw-label" htmlFor="dw-account">Select Account</label>
            <div className="dw-select">
                <div className="dw-select-icon"><CreditCard size={20} /></div>
                
                <ChevronDown size={18} className="dw-select-chevron" />
                
            </div>


            {config.amountLabel}
            <label className="dw-label" htmlFor="dw-amount">
                
                <div className="dw-amount input">
                    <input
                    type="text"
                    placeholder="0.00"
                    required
                    />
                </div>
            </label>

            {config.methodLabel}
            <div className="dw-methods" role="radiogroup" aria-label={config.methodLabel}>
                <label className={`dw-method ${method === "bank" ? "selected" : ""}`}>
                    <input
                        type="radio"
                        name="method"
                        value="bank"
                        checked={method === "bank"}
                        onChange={() => setMethod("bank")}
                    />
                    <span className="dw-radio" />
                    <span className="dw-method-text">
                        <strong>{config.methods[0].label}</strong>
                        <small>{config.methods[0].description}</small>
                    </span>
                </label>

                <label className={`dw-method ${method === "card" ? "selected" : ""}`}>
                    <input
                        type="radio"
                        name="method"
                        value="card"
                        checked={method === "card"}
                        onChange={() => setMethod("card")}
                    />
                    <span className="dw-radio" />
                    <span className="dw-method-text">
                        <strong>{config.methods[1].label}</strong>
                        <small>{config.methods[1].description}</small>
                    </span>
                </label>
        </div>

        <div>
                <button type="button" className="dw-submit">
                    Deposit Funds
                </button>
            </div>


            
        </form>
    );
}

export default DepositWithdrawForm;
