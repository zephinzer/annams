#!/bin/sh
docker build \
  --file ./provisioning/images/service-mock.Dockerfile \
  --tag zephinzer/annams:mock-latest \
  . \
;