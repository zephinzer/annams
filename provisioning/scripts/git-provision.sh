#!/bin/sh
CURR_DIR="$(dirname $0)";
printf -- "CURR_DIR: ${CURR_DIR}\n";

GIT_HOOKS_SRC="${CURR_DIR}/dot-git/*";
GIT_HOOKS_DST="${CURR_DIR}/../../.git/hooks";

printf -- 'Copying git hooks\n';
printf -- "  from : ${GIT_HOOKS_SRC}\n";
printf -- "  to   : ${GIT_HOOKS_DST}\n";

cp -r ${GIT_HOOKS_SRC} ${GIT_HOOKS_DST};

if [ "$?" = "0" ]; then
  printf -- '\033[1m\033[32mGit hooks copied successfully\033[0m\n';
  exit 0;
else 
  printf -- '\033[1m\033[31mFailed to copy git hooks.\033[0m\n';
  exit 1;
fi;
