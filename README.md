**Event Management API with NestJS**

This project implements an **Event Management** feature in a NestJS application, allowing you to:

* Create, retrieve, and delete events
* Merge overlapping events for a user, consolidating invitees, time ranges, and descriptions

---

## Prerequisites

* [Node.js](https://nodejs.org/) (v18.x recommended)
* [npm](https://www.npmjs.com/) (v8.x or later)
* MySQL server (or PostgreSQL) for database
* Optional: [Docker](https://www.docker.com/) for containerized MySQL

---

## Setup

1. **Clone the repository** (forked from `nestjs/typescript-starter`):

   ```bash
   git clone https://github.com/<your-username>/nestjs-event-manager.git
   cd nestjs-event-manager
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure environment variables**: create a `.env` file in the project root with the following (update values as needed):

   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=root
   DB_PASSWORD=your_password
   DB_DATABASE=nest_events
   ```

4. **Start MySQL** (locally or via Docker):

   ```bash
   docker run --name mysql-nest -e MYSQL_ROOT_PASSWORD=your_password -e MYSQL_DATABASE=nest_events -p 3306:3306 -d mysql:8
   ```

---

## Running the Application

Start the NestJS server in development mode:

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000/`.

---

## API Endpoints

| Method | Path                    | Description                               |
| ------ | ----------------------- | ----------------------------------------- |
| POST   | `/events`               | Create a new event                        |
| GET    | `/events/:id`           | Retrieve an event by ID                   |
| DELETE | `/events/:id`           | Delete an event by ID                     |
| POST   | `/events/merge/:userId` | Merge overlapping events for a given user |

### Example: Create Event

**Request**

```http
POST /events HTTP/1.1
Content-Type: application/json

{
  "title": "Team Meeting",
  "description": "Discuss project roadmap",
  "status": "TODO",
  "startTime": "2025-07-10T09:00:00Z",
  "endTime": "2025-07-10T10:30:00Z",
  "invitees": [1, 2, 3]
}
```

**Response**

```json
{
  "id": 5,
  "title": "Team Meeting",
  "description": "Discuss project roadmap",
  "status": "TODO",
  "startTime": "2025-07-10T09:00:00.000Z",
  "endTime": "2025-07-10T10:30:00.000Z",
  "invitees": [
    { "id": 1, "name": "Alice" },
    { "id": 2, "name": "Bob" },
    { "id": 3, "name": "Carol" }
  ],
  "createdAt": "2025-07-07T12:00:00.000Z",
  "updatedAt": "2025-07-07T12:00:00.000Z"
}
```

---

## Running Tests

This project includes **unit tests** for both services and controllers.

```bash
npm run test
```

You should see all tests pass with 100% coverage for the event feature.

---

## Demo Video

A short demo video is provided in the repository root:

* **demo.mp4**: Shows:

  1. Creating, retrieving, and deleting events
  2. Merging overlapping events
  3. Running the test suite with all green results


