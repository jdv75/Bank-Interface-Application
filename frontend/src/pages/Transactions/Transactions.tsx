import { useEffect, useState, type ChangeEvent } from "react";
import { useSearchParams } from "react-router-dom";
import AccountSelect from "../../components/AccountSelect/AccountSelect";
import Pagination from "../../components/Pagination/Pagination";
import TransactionList from "../../components/TransactionList/TransactionList";
import { useTransactions } from "../../hooks/useTransactions";
import { bankService } from "../../services/bankService";
import type { Account, TransactionType } from "../../types/bank";
import "./Transactions.css";

const PAGE_SIZE = 10;

type TypeFilter = TransactionType | "";

function Transactions() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [accountId, setAccountId] = useState("");
    const [accountsError, setAccountsError] = useState("");
    const [type, setType] = useState<TypeFilter>("");
    const page = Math.max(1, Number(searchParams.get("page")) || 1);

    // Load the logged-in user's accounts and select the first one
    useEffect(() => {
        bankService
            .getAccounts()
            .then((nextAccounts) => {
                setAccounts(nextAccounts);
                setAccountId((current) => current || nextAccounts[0]?.id || "");
            })
            .catch((err: Error) => setAccountsError(err.message || "Could not load accounts."));
    }, []);

    const { transactions, total, pageCount, loading, error } = useTransactions({
        accountId,
        page,
        pageSize: PAGE_SIZE,
        type: type || undefined
    });

    function goToPage(nextPage: number) {
        setSearchParams(nextPage === 1 ? {} : { page: String(nextPage) });
    }

    function handleAccountChange(nextAccountId: string) {
        setAccountId(nextAccountId);
        goToPage(1);
    }

    function handleTypeChange(event: ChangeEvent<HTMLSelectElement>) {
        setType(event.target.value as TypeFilter);
        goToPage(1);
    }

    const firstShown = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
    const lastShown = Math.min(page * PAGE_SIZE, total);

    let status = "";
    if (accountsError) {
        status = accountsError;
    } else if (error) {
        status = error;
    } else if (accounts.length === 0) {
        status = "You don't have any accounts yet.";
    } else if (loading) {
        status = "Loading transactions...";
    } else if (total === 0) {
        status = "No transactions found.";
    }

    return (
        <section className="transactions-page">
            <div className="transactions-header">
                <h1>Transactions</h1>
                <p>Browse your full transaction history.</p>
            </div>

            <div className="transaction-filters">
                {accounts.length > 0 && (
                    <div className="transaction-account-filter">
                        <AccountSelect
                            label="Account"
                            id="transactions-account"
                            accounts={accounts}
                            accountId={accountId}
                            onChange={handleAccountChange}
                            hideBalanceOnMobile
                        />
                    </div>
                )}

                <select
                    className="transaction-type-filter"
                    aria-label="Filter by transaction type"
                    value={type}
                    onChange={handleTypeChange}
                >
                    <option value="">All Types</option>
                    <option value="deposit">Deposits</option>
                    <option value="withdraw">Withdrawals</option>
                    <option value="transfer">Transfers</option>
                </select>
            </div>

            <TransactionList
                title="All Transactions"
                transactions={transactions}
                headerAction={
                    total > 0 && (
                        <span className="transactions-count">
                            Showing {firstShown}–{lastShown} of {total}
                        </span>
                    )
                }
            />

            {status && (
                <p className={`transactions-status${error || accountsError ? " error" : ""}`} role="status">
                    {status}
                </p>
            )}

            <Pagination page={page} pageCount={pageCount} onPageChange={goToPage} />
        </section>
    );
}

export default Transactions;
