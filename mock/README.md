# Annams Mock
This directory contains service mock data for Annams.

## Get Started
To run the mock service, run the following in your terminal at the project's root:

```sh
npm run start-mock;
```

The mock service together with Annams should come up, available on http://localhost:18080 and http://localhost:10000 respectively.

To create the data mappings, run:

```sh
npm run create-mock-data;
```

Your `./mock/mappings` directory should be populated with the relevant recordings.

To debug the mock service, create a shell into it with:

```sh
npm run exec-mock;
```

To stop the mock, run:

```sh
npm run stop-mock;
```

To generate the mock service as an image after creating the mappings at `./mock/mappings/*.json`, run:

```sh
npm run build-mock;
```

You can now run the image independently with the mock data by running:

```sh
docker run -p 18080:18080 zephinzer/annams:mock-latest;
```

> This feature targetted at consumer driven contract testing is still a WIP.
