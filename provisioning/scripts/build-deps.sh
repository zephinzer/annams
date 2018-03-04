#!/bin/sh
DEPENDENCIES_HASH="${1}";
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
  --file ./provisioning/images/dependencies.Dockerfile \
  --tag zephinzer/annams:dependency-set-${ENV}-${DEPENDENCIES_HASH} \
  .;