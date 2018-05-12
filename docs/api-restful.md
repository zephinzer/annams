# Annams RESTful API

Entities:
1. Session
2. User
3. Group
4. ResourceType

The base URL for Annams API is `http://annams.yourapp.com/api/v1`. The `v*` indicates the version of the API we are calling.

## Session

### Create Session (Login)
#### `POST /session`

### Retrieve Session Data
#### `GET /session`

### Update Session Data
#### `PATCH /session`

### Delete Session (Logout)
#### `DELETE /session`

## User

### Create User (Register New Account)
#### `POST /account`

```json
{
  "type": "",
  "email": "",
  "password": ""
}
```

### Retrieve all Users
#### `GET /accounts`

### Retrieve User Data
#### `GET /account`
#### `GET /account/:userId`

### Retrieve Groups a User belongs to
#### `GET /account/groups`
#### `GET /account/:userId/groups`

### Retrieve User-Accessible ResourceTypes
#### `GET /account/resource-types`
#### `GET /account/:userId/resource-types`

### Update User Data
#### `PATCH /account`
#### `PATCH /account/:userId`

### Delete User (Delete Account)
#### `DELETE /account`
#### `PATCH /account/:userId`

## Group

### Create Group
#### `POST /group`

### Retrieve all Groups
#### `GET /groups`

### Retrieve Group by ID
#### `GET /group/:groupId`

### Retrieve Users in a Group
#### `GET /group/:groupId/accounts`

### Retrieve ResourceTypes in a Group
#### `GET /group/:groupId/resource-types`

### Update Group Data
#### `PATCH /group/:groupId`

### Delete Group
#### `DELETE /group/:groupId`

## ResourceType

### Create ResourceType
#### `POST /resource-type`

### Retrieve all ResourceType
#### `GET /resource-types`

### Retrieve ResourceType
#### `GET /resource-type`

### Update ResourceType
#### `PATCH /resource-type/:resourceTypeId`

### Delete ResourceType
#### `DELETE /resource-type/:resourceTypeId`