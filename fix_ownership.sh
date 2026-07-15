#!/bin/bash
set -e

echo "=== Fixing table ownership ==="
sudo -u postgres psql -d zyhostore -c "
DO \$\$
DECLARE
  r RECORD;
BEGIN
  FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
    EXECUTE 'ALTER TABLE public.' || quote_ident(r.tablename) || ' OWNER TO zyhostore_user';
  END LOOP;
END\$\$;
"

echo "=== Fixing sequence ownership ==="
sudo -u postgres psql -d zyhostore -c "
DO \$\$
DECLARE
  r RECORD;
BEGIN
  FOR r IN SELECT sequence_name FROM information_schema.sequences WHERE sequence_schema = 'public' LOOP
    EXECUTE 'ALTER SEQUENCE public.' || quote_ident(r.sequence_name) || ' OWNER TO zyhostore_user';
  END LOOP;
END\$\$;
"

echo "=== Verifying ownership ==="
PGPASSWORD='ef05a4fb69483e235900066f11bbf4ba' psql -U zyhostore_user -h localhost -d zyhostore -c "SELECT count(*) as total_tables FROM pg_tables WHERE schemaname='public';"

echo "=== Done! ==="
