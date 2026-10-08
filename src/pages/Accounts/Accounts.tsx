import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

import AccountDetailCard from "../../components/AccountDetailCard/AccountDetailCard";
import ActivityItem from "../../components/ActivityItem/ActivityItem";
import NewAccountForm from "../../components/NewAccountForm/NewAccountForm";
import { bankService } from "../../services/bankService";
import type { Account, Transaction } from "../../types/bank";
import { accountColors } from "../../utils/accountDetails";
import { formatCurrency } from "../../utils/format";
import "./Accounts.css";

type AccountsData = {
    accounts: Account[];
    activity: Transaction[];
};

type AccountShare = {
    account: Account;
    percent: number;
};

function getTotalBalance(accounts: Account[]): number {
    return accounts.reduce((total, account) => total + account.balance, 0);
}

function getAccountShares(accounts: Account[], total: number): AccountShare[] {
    return accounts.map((account) => ({
        account,
        percent: total === 0 ? 0 : (account.balance / total) * 100
    }));
}

function buildDonutGradient(shares: AccountShare[]): string {
    const stops: string[] = [];
    let start = 0;

    for (const share of shares) {
        const end = start + share.percent;
        const color = accountColors[share.account.type];

        stops.push(`${color} ${start}% ${end}%`);
        start = end;
    }

    return `conic-gradient(${stops.join(", ")})`;
}

function ActivityPanel({ activity }: { activity: Transaction[] }) {
    return (
        <section className="account-panel activity">
            <div className="panel-header">
                <h2>Account Activity</h2>
                <a href="/transactions">View All Transactions →</a>
            </div>

            <ul>
                {activity.map((transaction) => (
                    <ActivityItem key={transaction.id} transaction={transaction} />
                ))}
            </ul>
        </section>
    );
}

function SummaryPanel({ shares, total }: { shares: AccountShare[]; total: number }) {
    return (
        <section className="account-panel summary">
            <h2>Account Summary</h2>

            <div className="summary-body">
                <div
                    className="donut"
                    aria-hidden="true"
                    style={{ background: buildDonutGradient(shares) }}
                >
                    <div className="donut-hole">
                        <strong>{formatCurrency(total)}</strong>
                        <span>Total Balance</span>
                    </div>
                </div>

                <ul className="summary-legend">
                    {shares.map(({ account, percent }) => (
                        <li key={account.id}>
                            <span className={`dot ${account.type}`} />
                            <span>{account.name.replace(" Account", "")}</span>
                            <strong>{formatCurrency(account.balance)}</strong>
                            <em>{percent.toFixed(1)}%</em>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}


function Accounts() {
    const [showNewAccount, setShowNewAccount] = useState(false);
    const [data, setData] = useState<AccountsData | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function loadData() {
            const [accounts, activity] = await Promise.all([
                bankService.getAccounts(),
                bankService.getRecentTransactions(5)
            ]);

            if (!cancelled) {
                setData({ accounts, activity });
            }
        }

        loadData();

        return () => {
            cancelled = true;
        };
    }, []);

    if (!data) {
        return <div className="accounts-page">Loading…</div>;
    }

    const total = getTotalBalance(data.accounts);
    const shares = getAccountShares(data.accounts, total);

    async function handleDelete(accountId: string) {
        if(!confirm("Delete this account? This cannot be undone.")) return;
        await bankService.deleteAccount(accountId);
        const [accounts, activity] = await Promise.all([
            bankService.getAccounts(),
            bankService.getRecentTransactions(5)
        ]);
        setData({accounts, activity});
    }

    return (
        <div className="accounts-page">
            {showNewAccount && (
                <NewAccountForm onClose={() => setShowNewAccount(false)} 
                    onCreated={async () => {
                        const [accounts, activity] = await Promise.all([
                            bankService.getAccounts(),
                            bankService.getRecentTransactions(5)
                        ]);
                        setData({accounts, activity});
                    }}
                />
            )}

            <div className="accounts-header">
                <div>
                    <h1>Accounts</h1>
                    <p>Manage your accounts, view balances, and account details.</p>
                </div>

                <button
                    className="new-account-button"
                    type="button"
                    onClick={() => setShowNewAccount(true)}
                >
                    <Plus />
                    Open a New Account
                </button>
            </div>

            <div className="accounts-grid">
                {data.accounts.map((account) => (
                    <AccountDetailCard key={account.id} account={account} onDelete={handleDelete}/>
                ))}
            </div>

            <div className="accounts-bottom">
                <ActivityPanel activity={data.activity} />
                <SummaryPanel shares={shares} total={total} />
            </div>
        </div>
    );
}

export default Accounts;
