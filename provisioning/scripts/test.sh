#!/bin/sh
printf -- "Called with arguments: $@ (->MOCHA_FLAGS)\n";
MOCHA_FLAGS="$@";
FLAG_WATCH='--watch';
CALLED_WITH_COMMAND="$0 $@";
if [ -z "${CALLED_WITH_COMMAND##*$FLAG_WATCH*}" ]; then
  NYC_FLAGS='--silent';
else
  NYC_FLAGS='';
fi;
export NODE_ENV='test';

case $CHOSEN_ACTION in
  help)
    printf << HELP
hi
HELP
    ;;
  deployment)
    command -v docker-compose >/dev/null;
    if [ "$?" != '0' ]; then
      printf -- 'Failed to find "docker-compose" command. Verify it is installed and try again.\n';
      printf -- 'On UNIX systems: "pip install docker-compose" should do the trick. Good luck, Windows.\n';
      printf -- 'Exiting with status code 1.\n';
      exit 1;
    fi;
    docker-compose -f ./provisioning/deployments/docker/development/docker-compose.yml config;
    docker-compose -f ./provisioning/deployments/docker/mock-mapper/docker-compose.yml config;
    docker-compose -f ./provisioning/deployments/docker/test/docker-compose.yml config;
  ;;
  lint)
    command -v eslint >/dev/null;
    if [ "$?" != '0' ]; then
      printf -- 'Failed to find "eslint" command. Verify it is installed and try again.\n';
      printf -- 'Try running "yarn install" or "npm install" before running this script.\n';
      printf -- 'Exiting with status code 1.\n';
      exit 1;
    fi;
    eslint .;
  ;;
  sec)
    command -v eslint >/dev/null;
    if [ "$?" != '0' ]; then
      printf -- 'Failed to find "nsp" command. Verify it is installed and try again.\n';
      printf -- 'Try running "yarn install" or "npm install" before running this script.\n';
      printf -- 'Exiting with status code 1.\n';
      exit 1;
    fi;
    nsp check .;
  ;;
  watch)
    command -v nyc >/dev/null;
    if [ "$?" != '0' ]; then
      printf -- 'Failed to find "nyc" command. Verify it is installed and try again.\n';
      printf -- 'Try running "yarn install" or "npm install" before running this script.\n';
      printf -- 'Exiting with status code 1.\n';
      exit 1;
    fi;
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
    mkdir -p coverage/.nyc_output;
    nyc report --temp-directory=coverage/.nyc_output;
  ;;
  *)
    command -v nyc >/dev/null;
    if [ "$?" != '0' ]; then
      printf -- 'Failed to find "nyc" command. Verify it is installed and try again.\n';
      printf -- 'Try running "yarn install" or "npm install" before running this script.\n';
      printf -- 'Exiting with status code 1.\n';
      exit 1;
    fi;
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
    mkdir -p coverage/.nyc_output;
    nyc report --temp-directory=coverage/.nyc_output;
  ;;
esac;
