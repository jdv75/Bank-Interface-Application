# NeuroBank API contract

All endpoints require authentication unless stated otherwise. JSON field names below match the
backend DTOs exactly.

## GET /api/accounts

Returns the authenticated user's accounts.

### Response: 200

```json
[
  {
    "id": "12",
    "type": "checking",
    "name": "Checking Account",
    "last4": "1234",
    "balance": 2500.0,
    "routingNumber": "123456789",
    "pendingTransferAmount": 150.0
  }
]
```

`pendingTransferAmount` is the total of scheduled outgoing transfers that have not executed. The
effective available balance is `balance - pendingTransferAmount`.

## GET /api/accounts/{accountId}/transactions

Returns one page of the account's transaction history, newest first.

### Query parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `page` | number | `1` | One-based page number |
| `page_size` | number | `20` | Items per page; the backend caps this at 100 |
| `type` | string | none | `deposit`, `withdraw`, or `transfer`; omit for all types |

### Response: 200

```json
{
  "transactions": [
    {
      "id": "42",
      "accountId": "12",
      "type": "transfer",
      "category": "internal-transfer",
      "name": "To Savings",
      "detail": "Scheduled for Oct 30, 2026 · Emergency fund",
      "amount": -150.0,
      "createdAt": "2026-10-23T17:15:00Z",
      "status": "scheduled",
      "note": "Emergency fund",
      "scheduledFor": "2026-10-30"
    }
  ],
  "total": 1
}
```

`status` is `scheduled`, `completed`, or `failed`. `note` and `scheduledFor` can be `null` for
transactions where those values do not apply. Amounts are signed from the selected account's
perspective: outgoing transfers and withdrawals are negative; incoming transfers and deposits
are positive.

### Errors

| Case | Status |
| --- | --- |
| Not logged in | 401 |
| Account does not exist or does not belong to the user | 404 |
| Invalid transaction type | 400 |

## POST /api/transfers

Creates an immediate or scheduled internal or external transfer.

### Internal-transfer request

```json
{
  "originAccountId": 12,
  "destination": {
    "type": "internal",
    "destinationAccountId": 18
  },
  "amount": 150.0,
  "transactionNote": "Emergency fund",
  "scheduledFor": "2026-10-30"
}
```

### External-transfer request

```json
{
  "originAccountId": 12,
  "destination": {
    "type": "external",
    "destinationAccountId": 25,
    "routingNumber": 123456789
  },
  "amount": 75.0,
  "transactionNote": "Dinner",
  "scheduledFor": "2026-10-30"
}
```

`transactionNote` is optional and limited to 50 characters. `scheduledFor` is optional;
omitting it executes the transfer immediately. Account IDs and the external routing number are
JSON numbers, matching the backend's `Integer` fields.

### Response: 201

```json
{
  "transactionId": 42,
  "createdAt": "2026-10-23T17:15:00Z",
  "status": "scheduled",
  "originAccountId": 12,
  "destination": {
    "type": "internal",
    "destinationAccountId": 18
  },
  "amount": 150.0,
  "transactionNote": "Emergency fund",
  "scheduledFor": "2026-10-30"
}
```

For an immediate transfer, `status` is `completed` and `scheduledFor` is `null`. The status
enum also includes `failed` for scheduled transfers that cannot be completed at execution time.

### Errors

| Case | Status |
| --- | --- |
| Not logged in | 401 |
| Request validation fails | 400 |
| Transfer violates account ownership or routing rules | 400 or 404 |
| Available balance is insufficient | 400 |

Validation errors use this shape:

```json
{
  "message": "Request validation failed.",
  "errors": {
    "amount": ["Transfer amount must be greater than $0."]
  }
}
```

## POST /api/transactions

Creates a deposit or withdrawal. This endpoint currently accepts and returns the backend
`Transaction` entity directly; it does not use the transfer DTO structures documented above.
