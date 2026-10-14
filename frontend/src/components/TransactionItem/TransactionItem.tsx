import type { Transaction } from "../../types/bank";
import { formatDateTime, formatSignedCurrency } from "../../utils/format";
import { getTransactionIcon } from "../../utils/icons";

interface TransactionItemProps {
    transaction: Transaction;
}

function TransactionItem({ transaction }: TransactionItemProps) {
    const Icon = getTransactionIcon(transaction);
    const isPositive = transaction.amount > 0;

    return (
        <li className="transaction">
            <div className="transaction-icon">
                <Icon />
            </div>

            <div className="transaction-info">
                <strong>{transaction.name}</strong>
                <span>
                    {transaction.detail} | {formatDateTime(transaction.createdAt)}
                </span>
            </div>

            <span className={isPositive ? "positive" : "negative"}>
                {formatSignedCurrency(transaction.amount)}
            </span>
        </li>
    );
}

export default TransactionItem;
