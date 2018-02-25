# ANNAMS
**Authentication && Authorization MicroService** created for container-based deployments.

1. Authentication
2. &&
3. Authoorisation
4. Microservice

## Documentation Index

1. [Configurations](./docs/configuration.md)
2. [Deployment Notes](./docs/deployment.md)
3. [REST-ful API](./docs/api-restful.md)
4. [GraphQL API](./docs/api-graphql.md)
5. [Contributing](./docs/contributing.md)

## About ANNAMS
### Authentication
Authentication is the process of knowing who a user is. Annams provides for the following methods of authenticating a user:

1. Email/password
2. Username/password
3. One-Time-Email
4. Via Facebook
5. Via Google

To keep Annams stateless, we utilise JSON Web Tokens (JWTs) which are signed using asymmetric keys.

### Authorization
Authorization is the process of restricting access to content a user may access. Annams allows you to create Resource Types, Groups, and Users.

1. Resource Types are atomic and can be assigned one or more Groups.
2. Groups can be assigned one or more Users.
3. Users belonging to a Group that has access to a Resource Type will be able to access the Resource Type, otherwise, access can be denied.

### Microservice
Annams was created for deployment as part of a larger microservice architecture and accounts for both intra-network communications with other microservices, as well as communication with a client-side application. We implement the following features:

- [ ] Virtual Machine Deployment Support (via PM2)
- [ ] Container Deployment Support (via Docker)
- [ ] Metrics (via Prometheus)
- [ ] Logging (via Fluentd)
- [ ] Liveness Checks
- [ ] Readiness Checks
- [ ] Cross-Origin-Resource-Sharing (CORS)
- [ ] REST-ful API
- [ ] HTTP/2 Compatibility
- [ ] GraphQL API
- [ ] Administrator Frontend

## License

Annams is licensed under the GPLv3 license.

- - -

Authentication && Authorization MicroService (ANNAMS)
Copyright (C) 2017 Joseph Matthias Goh

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