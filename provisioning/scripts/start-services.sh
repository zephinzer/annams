#!/bin/sh
export USER_ID=$(id -u $(whoami));
docker-compose -f ./provisioning/deployments/docker/development/docker-compose.yml rm -f -s -v;
docker-compose -f ./provisioning/deployments/docker/development/docker-compose.yml up -d --build;