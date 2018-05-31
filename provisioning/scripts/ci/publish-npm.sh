#!/bin/sh
CURR_DIR="$(dirname $0)";

PROJ_DIR="$(pwd)/${CURR_DIR}/../..";
printf -- "Project directory: ${PROJ_DIR}\n";

CURR_VERSION="$(docker run -v "${PROJ_DIR}:/app" zephinzer/vtscripts:latest get-latest -q)";
printf -- "Current version:   ${CURR_VERSION}\n";

cp ${PROJ_DIR}/package.json ${PROJ_DIR}/package.template.json;
printf -- "\
const fs = require('fs');\n\
let packageJson = require('${PROJ_DIR}/package.template.json');\n\
packageJson.version = '${CURR_VERSION}';\n\
fs.writeFileSync(\n\
  '${PROJ_DIR}/package.json',\n\
  JSON.stringify(packageJson, null, 2)\n\
); \n\
" > ${CURR_DIR}/version-bump.js;
printf -- "Published:         $(node ${CURR_DIR}/version-bump.js)";

rm -rf ${CURR_DIR}/version-bump.js;
cd ${PROJ_DIR} && npm publish;
rm -rf ${PROJ_DIR}/package.json;
mv ${PROJ_DIR}/package.template.json ${PROJ_DIR}/package.json;
