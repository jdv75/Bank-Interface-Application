import { useState } from "react";
import type { FormEvent } from "react";
import "./DepositWithdrawForm.css";
import AccountSelect from "../AccountSelect/AccountSelect";
import { getAccounts, deposit, withdraw, addTransaction } from "../../services/transactionService";

export type TransactionType = "deposit" | "withdrawal";

// export interface Account {
//     id: string;
//     name: string;
//     last4: string;
//     balance: number;
// }

// interface DepositWithdrawFormProps {
//     type: TransactionType;
// }

const CONFIG = {
    deposit: {
        title: "Deposit Details",
        amountLabel: "Deposit Amount",
        methodLabel: "Deposit Method",
        submitLabel: "Deposit Funds"
        // methods: [
        //     { id: "bank", label: "Bank Transfer", description: "From an external bank account", icon: Landmark },
        //     { id: "card", label: "Debit Card", description: "Use a linked debit card", icon: CreditCard },
        // ],
    },
    withdrawal: {
        title: "Withdrawal Details",
        amountLabel: "Withdrawal Amount",
        methodLabel: "Withdrawal Method",
        submitLabel: "Withdraw Funds"
        // methods: [
        //     { id: "bank", label: "Bank Transfer", description: "To an external bank account", icon: Landmark },
        //     { id: "card", label: "Debit Card", description: "To a linked debit card", icon: CreditCard },
        // ],
    }
} as const;

function DepositWithdrawForm({ type }: { type: TransactionType }) {
    const accounts = getAccounts();
    const [accountId, setAccountId] = useState(accounts[0]?.id ?? "");
    const config = CONFIG[type];
    const [amount, setAmount] = useState("");
    const [submit, setSubmit] = useState(false);
    const [result, setResult] = useState("");
    const [showResult, setShowResult] = useState(false);
    const [error, setError] = useState("");
    // const [method, setMethod] = useState<string>(config.methods[0].id);


    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (submit) {
            return;
        }
        
        setSubmit(true);
        setShowResult(false);
        setTimeout(() => { // delay to show off loading state
            try {
            
            const parsedAmount = Number.parseFloat(amount);

            if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
                throw Error("Please enter a valid numerical amount greater than zero.");
            }

            // Check if amount contains more than two decimal points
            const regex = /^\d+(\.\d{3,})$/;
            if (regex.test(amount)) {
                throw Error("Amount cannot have more than 2 decimals.");
            }

            if (parsedAmount >= 1000000) {
                throw Error("Transaction amount cannot be $1,000,000 or greater");
            }
            

            if (type === "deposit") {
                deposit(accountId, parsedAmount);
            } else {
                withdraw(accountId, parsedAmount);
            }

            const timestamp = new Date();
            addTransaction(accountId, type, timestamp.toISOString(), Number(parsedAmount.toFixed(2)));
            setResult("success");
        } catch (error) {
            if (error instanceof Error) {
                setResult("failed");
                console.error("An error occurred:", error.message);
                setError("Transaction Failed: " + error.message);
                // alert(`An error occurred: ${error.message}`);
            }

        } finally {
            setShowResult(true);
            setSubmit(false);
        }
        }, 1000);
        
        setError("");
        setAmount("");
    };

    return (
        <form className="dw-form" onSubmit={handleSubmit}>
            <h2 className="dw-title">{config.title}</h2>

            <AccountSelect
                label="Select Account"
                id="dw-account"
                accounts={accounts}
                accountId={accountId}
                onChange={setAccountId}
                showAccountType
            />


            <label className="dw-label" htmlFor="dw-amount">
                {config.amountLabel}
            </label>
            <div className="dw-amount input">
                <input
                    id="dw-amount"
                    type="text"
                    value={amount}
                    placeholder="0.00"
                    required
                    onChange={(e) => setAmount(e.target.value)}
                />
            </div>

            {/* <p className="dw-label">{config.methodLabel}</p>
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
        </div> */}

        <div>
                <button type="button" className="dw-submit" onClick={handleSubmit} disabled={submit}>
                    {submit ? 'Processing...' : config.submitLabel}
                </button>

                <span className="dw-submitResult">
                    {
                        showResult ? result == "success" ? <strong>Transaction Successful!</strong> : <strong className="dw-error">{error}</strong>
                        : null
                    }
                </span>
            </div>


            
        </form>
    );
}

export default DepositWithdrawForm;
