#!/bin/sh
CHOSEN_ACTION="$1";

export NODE_ENV='test';

case $CHOSEN_ACTION in
  deployment)
    docker-compose -f ./provisioning/deployments/docker/development/docker-compose.yml config;
    docker-compose -f ./provisioning/deployments/docker/test/docker-compose.yml config;
  ;;
  lint)
    eslint .;
  ;;
  sec)
    nsp check .;
  ;;
  watch)
    nyc \
      --silent \
      --clean \
      --produce-source-map \
      --report-dir=coverage \
      --reporter=lcov \
      --reporter=text-lcov \
      --show-process-tree \
      --temp-directory=coverage/.nyc_output \
      mocha --watch --recursive ./src/test.entrypoint.js \
      "./db/**/*.test.js" \
      "./src/**/*.test.js";
    nyc report --temp-directory=coverage/.nyc_output;
  ;;
  *)
    nyc \
      --silent \
      --clean \
      --produce-source-map \
      --report-dir=coverage \
      --reporter=lcov \
      --reporter=text-lcov \
      --show-process-tree \
      --temp-directory=coverage/.nyc_output \
      mocha --recursive ./src/test.entrypoint.js \
      "./db/**/*.test.js" \
      "./src/**/*.test.js";
    nyc report --temp-directory=coverage/.nyc_output;
  ;;
esac;
