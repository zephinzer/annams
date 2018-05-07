FROM node:8-alpine
WORKDIR /app
ARG NODE_ENV="development"
ARG YARN_FLAGS="--development"
ARG USER_ID=1001
ENV NODE_ENV="${NODE_ENV}"
ENV YARN_FLAGS="${YARN_FLAGS}"
ENV USER_ID="${USER_ID}"
RUN addgroup -S app \
  && adduser -S -D -u ${USER_ID} -G app -h /app app \
  && chown app:app -R /app
USER app
COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json
COPY ./yarn.lock /app/yarn.lock
COPY ./.yarnclean /app/.yarnclean
RUN yarn install ${YARN_FLAGS} \
  && yarn cache clean \
  && npm cache clean --force
ENTRYPOINT [ "/bin/sh" ]