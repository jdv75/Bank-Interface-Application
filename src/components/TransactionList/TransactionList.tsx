import type { ReactNode } from "react";
import type { Transaction } from "../../types/bank";
import { formatCurrency } from "../../utils/format";
import "./TransactionList.css";

type Props = {
    title: string;
    transactions: Transaction[];
    headerAction?: ReactNode;
};

function groupTransactionsByDate(transactions: Transaction[]): Map<string, Transaction[]> {
    const transactionsByDate = new Map<string, Transaction[]>();

    for (const transaction of transactions) {
        const date = new Date(transaction.createdAt).toLocaleDateString();
        const dayTransactions = transactionsByDate.get(date) ?? [];

        dayTransactions.push(transaction);
        transactionsByDate.set(date, dayTransactions);
    }

    return transactionsByDate;
}

function TransactionList({ title, transactions, headerAction }: Props) {
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
                            const incoming = transaction.amount > 0;

                            return (
                                <div
                                    key={transaction.id}
                                    className="transaction-row"
                                    data-type={transaction.type}
                                    data-direction={incoming ? "in" : "out"}
                                >
                                    <div className="transaction-type">
                                        <span>
                                            {transaction.name}
                                            <span className="transaction-detail">
                                                {` · ${transaction.detail}`}
                                            </span>
                                        </span>
                                    </div>
                                    <div className="transaction-amount">
                                        {incoming ? "+" : "−"}
                                        {formatCurrency(Math.abs(transaction.amount))}
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
