#!/bin/sh
if [ "${ENV}" != "production" ]; then RUN="nodemon"; else RUN="node"; fi;
${RUN} ./src/entrypoint.js;
