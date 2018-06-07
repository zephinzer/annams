#!/bin/sh
CURR_DIR="$(dirname $0)";
CHOSEN_ACTION="$1";

MOCK_IMAGE_PATH='./provisioning/images/service-mock.Dockerfile';
MOCK_COMPOSE_PATH='./provisioning/deployments/docker/mock-mapper/docker-compose.yml';
MAPPER_COMPOSE_PATH='./provisioning/deployments/docker/mock-mapper/docker-compose.yml';
export USER_ID=$(id -u $(whoami));

case $CHOSEN_ACTION in
  'build-mapper')
    printf -- 'Building the mock mapper...\n';
    docker-compose \
      -f "${MAPPER_COMPOSE_PATH}" \
      build \
    ;
    exit $?;
  ;;
  'clear-data')
    rm -rf ${CURR_DIR}/../../mock/mappings/*.*;
    rm -rf ${CURR_DIR}/../../mock/__files/*.*;
    exit 0;
  ;;
  'exec')
    docker exec -it annams_dev_mock_mapper_wiremock /bin/sh;
  ;;
  'export')
    docker build \
      --file "${MOCK_IMAGE_PATH}" \
      --tag zephinzer/annams:mock-latest \
      . \
    ;
    exit $?
  ;;
  'map')
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
    printf -- ' -- build-mapper : triggers build of the mock mapper\n';
    printf -- ' -- clear-data   : clears the mock data\n';
    printf -- ' -- export       : builds a zephinzer/annams:mock-altest image\n';
    printf -- ' -- exec         : spins up a shell in the mock container\n';
    printf -- ' -- map          : runs the url scrape to generate the mock data\n';
    printf -- ' -- start        : starts the mock docker compose\n';
    printf -- ' -- stop         : stops the mock docker compose\n';
  ;;
esac;