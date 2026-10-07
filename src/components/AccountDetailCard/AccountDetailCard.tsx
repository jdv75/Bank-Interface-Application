import { ChevronRight, Copy } from "lucide-react";

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
}

function AccountDetailCard({ account }: AccountDetailCardProps) {
    const Icon = getAccountIcon(account.type);
    const highlight = getHighlightRow(account);

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

                {/* <button
                    className="account-arrow"
                    type="button"
                    aria-label={`Open ${account.name}`}
                >
                    <ChevronRight />
                </button> */}
            </div>

            <div className="account-details">
                <div>
                    <span>{getBalanceLabel(account.type)}</span>
                    <strong>{formatCurrency(account.balance)}</strong>
                </div>

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
