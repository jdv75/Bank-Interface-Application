import { useState, type ChangeEvent } from "react";
import { useSearchParams } from "react-router-dom";
import Pagination from "../../components/Pagination/Pagination";
import TransactionList from "../../components/TransactionList/TransactionList";
import { useTransactions } from "../../hooks/useTransactions";
import { MOCK_ACCOUNT_ID } from "../../services/transactionService";
import type { Transaction } from "../../types/transaction";
import "./Transactions.css";

const PAGE_SIZE = 10;

type TypeFilter = Transaction["type"] | "";

function Transactions() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [type, setType] = useState<TypeFilter>("");
    const page = Math.max(1, Number(searchParams.get("page")) || 1);

    const { transactions, total, pageCount } = useTransactions(MOCK_ACCOUNT_ID, {
        page,
        pageSize: PAGE_SIZE,
        type: type || undefined
    });

    function goToPage(nextPage: number) {
        setSearchParams(nextPage === 1 ? {} : { page: String(nextPage) });
    }

    function handleTypeChange(event: ChangeEvent<HTMLSelectElement>) {
        setType(event.target.value as TypeFilter);
        goToPage(1);
    }

    const firstShown = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
    const lastShown = Math.min(page * PAGE_SIZE, total);

    return (
        <section className="transactions-page">
            <div className="transactions-header">
                <h1>Transactions</h1>
                <p>Browse your full transaction history.</p>
            </div>

            <div className="transaction-filters">
                <select
                    className="transaction-type-filter"
                    aria-label="Filter by transaction type"
                    value={type}
                    onChange={handleTypeChange}
                >
                    <option value="">All Types</option>
                    <option value="deposit">Deposits</option>
                    <option value="withdrawal">Withdrawals</option>
                    <option value="transfer">Transfers</option>
                </select>
            </div>

            <TransactionList
                title="All Transactions"
                accountId={MOCK_ACCOUNT_ID}
                transactions={transactions}
                headerAction={
                    total > 0 && (
                        <span className="transactions-count">
                            Showing {firstShown}–{lastShown} of {total}
                        </span>
                    )
                }
            />

            <Pagination page={page} pageCount={pageCount} onPageChange={goToPage} />
        </section>
    );
}

export default Transactions;
