## GET /api/accounts/{accountId}/transactions
Response: 200. Array of transactions, newest first.
```
[
    {
        "id": string,
        "type": "deposit" | "withdrawal" | "transfer",
        "amount": number,           // positive, 2 decimals
        "created_at": string,
        "account_id: string,
        "to_account_id": string,    //transfers only
    }
]
```
### Rules
- to_account_id is required when `type` is `"transfer"`, otherwise, it is omitted.