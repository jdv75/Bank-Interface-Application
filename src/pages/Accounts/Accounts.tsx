import {
    ArrowRight,
    ChartColumn,
    ChevronRight,
    Copy,
    CreditCard,
    Landmark,
    PiggyBank,
    Plus,
    ShoppingBag,
    ShoppingCart,
    Utensils,
    type LucideIcon
} from "lucide-react";
import { useState } from "react";
import NewAccountForm from "../../components/NewAccountForm/NewAccountForm";
import "./Accounts.css";

const activity: {
    icon: LucideIcon;
    name: string;
    detail: string;
    amount: string;
    positive: boolean;
}[] = [
    { icon: ShoppingCart, name: "Grocery Store", detail: "Mar 24, 2024, 2:17 PM", amount: "-$85.23", positive: false },
    { icon: Landmark, name: "Direct Deposit", detail: "Mar 22, 2024, 9:00 AM", amount: "+$1,200.00", positive: true },
    { icon: Utensils, name: "Restaurant", detail: "Mar 20, 2024, 7:30 PM", amount: "-$62.50", positive: false },
    { icon: ArrowRight, name: "Transfer to Savings", detail: "Mar 18, 2024, 11:32 AM", amount: "-$500.00", positive: false },
    { icon: ShoppingBag, name: "Online Purchase", detail: "Mar 16, 2024, 4:21 PM", amount: "-$120.00", positive: false }
];

function Accounts() {
    const [showNewAccount, setShowNewAccount] = useState(false);

    return (
        <div className="accounts-page">
            {showNewAccount && (
                <NewAccountForm onClose={() => setShowNewAccount(false)} />
            )}
            <div className="accounts-header">
                <div>
                    <h1>Accounts</h1>
                    <p>Manage your accounts, view balances, and account details.</p>
                </div>
                <button className="new-account-button" type="button" onClick={() => setShowNewAccount(true)}>
                    <Plus />
                    Open a New Account
                </button>
            </div>

            <div className="accounts-grid">
                <article className="account-card checking">
                    <div className="account-card-top">
                        <div className="account-card-main">
                            <div className="account-identity">
                                <div className="account-icon">
                                    <CreditCard />
                                </div>
                                <div>
                                    <h3>Checking Account</h3>
                                    <span>**** 0224</span>
                                </div>
                            </div>
                            <strong className="account-balance">$2,431.89</strong>
                        </div>
                        <button className="account-arrow" type="button" aria-label="Open checking account">
                            <ChevronRight />
                        </button>
                    </div>
                    <div className="account-details">
                        <div>
                            <span>Available Balance</span>
                            <strong>$2,431.89</strong>
                        </div>
                        <div>
                            <span>Account Type</span>
                            <strong>Checking</strong>
                        </div>
                        <div>
                            <span>Routing Number</span>
                            <strong>021000021</strong>
                        </div>
                        <div>
                            <span>Account Number</span>
                            <strong>
                                **** 0224
                                <button type="button" aria-label="Copy checking account number">
                                    <Copy />
                                </button>
                            </strong>
                        </div>
                    </div>
                </article>

                <article className="account-card savings">
                    <div className="account-card-top">
                        <div className="account-card-main">
                            <div className="account-identity">
                                <div className="account-icon">
                                    <PiggyBank />
                                </div>
                                <div>
                                    <h3>Savings Account</h3>
                                    <span>**** 4432</span>
                                </div>
                            </div>
                            <strong className="account-balance">$6,210.45</strong>
                        </div>
                        <button className="account-arrow" type="button" aria-label="Open savings account">
                            <ChevronRight />
                        </button>
                    </div>
                    <div className="account-details">
                        <div>
                            <span>Available Balance</span>
                            <strong>$6,210.45</strong>
                        </div>
                        <div>
                            <span>Account Type</span>
                            <strong>Savings</strong>
                        </div>
                        <div>
                            <span>Interest Rate</span>
                            <strong>4.00% APY</strong>
                        </div>
                        <div>
                            <span>Account Number</span>
                            <strong>
                                **** 4432
                                <button type="button" aria-label="Copy savings account number">
                                    <Copy />
                                </button>
                            </strong>
                        </div>
                    </div>
                </article>

                <article className="account-card investment">
                    <div className="account-card-top">
                        <div className="account-card-main">
                            <div className="account-identity">
                                <div className="account-icon">
                                    <ChartColumn />
                                </div>
                                <div>
                                    <h3>Investment Account</h3>
                                    <span>**** 7789</span>
                                </div>
                            </div>
                            <strong className="account-balance">$12,340.00</strong>
                        </div>
                        <button className="account-arrow" type="button" aria-label="Open investment account">
                            <ChevronRight />
                        </button>
                    </div>
                    <div className="account-details">
                        <div>
                            <span>Total Balance</span>
                            <strong>$12,340.00</strong>
                        </div>
                        <div>
                            <span>Account Type</span>
                            <strong>Investment</strong>
                        </div>
                        <div>
                            <span>YTD Return</span>
                            <strong className="positive">+8.25%</strong>
                        </div>
                        <div>
                            <span>Account Number</span>
                            <strong>
                                **** 7789
                                <button type="button" aria-label="Copy investment account number">
                                    <Copy />
                                </button>
                            </strong>
                        </div>
                    </div>
                </article>
            </div>

            <div className="accounts-bottom">
                <section className="account-panel activity">
                    <div className="panel-header">
                        <h2>Account Activity</h2>
                        <a href="/transactions">View All Transactions →</a>
                    </div>
                    <ul>
                        {activity.map((item) => {
                            const Icon = item.icon;

                            return (
                                <li key={item.name}>
                                    <div className="activity-icon">
                                        <Icon />
                                    </div>
                                    <div>
                                        <strong>{item.name}</strong>
                                        <span>{item.detail}</span>
                                    </div>
                                    <em className={item.positive ? "positive" : "negative"}>{item.amount}</em>
                                </li>
                            );
                        })}
                    </ul>
                </section>

                <section className="account-panel summary">
                    <h2>Account Summary</h2>
                    <div className="summary-body">
                        <div className="donut" aria-hidden="true">
                            <div className="donut-hole">
                                <strong>$21,000.34</strong>
                                <span>Total Balance</span>
                            </div>
                        </div>
                        <ul className="summary-legend">
                            <li>
                                <span className="dot checking" />
                                <span>Checking</span>
                                <strong>$2,431.89</strong>
                                <em>11.6%</em>
                            </li>
                            <li>
                                <span className="dot savings" />
                                <span>Savings</span>
                                <strong>$6,210.45</strong>
                                <em>29.6%</em>
                            </li>
                            <li>
                                <span className="dot investment" />
                                <span>Investment</span>
                                <strong>$12,340.00</strong>
                                <em>58.8%</em>
                            </li>
                        </ul>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Accounts;
