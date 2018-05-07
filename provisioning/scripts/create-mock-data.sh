#!/bin/sh
if [ "${ANNAMS_PORT}" = '' ]; then ANNAMS_PORT=10000; fi;
if [ "${WIREMOCK_PORT}" = '' ]; then WIREMOCK_PORT=18080; fi;

ANNAMS_BASE_URL="http://127.0.0.1:${ANNAMS_PORT}";
WIREMOCK_BASE_URL="http://127.0.0.1:${WIREMOCK_PORT}";

curl -X GET "${WIREMOCK_BASE_URL}/__admin/mappings";
if [ "$?" != "0" ]; then
  printf -- '\033[31m\033[1mWiremock does not seem to be up. Start it with "npm run start-mock" or "npm run start-services".\033[0m';
  exit 1;
fi;
curl -X GET "${ANNAMS_BASE_URL}/healthz";
if [ "$?" != "0" ]; then
  printf -- '\033[31m\033[1mAnnams does not seem to be up. Start it with "npm start".\033[0m';
  exit 1;
fi;

curl -X GET 

curl -d "{\"targetBaseUrl\": \"${ANNAMS_BASE_URL}\"}" \
  -X POST "${WIREMOCK_BASE_URL}/__admin/recordings/start";
curl -X GET "${WIREMOCK_BASE_URL}/";
curl -X GET "${WIREMOCK_BASE_URL}/healthz";
curl -X GET "${WIREMOCK_BASE_URL}/readyz";
curl -X GET "${WIREMOCK_BASE_URL}/metrics";
curl -X POST "${WIREMOCK_BASE_URL}/api/v1/user";
curl -X GET "${WIREMOCK_BASE_URL}/api/v1/users";
curl -X GET "${WIREMOCK_BASE_URL}/api/v1/user";
curl -X GET "${WIREMOCK_BASE_URL}/api/v1/user/:userId";
curl -X PATCH "${WIREMOCK_BASE_URL}/api/v1/user/group";
curl -X DELETE "${WIREMOCK_BASE_URL}/api/v1/user";
curl -X POST "${WIREMOCK_BASE_URL}/__admin/recordings/stop";