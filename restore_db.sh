#!/bin/bash
set -e

echo "=== Terminating active connections ==="
sudo -u postgres psql -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'zyhostore' AND pid <> pg_backend_pid();"

echo "=== Dropping database ==="
sudo -u postgres psql -c "DROP DATABASE IF EXISTS zyhostore;"

echo "=== Creating database ==="
sudo -u postgres psql -c "CREATE DATABASE zyhostore OWNER zyhostore_user;"

echo "=== Granting privileges ==="
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE zyhostore TO zyhostore_user;"

echo "=== Restoring from local SQL dump ==="
sudo -u postgres psql -d zyhostore -f /tmp/local_db_plain.sql 2>&1 | grep -E "ERROR|WARNING|error" | head -20 || true

echo "=== Fixing ownership ==="
sudo -u postgres psql -d zyhostore -c "REASSIGN OWNED BY postgres TO zyhostore_user;" 2>/dev/null || true

echo "=== Verifying tables ==="
PGPASSWORD='ef05a4fb69483e235900066f11bbf4ba' psql -U zyhostore_user -h localhost -d zyhostore -c "\dt" | head -30

echo "=== Done! ==="
