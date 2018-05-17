#!/bin/sh
if [ "${DATABASE_HOST}" = "" ]; then DATABASE_HOST=dev_database; fi;
if [ "${DATABASE_HOST}" = "" ]; then DATABASE_PORT=3306; fi;

DATABASE_UP=0;
printf -- 'Waiting for MySQL to be up..';
while [ "${DATABASE_UP}" = "0" ]; do
  nc -z -v "${DATABASE_HOST}" "${DATABASE_PORT}";
  if [ "$?" = "0" ]; then DATABASE_UP=1; fi;
  printf '.';
  sleep 1;
done;
printf -- " MySQL found at ${DATABASE_HOST}:${DATABASE_PORT}.\n";

if [ "${ENABLE_MIGRATION}" = "1" ]; then
  printf -- 'Performing migration...\n';
  knex migrate:latest;
fi;

if [ "${ENABLE_SEEDING}" = "1" ]; then
  printf -- 'Performing data seeding...\n';
  knex seed:run;
fi;

exit 0;