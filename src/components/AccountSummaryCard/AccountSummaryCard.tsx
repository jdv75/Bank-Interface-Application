import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import type { Account } from "../../types/bank";
import { formatCurrency, maskAccount } from "../../utils/format";
import { getAccountIcon } from "../../utils/icons";

interface AccountSummaryCardProps {
    account: Account;
}

function AccountSummaryCard({ account }: AccountSummaryCardProps) {
    const Icon = getAccountIcon(account.type);
    const navigate = useNavigate();

    return (
        <article className={`dash-account ${account.type}`}>
            <div className="dash-account-main">
                <div className="dash-account-top">
                    <div className={`dash-account-icon ${account.type}`}>
                        <Icon />
                    </div>

                    <div className="info">
                        <h3>{account.name}</h3>
                        <span>{maskAccount(account.last4)}</span>
                    </div>
                </div>

                <strong>{formatCurrency(account.balance)}</strong>
            </div>

            <button
                className="dash-account-arrow"
                type="button"
                aria-label={`Open ${account.name}`}
                onClick={() => navigate("/accounts")}
            >
                <ChevronRight />
            </button>
        </article>
    );
}

export default AccountSummaryCard;
