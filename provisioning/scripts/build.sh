#!/bin/sh
CURR_DIR="$(dirname $0)";
CALLED_WITH_ARGS="$*";
CHOSEN_ACTION="$(printf -- "${*}" | cut -f 1 -d ' ')";
ARGUMENTS="$(printf -- "${*}" | cut -f2- -d ' ')";

printf -- "\033[1m";
printf -- "------------------\n";
printf -- "Called...\n";
printf -- "  from directory: ${PWD}/${CURR_DIR}\n";
printf -- "  with arguments: ${CALLED_WITH_ARGS}\n";
printf -- "  with action:    ${CHOSEN_ACTION}\n";
printf -- "  with params:    ${ARGUMENTS}\n";
printf -- "------------------\n";
printf -- "\033[0m";

export NODE_ENV='test';

case $CHOSEN_ACTION in
  deps)
    DEPENDENCIES_HASH="${ARGUMENTS}";
    if [ "${ENV}" = "" ]; then
      ENV='production';
    fi;
    if [ "${DEPENDENCIES_HASH}" = "" ]; then
      printf -- '\e[31m\e[1m';
      printf -- 'Invalid argument provided - enter a hash as the argument to this command to use that as the dependency hash\n';
      printf -- 'Exiting with code 1.\n\n';
      printf -- '\e[0m';
      exit 1;
    fi;
    docker build \
      --build-arg NODE_ENV=${ENV} \
      --build-arg YARN_FLAGS=--${ENV} \
      --file "${CURR_DIR}/../images/dependencies.Dockerfile" \
      --tag zephinzer/annams:deps-${ENV}-${DEPENDENCIES_HASH} \
      .;
  ;;
  mock)
    docker build \
      --file "${CURR_DIR}/../images/service-mock.Dockerfile" \
      --tag zephinzer/annams:mock-latest \
      . \
    ;
  ;;
  *)
    if [ "${ENV}" = "" ]; then
      ENV='production';
    fi;
    printf -- "Building ANNAMS in '${ENV}' environment...\n";
    docker build \
      --file "${CURR_DIR}/../images/application.Dockerfile" \
      --build-arg ENVIRONMENT="${ENV}" \
      --build-arg DEPENDENCY_VERSION="${DEPENDENCY_VERSION}" \
      --build-arg YARN_FLAGS="--${ENV}" \
      --build-arg NODE_ENV="${ENV}" \
      --tag zephinzer/annams:${ENV}-latest \
      .;
    if [ "$?" = "0" ]; then 
      printf -- "ANNAMS built in '${ENV}' environment.\n";
    fi;
  ;;
esac;
