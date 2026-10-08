import type { ReactNode } from "react";
import type { Transaction } from "../../types/transaction";
import { groupTransactionsByDate } from "../../utils/groupTransactionsByDate";
import { formatCurrency } from "../../utils/format";
import "./TransactionList.css";

type Props = {
    title: string;
    accountId: string;
    transactions: Transaction[];
    headerAction?: ReactNode;
};

function isIncoming(transaction: Transaction, accountId: string): boolean {
    if (transaction.type === "transfer") {
        return transaction.to_account_id === accountId;
    }
    return transaction.type === "deposit";
}

function TransactionList({ title, accountId, transactions, headerAction }: Props) {
    const transactionsByDate = groupTransactionsByDate(transactions);

    return (
        <section className="transaction-list">
            <div className="transaction-list-header">
                <h2>{title}</h2>
                {headerAction}
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
                        {dayTransactions.map((transaction) => {
                            const incoming = isIncoming(transaction, accountId);

                            return (
                                <div
                                    key={transaction.id}
                                    className="transaction-row"
                                    data-type={transaction.type}
                                    data-direction={incoming ? "in" : "out"}
                                >
                                    <div className="transaction-type">
                                        <span>
                                            {transaction.type}
                                            {transaction.type === "transfer" && (
                                                <span className="transaction-detail">
                                                    {incoming
                                                        ? ` from ${transaction.account_id}`
                                                        : ` to ${transaction.to_account_id}`}
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                    <div className="transaction-amount">
                                        {incoming ? "+" : "−"}
                                        {formatCurrency(transaction.amount)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </section>
    );
}

export default TransactionList;
