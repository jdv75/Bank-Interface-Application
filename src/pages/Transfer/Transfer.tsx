import {
	CalendarDays,
	CheckCircle2,
	ChevronDown,
	CreditCard,
	Send,
} from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

import transferImage from "../../assets/images/Transfer.svg";
import { bankService } from "../../services/bankService";
import type { Account, TransferResult } from "../../types/bank";
import { formatCurrency, maskAccount } from "../../utils/format";
import { getAccountIcon } from "../../utils/icons";
import "./Transfer.css";

const quickAmounts = [50, 100, 250, 500];

function getTomorrow(): string {
	const date = new Date();
	date.setDate(date.getDate() + 1);

	return date.toISOString().slice(0, 10);
}

function getAvailableBalance(account: Account): number {
	return account.balance - (account.pendingTransferAmount ?? 0);
}

function Transfer() {
	const [accounts, setAccounts] = useState<Account[]>([]);
	const [fromAccountId, setFromAccountId] = useState("");
	const [toAccountId, setToAccountId] = useState("");
	const [amount, setAmount] = useState("");
	const [note, setNote] = useState("");
	const [isScheduled, setIsScheduled] = useState(false);
	const [scheduledFor, setScheduledFor] = useState("");
	const [error, setError] = useState("");
	const [result, setResult] = useState<TransferResult | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	async function loadAccounts() {
		const nextAccounts = await bankService.getAccounts();

		setAccounts(nextAccounts);

		if (!fromAccountId && nextAccounts[0]) {
			setFromAccountId(nextAccounts[0].id);
			setToAccountId(nextAccounts[1]?.id ?? "");
		}
	}

	useEffect(() => {
		loadAccounts();
	}, []);

	const fromAccount = accounts.find((account) => account.id === fromAccountId);
	const toAccount = accounts.find((account) => account.id === toAccountId);
	const destinationAccounts = accounts.filter(
		(account) => account.id !== fromAccountId,
	);

	function handleFromAccountChange(accountId: string) {
		setFromAccountId(accountId);

		if (accountId === toAccountId) {
			const nextDestination = accounts.find(
				(account) => account.id !== accountId,
			);
			setToAccountId(nextDestination?.id ?? "");
		}
	}

	function validateForm(): string {
		const transferAmount = Number(amount);

		if (!fromAccount || !toAccount) {
			return "Choose an account to transfer from and to.";
		}

		if (!/^\d+(\.\d{1,2})?$/.test(amount) || transferAmount <= 0) {
			return "Enter a valid amount greater than zero.";
		}

		if (transferAmount > getAvailableBalance(fromAccount)) {
			return "Transfer amount exceeds the available balance.";
		}

		if (isScheduled && !scheduledFor) {
			return "Choose a future date for the transfer.";
		}

		return "";
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const validationMessage = validateForm();

		if (validationMessage) {
			setError(validationMessage);
			return;
		}

		setError("");
		setIsSubmitting(true);

		try {
			const transfer = await bankService.createTransfer({
				fromAccountId,
				destination: {
					type: "internal",
					accountId: toAccountId,
				},
				amount: Number(amount),
				note: note.trim() || undefined,
				scheduledFor: isScheduled ? scheduledFor : undefined,
			});

			setResult(transfer);
			await loadAccounts();
		} catch (requestError) {
			setError(
				requestError instanceof Error
					? requestError.message
					: "Unable to complete the transfer.",
			);
		} finally {
			setIsSubmitting(false);
		}
	}

	function startAnotherTransfer() {
		setAmount("");
		setNote("");
		setIsScheduled(false);
		setScheduledFor("");
		setError("");
		setResult(null);
	}

	if (accounts.length === 0) {
		return <main className="transfer-page">Loading…</main>;
	}

	return (
		<main className="transfer-page">
			<div className="transfer-breadcrumb">
				<span>Transaction Center</span>
				<span aria-hidden="true">›</span>
				<strong>Transfer</strong>
			</div>

			<div className="transfer-header">
				<h1>Transfer Funds</h1>
				<p>Send money between your accounts quickly and securely.</p>
			</div>

			<div className="transfer-layout">
				<section className="transfer-form-card">
					{result ? (
						<div className="transfer-result" role="status">
							<CheckCircle2 />
							<p>
								{result.status === "scheduled"
									? "Transfer scheduled"
									: "Transfer complete"}
							</p>
							<h2>{formatCurrency(result.amount)}</h2>
							<span>
								{fromAccount?.name} to {toAccount?.name}
							</span>
							<button type="button" onClick={startAnotherTransfer}>
								Make another transfer
							</button>
						</div>
					) : (
						<form onSubmit={handleSubmit}>
							<h2>Transfer Details</h2>

							<AccountSelect
								label="From Account"
								id="transfer-from-account"
								accounts={accounts}
								accountId={fromAccountId}
								onChange={handleFromAccountChange}
								showAvailableBalance
							/>

							<AccountSelect
								label="To Account"
								id="transfer-to-account"
								accounts={destinationAccounts}
								accountId={toAccountId}
								onChange={setToAccountId}
							/>

							<label className="transfer-label" htmlFor="transfer-amount">
								Transfer Amount
							</label>
							<div className="transfer-amount">
								<span>$</span>
								<input
									id="transfer-amount"
									inputMode="decimal"
									value={amount}
									onChange={(event) => setAmount(event.target.value)}
									placeholder="0.00"
								/>
							</div>

							<div className="transfer-quick-amounts">
								{quickAmounts.map((quickAmount) => (
									<button
										key={quickAmount}
										type="button"
										onClick={() => setAmount(String(quickAmount))}
									>
										{formatCurrency(quickAmount)}
									</button>
								))}
							</div>

							<fieldset className="transfer-timing">
								<legend>Transfer Date</legend>
								<label className={!isScheduled ? "selected" : ""}>
									<input
										type="radio"
										checked={!isScheduled}
										onChange={() => setIsScheduled(false)}
									/>
									<Send />
									<span>
										<strong>Transfer Now</strong>
										<small>Complete immediately</small>
									</span>
								</label>
								<label className={isScheduled ? "selected" : ""}>
									<input
										type="radio"
										checked={isScheduled}
										onChange={() => setIsScheduled(true)}
									/>
									<CalendarDays />
									<span>
										<strong>Schedule Transfer</strong>
										<small>Choose a future date</small>
									</span>
								</label>
							</fieldset>

							{isScheduled && (
								<label className="transfer-date" htmlFor="transfer-date">
									Scheduled Date
									<input
										id="transfer-date"
										type="date"
										min={getTomorrow()}
										value={scheduledFor}
										onChange={(event) => setScheduledFor(event.target.value)}
									/>
								</label>
							)}

							<label className="transfer-note" htmlFor="transfer-note">
								Optional Note
								<textarea
									id="transfer-note"
									value={note}
									maxLength={50}
									placeholder="Add a note (e.g., rent, savings, etc.)"
									onChange={(event) => setNote(event.target.value)}
								/>
								<small>{note.length}/50</small>
							</label>

							{error && (
								<p className="transfer-error" role="alert">
									{error}
								</p>
							)}

							<button
								className="transfer-submit"
								type="submit"
								disabled={isSubmitting}
							>
								{isSubmitting
									? "Submitting…"
									: isScheduled
										? "Schedule Transfer"
										: "Transfer Funds"}
							</button>
						</form>
					)}
				</section>

				<aside className="transfer-side-panel">
					<section className="transfer-information">
						<div className="transfer-graphic" aria-hidden="true">
							<img src={transferImage} alt="" />
						</div>
						<h2>Transfer Between Your Accounts</h2>
						<p>
							Move money easily between your NeuroBank accounts. Transfers are
							typically instant and there are no fees.
						</p>
					</section>

					<section className="transfer-summary">
						<h2>Accounts Summary</h2>
						{accounts.map((account) => {
							const Icon = getAccountIcon(account.type);
							const pendingAmount = account.pendingTransferAmount ?? 0;

							return (
								<div className="transfer-summary-account" key={account.id}>
									<span className={`transfer-summary-icon ${account.type}`}>
										<Icon />
									</span>
									<span>
										<strong>{account.name}</strong>
										<small>{maskAccount(account.last4)}</small>
										{pendingAmount > 0 && (
											<small>Scheduled: −{formatCurrency(pendingAmount)}</small>
										)}
									</span>
									<span className="transfer-summary-balance">
										<strong>{formatCurrency(account.balance)}</strong>
										{pendingAmount > 0 && (
											<small>
												Available:{" "}
												{formatCurrency(getAvailableBalance(account))}
											</small>
										)}
									</span>
								</div>
							);
						})}
					</section>
				</aside>
			</div>
		</main>
	);
}

