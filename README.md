# 🔐 Backend Development — TaskMaster API

![Node.js](https://img.shields.io/badge/Node.js-20.x-green)
![Express](https://img.shields.io/badge/Express-5.x-lightgrey)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![bcrypt](https://img.shields.io/badge/Security-bcrypt-red)

A secure RESTful API built for TaskMaster, a productivity platform managing users, projects, and tasks. Implements JWT-based authentication bcrypt password hashing, and multi-layered ownership-based authorization across nested resources.

## Tech Stack

- [Node.js](https://nodejs.org/) — runtime environment
- [Express](https://expressjs.com/) — web framework
- [MongoDB Atlas](https://www.mongodb.com/atlas) — cloud database
- [Mongoose](https://mongoosejs.com/) — MongoDB ODM
- [bcrypt](https://www.npmjs.com/package/bcrypt) — password hashing
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) — JWT signing and verification
- [dotenv](https://www.npmjs.com/package/dotenv) — environment variable management

## Project Structure

```
backend-development/
├── config/
│   └── connection.js        ← MongoDB connection
├── models/
│   ├── index.js             ← exports all models
│   ├── Project.js           ← project schema with user ownership
│   ├── Task.js              ← task schema with project reference
│   └── User.js              ← user schema with bcrypt pre-save hook
├── routes/
│   ├── api/
│   │   ├── index.js         ← mounts user, project, and task routes
│   │   ├── projectRoutes.js ← full CRUD with auth and ownership
│   │   ├── taskRoutes.js    ← full CRUD with nested routing and parent project ownership
│   │   └── userRoutes.js    ← register and login endpoints
│   └── index.js             ← top level router with 404 handler
├── utils/
│   └── auth.js              ← signToken and authMiddleware
├── .env.example
├── .gitignore
├── package.json
├── server.js
└── README.md
```

## Data Model Relationships

```
User (1) ──────── (_) Project (1) ──────── (_) Task
owns contains
```

- A `User` owns many `Projects`
- A `Project` contains many `Tasks`
- A `Task` belongs to one `Project`
- Authorization always traces back to the `User` through this chain

## Getting Started

### Prerequisites

- Node.js v20+
- MongoDB Atlas account

### Installation

1. Clone the repository
2. Run `npm install`
3. Copy `.env.example` to `.env` and fill in your values
4. Run `nodemon server.js`

## Environment Variables

| Variable     | Description                                                                                                            |
| ------------ | ---------------------------------------------------------------------------------------------------------------------- |
| `MONGO_URI`  | MongoDB Atlas connection string                                                                                        |
| `PORT`       | Port the server runs on                                                                                                |
| `JWT_SECRET` | Secret key for signing JWTs — generate with `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |

## API Endpoints

### User Routes

| Method | Endpoint              | Description           | Auth Required |
| ------ | --------------------- | --------------------- | ------------- |
| POST   | `/api/users/register` | Register a new user   | No            |
| POST   | `/api/users/login`    | Login and receive JWT | No            |

### Project Routes

| Method | Endpoint            | Description                         | Auth Required |
| ------ | ------------------- | ----------------------------------- | ------------- |
| POST   | `/api/projects`     | Create a new project                | Yes           |
| GET    | `/api/projects`     | Get all projects for logged-in user | Yes           |
| GET    | `/api/projects/:id` | Get a single project                | Yes           |
| PUT    | `/api/projects/:id` | Update a project — owner only       | Yes           |
| DELETE | `/api/projects/:id` | Delete a project — owner only       | Yes           |

### Task Routes

| Method | Endpoint                         | Description                        | Auth Required |
| ------ | -------------------------------- | ---------------------------------- | ------------- |
| POST   | `/api/projects/:projectId/tasks` | Create a task for a project        | Yes           |
| GET    | `/api/projects/:projectId/tasks` | Get all tasks for a project        | Yes           |
| PUT    | `/api/tasks/:taskId`             | Update a task — project owner only | Yes           |
| DELETE | `/api/tasks/:taskId`             | Delete a task — project owner only | Yes           |

## Authentication Flow

1. Client sends credentials to `/api/users/register` or `/api/users/login`
2. Server hashes password using bcrypt with 10 salt rounds on registration
3. On login, `bcrypt.compare()` validates incoming password against stored hash
4. Server signs and returns a JWT containing non-sensitive user data
5. Client includes JWT in `Authorization: Bearer <token>` header on subsequent requests
6. `authMiddleware` intercepts every protected request and verifies the token
7. Decoded user data attached to `req.user` for downstream route handlers

## Authorization Flow

### Project Authorization

1. `authMiddleware` verifies JWT and attaches `req.user` to request
2. Route handler finds project by ID
3. Compares `project.user.toString()` against `req.user._id.toString()`
4. Access granted or `403 Forbidden` returned based on ownership match

### Task Authorization — Complex Chain

1. `authMiddleware` verifies JWT and attaches `req.user` to request
2. Route handler finds task by ID
3. From task, finds parent project using `task.project`
4. Compares `project.user.toString()` against `req.user._id.toString()`
5. Access granted or `403 Forbidden` returned based on parent project ownership

## Task Authorization Chain
```
Request → authMiddleware → Find Task → Find Parent Project → Check project.user === req.user.\_id → ✅ or 403
```

No other route pattern in this project requires this traversal. Tasks don't reference users directly — ownership is always verified through the parent project.

## Security Features

- Passwords hashed and salted using bcrypt with 10 salt rounds
- JWT authentication required on all project and task endpoints
- Ownership-based authorization on all project routes
- Complex parent project ownership check on all task routes
- Generic error messages on failed login prevent email enumeration attacks
- Cryptographically generated JWT secret using Node.js `crypto` module
- Environment variables protect all sensitive credentials
- `.env` excluded from version control via `.gitignore`

## Error Responses

| Status Code | Message                                                | Reason                    |
| ----------- | ------------------------------------------------------ | ------------------------- |
| 400         | Incorrect email or password.                           | Invalid login credentials |
| 401         | You must be logged in to do that.                      | Missing token             |
| 401         | Invalid token.                                         | Expired or invalid token  |
| 403         | User is not authorized to view this project.           | Wrong user token          |
| 403         | User is not authorized to update this project.         | Wrong user token          |
| 403         | User is not authorized to delete this project.         | Wrong user token          |
| 403         | User is not authorized to add tasks to this project.   | Wrong user token          |
| 403         | User is not authorized to view tasks for this project. | Wrong user token          |
| 403         | User is not authorized to update this task.            | Wrong user token          |
| 403         | User is not authorized to delete this task.            | Wrong user token          |
| 404         | No project found with this id!                         | Project doesn't exist     |
| 404         | No task found with this id!                            | Task doesn't exist        |

## Testing

All endpoints tested using Postman. Test coverage includes:

- User registration and login
- Full CRUD on projects with ownership verification
- Full CRUD on tasks with parent project ownership verification
- Authorization rejection — wrong user returns `403` on all protected routes
- Unauthenticated rejection — missing token returns `401` on all protected routes

## Usage Examples

### Register a New User

**POST** `/api/users/register`

```json
{
  "username": "bd-testuser",
  "email": "bd-test@test.com",
  "password": "bd-password123"
}
```

**Response — 201 Created:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "username": "bd-testuser",
    "email": "bd-test@test.com"
  }
}
```

### Create a Project

**POST** `/api/projects`

```json
{
  "name": "BD Task Test Project",
  "description": "Project for task and authorization testing"
}
```

**Response — 201 Created:**

```json
{
  "_id": "...",
  "name": "BD Task Test Project",
  "description": "Project for task and authorization testing",
  "user": "..."
}
```

### Create a Task

**POST** `/api/projects/:projectId/tasks`

```json
{
  "title": "BD Test Task",
  "description": "Test task for backend development",
  "status": "To Do"
}
```

**Response — 201 Created:**

```json
{
  "_id": "...",
  "title": "BD Test Task",
  "description": "Test task for backend development",
  "status": "To Do",
  "project": "..."
}
```

### Task Status Values

| Status        | Description                      |
| ------------- | -------------------------------- |
| `To Do`       | Task has not been started        |
| `In Progress` | Task is actively being worked on |
| `Done`        | Task has been completed          |

### Unauthorized Access

**Response — 403 Forbidden:**

```json
{
  "message": "User is not authorized to update this task."
}
```

## References

- [Mongoose pre() Middleware](https://mongoosejs.com/docs/middleware.html#pre)
- [Mongoose Population](https://mongoosejs.com/docs/populate.html)
- [Mongoose SchemaTypes](https://mongoosejs.com/docs/schematypes.html)
- [Mongoose SchemaTypes — enum](https://mongoosejs.com/docs/schematypes.html#string-validators)
- [bcrypt on npm](https://www.npmjs.com/package/bcrypt)
- [jsonwebtoken on npm](https://www.npmjs.com/package/jsonwebtoken)
- [Express.js Routing Documentation](https://expressjs.com/en/guide/routing.html)
- [Express.js — Route Parameters](https://expressjs.com/en/guide/routing.html#route-parameters)
- [RESTful API Design — Nested Resources](https://www.moesif.com/blog/technical/api-design/REST-API-Design-Best-Practices-for-Sub-and-Nested-Resources/)
- [How To Safely Store A Password](https://codahale.com/how-to-safely-store-a-password/)
- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)

## Reflection

The TaskMaster API is an architecturally complex backend project that pushed the boundaries of what a RESTful API can do with thoughtful data modeling and layered security. Bringing together three interconnected models, nested routing, and multi-layered authorization into a single cohesive API required careful planning at every phase — from schema design to route security.

The most technically demanding aspect was the task authorization chain. Unlike projects, tasks don't reference users directly — ownership must be verified by traversing from the task to its parent project and then checking the project's owner against the authenticated user. This two-step lookup — `task.project → project.user → req.user._id` — is a pattern that emerges naturally from sound relational data modeling. Understanding why this traversal is necessary, rather than just implementing it, was the real learning moment.

Nested routing also introduced new complexity. Flat routes are straightforward, but `POST /api/projects/:projectId/tasks` required understanding how Express handles route parameters across nested resources. Mounting the task router at the root level rather than under `/tasks` was a deliberate architectural decision that kept the URL structure RESTful and semantically correct.

Several bugs were caught during testing that reinforced the importance of thorough API testing before submission. Typos in property names — `emai` instead of `email`, `eq.body` instead of `req.body`, `date` instead of `data` — caused silent failures that only surfaced through careful Postman testing and terminal logging. Each fix was committed independently, creating an honest and traceable git history.

From an IAM and DevSecOps perspective, this project demonstrates that authorization is never a single check — it is a chain of verification steps that must account for resource ownership at every level. A user authenticated with a valid JWT still cannot access resources they don't own. A valid token proves identity. Ownership proves permission. Both are required, and neither is sufficient alone. That principle, applied consistently across every route in this API, is the foundation of any secure backend system.
