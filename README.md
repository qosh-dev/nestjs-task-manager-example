# Simple task manager api with NestJS, TypeORM, and JWT Authentication

This project provides a secure and scalable NestJS API for managing tasks. It utilizes TypeORM with migrations for database persistence, and JWT authentication for access control.

## Features:

<ul>
<li>Create, retrieve, update, and delete tasks.</li>
<li>Secure user access with JWT-based authentication.</li>
<li>Система логирования для эффективной отладки и мониторинга приложения.</li>
</ul>

## Technologies:

<ul>
<li>NestJS (backend framework)</li>
<li>TypeORM (object-relational mapper with migrations)</li>
<li>JWT (JSON Web Token) for authentication</li>
</ul>

## Getting Started:

<ol>
  <li> Clone this repository. </li>
  <li> Install dependencies: <code> npm install </code></li>
  <li>
  Create a .env file in the root directory and configure the following environment variables:

  ```
  PORT=2211

  DB_HOST=localhost
  DB_USER=your_username
  DB_PASSWORD=your_password
  DB_DATABASE=your_database_name
  DB_PORT=2231

  JWT_SECRET=your_jwt_secret_key (long and complex string)
  JWT_EXPIRE=360000 (in milliseconds, default 1 hour)
  Run database migrations: npm run typeorm:migration
  ```
  </li>

  <li> Run docker containers for Postgres and Redis <code> docker compose up </code> </li>
  <li> Run migrations <code> npm run migration:run </code> </li>
  <li> Start the application: <code> npm run start:dev </code> </li>
</ol>


## API Endpoints:

### Authentication Routes:

<ul>
  <li>
    POST /auth/signup (body: { username, password }): Registration endpoint to generate JWT token upon successful user credentials validation.
  </li>
  <li>
    POST /auth/signin (body: { username, password }): Login endpoint to generate JWT token upon successful user credentials validation.
  </li>
  <li>
    GET /current-user/profile (requires valid JWT token): Retrieves currently authenticated user information.
  </li>
</ul>


### Task Routes:

<ul>
  <li> POST /tasks (Requires authorization): Creates a new task. </li>
  <li> GET /tasks/:id (Optional authorization): Retrieves an task by its ID. </li>
  <li> GET /tasks/ (Optional authorization): Retrieves a list of tasks. </li>
  <li> PATCH /tasks/:id (Requires authorization): Updates an task. </li>
  <li> 
  DELETE /tasks/:id (Requires authorization): Deletes an task. </li>
</ul>


### Authorization:

The API utilizes JWT (JSON Web Token) for authentication. Successful login via the /auth/signin endpoint provides a JWT token that needs to be included in the authorization header of subsequent requests that require authentication (indicated in the endpoint descriptions).

### Testing:

Unit tests are included to ensure core functionalities.
