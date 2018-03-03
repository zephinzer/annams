#!/bin/sh
DEPENDENCIES_HASH="${1}";
ENVIRONMENT="${2}";
if [ "${DEPENDENCIES_HASH}" = "" ]; then
  printf -- '\e[31m\e[1m';
  printf -- 'Invalid argument provided - enter a hash as the argument to this command to use that as the dependency hash\n';
  printf -- 'Exiting with code 1.\n\n';
  printf -- '\e[0m';
  exit 1;
fi;
if [ "${ENVIRONMENT}" != "" ]; then
  BUILD_ARGUMENTS="--build-arg NODE_ENV=\"${ENVIRONMENT}\" --build-arg YARN_FLAGS=\"--${ENVIRONMENT}\"";
else
  ENVIRONMENT='production';
  BUILD_ARGUMENTS='';
fi;
docker build \
  ${BUILD_ARGUMENTS} \
  --file ./provisioning/images/dependencies.Dockerfile \
  --tag zephinzer/annams:dependency-set-${ENVIRONMENT}-${DEPENDENCIES_HASH} \
  .;