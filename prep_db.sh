#!/bin/bash
export PGPASSWORD='ef05a4fb69483e235900066f11bbf4ba'

echo "=== Terminating active connections ==="
psql -U zyhostore_user -h localhost -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'zyhostore' AND pid <> pg_backend_pid();"

echo "=== Dropping database ==="
psql -U zyhostore_user -h localhost -d postgres -c "DROP DATABASE IF EXISTS zyhostore;"

echo "=== Creating database ==="
psql -U zyhostore_user -h localhost -d postgres -c "CREATE DATABASE zyhostore OWNER zyhostore_user;"

echo "=== Restoring from local dump ==="
pg_restore -U zyhostore_user -h localhost -d zyhostore --no-owner --no-privileges -v /tmp/local_db_dump.backup 2>&1 | tail -20

echo "=== Done! ==="
