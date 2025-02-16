#!/bin/sh
set -e

npx prisma generate

exec "$@"
