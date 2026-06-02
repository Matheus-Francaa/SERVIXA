#!/bin/sh
set -e

echo "Running database migrations..."
pnpm db:push

echo "Seeding database..."
pnpm seed 2>/dev/null || true

echo "Starting API..."
exec "$@"
