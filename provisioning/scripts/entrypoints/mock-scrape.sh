#!/bin/sh
CURR_DIR="$(dirname $0)";

if [ "${ANNAMS_HOST}" = '' ]; then ANNAMS_HOST='127.0.0.1'; fi;
if [ "${ANNAMS_PORT}" = '' ]; then ANNAMS_PORT=10000; fi;
if [ "${WIREMOCK_HOST}" = '' ]; then WIREMOCK_HOST='127.0.0.1'; fi;
if [ "${WIREMOCK_PORT}" = '' ]; then WIREMOCK_PORT=18080; fi;

ANNAMS_BASE_URL="http://${ANNAMS_HOST}:${ANNAMS_PORT}";
WIREMOCK_BASE_URL="http://${WIREMOCK_HOST}:${WIREMOCK_PORT}";

printf -- "DEBUG> ANNAMS_BASE_URL: ${ANNAMS_BASE_URL}\n";
printf -- "DEBUG> WIREMOCK_BASE_URL: ${WIREMOCK_BASE_URL}\n";

AVAILABILITY_TTL=15;
printf -- 'Checking Wiremock availability..';
WIREMOCK_UP=0;
WIREMOCK_COUNT=0;
while [ $WIREMOCK_UP -eq 0 ] && [ $WIREMOCK_COUNT -lt $AVAILABILITY_TTL ]; do
  curl -sL  -X GET "${WIREMOCK_BASE_URL}/__admin/mappings" > /dev/null;
  if [ "$?" = "0" ]; then WIREMOCK_UP=1; fi;
  printf -- '.';
  WIREMOCK_COUNT=$(($WIREMOCK_COUNT + 1));
  sleep 1;
done;
if [ $WIREMOCK_UP -eq 0 ]; then
  printf -- ' Wiremock is not available. Exiting with status code 1.\n';
  exit 1;
else printf -- ' Wiremock is up.\n';
fi;

printf -- 'Checking Annams availability..';
ANNAMS_UP=0;
ANNAMS_COUNT=0;
while [ $ANNAMS_UP -eq 0 ] && [ $ANNAMS_COUNT -lt $AVAILABILITY_TTL ]; do
  curl -sL -X GET "${ANNAMS_BASE_URL}/healthz" > /dev/null;
  if [ "$?" = "0" ]; then ANNAMS_UP=1; fi;
  printf -- '.';
  ANNAMS_COUNT=$(($ANNAMS_COUNT + 1));
  sleep 1;
done;
if [ $ANNAMS_UP -eq 0 ]; then
  printf -- ' Annams is not available. Exiting with status code 1.\n';
  exit 1;
else printf -- ' Annams is up.\n';
fi;

printf -- 'Starting mock recorder... ';
curl -sSL -d "{\"targetBaseUrl\": \"${ANNAMS_BASE_URL}\"}" \
  -X POST "${WIREMOCK_BASE_URL}/__admin/recordings/start" > /dev/null;
printf -- 'Done.\n';

printf -- '\nGoing through API list:\n';

METHOD='GET'; URL="${WIREMOCK_BASE_URL}/";
printf -- "  - ${METHOD} ${URL}\n";
curl -sSL -X ${METHOD} "${URL}" > /dev/null;

METHOD='GET'; URL="${WIREMOCK_BASE_URL}/healthz";
printf -- "  - ${METHOD} ${URL}\n";
curl -sSL -X ${METHOD} "${URL}" > /dev/null;

METHOD='GET'; URL="${WIREMOCK_BASE_URL}/readyz";
printf -- "  - ${METHOD} ${URL}\n";
curl -sSL -X ${METHOD} "${URL}" > /dev/null;

METHOD='GET'; URL="${WIREMOCK_BASE_URL}/metrics";
printf -- "  - ${METHOD} ${URL}\n";
curl -sSL -X ${METHOD} "${URL}" > /dev/null;

METHOD='GET'; URL="${WIREMOCK_BASE_URL}/api/v1/account";
printf -- "  - ${METHOD} ${URL}\n";
curl -sSL -X ${METHOD} "${URL}" > /dev/null;

METHOD='POST'; URL="${WIREMOCK_BASE_URL}/api/v1/account";
printf -- "  - ${METHOD} ${URL}\n";
curl -sSL -X ${METHOD} "${URL}" > /dev/null;

METHOD='GET'; URL="${WIREMOCK_BASE_URL}/api/v1/accounts";
printf -- "  - ${METHOD} ${URL}\n";
curl -sSL -X ${METHOD} "${URL}" > /dev/null;

METHOD='GET'; URL="${WIREMOCK_BASE_URL}/api/v1/account/:accountId";
printf -- "  - ${METHOD} ${URL}\n";
curl -sSL -X ${METHOD} "${URL}" > /dev/null;

METHOD='PATCH'; URL="${WIREMOCK_BASE_URL}/api/v1/account/:accountId";
printf -- "  - ${METHOD} ${URL}\n";
curl -sSL -X ${METHOD} "${URL}" > /dev/null;

METHOD='DELETE'; URL="${WIREMOCK_BASE_URL}/api/v1/account";
printf -- "  - ${METHOD} ${URL}\n";
curl -sSL -X ${METHOD} "${URL}" > /dev/null;

printf -- '\nStopping mock recorder... ';
curl -sSL -X POST "${WIREMOCK_BASE_URL}/__admin/recordings/stop" > /dev/null;
printf -- 'Done.\n\n';

printf -- 'Listing generated mocks from "./mock/mappings":\n';
MOCK_LISTING=$(ls -a1 ${CURR_DIR}/../../../mock/mappings | egrep -v '^\.[a-z\.]*');
printf -- "${MOCK_LISTING}" | xargs -I@ sh -c 'printf -- "  - @\n";';
printf -- '\n';

printf -- 'Listing registered routes for the mock:\n';
printf -- "${MOCK_LISTING}" | xargs -I@ sh -c "cat $(pwd)/mock/mappings/@ | jq '.request | \"  - \" + .method + \" \" + .url' -r";

printf -- '\nExiting with code 0.\n';
exit 0;