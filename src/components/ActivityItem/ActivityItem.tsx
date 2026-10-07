import type { Transaction } from "../../types/bank";
import { formatDateTime, formatSignedCurrency } from "../../utils/format";
import { getTransactionIcon } from "../../utils/icons";

interface ActivityItemProps {
    transaction: Transaction;
}

function ActivityItem({ transaction }: ActivityItemProps) {
    const Icon = getTransactionIcon(transaction);
    const isPositive = transaction.amount > 0;

    return (
        <li>
            <div className="activity-icon">
                <Icon />
            </div>

            <div>
                <strong>{transaction.name}</strong>
                <span>
                    {transaction.detail} | {formatDateTime(transaction.createdAt)}
                </span>
            </div>

            <em className={isPositive ? "positive" : "negative"}>
                {formatSignedCurrency(transaction.amount)}
            </em>
        </li>
    );
}

export default ActivityItem;
