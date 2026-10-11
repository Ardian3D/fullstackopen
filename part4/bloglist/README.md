# Part 4 — Blog List API

University of Helsinki Full Stack Open: https://fullstackopen.com/en/part4/

Node.js/Express 5, MongoDB/Mongoose, user account registration, JWT login, blog ownership, and `node:test`/SuperTest tests.

Setup and testing: see [`../PART4_INSTRUCTIONS.md`](../PART4_INSTRUCTIONS.md).

## Local endpoints

- `GET /health`
- `GET /api/blogs`, `GET /api/blogs/:id`
- `POST /api/blogs` (Bearer token), `PUT /api/blogs/:id`, `DELETE /api/blogs/:id` (owner Bearer token)
- `GET /api/users`, `POST /api/users`
- `POST /api/login`

Credentials are passed via `.env`, excluded from Git by `.gitignore`. Use distinct `bloglist` and `bloglist_test` MongoDB databases. Integration tests delete data in the test database.
