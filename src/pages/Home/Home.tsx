import {
    ArrowDownToLine,
    ArrowLeftRight,
    ArrowUpFromLine,
    ChevronDown,
    ChevronRight,
    Plus,
    type LucideIcon
} from "lucide-react";
import { useEffect, useState, type KeyboardEvent } from "react";
import { Link } from "react-router-dom";

import AccountSummaryCard from "../../components/AccountSummaryCard/AccountSummaryCard";
import NewAccountForm from "../../components/NewAccountForm/NewAccountForm";
import TransactionList from "../../components/TransactionList/TransactionList";
import { useTransactions } from "../../hooks/useTransactions";
import { bankService } from "../../services/bankService";
import { MOCK_ACCOUNT_ID } from "../../services/transactionService";
import type { Account, User } from "../../types/bank";
import "./Home.css";

type HomeData = {
    user: User;
    accounts: Account[];
};

type QuickAction = {
    tone: string;
    icon: LucideIcon;
    title: string;
    detail: string;
    to: string;
};

const quickActions: QuickAction[] = [
    { tone: "deposit", icon: ArrowDownToLine, title: "Deposit", detail: "Add money to your account", to: "/deposit" },
    { tone: "withdraw", icon: ArrowUpFromLine, title: "Withdraw", detail: "Take money from your account", to: "/withdraw" },
    { tone: "transfer", icon: ArrowLeftRight, title: "Transfer", detail: "Send money between accounts", to: "/transfer" }
];

function NewAccountCard({ onOpen }: { onOpen: () => void }) {
    function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onOpen();
        }
    }

    return (
        <article
            className="dash-account new-account"
            role="button"
            tabIndex={0}
            onClick={onOpen}
            onKeyDown={handleKeyDown}
        >
            <div className="new-account-icon">
                <Plus />
            </div>
            <div className="info">
                <h3>Open a New Account</h3>
                <span>Checking, Savings, or Investment account.</span>
            </div>
        </article>
    );
}

function QuickActionCard({ action }: { action: QuickAction }) {
    const Icon = action.icon;

    return (
        <article className={`quick-action ${action.tone}`}>
            <div className="quick-action-icon">
                <Icon />
            </div>
            <div className="info">
                <h3>{action.title}</h3>
                <span>{action.detail}</span>
            </div>
            <Link className="dash-account-arrow" to={action.to} aria-label={action.title}>
                <ChevronRight />
            </Link>
        </article>
    );
}

function Home() {
    const [showNewAccount, setShowNewAccount] = useState(false);
    const [data, setData] = useState<HomeData | null>(null);
    const recent = useTransactions(MOCK_ACCOUNT_ID, { pageSize: 5 });

    useEffect(() => {
        let cancelled = false;

        async function loadData() {
            const [user, accounts] = await Promise.all([
                bankService.getCurrentUser(),
                bankService.getAccounts()
            ]);

            if (!cancelled) {
                setData({ user, accounts });
            }
        }

        loadData();

        return () => {
            cancelled = true;
        };
    }, []);

    if (!data) {
        return <section className="home">Loading…</section>;
    }

    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric"
    });

    return (
        <section className="home">
            {showNewAccount && <NewAccountForm onClose={() => setShowNewAccount(false)} />}

            <div className="home-header">
                <div>
                    <h1>
                        Welcome back, <span>{data.user.name}!</span>
                    </h1>
                    <p>Here's an overview of your accounts and recent activity.</p>
                </div>

                <div className="home-date">
                    {/* <span>{today}</span> */}
                    <button type="button">
                        {today}
                        {/* <ChevronDown /> */}
                    </button>
                </div>
            </div>

            <div className="accounts-overview">
                {data.accounts.map((account) => (
                    <AccountSummaryCard key={account.id} account={account} />
                ))}
                <NewAccountCard onOpen={() => setShowNewAccount(true)} />
            </div>

            <section className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="quick-actions-grid">
                    {quickActions.map((action) => (
                        <QuickActionCard key={action.title} action={action} />
                    ))}
                </div>
            </section>
            <TransactionList
                title="Recent Transactions"
                accountId={MOCK_ACCOUNT_ID}
                transactions={recent.transactions}
                headerAction={<Link to="/transactions">View All Transactions →</Link>}
            />
        </section>
    );
}

export default Home;
