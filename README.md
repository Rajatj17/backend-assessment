# NestJS-PostgreSQL RESTful API

This repository contains the implementation of a RESTful API using NestJS, PostgreSQL, and various tools for authentication, rate limiting, and testing.

## Framework and Database

### NestJS

[NestJS](https://nestjs.com/) was chosen as the framework for this project due to its fast-paced development, built-in features, and excellent support for unit testing and end-to-end (e2e) testing. NestJS also provides a modular structure, making it easy to organize and scale the application.

### PostgreSQL with TypeORM

[PostgreSQL](https://www.postgresql.org/) was selected as the database for its reliability and powerful support for relational data. [TypeORM](https://typeorm.io/) is used as the Object-Relational Mapping (ORM) library, providing a seamless connection between the application and the PostgreSQL database. The choice of PostgreSQL enables the use of complex queries and joins, which can be beneficial for future expansions of the application.

## Authentication

JSON Web Token (JWT) is used for authentication. Users can sign up using the `POST /api/auth/signup` endpoint to create a new account and log in with existing credentials using the `POST /api/auth/login` endpoint to obtain an access token.

## Rate Limiting and Request Throttling

To handle high traffic, rate limiting and request throttling are implemented. NestJS provides built-in support for rate limiting through middleware. Adjust the configuration in the `.env` file to customize rate limiting parameters.

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

## Instructions to Run the Code

### Prerequisites

1. Clone the repository:

    ```bash
    git clone <repository-url>
    ```

2. Create a copy of the `.env.example` file and name it `.env`. Update the configurations in the `.env` file as needed.

3. Install dependencies:

    ```bash
    npm install
    ```

4. Run database migrations:

    ```bash
    npm run migrations
    ```

5. Start the development server:

    ```bash
    npm run start:dev
    ```

6. Access the API documentation at [http://localhost:3000/api](http://localhost:3000/api) using Swagger.

### Running Tests

Run unit tests and integration tests:

```bash
npm test
```

## Conclusion

This project provides a robust RESTful API using NestJS and PostgreSQL, with JWT for authentication, rate limiting for high traffic, and comprehensive testing. Feel free to explore and extend the functionality as needed. If you encounter any issues, please refer to the documentation or reach out to the maintainers.