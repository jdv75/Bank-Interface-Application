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

INSERT INTO transactions (date, transaction_type, amount, origin_account_id, destination_account_id)
SELECT seed.date::timestamp, seed.transaction_type, seed.amount, origin.account_id, destination.account_id
FROM (VALUES
        ('2026-09-01 09:00:00', 'DEPOSIT',  2500.00, 'CHECKING',   NULL),
        ('2026-09-01 09:30:00', 'DEPOSIT',  5000.00, 'INVESTMENT', NULL),
        ('2026-09-02 10:15:00', 'DEPOSIT',  1000.00, 'SAVINGS',    NULL),
        ('2026-09-03 18:42:00', 'WITHDRAW',   60.00, 'CHECKING',   NULL),
        ('2026-09-05 08:00:00', 'TRANSFER',  500.00, 'CHECKING',   'SAVINGS'),
        ('2026-09-10 12:30:00', 'WITHDRAW',  120.00, 'CHECKING',   NULL),
        ('2026-09-15 09:00:00', 'DEPOSIT',  2500.00, 'CHECKING',   NULL),
        ('2026-09-20 20:11:00', 'WITHDRAW',   40.00, 'CHECKING',   NULL),
        ('2026-09-25 14:20:00', 'TRANSFER', 1000.00, 'CHECKING',   'INVESTMENT'),
        ('2026-10-01 09:00:00', 'DEPOSIT',  2500.00, 'CHECKING',   NULL),
        ('2026-10-05 08:00:00', 'TRANSFER',  500.00, 'CHECKING',   'SAVINGS'),
        ('2026-10-05 16:45:00', 'WITHDRAW',  200.00, 'CHECKING',   NULL),
        ('2026-10-10 11:00:00', 'WITHDRAW',  200.00, 'SAVINGS',    NULL),
        ('2026-10-12 07:30:00', 'WITHDRAW',   80.00, 'CHECKING',   NULL),
        ('2026-10-15 09:00:00', 'DEPOSIT',  2500.00, 'CHECKING',   NULL),
        ('2026-10-18 19:05:00', 'WITHDRAW',  100.00, 'CHECKING',   NULL),
        ('2026-10-20 10:00:00', 'TRANSFER',  300.00, 'SAVINGS',    'CHECKING')
     ) AS seed(date, transaction_type, amount, origin_type, destination_type)
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
