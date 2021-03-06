#!/bin/sh
printf -- 'From environment:\n';
if [ "${DB_HOST}" = "" ]; then DB_HOST=dev_database; fi;
printf -- "  DB_HOST:          ${DB_HOST}\n";
if [ "${DB_PORT}" = "" ]; then DB_PORT=3306; fi;
printf -- "  DB_PORT:          ${DB_PORT}\n";
if [ "${ENABLE_MIGRATION}" = "" ]; then ENABLE_MIGRATION=0; fi;
printf -- "  ENABLE_MIGRATION: ${ENABLE_MIGRATION}\n";
if [ "${ENABLE_SEEDING}" = "" ]; then ENABLE_SEEDING=0; fi;
printf -- "  ENABLE_SEEDING:   ${ENABLE_SEEDING}\n";
printf -- '-\n';

DATABASE_UP=0;
printf -- "Waiting for MySQL at '${DB_HOST}:${DB_PORT}' to be up..";
while [ "${DATABASE_UP}" = "0" ]; do
  nc -z -v "${DB_HOST}" "${DB_PORT}" 2>/dev/null;
  if [ "$?" = "0" ]; then DATABASE_UP=1; fi;
  printf '.';
  sleep 1;
done;
printf -- " MySQL found at ${DB_HOST}:${DB_PORT}.\n";

if [ "${ENABLE_MIGRATION}" = "1" ]; then
  printf -- 'Performing migration...\n';
  DATABASE_HOST="${DB_HOST}" \
    DATABASE_PORT="${DB_PORT}" \
    knex migrate:latest;
fi;

if [ "${ENABLE_SEEDING}" = "1" ]; then
  printf -- 'Performing data seeding...\n';
  DATABASE_HOST="${DB_HOST}" \
    DATABASE_PORT="${DB_PORT}" \
    knex seed:run;
fi;

exit 0;