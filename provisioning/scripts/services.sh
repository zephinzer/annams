#!/bin/sh
CHOSEN_ACTION="$1";

DOCKER_COMPOSE_PATH="./provisioning/deployments/docker/development/docker-compose.yml";
export USER_ID=$(id -u $(whoami));

case $CHOSEN_ACTION in
  'build')
    docker-compose -f "${DOCKER_COMPOSE_PATH}" build;
    exit $?;
    ;;
  'status')
    _=$(docker ps | grep annams_dev_metrics_prometheus);
    printf -- 'metrics:      ';
    if [ "$?" = "0" ]; then printf -- 'UP\n';
    else printf -- 'DOWN\n';
    fi;
    _=$(docker ps | grep annams_dev_mock_wiremock);
    printf -- 'mock:         ';
    if [ "$?" = "0" ]; then printf -- 'UP\n';
    else printf -- 'DOWN\n';
    fi;
    _=$(docker ps | grep annams_dev_database_mysql);
    printf -- 'database:     ';
    if [ "$?" = "0" ]; then printf -- 'UP\n';
    else printf -- 'DOWN\n';
    fi;
    _=$(docker ps | grep annams_dev_annams);
    printf -- 'application:  ';
    if [ "$?" = "0" ]; then printf -- 'UP\n';
    else printf -- 'DOWN\n';
    fi;
    _=$(docker ps | grep annams_dev_metrics_push_gateway);
    printf -- 'push gateway: ';
    if [ "$?" = "0" ]; then printf -- 'UP\n';
    else printf -- 'DOWN\n';
    fi;
    _=$(docker ps | grep annams_dev_cache_redis);
    printf -- 'cache:        ';
    if [ "$?" = "0" ]; then printf -- 'UP\n';
    else printf -- 'DOWN\n';
    fi;
    _=$(docker ps | grep annams_dev_tracing_zipkin);
    printf -- 'tracing:      ';
    if [ "$?" = "0" ]; then printf -- 'UP\n';
    else printf -- 'DOWN\n';
    fi;
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