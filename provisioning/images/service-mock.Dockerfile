FROM alpine:3.7
RUN apk add --no-cache openjdk8
ARG VERSION_WIREMOCK='2.17.0'
WORKDIR /app
RUN wget -O /app/wiremock.jar http://repo1.maven.org/maven2/com/github/tomakehurst/wiremock-standalone/${VERSION_WIREMOCK}/wiremock-standalone-${VERSION_WIREMOCK}.jar \
  && chmod +x /app/wiremock.jar
COPY ./mock /app/data
RUN mv /app/data/wiremock /app/wiremock \
  && chmod +x /app/wiremock \
  && ln -s /app/wiremock /usr/bin/wiremock \
  && chmod +x /usr/bin/wiremock
EXPOSE 8080
VOLUME [ "/app/data" ]
ENTRYPOINT [ "wiremock" ]