#!/bin/sh
set -e

echo "Running Prisma migrations..."
npx prisma migrate deploy

echo "Starting server..."
exec node -r dotenv/config -r module-alias/register ./dist/main.js
