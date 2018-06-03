#!/bin/sh
CURR_DIR="$(dirname $0)";
CALLED_WITH_ARGS="$*";
CHOSEN_ACTION="$(printf -- "${*}" | cut -f 1 -d ' ')";
ARGUMENTS="$(printf -- "${*}" | cut -f2- -d ' ')";

printf -- "\033[1m";
printf -- "------------------\n";
printf -- "Called...\n";
printf -- "  from directory: ${PWD}/${CURR_DIR}\n";
printf -- "  with arguments: ${CALLED_WITH_ARGS}\n";
printf -- "  with action:    ${CHOSEN_ACTION}\n";
printf -- "  with params:    ${ARGUMENTS}\n";
printf -- "------------------\n";
printf -- "\033[0m";

export NODE_ENV='test';

case $CHOSEN_ACTION in
  help)
    printf -- "$(cat << HELP
\033[1mUsage\033[0m:
  npm test [action]

\033[1mActions\033[0m:
  help           - displays this message
  deployment     - runs a check on docker compose files
  lint           - runs the linter on this project
  sec            - runs a security check on this project's dependencies
  watch          - runs the unit tests and watches for changes
  *              - runs the unit tests
HELP
)";
    exit 0;
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
      --clean \
      --produce-source-map \
      --report-dir=coverage \
      --reporter=lcov \
      --reporter=html \
      --show-process-tree \
      --temp-directory=coverage/.nyc_output \
      mocha --recursive ./src/test.entrypoint.js \
      "./db/**/*.test.js" \
      "./src/**/*.test.js";
    mkdir -p coverage/.nyc_output;
    nyc report --temp-directory=coverage/.nyc_output;
  ;;
esac;
