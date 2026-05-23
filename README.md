# DevPulse API

> Internal Tech Issue & Feature Tracker — A collaborative platform for software teams to report bugs, suggest features, and coordinate resolutions.

**Live URL:** `https://your-deployment-url.vercel.app`

---

## ✨ Features

- User registration and authentication with JWT
- Role-based access control (`contributor` and `maintainer`)
- Create, read, update, and delete issues
- Filter issues by type and status
- Sort issues by newest or oldest
- Secure password hashing with bcrypt
- PostgreSQL database with raw SQL queries

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Node.js (LTS 24.x) | Runtime environment |
| TypeScript | Type-safe development |
| Express.js | HTTP server & routing |
| PostgreSQL | Relational database |
| `pg` (native driver) | Raw SQL queries |
| bcrypt | Password hashing |
| jsonwebtoken | JWT authentication |
| cors | Cross-origin resource sharing |
| dotenv | Environment variable management |

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js 24.x or higher
- PostgreSQL database (NeonDB / Supabase / ElephantSQL)

### Steps

**1. Clone the repository**
```bash
git clone https://github.com/TutulMajumder/devpulse.git
cd devpulse
```

**2. Install dependencies**
```bash
npm install
```

**3. Configure environment variables**

Create a `.env` file in the root directory:
```env
PORT=server port
CONNECTION_STRING=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret_key
```

**4. Run the development server**
```bash
npm run dev
```

> Tables are created automatically on first run via `initDB()`.

---

## 🌐 API Endpoints

### Authentication

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Public | Register a new user |
| `POST` | `/api/auth/login` | Public | Login and receive JWT token |

### Issues

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/issues` | Authenticated | Create a new issue |
| `GET` | `/api/issues` | Public | Get all issues (with filters) |
| `GET` | `/api/issues/:id` | Public | Get a single issue |
| `PATCH` | `/api/issues/:id` | Authenticated | Update an issue |
| `DELETE` | `/api/issues/:id` | Maintainer only | Delete an issue |

### Query Parameters for `GET /api/issues`

| Param | Values | Default |
|---|---|---|
| `sort` | `newest`, `oldest` | `newest` |
| `type` | `bug`, `feature_request` | — |
| `status` | `open`, `in_progress`, `resolved` | — |

### Authorization Header

```
Authorization: <JWT_TOKEN>
```

---

## 🗄️ Database Schema

### `users` table

| Column | Type | Description |
|---|---|---|
| `id` | `SERIAL PRIMARY KEY` | Auto-increment ID |
| `name` | `VARCHAR(100)` | Full display name |
| `email` | `VARCHAR(100) UNIQUE NOT NULL` | Login email |
| `password` | `TEXT NOT NULL` | Bcrypt hashed password |
| `role` | `VARCHAR(15) DEFAULT 'contributor'` | `contributor` or `maintainer` |
| `created_at` | `TIMESTAMP` | Auto-generated on insert |
| `updated_at` | `TIMESTAMP` | Auto-refreshed on update |

### `issues` table

| Column | Type | Description |
|---|---|---|
| `id` | `SERIAL PRIMARY KEY` | Auto-increment ID |
| `title` | `VARCHAR(150) NOT NULL` | Short headline (max 150 chars) |
| `description` | `TEXT NOT NULL` | Detailed explanation (min 20 chars) |
| `type` | `VARCHAR(20) NOT NULL` | `bug` or `feature_request` |
| `status` | `VARCHAR(15) DEFAULT 'open'` | `open`, `in_progress`, `resolved` |
| `reporter_id` | `INT` | References the user who created the issue |
| `created_at` | `TIMESTAMP` | Auto-generated on insert |
| `updated_at` | `TIMESTAMP` | Auto-refreshed on update |

---

## 👥 User Roles & Permissions

| Role | Permissions |
|---|---|
| `contributor` | Register, login, create issues, view all issues, update own issue (only if `open`) |
| `maintainer` | All contributor permissions + update any issue, delete any issue, change status |

---

## 📌 Response Format

**Success**
```json
{
  "success": true,
  "message": "Operation description",
  "data": {}
}
```

**Error**
```json
{
  "success": false,
  "message": "Error description",
  "errors": "Error details"
}
```
