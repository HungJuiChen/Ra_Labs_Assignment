# 📅 Event Management API with NestJS

This project extends the official [NestJS TypeScript Starter](https://github.com/nestjs/typescript-starter) by adding an **Event Management** feature that includes task-like events, invitees (users), and automatic merging of overlapping time slots.

---

##  Features

-  Create, retrieve, and delete events
-  Merge overlapping events for a user
-  Associate users and events (many-to-many)
-  Unit and integration testing

---

## Requirements

- Node.js v18+
- npm v8+
- MySQL 8+ (or Docker)
- NestJS CLI

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/nestjs-event-manager.git
cd nestjs-event-manager
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file in the root directory:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=nest_events
```

### 4. Prepare the MySQL Database

You can create the database manually:

```sql
CREATE DATABASE nest_events;
```

Or with Docker:

```bash
docker run --name mysql-nest \
  -e MYSQL_ROOT_PASSWORD=your_password \
  -e MYSQL_DATABASE=nest_events \
  -p 3306:3306 -d mysql:8
```

---

## Run the Application

```bash
npm run start:dev
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## API Endpoints

| Method | Endpoint                | Description                                |
|--------|-------------------------|--------------------------------------------|
| POST   | `/events`               | Create a new event                         |
| GET    | `/events/:id`           | Retrieve an event by ID                    |
| DELETE | `/events/:id`           | Delete an event by ID                      |
| POST   | `/events/merge/:userId` | Merge overlapping events for given user ID |

---

## 🧪 Testing

### Unit & Integration Tests

```bash
npm run test
```

### End-to-End (E2E) Tests

```bash
npm run test:e2e
```

> ⚠️ Ensure no server is already running on port 3000 when executing `test:e2e`.

---

## 📡 curl Examples

### Create Event

```bash
curl -X POST http://localhost:3000/events \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Kickoff",
    "description": "Initial meeting",
    "status": "TODO",
    "startTime": "2025-07-10T09:00:00Z",
    "endTime": "2025-07-10T10:30:00Z",
    "invitees": [1, 2]
  }'
```

### Get Event by ID

```bash
curl http://localhost:3000/events/1
```

### Delete Event by ID

```bash
curl -X DELETE http://localhost:3000/events/1
```

### Merge Overlapping Events

```bash
curl -X POST http://localhost:3000/events/merge/1
```

---

## Project Structure

```
src/
├── events/              # Events module
├── users/               # Users module
├── app.module.ts        # Main app module
test/
├── app.e2e-spec.ts      # E2E test
.env                     # Environment variables
```

---
## FAQ

### Do I need to create tables manually?

No. With `synchronize: true` in the TypeORM config, tables are automatically created when you run the app.

---

### Why doesn’t event ID reset after deletion?

MySQL auto-increment does not reset. To reset it manually:

```sql
TRUNCATE TABLE event;
```

> If there's a foreign key error, truncate join tables first, e.g., `event_invitees`.

---

### Why is there no `events` column in the `user` table?

Events and users are related through a many-to-many relationship via a join table. The `user` table doesn’t store event IDs directly; TypeORM manages this automatically.

---
