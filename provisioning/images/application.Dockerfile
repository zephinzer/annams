ARG ENVIRONMENT="development"
ARG DEPENDENCY_VERSION="latest"
FROM zephinzer/annams:deps-${ENVIRONMENT}-${DEPENDENCY_VERSION}
WORKDIR /app
USER app
COPY ./src /app/src
COPY ./tests /app/tests
COPY ./provisioning /app/provisioning
ENTRYPOINT [ "npm", "start" ]
