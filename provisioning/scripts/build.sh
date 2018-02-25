#!/bin/sh
docker build \
  --file ./provisioning/images/application.Dockerfile \
  --build-arg YARN_FLAGS="--${ENV}" \
  --build-arg NODE_ENV="${ENV}" \
  --tag zephinzer/annams:latest \
  .;