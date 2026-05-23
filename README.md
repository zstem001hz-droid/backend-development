# Backend Development — TaskMaster API

![Node.js](https://img.shields.io/badge/Node.js-20.x-green)
![Express](https://img.shields.io/badge/Express-5.x-lightgrey)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![bcrypt](https://img.shields.io/badge/Security-bcrypt-red)

A secure RESTful API built for TaskMaster, a productivity platform managing users, projects, and tasks. Implements JWT-based authentication bcrypt password hashing, and multi-layered ownership-based authorization across nested resources.

## Tech Stack

## Project Structure

```
backend-development/
├── config/
│   └── connection.js
├── models/
│   ├── index.js
│   ├── Project.js
│   ├── Task.js
│   └── User.js
├── routes/
│   ├── api/
│   │   ├── index.js
│   │   ├── projectRoutes.js
│   │   ├── taskRoutes.js
│   │   └── userRoutes.js
│   └── index.js
├── utils/
│   └── auth.js
├── .env
├── .env.example
├── .gitignore
├── package.json
├── server.js
└── README.md
```

## Getting Started

### Prerequisites

### Installation

## Environment Variables

## API Endpoints

## Authentication Flow

## Authorization Flow

## Security Features

## Error Responses

## Usage Examples

## References

- [Mongoose Population](https://mongoosejs.com/docs/populate.html)
- [Mongoose SchemaTypes](https://mongoosejs.com/docs/schematypes.html)
- [Mongoose SchemaTypes — enum](https://mongoosejs.com/docs/schematypes.html#string-validators)
- [jsonwebtoken on npm](https://www.npmjs.com/package/jsonwebtoken)
- [RESTful API Design — Nested Resources](https://www.moesif.com/blog/technical/api-design REST-API-Design-Best-Practices-for-Sub-and-Nested-Resources/)
- [Express.js — Route Parameters](https://expressjs.com/en/guide/routing.html#route-parameters)

## Reflection

> 🚧 Work in progress
