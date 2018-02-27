# Configuring Annams
## Environment Variables

### `AUTHN_HEALTHCHECK_USERNAME`
> Defaults to `null`

Path: `config.authn.healthcheck.username`

### `AUTHN_HEALTHCHECK_PASSWORD`
> Defaults to `null`

Path: `config.authn.healthcheck.password`

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

### `SERVER_CORS_ALLOWED_HOSTS`
> Defaults to `[]`

Path: `config.server.cors.allowed.hosts`

### `SERVER_CORS_ALLOWED_METHODS`
> Defaults to `[]`

Path: `config.server.cors.allowed.methods`

### `SERVER_LOG_LEVEL`
> Defaults to `"info"`

Path: `config.server.log.level`

### `SERVER_PORT`
> Defaults to `10000`

Path: `config.server.port`

### `SERVER_BIND_ADDRESS`
> Defaults to `0.0.0.0`

Path: `config.server.bind.address`
