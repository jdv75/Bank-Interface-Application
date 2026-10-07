import { getTransactions } from "../../services/transactionService";
import { groupTransactionsByDate } from "../../utils/groupTransactionsByDate";
import { useLocation } from "react-router-dom";
import "./TransactionList.css";

type Props = {
    limit: number
}

function TransactionList({limit}: Props) {
    const transactions = getTransactions("testId", limit);
    const transactionsByDate = groupTransactionsByDate(transactions);
    const location = useLocation();

    return (
        <div className="transaction-list">
            <div className="transaction-filters">
                <div className="transaction-search">
                    <input type="text" placeholder="Search transactions" />
                </div>
                {/* TODO: Add filters later */}
            </div>
            <div className="transaction-list-header">
                <h2>Recent Transactions</h2>
                {location.pathname === "/dashboard" && <a href="/transactions">See all transactions</a>}
            </div>
            <div className="transaction-table">
                <div className="transaction-table-head">
                    <div>Date</div>
                    <div>Type</div>
                    <div>Amount</div>
                </div>
                {[...transactionsByDate].map(([date, dayTransactions]) => (
                        <div key={date} className="transaction-day">
                            <div className="transaction-date">{date}</div>
                            {dayTransactions.map(transaction => (
                                <div key={transaction.id} className="transaction-row" data-type={transaction.type}>
                                    <div className="transaction-type">
                                        <span>
                                            {transaction.type}
                                            {transaction.type === "transfer" && (
                                                <span className="transaction-detail"> to {transaction.to_account_id}</span>
                                            )}
                                        </span>
                                    </div>
                                    <div className="transaction-amount">
                                        {transaction.type === "deposit" ? "+" : "-"}${transaction.amount}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default TransactionList;
