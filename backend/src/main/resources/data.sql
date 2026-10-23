INSERT INTO bank (routing_number, bank_name)
VALUES (123456789, 'NeuroBank')
ON CONFLICT (routing_number) DO NOTHING;

INSERT INTO users (username, password, f_name, l_name, email, phone)
VALUES ('demo', '$2a$10$0OwRH1xdCR1lthS3D5IpVeW6YQtVHe3MV4v7jooRHp1VsYmH9FkIW',
        'Demo', 'User', 'demo@neurobank.com', '5555550100')
ON CONFLICT (username) DO NOTHING;

INSERT INTO accounts (account_id, pin, balance, username, routing_num, account_type)
SELECT nextval('account_sequence'), '1234', seed.balance, 'demo', 123456789, seed.account_type
FROM (VALUES (1, 'CHECKING', 7700.00),
             (2, 'SAVINGS', 1500.00),
             (3, 'INVESTMENT', 6000.00)) AS seed(sort_order, account_type, balance)
WHERE NOT EXISTS (SELECT 1 FROM accounts WHERE username = 'demo')
ORDER BY seed.sort_order;

INSERT INTO transactions (
    date,
    transaction_type,
    amount,
    origin_account_id,
    destination_account_id,
    status,
    note,
    scheduled_for
)
SELECT seed.date::timestamptz,
       seed.transaction_type,
       seed.amount,
       origin.account_id,
       destination.account_id,
       seed.status,
       seed.note,
       seed.scheduled_for::date
FROM (VALUES
        ('2026-09-01T09:00:00Z', 'DEPOSIT',  2500.00, 'CHECKING',   NULL,         'COMPLETED', NULL,                    NULL),
        ('2026-09-01T09:30:00Z', 'DEPOSIT',  5000.00, 'INVESTMENT', NULL,         'COMPLETED', NULL,                    NULL),
        ('2026-09-02T10:15:00Z', 'DEPOSIT',  1000.00, 'SAVINGS',    NULL,         'COMPLETED', NULL,                    NULL),
        ('2026-09-03T18:42:00Z', 'WITHDRAW',   60.00, 'CHECKING',   NULL,         'COMPLETED', NULL,                    NULL),
        ('2026-09-05T08:00:00Z', 'TRANSFER',  500.00, 'CHECKING',   'SAVINGS',    'COMPLETED', NULL,                    NULL),
        ('2026-09-10T12:30:00Z', 'WITHDRAW',  120.00, 'CHECKING',   NULL,         'COMPLETED', NULL,                    NULL),
        ('2026-09-15T09:00:00Z', 'DEPOSIT',  2500.00, 'CHECKING',   NULL,         'COMPLETED', NULL,                    NULL),
        ('2026-09-20T20:11:00Z', 'WITHDRAW',   40.00, 'CHECKING',   NULL,         'COMPLETED', NULL,                    NULL),
        ('2026-09-25T14:20:00Z', 'TRANSFER', 1000.00, 'CHECKING',   'INVESTMENT', 'COMPLETED', NULL,                    NULL),
        ('2026-10-01T09:00:00Z', 'DEPOSIT',  2500.00, 'CHECKING',   NULL,         'COMPLETED', NULL,                    NULL),
        ('2026-10-05T08:00:00Z', 'TRANSFER',  500.00, 'CHECKING',   'SAVINGS',    'COMPLETED', NULL,                    NULL),
        ('2026-10-05T16:45:00Z', 'WITHDRAW',  200.00, 'CHECKING',   NULL,         'COMPLETED', NULL,                    NULL),
        ('2026-10-10T11:00:00Z', 'WITHDRAW',  200.00, 'SAVINGS',    NULL,         'COMPLETED', NULL,                    NULL),
        ('2026-10-12T07:30:00Z', 'WITHDRAW',   80.00, 'CHECKING',   NULL,         'COMPLETED', NULL,                    NULL),
        ('2026-10-15T09:00:00Z', 'DEPOSIT',  2500.00, 'CHECKING',   NULL,         'COMPLETED', NULL,                    NULL),
        ('2026-10-18T19:05:00Z', 'WITHDRAW',  100.00, 'CHECKING',   NULL,         'COMPLETED', NULL,                    NULL),
        ('2026-10-20T10:00:00Z', 'TRANSFER',  300.00, 'SAVINGS',    'CHECKING',   'COMPLETED', NULL,                    NULL),
        ('2026-10-21T15:00:00Z', 'TRANSFER', 9000.00, 'CHECKING',   'SAVINGS',    'FAILED',    'Insufficient funds',    '2026-10-22'),
        ('2026-10-22T15:00:00Z', 'TRANSFER',  125.00, 'CHECKING',   'SAVINGS',    'SCHEDULED', 'Upcoming transfer',    '2026-10-30')
     ) AS seed(date, transaction_type, amount, origin_type, destination_type,
               status, note, scheduled_for)
JOIN accounts origin
    ON origin.username = 'demo' AND origin.account_type = seed.origin_type
LEFT JOIN accounts destination
    ON destination.username = 'demo' AND destination.account_type = seed.destination_type
WHERE NOT EXISTS (
    SELECT 1 FROM transactions t
    JOIN accounts a ON a.account_id = t.origin_account_id
    WHERE a.username = 'demo'
)
ORDER BY seed.date;
