import { useEffect, useState } from "react";
import {
    bankService,
    type TransactionHistoryPage
} from "../services/bankService";
import type { TransactionType } from "../types/bank";

type UseTransactionsOptions = {
    accountId?: string;
    pageSize: number;
    page?: number;
    type?: TransactionType;
};

const EMPTY_PAGE: TransactionHistoryPage = { transactions: [], total: 0 };

export function useTransactions({ accountId, pageSize, page = 1, type }: UseTransactionsOptions) {
    const [result, setResult] = useState<TransactionHistoryPage>(EMPTY_PAGE);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        // Nothing to load until an account is selected
        if (!accountId) {
            setResult(EMPTY_PAGE);
            return;
        }

        let cancelled = false;
        setLoading(true);
        setError("");

        bankService
            .getTransactionHistory({ accountId, page, pageSize, type })
            .then((nextResult) => {
                if (!cancelled) {
                    setResult(nextResult);
                }
            })
            .catch((err: Error) => {
                if (!cancelled) {
                    setResult(EMPTY_PAGE);
                    setError(err.message || "Could not load transactions.");
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [accountId, page, pageSize, type]);

    return {
        transactions: result.transactions,
        total: result.total,
        pageCount: Math.max(1, Math.ceil(result.total / pageSize)),
        loading,
        error
    };
}
