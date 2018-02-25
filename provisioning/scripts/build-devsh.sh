#!/bin/sh
docker build \
  --file ./provisioning/images/application.Dockerfile \
  --build-arg YARN_FLAGS='--development' \
  --build-arg NODE_ENV='development' \
  --tag zephinzer/annams:latest \
  .;