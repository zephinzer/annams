FROM alpine:3.7
RUN apk add --no-cache openjdk8
WORKDIR /app
RUN wget -O ./wiremock-2.17.0.jar http://repo1.maven.org/maven2/com/github/tomakehurst/wiremock-standalone/2.17.0/wiremock-standalone-2.17.0.jar
RUN chmod +x /app/wiremock-2.17.0.jar
RUN printf -- '#!/bin/sh\n \
  java -jar /app/wiremock-2.17.0.jar \
  --root-dir /app/data \
' > /usr/bin/wiremock
RUN chmod +x /usr/bin/wiremock
COPY ./mock /app/data
EXPOSE 8080
VOLUME [ "/app/data" ]
ENTRYPOINT [ "wiremock" ]