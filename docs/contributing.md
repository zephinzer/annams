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

## Setting up the development environment
You'll need a Docker daemon installed and running on your host machine, and you can get it from this link: https://store.docker.com/search?type=edition&offering=community.

### Method 1 - via Development Shell
We use a development shell to standardise the development environment.

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
If you have both Docker, at least Node 8, and Yarn installed locally, you can safely start developing without worry.

## Running in development
To get started, install the NPM dependencies. We use Yarn to manage the dependencies:

```bash
yarn install
```

Next, start the services in the background:

```bash
npm run start-services
```

Verify they are up by running:

```bash
docker ps
```

> To stop the services, run `npm run stop-services`

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

WIP