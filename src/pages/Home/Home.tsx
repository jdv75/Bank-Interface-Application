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

import AccountSummaryCard from "../../components/AccountSummaryCard/AccountSummaryCard";
import NewAccountForm from "../../components/NewAccountForm/NewAccountForm";
import TransactionItem from "../../components/TransactionItem/TransactionItem";
import { bankService, type TransactionsByType } from "../../services/bankService";
import type { Account, Transaction, TransactionType, User } from "../../types/bank";
import "./Home.css";
import TransactionList from "../../components/TransactionList/TransactionList";

type HomeData = {
    user: User;
    accounts: Account[];
    transactionsByType: TransactionsByType;
};

<<<<<<< HEAD
type RecentColumn = {
    title: string;
    tone: string;
    icon: LucideIcon;
    type: TransactionType;
};

type QuickAction = {
    tone: string;
    icon: LucideIcon;
    title: string;
    detail: string;
};

const recentColumns: RecentColumn[] = [
    { title: "Deposits", tone: "deposits", icon: ArrowDownToLine, type: "deposit" },
    { title: "Withdrawals", tone: "withdrawals", icon: ArrowUpFromLine, type: "withdraw" },
    { title: "Transfers", tone: "transfers", icon: ArrowLeftRight, type: "transfer" }
];
=======

>>>>>>> 387215c (feat: add transactions list component)

const quickActions: QuickAction[] = [
    { tone: "deposit", icon: ArrowDownToLine, title: "Deposit", detail: "Add money to your account" },
    { tone: "withdraw", icon: ArrowUpFromLine, title: "Withdraw", detail: "Take money from your account" },
    { tone: "transfer", icon: ArrowLeftRight, title: "Transfer", detail: "Send money between accounts" }
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
            <button className="dash-account-arrow" type="button" aria-label={action.title}>
                <ChevronRight />
            </button>
        </article>
    );
}

function RecentColumnCard({ column, transactions }: { column: RecentColumn; transactions: Transaction[]; }) {
    const ColumnIcon = column.icon;

    return (
        <div className={`recent-column ${column.tone}`}>
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
                {transactions.map((transaction) => (
                    <TransactionItem key={transaction.id} transaction={transaction} />
                ))}
            </ul>
        </div>
    );
}

function Home() {
    const [showNewAccount, setShowNewAccount] = useState(false);
    const [data, setData] = useState<HomeData | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function loadData() {
            const [user, accounts, transactionsByType] = await Promise.all([
                bankService.getCurrentUser(),
                bankService.getAccounts(),
                bankService.getTransactionsByType()
            ]);

            if (!cancelled) {
                setData({ user, accounts, transactionsByType });
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
                    <span>{today}</span>
                    <button type="button">
                        This Month
                        <ChevronDown />
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
<<<<<<< HEAD

            <section className="recent-section">
                <div className="recent-header">
                    <h2>Recent Transactions</h2>
                    <a href="/transactions">View All Transactions →</a>
                </div>

                <div className="recent">
                    <div className="recent-grid">
                        {recentColumns.map((column) => (
                            <RecentColumnCard
                                key={column.title}
                                column={column}
                                transactions={data.transactionsByType[column.type]}
                            />
                        ))}
                    </div>
                </div>
            </section>
=======
            <TransactionList />
>>>>>>> 387215c (feat: add transactions list component)
        </section>
    );
}

export default Home;
