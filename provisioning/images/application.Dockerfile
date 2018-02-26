FROM node:8-alpine
WORKDIR /app
COPY . /app
ARG NODE_ENV="development"
ARG YARN_FLAGS="--development"
ENV NODE_ENV="${NODE_ENV}"
ENV YARN_FLAGS="${YARN_FLAGS}"
RUN yarn install ${YARN_FLAGS} \
  && addgroup -S app \
  && adduser -S -D -u 1001 -G app -h /app app \
  && chown app:app -R /app
USER app
ENTRYPOINT [ "npm", "start" ]