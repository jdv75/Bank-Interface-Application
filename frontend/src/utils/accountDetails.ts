import type { Account, AccountType } from "../types/bank";
import { formatPercent } from "./format";

export interface DetailRow {
    label: string;
    value: string;
    positive?: boolean;
}

export const accountColors: Record<AccountType, string> = {
    checking: "#2f80ff",
    savings: "#00d69a",
    investment: "#6c4dff"
};

export function getBalanceLabel(type: AccountType): string {
    return type === "investment" ? "Total Balance" : "Available Balance";
}

export function getAccountTypeLabel(type: AccountType): string {
    return type.charAt(0).toUpperCase() + type.slice(1);
}

export function getHighlightRow(account: Account): DetailRow {
    switch (account.type) {
        case "checking":
            return {
                label: "Routing Number",
                value: account.routingNumber ?? "—"
            };

        case "savings":
            return {
                label: "Interest Rate",
                value: account.interestRate === undefined
                    ? "—"
                    : `${formatPercent(account.interestRate)} APY`
            };

        case "investment":
            return {
                label: "YTD Return",
                value: account.ytdReturn === undefined
                    ? "—"
                    : `+${formatPercent(account.ytdReturn)}`,
                positive: true
            };
    }
}