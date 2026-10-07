import { ArrowDownToLine, Landmark, LucideIcon, Camera, Banknote, CreditCard, ArrowUpFromLine, ShoppingCart, ArrowRight, Utensils, ShoppingBag, ArrowLeftRight, ArrowLeft } from "lucide-react";
import { getTransactions } from "../../services/transactionService";
import { groupTransactionsByDate } from "../../utils/groupTransactionsByDate";
import "./TransactionList.css";

function TransactionList() {
    const transactions = getTransactions("testId", 5);
    const transactionsByDate = groupTransactionsByDate(transactions);
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
