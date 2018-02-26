#!/bin/sh
docker run \
  --interactive \
  --tty \
  --volume "${HOME}/.ssh:/root/.ssh" \
  --volume "${HOME}/.gitconfig:/root/.gitconfig" \
  --volume "$(pwd):/app" \
  --volume "/var/run/docker.sock:/var/run/docker.sock" \
  zephinzer/annams:devsh-latest;
