# Configuring Annams
## Environment Variables

### `AUTHN_HEALTHCHECK_USERNAME`
> Defaults to `null`

Path: `config.authn.healthcheck.username`

### `AUTHN_HEALTHCHECK_PASSWORD`
> Defaults to `null`

Path: `config.authn.healthcheck.password`

### `AUTHN_METRICS_USERNAME`
> Defaults to `null`

Path: `config.authn.metrics.username`

### `AUTHN_METRICS_PASSWORD`
> Defaults to `null`

Path: `config.authn.metrics.password`

### `AUTHN_JWT_KEY_PRIVATE`
> Defaults to `null`

Path: `config.authn.jwt.key.private`

### `AUTHN_JWT_KEY_PUBLIC`
> Defaults to `null`

Path: `config.authn.jwt.key.public`

### `CACHE_HOST`
> Defaults to `"127.0.0.1"`

Path: `config.cache.host`

### `CACHE_PORT`
> Defaults to `"6379"`

Path: `config.cache.port`

### `DATABASE_AUTH_USERNAME`
> Defaults to `"annams_user"`

Path: `config.database.auth.username`

### `DATABASE_AUTH_PASSWORD`
> Defaults to `"annams_password"`

Path: `config.database.auth.password`

### `DATABASE_HOST`
> Defaults to `"127.0.0.1"`

Path: `config.database.host`

### `DATABASE_NAME`
> Defaults to `"annams"`

Path: `config.database.name`

### `DATABASE_PORT`
> Defaults to `"3306"`

Path: `config.database.port`

### `ENDPOINT_LIVE`
> Defaults to `"/healthz"`

Path: `config.endpoint.live`

### `ENDPOINT_READY`
> Defaults to `"/readyz"`

Path: `config.endpoint.ready`

### `ENDPOINT_METRICS`
> Defaults to `"/metrics"`

Path: `config.endpoint.metrics`

### `ERROR_ADDRINUSE_INTERVAL`
> Defaults to `5000`

Path: `config.error.addrinuse.interval`

### `ERROR_ADDRINUSE_TTL`
> Defaults to `5`

Path: `config.error.addrinuse.ttl`

### `ERROR_DBNOTFOUND_INTERVAL`
> Defaults to `5000`

Path: `config.error.dbnotfound.interval`

### `ERROR_DBNOTFOUND_TTL`
> Defaults to `15`

Path: `config.error.dbnotfound.ttl`

### `METRICS_INTERVAL`
> Defaults to `5000`

Path: `config.metrics.interval`

### `METRICS_PUSHGATEWAY_HOST`
> Defaults to `"http://localhost"`

Path: `config.metrics.pushgateway.host`

### `METRICS_PUSHGATEWAY_PORT`
> Defaults to `"19091"`

Path: `config.metrics.pushgateway.port`

### `METRICS_PUSHGATEWAY_TIMEOUT`
> Defaults to `10000`

Path: `config.metrics.pushgateway.timeout`

### `METRICS_PUSHGATEWAY_INTERVAL`
> Defaults to `5000`

Path: `config.metrics.pushgateway.interval`

### `NODE_ENV`
> Defaults to `"development"`

Path: `config.environment`

### `SERVER_BIND_ADDRESS`
> Defaults to `0.0.0.0`

Path: `config.server.bind.address`

### `SERVER_CORS_ALLOWED_HOSTS`
> Defaults to `[]`

Path: `config.server.cors.allowed.hosts`

### `SERVER_CORS_ALLOWED_METHODS`
> Defaults to `[]`

Path: `config.server.cors.allowed.methods`

### `SERVER_LOG_LEVEL`
> Defaults to `"trace"`

#### Possible Options
One of:
- `"fatal"`
- `"error"`
- `"warn"`
- `"info"`
- `"debug"`
- `"trace"`
- `"silent"`

Path: `config.server.log.level`

### `SERVER_LOG_PRETTY`
> Defaults to `true`

When set to `false`, logs look like:

```
{"level":30,"time":1519833207129,"msg":"Server listening on port 10000 > http://127.0.0.1:10000","pid":34325,"hostname":"<HOSTNAME>","v":1}
```

When set to `true`, logs look like:

```
[2018-02-28T15:52:03.283Z] INFO (34278 on <HOSTNAME>): Server listening on port 10000 > http://127.0.0.1:10000
```

Path: `config.server.log.pretty`

### `SERVER_PORT`
> Defaults to `10000`

The port which Annams will listen to when it is up.

Path: `config.server.port`

### `SERVER_TRACING_ZIPKIN_ENABLED`
> Defaults to `true`

When this is set to `false`, Zipkin request tracing will be disabled.

Path: `config.server.tracing.zipkin.enabled`

### `SERVER_TRACING_ZIPKIN_HOSTNAME`
> Defaults to `"http://localhost:19411"`

When this is not specified, the tracer will send the traces to `console.trace`. When specified, the traces will be sent to the Zipkin server.

Path: `config.server.tracing.zipkin.hostname`

### `SERVICE_NAME`
> Defaults to `"annams"`

Path: `config.service.name`
