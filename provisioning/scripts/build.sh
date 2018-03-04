#!/bin/sh
if [ "${ENV}" = "" ]; then
  ENV='production';
fi;
printf -- "Building ANNAMS in '${ENV}' environment...\n";
docker build \
  --file ./provisioning/images/application.Dockerfile \
  --build_arg ENVIRONMENT="${ENV}" \
  --build_arg DEPENDENCY_VERSION="${DEPENDENCY_VERSION}" \
  --build-arg YARN_FLAGS="--${ENV}" \
  --build-arg NODE_ENV="${ENV}" \
  --tag zephinzer/annams:${ENV}-latest \
  .;
if [ "$?" = "0" ]; then 
  printf -- "ANNAMS built in '${ENV}' environment.\n";
fi;