# ANNAMS
**Authentication && Authorization MicroService** created for container-based deployments.

1. [Authentication](#authentication)
2. [Authorisation](#authorization)
3. [MicroService](#microservice)

## Documentation Index

1. [Configurations](./docs/configuration.md)
2. [Deployment Notes](./docs/deployment.md)
3. [REST-ful API](./docs/api-restful.md)
4. [GraphQL API](./docs/api-graphql.md)
5. [Contributing](./docs/contributing.md)

## About ANNAMS
### Authentication
Authentication is the process of knowing who a user is. Annams provides for the following methods of authenticating a user:

- [ ] Email/password
- [ ] Username/password
- [ ] One-Time-Email
- [ ] Via Facebook
- [ ] Via Google

To keep Annams stateless, we utilise JSON Web Tokens (JWTs) which are signed using asymmetric keys.

### Authorization
Authorization is the process of restricting access to content a user may access. Annams allows you to create Resource Types, Groups, and Users.

1. Resource Types are atomic and can be assigned one or more Groups.
2. Groups can be assigned one or more Users.
3. Users belonging to a Group that has access to a Resource Type will be able to access the Resource Type, otherwise, access can be denied.

### MicroService
Annams was created for deployment as part of a larger microservice architecture and accounts for both intra-network communications with other microservices, as well as communication with a client-side application. We implement the following features:

- [x] Basic HTTP header security
- [x] GZIP compressed responses
- [x] Metrics collection/exposing (via Prometheus)
- [x] Liveness Checks
- [x] Readiness Checks
- [x] Cross-Origin-Resource-Sharing (CORS)
- [x] MicroServices compatible logging (via Pino)
- [x] Containerisable (via Docker)
- [x] Traceability (via Zipkin)
- [ ] Virtual Machine Deployment Support (via PM2)
- [ ] Container Deployment Support (via Docker)
- [ ] Container Deployment Support (via Kubernetes)
- [ ] REST-ful API

### Future Development
The following are on the roadmap for future development:

- [ ] HTTP/2 Compatibility
- [ ] GraphQL API
- [ ] Administrator Frontend

## Architecture Notes
### Primary Technologies
- Shell Scripting
- JavaScript (ES2017)
- Docker
- Kubernetes

### Significant Frameworks/Libraries/Tools
- App Framework : [Express](https://github.com/expressjs/express)
- API Framework : [Swagger](https://swagger.io/)
- Service Logger : [Pino](https://github.com/pinojs/pino)
- Request Logger : [Morgan](https://github.com/expressjs/morgan)
- Query Builder : [Knex](http://knexjs.org/)
- Object Relational Mapper : [Objection.js](https://github.com/Vincit/objection.js/)
- Test Framework : [Mocha](https://mochajs.org/)
- Assertion Library : [Chai](http://chaijs.com/)
- Code Quality Checker : [ESLint](https://eslint.org/)
- Vulnerability Assessment : [NSP](https://github.com/nodesecurity/nsp)
- Metrics : [Prometheus](https://prometheus.io/)
- Request Tracing : [Zipkin](https://zipkin.io/)
- Container Bundling : [Docker](https://www.docker.com/)
- Continuous Integration : [Travis](https://travis-ci.org/)
- Deployment : [PM2](https://github.com/Unitech/pm2) [Docker](https://www.docker.com/), [Kubernetes](https://kubernetes.io/)
- Releases : [NPM](https://www.npmjs.com/), [GitHub](https://github.com), [DockerHub](https://hub.docker.com)

## License

Annams is licensed under the GPLv3 license.

- - -

Authentication && Authorization MicroService (ANNAMS)

Copyright (C) 2018 Joseph Matthias Goh (@zephinzer)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.

- - -

# Cheers