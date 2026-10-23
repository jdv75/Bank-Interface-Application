import { ArrowLeftRight, CalendarDays, CheckCircle2, Landmark, Send } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

import AccountSelect from "../../components/AccountSelect/AccountSelect";
import { bankService } from "../../services/bankService";
import type { Account, TransferResult } from "../../types/bank";
import { formatCurrency, maskAccount } from "../../utils/format";
import { getAccountIcon } from "../../utils/icons";
import transferImage from "../../assets/images/Transfer.svg";
import "./Transfer.css";

const quickAmounts = [50, 100, 250, 500];
type TransferMode = "internal" | "external";

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
	const [transferMode, setTransferMode] = useState<TransferMode>("internal");
	const [fromAccountId, setFromAccountId] = useState("");
	const [toAccountId, setToAccountId] = useState("");
	const [externalAccountId, setExternalAccountId] = useState("");
	const [externalRoutingNumber, setExternalRoutingNumber] = useState("");
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

		if (!fromAccount) {
			return "Choose an account to transfer from.";
		}

		if (transferMode === "internal" && !toAccount) {
			return "Choose an account to transfer to.";
		}

		if (transferMode === "external") {
			const destinationAccountId = Number(externalAccountId);
			const routingNumber = Number(externalRoutingNumber);

			if (!/^\d+$/.test(externalAccountId)
				|| !Number.isSafeInteger(destinationAccountId)
				|| destinationAccountId <= 0
				|| destinationAccountId > 2_147_483_647) {
				return "Enter a valid recipient account number.";
			}

			if (!/^\d{9}$/.test(externalRoutingNumber)
				|| !Number.isSafeInteger(routingNumber)
				|| routingNumber <= 0) {
				return "Enter a valid 9-digit routing number.";
			}
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
			const destination = transferMode === "internal"
				? {
					type: "internal" as const,
					destinationAccountId: Number(toAccountId),
				}
				: {
					type: "external" as const,
					destinationAccountId: Number(externalAccountId),
					routingNumber: Number(externalRoutingNumber),
				};

			const transfer = await bankService.createTransfer({
				originAccountId: Number(fromAccountId),
				destination,
				amount: Number(amount),
				transactionNote: note.trim() || undefined,
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
		setExternalAccountId("");
		setExternalRoutingNumber("");
		setError("");
		setResult(null);
	}

	const destinationLabel = transferMode === "internal"
		? toAccount?.name
		: `External account ending in ${externalAccountId.slice(-4)}`;

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
				<p>Move money between your accounts or send it to someone else.</p>
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
								{fromAccount?.name} to {destinationLabel}
							</span>
							<button type="button" onClick={startAnotherTransfer}>
								Make another transfer
							</button>
						</div>
					) : (
						<form onSubmit={handleSubmit}>
							<h2>Transfer Details</h2>

							<div className="transfer-mode" role="group" aria-label="Transfer type">
								<button
									type="button"
									className={transferMode === "internal" ? "selected" : ""}
									aria-pressed={transferMode === "internal"}
									onClick={() => {
										setTransferMode("internal");
										setError("");
									}}
								>
									<ArrowLeftRight />
									<span>
										<strong>Internal</strong>
										<small>Between your accounts</small>
									</span>
								</button>
								<button
									type="button"
									className={transferMode === "external" ? "selected" : ""}
									aria-pressed={transferMode === "external"}
									onClick={() => {
										setTransferMode("external");
										setError("");
									}}
								>
									<Landmark />
									<span>
										<strong>External</strong>
										<small>To another user</small>
									</span>
								</button>
							</div>

							<AccountSelect
								label="From Account"
								id="transfer-from-account"
								accounts={accounts}
								accountId={fromAccountId}
								onChange={handleFromAccountChange}
								showAvailableBalance
								hideBalanceOnMobile
							/>


							{transferMode === "internal" ? (
								<AccountSelect
									label="To Account"
									id="transfer-to-account"
									accounts={destinationAccounts}
									accountId={toAccountId}
									onChange={setToAccountId}
									hideBalanceOnMobile
								/>
							) : (
								<div className="transfer-external-fields">
									<label className="transfer-field" htmlFor="transfer-external-account">
										Recipient Account Number
										<input
											id="transfer-external-account"
											inputMode="numeric"
											autoComplete="off"
											maxLength={10}
											value={externalAccountId}
											placeholder="Enter account number"
											onChange={(event) => setExternalAccountId(
												event.target.value.replace(/\D/g, "")
											)}
										/>
									</label>
									<label className="transfer-field" htmlFor="transfer-routing-number">
										Routing Number
										<input
											id="transfer-routing-number"
											inputMode="numeric"
											autoComplete="off"
											maxLength={9}
											value={externalRoutingNumber}
											placeholder="9-digit routing number"
											onChange={(event) => setExternalRoutingNumber(
												event.target.value.replace(/\D/g, "")
											)}
										/>
									</label>
								</div>
							)}

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
						<h2>
							{transferMode === "internal"
								? "Transfer Between Your Accounts"
								: "Send to Someone Else"}
						</h2>
						<p>
							{transferMode === "internal"
								? "Move money easily between your NeuroBank accounts. Transfers are typically instant and there are no fees."
								: "Enter the recipient's account and routing numbers."}
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

export default Transfer;
