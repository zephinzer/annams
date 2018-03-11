#!/bin/sh
if [ "${NODE_ENV}" != "production" ]; then RUN="nodemon --config ./.nodemon.json"; else RUN="node"; fi;
${RUN} ./src/entrypoint.js;
