# User API

## POST /user

Creates a new user.

### Request Body

| Parameter | Type   | Description        |
| --------- |--------| ------------------ |
| id        | number | Unique user ID     |
| username  | string | User's username    |
| role      | string | User's role        |
| quests    | array  | User's quests list |

#### Example Request

```json
{
  "id": "unique_id_here",
  "username": "example_username",
  "role": "example_role",
  "quests": []
}
```

## GET /user

Retrieves a list of all users.

### Response

Returns a JSON array containing user objects.

#### Example Response

```json
[
  {
    "id": 1,
    "username": "user1",
    "role": "admin",
    "quests": ["quest1", "quest2"]
  },
  {
    "id": 2,
    "username": "user2",
    "role": "member",
    "quests": ["quest3", "quest4"]
  }
]
```

## GET /api/user/:id

Retrieves a user with the specified ID.

### Parameters

| Parameter | Type   | Description                 |
| --------- | ------ | --------------------------- |
| id        | string | The unique ID of the user. |

#### Example

- GET /api/user/<unique_user_id_here>

### Response

- **200 OK**: Returns the user object if found.

  ```json
  {
    "id": 1,
    "username": "user1",
    "role": "admin",
    "quests": []
  },

- **404 Not Found:** If the quest with the specified ID does not exist.
- **500 Internal Server Error:** If there's an issue with retrieving the quest.
