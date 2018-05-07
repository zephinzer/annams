#!/bin/sh
export USER_ID=$(id -u $(whoami));
docker-compose -f ./provisioning/deployments/docker/mock/docker-compose.yml down;