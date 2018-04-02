# Contributing to Annams

1. [Technologies Involved](#technologies-involved)
2. [Setting up the development environment](#setting-up-the-development-environment)
3. [Running in development](#running-in-development)
4. [Testing](#testing)

We work via standard fork + merge request to `master` model.

## Technologies Involved
1. Node.js - *the runtime*
  - Fastify application framework
  - Knex query builder library
  - Mocha test framework
  - Chai assertion library
  - Sinon mocking library
2. Yarn - *dependency mangement*
2. Docker - *local development/deployment*
3. Kubernetes - *deployment*
  - MiniKube for testing deployments

## Provisioning
You'll need a Docker daemon installed and running on your host machine, and you can get it from this link: https://store.docker.com/search?type=edition&offering=community.

### Method 1 - via Development Shell
We use a development shell to standardise the development environment. The shell contains Git, Node and Yarn and the command has volume mappings to directories needed to run Git. If you don't trust the code, use Method 2.

To build the development shell, run:

```bash
npm run build-devsh;
```

After it has built, run it with:

```bash
npm run start-devsh;
```

> The development shell uses your host's Docker to run Docker commands.

### Method 2 - via local machine
Confirm that Docker, Git, Node 8 and Yarn are installed on your machine. You can verify this via:

```bash
docker version;
# > Client: ...
git --version
# > git version ...
node -v
# > v....
yarn -v
# > ...
```

## Development
### Dependency Installation
To get started, install the NPM dependencies. We use Yarn to manage the dependencies:

```bash
yarn install
```

### External Services Startup
Next, start the services in the background:

```bash
npm run start-services
```

Verify they are up by running:

```bash
docker ps | grep annams_dev
```

> To stop the services, run `npm run stop-services`

The available services are:

- MySQL (exposed on port 13306 on host - [localhost:13306](localhost:13306))
- Prometheus (exposed on port 19090 on host [localhost:19090](http://localhost:19090))
- Prometheus PushGateway (exposed on port 19091 on host [localhost:19091](http://localhost:19091))
- Redis (exposed on port 16379 on host [localhost:16379](localhost:16379))
- Zipkin (exposed on port 19411 on host [localhost:19411](http://localhost:19411))

> The ports have been configured with a pre-pended `1` to avoid confusion between running in production/running in development.

### Application Startup
You should then be able to run the following command to get started developing locally:

```bash
npm start
```

To test the production build, run:

```bash
npm start-prd
```

OR

```bash
ENV=production npm start
```

## Testing

### Code Quality
ESLint is used for the linter. Run it with:

```bash
npm run test-lint;
```

To fix auto-correctable errors, run:

```bash
npm run fix-lint;
```

For pipeline purposes, run:

```bash
ENV=developmnt npm run build \
  && ANNAMS_DEV_IMAGE="zephinzer/annams:development-latest" docker-compose -f ./provisioning/deployments/docker/test/docker-compose.yml run test-lint;
```

### Depndency Vulnerability
NSP is used to check for known security vulnerabilities in dependencies. Run it with:

```bash
npm run test-sec;
```

For pipeline purposes, run:

```bash
ENV=developmnt npm run build \
  && ANNAMS_DEV_IMAGE="zephinzer/annams:development-latest" docker-compose -f ./provisioning/deployments/docker/test/docker-compose.yml run test-sec;
```

### Functional Testing
Mocha is used as the test framework with tests stored in [`./tests`](../tests) relative to the project root.

`WIP`

For pipeline purposes, run:

```bash
ENV=developmnt npm run build \
  && ANNAMS_DEV_IMAGE="zephinzer/annams:development-latest" docker-compose -f ./provisioning/deployments/docker/test/docker-compose.yml run test;
```

## Continuous Integration
We use Travis to automatically run tests on every push to any branch. 

`WIP`

## Release
Releases are done on GitHub, NPM and Docker Hub.

`WIP`