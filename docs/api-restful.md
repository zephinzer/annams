# Annams RESTful API

Entities:
1. Account
2. Session
3. Group
4. ResourceType

The base URL for Annams API is `http://annams.yourapp.com/api/v1`. The `v*` indicates the version of the API we are calling.

## User
### Create User (Register New Account)
#### `POST /account`
> Available since v1

##### Body data schema
```
{
  email : String
  username : String
  password : String
}
```

- **`email`** : (**REQUIRED**) email of the account holder

- **`username`** : username of the account holder

- **`password`** : password of the account holder

##### Examples
> WIP

### Retrieve all Users
#### `GET /accounts`
> Available since v1

##### Query URL Parameters

- **`offset`** : defines the offset as to which to start the query. **Defaults to 0**

- **`limit`** : defines how many items the response should contain. **Defaults to 20**

##### Examples

```sh
# get 20 accounts starting from the first
curl -X GET 'http://localhost:10000/api/v1/accounts';

# get 10 accounts starting from the fifth account
curl -X GET 'http://localhost:10000/api/v1/accounts?offset=5&limit=10';
```

### Retrieve User Data
#### `GET /account/:identifier`
> Available since v1

> WIP

### Retrieve Groups a User belongs to
#### `GET /account/groups`
#### `GET /account/:userId/groups`

### Retrieve User-Accessible ResourceTypes
#### `GET /account/resource-types`
> WIP

#### `GET /account/:userId/resource-types`
> WIP

### Update User Data
#### `PUT /account/:uuid`
> Available since v1

### Delete User (Delete Account)
#### `DELETE /account/:uuid`
> WIP

## Session
### Create Session (Login)
#### `POST /session`
> WIP

### Retrieve Session Data
#### `GET /session`
> WIP

### Update Session Data
#### `PATCH /session`
> WIP

### Delete Session (Logout)
#### `DELETE /session`
> WIP

## Group
### Create Group
#### `POST /group`
> WIP

### Retrieve all Groups
#### `GET /groups`
> WIP

### Retrieve Group by ID
#### `GET /group/:groupId`
> WIP

### Retrieve Users in a Group
#### `GET /group/:groupId/accounts`
> WIP

### Retrieve ResourceTypes in a Group
#### `GET /group/:groupId/resource-types`
> WIP

### Update Group Data
#### `PATCH /group/:groupId`
> WIP

### Delete Group
#### `DELETE /group/:groupId`
> WIP

## ResourceType
### Create ResourceType
#### `POST /resource-type`
> WIP

### Retrieve all ResourceType
#### `GET /resource-types`
> WIP

### Retrieve ResourceType
#### `GET /resource-type`
> WIP

### Update ResourceType
#### `PATCH /resource-type/:resourceTypeId`
> WIP

### Delete ResourceType
#### `DELETE /resource-type/:resourceTypeId`
> WIP