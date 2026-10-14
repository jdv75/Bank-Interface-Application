## GET /api/accounts/{accountId}/transactions
Returns one page of the account's transactions, newest first. Includes transfers where
`{accountId}` is either `account_id` (outgoing) or `to_account_id` (incoming).

### Query parameters
| Param       | Type   | Default | Description |
|-------------|--------|---------|-------------|
| `page`      | number | 1       | 1-based page number |
| `page_size` | number | 20      | Transactions per page |
| `type`      | string | none    | `"deposit"`, `"withdrawal"` or `"transfer"`; omit for all types |

### Response: 200
`total` is the number of transactions matching `type` across all pages, so the client can show
page numbers (`page_count = ceil(total / page_size)`).
```
{
    "transactions": [
        {
            "id": string,
            "type": "deposit" | "withdrawal" | "transfer",
            "amount": number,          // always positive, 2 decimals
            "created_at": string,      // ISO 8601 UTC, e.g. "2026-09-01T09:15:00Z"
            "account_id": string,
            "to_account_id": string    // transfers only
        }
    ],
    "total": number
}
```

### Rules
- `to_account_id` is required when `type` is `"transfer"`; otherwise it is omitted (not `null`).
- Direction comes from `type` and the account IDs, never from the sign of `amount`.

### Errors
| Case                                  | Status |
|---------------------------------------|--------|
| Not logged in                         | 401    |
| Account belongs to another user       | 403    |
| Account doesn't exist                 | 404    |

## POST /api/transfers

Creates an immediate or scheduled transfer.

```
{
    "fromAccountId": string,
    "destination": {
        "type": "internal",
        "accountId": string
    } | {
        "type": "external",
        "accountNumber": string,
        "routingNumber": string
    },
    "amount": number,
    "note": string?,
    "scheduledFor": "YYYY-MM-DD"?
}
```

The response includes an `id`, `createdAt`, and a `status` of `"completed"` or
`"scheduled"`.
