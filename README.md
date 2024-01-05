# Note Sharing Platform API's

This repository contains the implementation of a RESTful API using NestJS, PostgreSQL, and various tools for authentication, rate limiting, and testing.

## Framework and Database

### NestJS

[NestJS](https://nestjs.com/) was chosen as the framework for this project due to its fast-paced development, built-in features, and excellent support for unit testing and end-to-end (e2e) testing. NestJS also provides a modular structure, making it easy to organize and scale the application.

### PostgreSQL with TypeORM

[PostgreSQL](https://www.postgresql.org/) was selected as the database for its reliability and powerful support for relational data. [TypeORM](https://typeorm.io/) is used as the Object-Relational Mapping (ORM) library, providing a seamless connection between the application and the PostgreSQL database. The choice of PostgreSQL enables the use of complex queries and joins, which can be beneficial for future expansions of the application.

### Structure of the app
```
src
|-- app.controller.ts
|-- app.module.ts
|-- app.service.ts
|-- main.ts
|-- modules
|   |-- users
|       |-- dto
|       |   |-- create-user.dto.ts
|       |-- entities
|       |   |-- user.entity.ts
|       |-- controllers
|       |   |-- users.controller.ts
|       |-- services
|       |   |-- users.service.ts
|       |-- users.module.ts
|-- shared
|   |-- constants
|   |   |-- common.constants.ts
|   |-- filters
|   |   |-- http-exception.filter.ts
|   |-- interceptors
|   |   |-- logging.interceptor.ts
|   |-- pipes
|       |-- validation.pipe.ts
|-- main
|   |-- database
|   |   |-- database.module.ts
|   |   |-- database.providers.ts
|   |-- config
|   |   |-- config.module.ts
|   |   |-- config.service.ts
|-- test
|   |-- users.controller.spec.ts
|   |-- users.service.spec.ts
|-- .env
|-- .gitignore
|-- package.json
|-- tsconfig.json
|-- nest-cli.json
|-- README.md
```

## Authentication

JSON Web Token (JWT) is used for authentication. Users can sign up using the `POST /api/auth/signup` endpoint to create a new account and log in with existing credentials using the `POST /api/auth/login` endpoint to obtain an access token.

## Rate Limiting and Request Throttling

To handle high traffic, rate limiting and request throttling are implemented. NestJS provides built-in support for rate limiting through middleware. Used `req.ip` for unique key to identity anonymous session & `req.user.sub (Decode token is assigned to req.user)` for authenticated session

## Security

The application implements Cross-Origin Resource Sharing (CORS) to enhance security by restricting access to certain domains using [cors](https://github.com/expressjs/cors) package which is built-in to the NestJs.

To bolster the security of the application, the [Helmet](https://helmetjs.github.io/) middleware is utilized to set various HTTP headers in the server's responses. These headers enhance the security posture by preventing common web vulnerabilities and providing an additional layer of protection.

## Testing

Unit tests and integration tests are written using [Jest](https://jestjs.io/) and [Supertest](https://github.com/visionmedia/supertest). These tests ensure the correctness of the API endpoints and their interactions. Run tests using:

```bash
npm run test
```

## API Endpoints

### Authentication Endpoints

- `POST /api/auth/signup`: Create a new user account.
- `POST /api/auth/login`: Log in to an existing user account and receive an access token.

### Note Endpoints

- `GET /api/notes`: Get a list of all notes for the authenticated user.
- `GET /api/notes/:id`: Get a note by ID for the authenticated user.
- `POST /api/notes`: Create a new note for the authenticated user.
- `PUT /api/notes/:id`: Update an existing note by ID for the authenticated user.
- `DELETE /api/notes/:id`: Delete a note by ID for the authenticated user.
- `POST /api/notes/:id/share`: Share a note with another user for the authenticated user.
- `GET /api/search?q=:query`: Search for notes based on keywords for the authenticated user.

### User Endpoints

- `GET /api/me`: Get current authenticated users info


## What are the Pre-requisites?

Binaries      | Version
------------- | -------------
NodeJS        | >= 18.16.1
NPM           | >= 9.5.1
PostgreSQL    | >= 12.1

## How to SetUp & Install?

```sh
# Clone the repository
git clone <repository-url>

# Create the config file from the sample-config file
cp .env.example .env

# Add your database details
 user: 'db_username',
 password: 'db_password',
 database: 'db_dbname',
 host: 'db_host',

# Install NPM dependencies
npm install;

# Run database migrations:
npm run typeorm:run-migrations
```

## How to Run?

### Development Environment

```sh
# Run local server with --watch option
npm run start:dev;
```

### Production Environment

```sh
# Create a Build
npm run build 

# Run the build folder
npm run start:prod;
```

## Running Tests

Run unit tests and integration tests:

```bash
npm test
```

## Author

[Rajat](https://github.com/Rajatj17)

Software Engineer with 4+ years of experience specializing in Node.Js, Golang, and Python. Proven expertise in building robust APIs, architecting scalable features, and deploying on cloud platforms. Adept at leading teams and delivering complex backend solutions.

### Contact Information

For inquiries or feedback, feel free to reach out to us:

- **Email:** [rajatjainwal5@gmail.com](mailto:rajatjainwal5@gmail.com)
- **Twitter:** [@rajatj17](https://twitter.com/rajatj17)
- **LinkedIn:** [rajatj17](https://www.linkedin.com/in/rajatj17)

### Acknowledgements
I have used NestJs Documentation to build this repo. Thank you!
