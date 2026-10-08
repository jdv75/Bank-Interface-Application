import { useState } from "react";
import { ChevronDown, CreditCard } from "lucide-react";

import type { Account } from "../../types/bank";
import { formatCurrency, maskAccount } from "../../utils/format";
import { getAccountIcon } from "../../utils/icons";
import "./AccountSelect.css";

export interface AccountSelectProps {
	label: string;
	id: string;
	accounts: Account[];
	accountId: string;
	onChange: (accountId: string) => void;
	showAvailableBalance?: boolean;
	showAccountType?: boolean;
	hideBalanceOnMobile?: boolean;
}

function getAccountBalance(account: Account, showAvailableBalance: boolean): number {
	return showAvailableBalance
		? account.balance - (account.pendingTransferAmount ?? 0)
		: account.balance;
}

function AccountSelect({
	label,
	id,
	accounts,
	accountId,
	onChange,
	showAvailableBalance = false,
	showAccountType = false,
	hideBalanceOnMobile = false
}: AccountSelectProps) {
	const [isOpen, setIsOpen] = useState(false);
	const selectedAccount = accounts.find((account) => account.id === accountId);
	const Icon = selectedAccount ? getAccountIcon(selectedAccount.type) : CreditCard;

	return (
		<div className="account-select-field">
			<span className="account-select-label" id={`${id}-label`}>{label}</span>
			<div className="account-select-wrapper">
				<button
					className={`account-select-button${hideBalanceOnMobile ? " hide-balance-mobile" : ""}`}
					type="button"
					aria-labelledby={`${id}-label`}
					aria-expanded={isOpen}
					aria-haspopup="listbox"
					aria-controls={isOpen ? `${id}-options` : undefined}
					onClick={() => setIsOpen(!isOpen)}
				>
					<span className={`account-select-icon ${selectedAccount?.type ?? "checking"}`} aria-hidden="true">
						<Icon />
					</span>
					<span className="account-select-details">
						<strong>{selectedAccount?.name ?? "Select account"}</strong>
						{selectedAccount && (
							<small>
								{maskAccount(selectedAccount.last4)}
								{showAccountType && ` · ${selectedAccount.type} Account`}
							</small>
						)}
					</span>
					<strong>{selectedAccount ? formatCurrency(getAccountBalance(selectedAccount, showAvailableBalance)) : formatCurrency(0)}</strong>
					<ChevronDown className={isOpen ? "open" : ""} aria-hidden="true" />
				</button>

				{isOpen && (
					<div className="account-select-options" id={`${id}-options`} role="listbox" aria-labelledby={`${id}-label`}>
						{accounts.map((account) => {
							const OptionIcon = getAccountIcon(account.type);

							return (
								<button
									className={account.id === accountId ? "selected" : ""}
									key={account.id}
									type="button"
									role="option"
									aria-selected={account.id === accountId}
									onClick={() => {
										onChange(account.id);
										setIsOpen(false);
									}}
								>
									<span className={`account-select-icon ${account.type}`} aria-hidden="true">
										<OptionIcon />
									</span>
									<span className="account-select-details">
										<strong>{account.name}</strong>
										<small>{maskAccount(account.last4)}</small>
									</span>
									<strong>{formatCurrency(getAccountBalance(account, showAvailableBalance))}</strong>
								</button>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}

export default AccountSelect;
