-- Insert migration records yang belum ada
INSERT INTO payload_migrations (name, batch, created_at, updated_at)
SELECT '20260707_130840', 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM payload_migrations WHERE name = '20260707_130840');

INSERT INTO payload_migrations (name, batch, created_at, updated_at)
SELECT '20260712_102537_checkout_sessions_membership_points', 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM payload_migrations WHERE name = '20260712_102537_checkout_sessions_membership_points');

INSERT INTO payload_migrations (name, batch, created_at, updated_at)
SELECT '20260713_004500_settings_commerce_enable_usd', 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM payload_migrations WHERE name = '20260713_004500_settings_commerce_enable_usd');

INSERT INTO payload_migrations (name, batch, created_at, updated_at)
SELECT '20260714_145643', 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM payload_migrations WHERE name = '20260714_145643');

-- Verifikasi semua migration
SELECT name, batch FROM payload_migrations ORDER BY batch, name;
