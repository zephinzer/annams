#!/bin/sh
if [ "${ENV}" = "" ]; then
  ENV='production';
fi;
printf -- "Building ANNAMS in '${ENV}' environment...\n";
docker build \
  --file ./provisioning/images/application.Dockerfile \
  --build-arg YARN_FLAGS="--${ENV}" \
  --build-arg NODE_ENV="${ENV}" \
  --tag zephinzer/annams:${ENV}-latest \
  .;
if [ "$?" = "0" ]; then 
  printf -- "ANNAMS built in '${ENV}' environment.\n";
fi;