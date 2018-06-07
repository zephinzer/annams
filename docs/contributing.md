# Contributing to Annams

1. [Technologies Involved](#technologies-involved)
2. [Provisioning the Development Environment](#provisioning-the-development-environment)
3. [Running in development](#running-in-development)
4. [Testing](#testing)
5. [Continuous Integration](#continuous-integration)

We work via standard fork + merge request to `master` model.

## Technologies Involved
1. Node.js - *the runtime*
  - Express application framework
  - Knex query builder library
  - Mocha test framework
  - Chai assertion library
  - Sinon mocking library
2. Yarn - *dependency mangement*
3. Docker - *local development/deployment*
4. Wiremock - *consumer driven contract testing*
5. Kubernetes - *deployment*
  - MiniKube for testing deployments

## Provisioning the Development Environment
You'll need a Docker daemon installed and running on your host machine, and you can get it from this link: https://store.docker.com/search?type=edition&offering=community.

Confirm that Docker, Node 8 and Yarn are installed on your machine. You can verify this via:

```sh
docker version;
# > Client: ...
docker-compose version;
# > docker-compose version: ...
node -v
# > v....
yarn -v
# > ...
```

### Dependency Installation
To get started, install the NPM dependencies. We use Yarn to manage the dependencies:

```sh
yarn install;
```

### Support Services Startup
Next, start the services in the background:

```sh
npm run services start;
```

Verify they are up by running:

```sh
npm run service status;
```

> To stop the services, run `npm run services stop`

The available services are:

- MySQL (exposed on port 13306 on host - [localhost:13306](http://localhost:13306))
- Prometheus (exposed on port 19090 on host [localhost:19090](http://localhost:19090))
- Prometheus PushGateway (exposed on port 19091 on host [localhost:19091](http://localhost:19091))
- Redis (exposed on port 16379 on host [localhost:16379](http://localhost:16379))
- Wiremock (exposed on port 18081 on host [localhost:18081](http://localhost:18081))
- Zipkin (exposed on port 19411 on host [localhost:19411](http://localhost:19411))

> The ports have been configured with a pre-pended `1` to avoid confusion between running in production/running in development.

### Git Hooks
Some Git hooks have been provided for ease of verifying that the code base is commit worthy. To add these to the Git repository, run:

```sh
npm run git-provisioning;
```

> Do not use Yarn as relative paths using `dirname $0` are used.

## Running in development
### Application Startup
You should then be able to run the following command to get started developing locally:

```sh
npm start
```

To test the production build, run:

```sh
ENV=production npm start
```

## Testing
### Code Quality
ESLint is used for the linter. Run it with:

```sh
npm run test lint;
```

For pipeline purposes, run:

```sh
ENV=developmnt npm run build \
  && ANNAMS_DEV_IMAGE="zephinzer/annams:development-latest" docker-compose -f ./provisioning/deployments/docker/test/docker-compose.yml run test-lint;
```

### Depndency Vulnerability
NSP is used to check for known security vulnerabilities in dependencies. Run it with:

```sh
npm run test sec;
```

For pipeline purposes, run:

```sh
ENV=developmnt npm run build \
  && ANNAMS_DEV_IMAGE="zephinzer/annams:development-latest" docker-compose -f ./provisioning/deployments/docker/test/docker-compose.yml run test-sec;
```

### Functional Testing
Mocha is used as the test framework with tests stored in [`./tests`](../tests) relative to the project root. Run it with:

```sh
npm run test;
```

For pipeline purposes, run:

```bash
ENV=developmnt npm run build \
  && ANNAMS_DEV_IMAGE="zephinzer/annams:development-latest" docker-compose -f ./provisioning/deployments/docker/test/docker-compose.yml run test-unit;
```

### Consumer-Driven-Contract Testing
Wiremock is used to create mocks.

When you run `[npm run|yarn] services start`, an instance of Wiremock is spun up together with the other services.

To create the mock, confirm that the services are all up with:

```sh
yarn services status
```

Then run the command to start the mock mapper:

```sh
yarn mock map
```

To create an accurate mock, stop all services (`yarn services stop`) and start them again (`yarn services start`) before running the above command. This is because Wiremock will run the queries against the copy of Annams started by `yarn services start`.

[Read more on Wiremock here](http://wiremock.org).

## Continuous Integration
We use Travis to automatically run tests on every push to any branch. 

### Image Build Process
#### Building for Development
```sh
ENV=development npm run build deps -- latest;
ENV=development DEPENDENCY_VERSION=latest npm run build;
```

#### Building for Production
```sh
npm run build deps -- latest;
DEPENDENCY_VERSION=latest npm run build;
```

### Releasing
Releases are done on GitHub, NPM and Docker Hub. This process is automated in the Travis CI pipeline.

- GitHub @ https://github.com/zephinzer/annams/releases
- NPM @ https://www.npmjs.com/package/annams
- Docker Hub @ https://hub.docker.com/r/zephinzer/annams/