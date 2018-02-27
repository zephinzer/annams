#!/bin/sh
if [ "${NODE_ENV}" != "production" ]; then RUN="nodemon"; else RUN="node"; fi;
${RUN} ./src/entrypoint.js;
