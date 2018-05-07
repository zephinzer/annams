# Annams Mock
This directory contains service mock data for Annams.

## Get Started
To run the mock service, run the following in your terminal at the project's root:

```sh
npm run build-mock;
npm run start-mock;
```

This should result in Wiremock going up in the background and immediately going to the logs. Hit `ctrl+c` to quit the logs display.

To begin recording the endpoints, go to http://localhost:8080/__admin/recorder and enter `"http://localhost:10000"` in the **Target URL** input box. Hit **Record** to begin recording.

Visiting `http://localhost:8080/*` where `*` is any endpoint in ANNAMS should work, and the recordings will be stored in `./mock/mappings` (relative to project root).

To stop the mock, run:

```sh
npm run stop-mock;
```

To debug the mock service, run the following while `docker ps | grep mock` shows something to get a shell inside the mock service's container:

```sh
npm run exec-mock;
```

> This feature targetted at consumer driven contract testing is still a WIP.
