#!/bin/sh
CURRDIR="$(dirname $0)";
CHOSEN_ACTION="$1";

MOCK_IMAGE_PATH='./provisioning/images/service-mock.Dockerfile';
MOCK_COMPOSE_PATH='./provisioning/deployments/docker/mock/docker-compose.yml';
MAPPER_COMPOSE_PATH='./provisioning/deployments/docker/mock-mapper/docker-compose.yml';
export USER_ID=$(id -u $(whoami));

case $CHOSEN_ACTION in
  'build')
    docker-compose -f "${MOCK_COMPOSE_PATH}" build;
    exit $?;
  ;;
  'clear-data')
    rm -rf ${CURRDIR}/../../mock/mappings/*.*;
    rm -rf ${CURRDIR}/../../mock/__files/*.*;
    exit 0;
  ;;
  'exec')
    docker exec -it annams_mock /bin/sh;
  ;;
  'export')
    docker build \
      --file "${MOCK_IMAGE_PATH}" \
      --tag zephinzer/annams:mock-latest \
      . \
    ;
    exit $?
  ;;
  'reset')
    curl -X POST 'http://dev_mock:18080/__admin/mappings/reset';
    exit $?;
  ;;
  'scrape')
    npm run mock clear-data;
    docker-compose \
      -f "${MAPPER_COMPOSE_PATH}" \
      up --build --force-recreate \
    ;
    exit $?;
  ;;
  'start')
    docker-compose -f "${MOCK_COMPOSE_PATH}" up -d;
    exit $?;
  ;;
  'stop')
    docker-compose -f "${MOCK_COMPOSE_PATH}" down;
    exit $?;
  ;;
  *)
    printf -- 'Available options:\n';
    printf -- ' -- build      : triggers build of the mock docker compose\n';
    printf -- ' -- clear-data : clears the mock data\n';
    printf -- ' -- export     : builds a zephinzer/annams:mock-altest image\n';
    printf -- ' -- exec       : spins up a shell in the mock container\n';
    printf -- " -- reset      : resets the mock's data to the current mappings\n";
    printf -- ' -- scrape     : runs the url scrape\n';
    printf -- ' -- start      : starts the mock docker compose\n';
    printf -- ' -- stop       : stops the mock docker compose\n';
  ;;
esac;