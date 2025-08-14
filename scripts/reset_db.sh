#!/bin/bash

source ./.env

echo "Resetting database: $DATABASE_NAME"
echo "This will drop and recreate the database. Press enter to continue or Ctrl+C to cancel."
read

psql -U ky0422 -d postgres -c "DROP DATABASE IF EXISTS $DATABASE_NAME;"
psql -U ky0422 -d postgres -c "CREATE DATABASE $DATABASE_NAME;"