INSERT INTO bank (routing_number, bank_name)
VALUES (123456789, 'NeuroBank')
ON CONFLICT (routing_number) DO NOTHING;