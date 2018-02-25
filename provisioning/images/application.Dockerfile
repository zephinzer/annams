FROM node:8-alpine
WORKDIR /app
COPY . /app
ARG NODE_ENV="development"
ARG YARN_FLAGS="--development"
ENV NODE_ENV="${NODE_ENV}"
RUN yarn install ${YARN_FLAGS} \
  && addgroup -S app \
  && adduser -S -D -u 1000 -G app -h /app app \
  && chown app:app -R /app
USER app
VOLUME [ "/app/config.d.js" ]
ENTRYPOINT [ "npm", "start" ]