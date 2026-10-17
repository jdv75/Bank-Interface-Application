import { ChevronRight, Copy, Trash2 } from "lucide-react";

import type { Account } from "../../types/bank";
import {
    getAccountTypeLabel,
    getBalanceLabel,
    getHighlightRow
} from "../../utils/accountDetails";
import { formatCurrency, maskAccount } from "../../utils/format";
import { getAccountIcon } from "../../utils/icons";

interface AccountDetailCardProps {
    account: Account;
    onDelete?: (accountId: string) => void;
}

function AccountDetailCard({ account, onDelete }: AccountDetailCardProps) {
    const Icon = getAccountIcon(account.type);
    const highlight = getHighlightRow(account);
    const availableBalance = account.balance - (account.pendingTransferAmount ?? 0);
    const hasScheduledTransfer = (account.pendingTransferAmount ?? 0) > 0;

    return (
        <article className={`account-card ${account.type}`}>
            <div className="account-card-top">
                <div className="account-card-main">
                    <div className="account-identity">
                        <div className="account-icon">
                            <Icon />
                        </div>

                        <div>
                            <h3>{account.name}</h3>
                            <span>{maskAccount(account.last4)}</span>
                        </div>
                    </div>

                    <strong className="account-balance">
                        {formatCurrency(account.balance)}
                    </strong>
                </div>

                <button
                    className="account-delete"
                    type="button"
                    aria-label={`Delete ${account.name}`}
                    onClick={() => onDelete?.(account.id)}
                >
                    <Trash2 />
                </button>
            </div>

            <div className="account-details">
                <div>
                    <span>{getBalanceLabel(account.type)}</span>
                    <strong>{formatCurrency(account.balance)}</strong>
                </div>

                {hasScheduledTransfer && (
                    <div className="available-balance">
                        <span>Available After Scheduled Transfers</span>
                        <strong>{formatCurrency(availableBalance)}</strong>
                    </div>
                )}

                <div>
                    <span>Account Type</span>
                    <strong>{getAccountTypeLabel(account.type)}</strong>
                </div>

                <div>
                    <span>{highlight.label}</span>
                    <strong className={highlight.positive ? "positive" : undefined}>
                        {highlight.value}
                    </strong>
                </div>

                <div>
                    <span>Account Number</span>
                    <strong>
                        {maskAccount(account.last4)}
                        <button
                            type="button"
                            aria-label={`Copy ${account.name} number`}
                        >
                            <Copy />
                        </button>
                    </strong>
                </div>
            </div>
        </article>
    );
}

export default AccountDetailCard;
