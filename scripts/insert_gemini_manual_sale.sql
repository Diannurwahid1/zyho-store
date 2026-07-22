-- Manual sale: 10 akun Gemini Pro ke popquack@whitemail.my.id
-- Total: Rp 310.000 (10 x Rp 31.000)
-- Product: Google AI Pro — Gemini Access 18 Months (id=9, harga Rp 300.000 tapi jual manual Rp 31.000/akun)
-- Customer: popquack@whitemail.my.id (id=19)

BEGIN;

-- Generate 11 unit codes
DO $$
DECLARE
  i INT;
  ucode TEXT;
  new_order_id INT;
  new_txn_id INT;
  dsu_id INT;
  delivery_id TEXT;
  unit_ids INT[] := ARRAY[]::INT[];
  inv_ref TEXT;
  access_tok TEXT;
BEGIN
  -- 1. Insert 11 Digital Stock Units (10 assigned + 1 available)
  FOR i IN 1..11 LOOP
    ucode := 'DSTK-GM' || LPAD(i::TEXT, 2, '0') || '-' || SUBSTRING(md5(random()::text) FROM 1 FOR 6);
    
    IF i <= 10 THEN
      -- Assigned units (sold)
      INSERT INTO digital_stock_units (unit_code, product_id, status, delivery_type, account_email, label, customer_id, assigned_at, created_at, updated_at)
      VALUES (ucode, 9, 'assigned'::enum_digital_stock_units_status, 'credentials'::enum_digital_stock_units_delivery_type, 
              'gemini.slot' || i || '@gmail.com', 'Gemini Pro Slot ' || i, 19, NOW(), NOW() - INTERVAL '1 day', NOW())
      RETURNING id INTO dsu_id;
      unit_ids := array_append(unit_ids, dsu_id);
    ELSE
      -- 1 available unit (remaining stock)
      INSERT INTO digital_stock_units (unit_code, product_id, status, delivery_type, account_email, label, created_at, updated_at)
      VALUES (ucode, 9, 'available'::enum_digital_stock_units_status, 'credentials'::enum_digital_stock_units_delivery_type,
              'gemini.slot' || i || '@gmail.com', 'Gemini Pro Slot ' || i, NOW() - INTERVAL '1 day', NOW());
    END IF;
  END LOOP;

  -- 2. Create Order (10 akun, total 310.000)
  inv_ref := 'INV' || EXTRACT(EPOCH FROM NOW())::BIGINT::TEXT;
  access_tok := md5(random()::text) || '-' || md5(random()::text);
  -- Format access_tok as UUID-like
  access_tok := SUBSTRING(md5(random()::text) FROM 1 FOR 8) || '-' || 
                SUBSTRING(md5(random()::text) FROM 1 FOR 4) || '-' ||
                SUBSTRING(md5(random()::text) FROM 1 FOR 4) || '-' ||
                SUBSTRING(md5(random()::text) FROM 1 FOR 4) || '-' ||
                SUBSTRING(md5(random()::text) FROM 1 FOR 12);

  INSERT INTO orders (customer_id, customer_email, status, amount, currency, access_token, payment_reference, subtotal_before_discount, discount_amount, created_at, updated_at)
  VALUES (19, 'popquack@whitemail.my.id', 'completed'::enum_orders_status, 310000, 'IDR'::enum_orders_currency, access_tok, inv_ref, 310000, 0, NOW() - INTERVAL '1 day', NOW())
  RETURNING id INTO new_order_id;

  -- 3. Create Order Items (10 qty)
  INSERT INTO orders_items (_order, _parent_id, id, product_id, quantity)
  VALUES (1, new_order_id, md5(random()::text), 9, 10);

  -- 4. Create Transaction (pakasir, succeeded)
  INSERT INTO transactions (payment_method, status, customer_id, customer_email, order_id, amount, currency, pakasir_pakasir_order_i_d, created_at, updated_at)
  VALUES ('pakasir'::enum_transactions_payment_method, 'succeeded'::enum_transactions_status, 19, 'popquack@whitemail.my.id', new_order_id, 310000, 'IDR'::enum_transactions_currency, inv_ref, NOW() - INTERVAL '1 day', NOW())
  RETURNING id INTO new_txn_id;

  -- 5. Create Transaction Items
  INSERT INTO transactions_items (_order, _parent_id, id, product_id, quantity)
  VALUES (1, new_txn_id, md5(random()::text), 9, 10);

  -- 6. Link transaction to order via orders_rels
  INSERT INTO orders_rels ("order", parent_id, path, transactions_id)
  VALUES (1, new_order_id, 'transactions', new_txn_id);

  -- 7. Create Digital Deliveries
  delivery_id := md5(random()::text);
  INSERT INTO orders_digital_deliveries (_order, _parent_id, id, product_id, product_title, quantity)
  VALUES (1, new_order_id, delivery_id, 9, 'Google AI Pro— Gemini Access 18 Months', 10);

  -- 8. Create Digital Delivery Units (link each DSU)
  FOR i IN 1..10 LOOP
    INSERT INTO orders_digital_deliveries_units (_order, _parent_id, id, unit_code, delivery_type, account_email, label)
    VALUES (1, delivery_id, md5(random()::text || i::text), 
            (SELECT unit_code FROM digital_stock_units WHERE id = unit_ids[i]),
            'credentials'::enum_orders_digital_deliveries_units_delivery_type,
            'gemini.slot' || i || '@gmail.com',
            'Gemini Pro Slot ' || i);
  END LOOP;

  -- 9. Update DSU with order_id
  UPDATE digital_stock_units SET order_id = new_order_id WHERE id = ANY(unit_ids);

  -- 10. Create Payment Transaction record too
  INSERT INTO payment_transactions (order_id, customer_id, provider, provider_transaction_id, amount, currency, status, created_at, updated_at)
  VALUES (new_order_id, 19, 'manual'::enum_payment_transactions_provider, inv_ref || '-manual', 310000, 'IDR', 'settlement'::enum_payment_transactions_status, NOW() - INTERVAL '1 day', NOW());

  RAISE NOTICE 'Order ID: %, Transaction ID: %, Invoice: %, DSU IDs: %', new_order_id, new_txn_id, inv_ref, unit_ids;
END $$;

COMMIT;
