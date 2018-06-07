FROM alpine:3.6
RUN apk update --no-cache \
  && apk add --no-cache vim git curl jq
WORKDIR /app
ENTRYPOINT [ "/bin/sh" ]