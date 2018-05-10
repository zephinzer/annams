#!/bin/sh
CHOSEN_ACTION="$1";

DOCKER_COMPOSE_PATH="./provisioning/deployments/docker/development/docker-compose.yml";
export USER_ID=$(id -u $(whoami));

case $CHOSEN_ACTION in
  'build')
    docker-compose -f "${DOCKER_COMPOSE_PATH}" build;
    exit $?;
    ;;
  'start')
    docker-compose -f "${DOCKER_COMPOSE_PATH}" rm -f -s -v;
    docker-compose -f "${DOCKER_COMPOSE_PATH}" up -d --build;
    exit $?;
    ;;
  'stop')
    docker-compose -f "${DOCKER_COMPOSE_PATH}" down;
    exit $?;
    ;;
  *)
    printf -- 'Available options:\n';
    printf -- ' -- build    : triggers build of the docker compose\n';
    printf -- ' -- start    : starts the supporting services\n';
    printf -- ' -- stop     : stops the supporting services\n';
    ;;
esac;