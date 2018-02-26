#!/bin/sh
docker build \
  --file ./provisioning/images/development.Dockerfile \
  --tag zephinzer/annams:devsh-latest \
  .;