interface AccountSelectProps {
	label: string;
	id: string;
	accounts: Account[];
	accountId: string;
	onChange: (accountId: string) => void;
	showAvailableBalance?: boolean;
}

function AccountSelect({
	label,
	id,
	accounts,
	accountId,
	onChange,
	showAvailableBalance = false,
}: AccountSelectProps) {
	const [isOpen, setIsOpen] = useState(false);
	const selectedAccount = accounts.find((account) => account.id === accountId);
	const Icon = selectedAccount
		? getAccountIcon(selectedAccount.type)
		: CreditCard;
	const balance = selectedAccount
		? showAvailableBalance
			? getAvailableBalance(selectedAccount)
			: selectedAccount.balance
		: 0;

	return (
		<div className="transfer-account-field">
			<span className="transfer-label" id={`${id}-label`}>
				{label}
			</span>
			<div className="transfer-select-wrapper">
				<button
					className="transfer-select"
					type="button"
					aria-labelledby={`${id}-label`}
					aria-expanded={isOpen}
					aria-haspopup="listbox"
					onClick={() => setIsOpen(!isOpen)}
				>
					<span
						className={`transfer-select-icon ${selectedAccount?.type ?? "checking"}`}
					>
						<Icon />
					</span>
					<span className="transfer-select-details">
						<strong>{selectedAccount?.name ?? "Select account"}</strong>
						{selectedAccount && (
							<small>{maskAccount(selectedAccount.last4)}</small>
						)}
					</span>
					<strong>{formatCurrency(balance)}</strong>
					<ChevronDown className={isOpen ? "open" : ""} />
				</button>

				{isOpen && (
					<div className="transfer-select-options" id={id} role="listbox">
						{accounts.map((account) => {
							const OptionIcon = getAccountIcon(account.type);
							const optionBalance = showAvailableBalance
								? getAvailableBalance(account)
								: account.balance;

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
									<span className={`transfer-select-icon ${account.type}`}>
										<OptionIcon />
									</span>
									<span className="transfer-select-details">
										<strong>{account.name}</strong>
										<small>{maskAccount(account.last4)}</small>
									</span>
									<strong>{formatCurrency(optionBalance)}</strong>
								</button>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}

export default Transfer;
