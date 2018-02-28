#!/bin/sh
if [ "${ENV}" = "" ]; then
  ENV='production';
fi;
docker build \
  --file ./provisioning/images/application.Dockerfile \
  --build-arg YARN_FLAGS="--${ENV}" \
  --build-arg NODE_ENV="${ENV}" \
  --tag zephinzer/annams:${ENV}-latest \
  .;
if [ "${ENV}" = "production" ]; then
  docker tag zephinzer/annams:${ENV}-latest zephinzer/annams:latest;
fi;