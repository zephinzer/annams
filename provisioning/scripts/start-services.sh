#!/bin/sh
docker-compose -f ./provisioning/deployments/docker/development/docker-compose.yml rm -f -s -v;
docker-compose -f ./provisioning/deployments/docker/development/docker-compose.yml up -d --build;