#!/bin/sh
docker run \
  --user $(id -u $(whoami)) \
  --network host \
  --detach=true \
  --name annams-mock \
  --volume "$(pwd)/mock:/app/data:Z" \
  zephinzer/annams:mock-latest \
;

docker logs -f annams-mock;