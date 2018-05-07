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
nyc \
  ${NYC_FLAGS} \
  --clean \
  --produce-source-map \
  --report-dir=coverage \
  --reporter=lcov \
  --reporter=text-lcov \
  --show-process-tree \
  --temp-directory=coverage/.nyc_output \
  mocha $@ --recursive ./src/test.entrypoint.js \
  "./db/**/*.test.js" \
  "./src/**/*.test.js";
nyc report --temp-directory=coverage/.nyc_output;