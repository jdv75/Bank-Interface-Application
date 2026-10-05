import {
    ArrowDownToLine,
    ArrowLeft,
    ArrowLeftRight,
    ArrowRight,
    ArrowUpFromLine,
    Banknote,
    Camera,
    ChartColumn,
    ChevronDown,
    ChevronRight,
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
import "./Home.css";

type Transaction = {
    icon: LucideIcon;
    name: string;
    detail: string;
    amount: string;
    positive: boolean;
};

const recentColumns: {
    title: string;
    tone: string;
    icon: LucideIcon;
    items: Transaction[];
}[] = [
    {
        title: "Deposits",
        tone: "deposits",
        icon: ArrowDownToLine,
        items: [
            { icon: Landmark, name: "Direct Deposit", detail: "Mar 24, 2024, 9:00 AM", amount: "+$1,200.00", positive: true },
            { icon: Camera, name: "Mobile Check Deposit", detail: "Mar 20, 2024, 2:15 PM", amount: "+$350.00", positive: true },
            { icon: ArrowRight, name: "Bank Transfer", detail: "Mar 18, 2024, 11:32 AM", amount: "+$500.00", positive: true },
            { icon: Banknote, name: "Cash Deposit", detail: "Mar 15, 2024, 4:21 PM", amount: "+$200.00", positive: true }
        ]
    },
    {
        title: "Withdrawals",
        tone: "withdrawals",
        icon: ArrowUpFromLine,
        items: [
            { icon: CreditCard, name: "ATM Withdrawal", detail: "Mar 22, 2024, 6:45 PM", amount: "-$100.00", positive: false },
            { icon: ShoppingCart, name: "Grocery Store", detail: "Mar 19, 2024, 1:12 PM", amount: "-$85.23", positive: false },
            { icon: Utensils, name: "Restaurant", detail: "Mar 17, 2024, 7:30 PM", amount: "-$62.50", positive: false },
            { icon: ShoppingBag, name: "Online Purchase", detail: "Mar 14, 2024, 10:05 AM", amount: "-$120.00", positive: false }
        ]
    },
    {
        title: "Transfers",
        tone: "transfers",
        icon: ArrowLeftRight,
        items: [
            { icon: ArrowRight, name: "To Savings", detail: "From Checking • Mar 23, 2024", amount: "-$500.00", positive: false },
            { icon: ArrowRight, name: "To Investment", detail: "From Checking • Mar 20, 2024", amount: "-$300.00", positive: false },
            { icon: ArrowLeft, name: "From Savings", detail: "To Checking • Mar 16, 2024", amount: "+$200.00", positive: true },
            { icon: ArrowRight, name: "To Checking", detail: "From Investment • Mar 12, 2024", amount: "+$400.00", positive: true }
        ]
    }
];

function Home() {
    const [showNewAccount, setShowNewAccount] = useState(false);

    return (
        <section className="home">
            {showNewAccount && (
                <NewAccountForm onClose={() => setShowNewAccount(false)} />
            )}
            <div className="home-header">
                <div>
                    <h1>
                        Welcome back, <span>George!</span>
                    </h1>

                    <p>
                        Here's an overview of your accounts and recent activity.
                    </p>
                </div>

                <div className="home-date">
                    <span>Monday, March 24</span>
                    <button>
                        This Month
                        <ChevronDown />
                    </button>
                </div>
            </div>

            <div className="accounts-overview">
                <article className="dash-account checking">
                    <div className="dash-account-main">
                        <div className="dash-account-top">
                            <div className="dash-account-icon checking">
                                <CreditCard />
                            </div>
                            <div className="info">
                                <h3>Checking Account</h3>
                                <span>**** 0224</span>
                            </div>
                        </div>
                        <strong>$2,431.89</strong>
                    </div>
                    <button className="dash-account-arrow" type="button" aria-label="Open checking account">
                        <ChevronRight />
                    </button>
                </article>
                <article className="dash-account savings">
                    <div className="dash-account-main">
                        <div className="dash-account-top">
                            <div className="dash-account-icon savings">
                                <PiggyBank />
                            </div>
                            <div className="info">
                                <h3>Savings Account</h3>
                                <span>**** 4432</span>
                            </div>
                        </div>
                        <strong>$6,210.45</strong>
                    </div>
                    <button className="dash-account-arrow" type="button" aria-label="Open savings account">
                        <ChevronRight />
                    </button>
                </article>
                <article className="dash-account investment">
                    <div className="dash-account-main">
                        <div className="dash-account-top">
                            <div className="dash-account-icon investment">
                                <ChartColumn />
                            </div>
                            <div className="info">
                                <h3>Investment Account</h3>
                                <span>**** 7789</span>
                            </div>
                        </div>
                        <strong>$12,340.00</strong>
                    </div>
                    <button className="dash-account-arrow" type="button" aria-label="Open investment account">
                        <ChevronRight />
                    </button>
                </article>
                <article
                    className="dash-account new-account"
                    role="button"
                    tabIndex={0}
                    onClick={() => setShowNewAccount(true)}
                    onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            setShowNewAccount(true);
                        }
                    }}
                >
                    <div className="new-account-icon">
                        <Plus />
                    </div>
                    <div className="info">
                        <h3>Open a New Account</h3>
                        <span>Checking, Savings, or Investment account.</span>
                    </div>
                </article>
            </div>

            <section className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="quick-actions-grid">
                    <article className="quick-action deposit">
                        <div className="quick-action-icon">
                            <ArrowDownToLine />
                        </div>
                        <div className="info">
                            <h3>Deposit</h3>
                            <span>Add money to your account</span>
                        </div>
                        <button className="dash-account-arrow" type="button" aria-label="Deposit">
                            <ChevronRight />
                        </button>
                    </article>
                    <article className="quick-action withdraw">
                        <div className="quick-action-icon">
                            <ArrowUpFromLine />
                        </div>
                        <div className="info">
                            <h3>Withdraw</h3>
                            <span>Take money from your account</span>
                        </div>
                        <button className="dash-account-arrow" type="button" aria-label="Withdraw">
                            <ChevronRight />
                        </button>
                    </article>
                    <article className="quick-action transfer">
                        <div className="quick-action-icon">
                            <ArrowLeftRight />
                        </div>
                        <div className="info">
                            <h3>Transfer</h3>
                            <span>Send money between accounts</span>
                        </div>
                        <button className="dash-account-arrow" type="button" aria-label="Transfer">
                            <ChevronRight />
                        </button>
                    </article>
                </div>
            </section>

            <section className="recent-section">
                <div className="recent-header">
                    <h2>Recent Transactions</h2>
                    <a href="/transactions">View All Transactions →</a>
                </div>
                <div className="recent">
                    <div className="recent-grid">
                        {recentColumns.map((column) => {
                            const ColumnIcon = column.icon;

                            return (
                                <div className={`recent-column ${column.tone}`} key={column.title}>
                                    <div className="recent-column-header">
                                        <div className="recent-column-title">
                                            <div className="column-icon">
                                                <ColumnIcon />
                                            </div>
                                            <h3>{column.title}</h3>
                                        </div>
                                        <a href="/transactions">See all</a>
                                    </div>
                                    <ul>
                                        {column.items.map((item) => {
                                            const ItemIcon = item.icon;

                                            return (
                                                <li className="transaction" key={item.name}>
                                                    <div className="transaction-icon">
                                                        <ItemIcon />
                                                    </div>
                                                    <div className="transaction-info">
                                                        <strong>{item.name}</strong>
                                                        <span>{item.detail}</span>
                                                    </div>
                                                    <span className={item.positive ? "positive" : "negative"}>
                                                        {item.amount}
                                                    </span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </section>
    );
}

export default Home;