interface BaseTransaction {
  amount: number;
  datetime: string;
  id: string;
  account_id: string;
}

export type Transaction =
  | (BaseTransaction & { type: "deposit" | "withdrawal" })
  | (BaseTransaction & {
      type: "transfer";
      to_account_id: string;
    });
