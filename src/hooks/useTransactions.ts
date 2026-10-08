import { useEffect, useState } from "react";
import { getTransactions, type TransactionPage } from "../services/transactionService";
import type { Transaction } from "../types/transaction";

type UseTransactionsOptions = {
    pageSize: number;
    page?: number;
    type?: Transaction["type"];
};

export function useTransactions(accountId: string, { pageSize, page = 1, type }: UseTransactionsOptions) {
    const [result, setResult] = useState<TransactionPage>({ transactions: [], total: 0 });

    useEffect(() => {
        let cancelled = false;

        getTransactions(accountId, { page, pageSize, type }).then((nextResult) => {
            if (!cancelled) {
                setResult(nextResult);
            }
        });

        return () => {
            cancelled = true;
        };
    }, [accountId, page, pageSize, type]);

    return {
        transactions: result.transactions,
        total: result.total,
        pageCount: Math.max(1, Math.ceil(result.total / pageSize))
    };
}
