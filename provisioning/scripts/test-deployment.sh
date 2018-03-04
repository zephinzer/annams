#!/bin/sh
docker-compose -f ./provisioning/deployments/docker/development/docker-compose.yml config;
docker-compose -f ./provisioning/deployments/docker/test/docker-compose.yml config;