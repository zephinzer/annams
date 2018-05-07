#!/bin/sh
curl -d '{"targetBaseUrl": "http://127.0.0.1:10000"}' -X POST 'http://127.0.0.1:8080/__admin/recordings/start';
curl -X GET 'http://127.0.0.1:8080/';
curl -X GET 'http://127.0.0.1:8080/healthz';
curl -X GET 'http://127.0.0.1:8080/readyz';
curl -X GET 'http://127.0.0.1:8080/metrics';
curl -X POST 'http://127.0.0.1:8080/api/v1/user';
curl -X GET 'http://127.0.0.1:8080/api/v1/users';
curl -X GET 'http://127.0.0.1:8080/api/v1/user';
curl -X GET 'http://127.0.0.1:8080/api/v1/user/:userId';
curl -X PATCH 'http://127.0.0.1:8080/api/v1/user/group';
curl -X DELETE 'http://127.0.0.1:8080/api/v1/user';
curl -X POST 'http://127.0.0.1:8080/__admin/recordings/stop';