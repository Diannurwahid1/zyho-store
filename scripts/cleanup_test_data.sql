SELECT column_name FROM information_schema.columns WHERE table_name = 'transactions' ORDER BY ordinal_position;

-- Hapus relasi orders
DELETE FROM orders_rels WHERE parent_id IN (SELECT id FROM orders_to_delete);

-- Hapus order items
DELETE FROM orders_items WHERE _parent_id IN (SELECT id FROM orders_to_delete);

-- Hapus digital deliveries units
DELETE FROM orders_digital_deliveries_units WHERE _parent_id IN (
  SELECT odd.id FROM orders_digital_deliveries odd
  WHERE odd._parent_id IN (SELECT id FROM orders_to_delete)
);

-- Hapus digital deliveries
DELETE FROM orders_digital_deliveries WHERE _parent_id IN (SELECT id FROM orders_to_delete);

-- Hapus checkout sessions
DELETE FROM checkout_sessions WHERE order_id IN (SELECT id FROM orders_to_delete);

-- Hapus payment transactions
DELETE FROM payment_transactions WHERE order_id IN (SELECT id FROM orders_to_delete);

-- Hapus orders
DELETE FROM orders WHERE id IN (SELECT id FROM orders_to_delete);

-- Hapus user dillacandra (id=4)
DELETE FROM users WHERE id = 4;

-- Konfirmasi
SELECT 'Orders deleted' as status, COUNT(*) FROM orders WHERE created_at BETWEEN '2026-07-07' AND '2026-07-16 23:59:59'
UNION ALL
SELECT 'User dillacandra deleted', COUNT(*) FROM users WHERE id = 4;

COMMIT;
