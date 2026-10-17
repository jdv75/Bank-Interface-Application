import { useEffect, useState } from "react";
import {
    bankService,
    type TransactionHistoryPage
} from "../services/bankService";
import type { TransactionType } from "../types/bank";

type UseTransactionsOptions = {
    pageSize: number;
    page?: number;
    type?: TransactionType;
};

export function useTransactions({ pageSize, page = 1, type }: UseTransactionsOptions) {
    const [result, setResult] = useState<TransactionHistoryPage>({ transactions: [], total: 0 });

    useEffect(() => {
        let cancelled = false;

        bankService.getTransactionHistory({ page, pageSize, type }).then((nextResult) => {
            if (!cancelled) {
                setResult(nextResult);
            }
        });

        return () => {
            cancelled = true;
        };
    }, [page, pageSize, type]);

    return {
        transactions: result.transactions,
        total: result.total,
        pageCount: Math.max(1, Math.ceil(result.total / pageSize))
    };
}
