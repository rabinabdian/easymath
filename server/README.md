# EasyMath Backend Server

Backend API server for the EasyMath application with JWT authentication, role-based authorization, and PostgreSQL database.

## Features

- 🔐 **JWT Authentication** with Access + Refresh Tokens
- 🔄 **Token Rotation** for enhanced security
- 👥 **Role-Based Access Control** (TEACHER, ADMIN)
- 🗄️ **PostgreSQL Database** with full schema
- 📝 **OpenAPI/Swagger** specification
- 🛡️ **Secure Password Hashing** with bcrypt
- 🍪 **HTTP-only Cookies** for refresh tokens
- ⚡ **Express.js** with TypeScript

## Architecture

### Authentication Flow

1. **Login** → Returns Access Token (15 min) + Refresh Token in cookie (7 days)
2. **API Requests** → Use Access Token in `Authorization: Bearer <token>` header
3. **Token Expired** → Call `/auth/refresh` to get new Access Token
4. **Logout** → Revokes Refresh Token

### Token Details

- **Access Token**: Short-lived (15 minutes), contains user info, sent in Authorization header
- **Refresh Token**: Long-lived (7 days), HTTP-only cookie, hashed in database

### Database Schema

- `users` - Teacher/Admin accounts
- `refresh_tokens` - Refresh token storage with rotation
- `students` - Student profiles
- `exams` - Exam templates
- `exam_questions` - Exam questions (junction table)
- `student_attempts` - Student attempt records
- `student_month_badges` - Monthly achievement badges

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Git

### Installation

1. **Install dependencies:**

```bash
cd server
npm install
```

2. **Set up environment variables:**

```bash
cp .env.example .env
# Edit .env with your database credentials and JWT secrets
```

3. **Create PostgreSQL database:**

```bash
createdb easymath
```

4. **Initialize database schema:**

```bash
npm run db:init
```

This will create all tables and seed demo users:
- `teacher@example.com` (password: `password123`)
- `admin@example.com` (password: `admin123`)

5. **Start development server:**

```bash
npm run dev
```

Server will start on http://localhost:4000

### Production Build

```bash
npm run build
npm start
```

## API Documentation

See `/openapi.yaml` in the root directory for full API specification.

You can view it with:
- Swagger UI: https://editor.swagger.io/ (paste the YAML)
- ReDoc: https://redocly.github.io/redoc/ (paste the YAML)
- Postman: Import the YAML file

### Quick Reference

#### Authentication

```bash
# Register new user
POST /api/auth/register
{
  "email": "teacher@example.com",
  "password": "SecurePass123",
  "name": "Teacher Name"
}

# Login
POST /api/auth/login
{
  "email": "teacher@example.com",
  "password": "password123"
}
# Returns: { accessToken, user }
# Sets cookie: refreshToken

# Refresh access token
POST /api/auth/refresh
# Uses refreshToken cookie
# Returns: { accessToken }

# Logout
POST /api/auth/logout
# Revokes current refresh token

# Logout from all devices
POST /api/auth/logout-all
# Revokes all refresh tokens for user
```

#### Students (Requires Authentication)

```bash
# Get all students
GET /api/students
Authorization: Bearer <accessToken>

# Create student
POST /api/students
Authorization: Bearer <accessToken>
{
  "name": "נועם",
  "grade": "א׳",
  "yearLabel": "תשפ״ו",
  "avatar": "girl",
  "color": "#f97316"
}

# Get student by ID
GET /api/students/:id
Authorization: Bearer <accessToken>

# Update student
PATCH /api/students/:id
Authorization: Bearer <accessToken>
{
  "name": "נועם (עודכן)",
  "avatar": "robot"
}

# Delete student
DELETE /api/students/:id
Authorization: Bearer <accessToken>
```

#### Progress Tracking

```bash
# Record attempt
POST /api/students/:id/attempts
Authorization: Bearer <accessToken>
{
  "score": 9,
  "total": 10,
  "sourceType": "game",
  "context": {
    "month": "נובמבר",
    "yearLabel": "תשפ״ו",
    "weekIndex": 7
  }
}

# Get student progress
GET /api/students/:id/progress
Authorization: Bearer <accessToken>
```

#### Exams

```bash
# Get all exams
GET /api/exams
Authorization: Bearer <accessToken>

# Create exam
POST /api/exams
Authorization: Bearer <accessToken>
{
  "title": "חיבור עד 10",
  "grade": "א׳",
  "subject": "חשבון",
  "questions": ["add_basic_001", "add_basic_002"],
  "meta": { "topic": "addition" }
}

# Get exam by ID
GET /api/exams/:id
Authorization: Bearer <accessToken>

# Delete exam
DELETE /api/exams/:id
Authorization: Bearer <accessToken>
```

## Security Best Practices

### In Production

1. **Change JWT Secrets:**
   ```bash
   # Generate strong secrets
   openssl rand -base64 64
   ```
   Add to `.env`:
   ```
   JWT_ACCESS_SECRET=<generated-secret-1>
   JWT_REFRESH_SECRET=<generated-secret-2>
   ```

2. **Enable HTTPS:**
   - Use SSL certificates
   - Set `NODE_ENV=production`
   - Refresh token cookies will use `Secure` flag

3. **Database Security:**
   - Use strong database password
   - Enable SSL connection to database
   - Run database in private network

4. **CORS Configuration:**
   - Set `FRONTEND_URL` to your production domain
   - Don't use wildcard origins

5. **Rate Limiting:**
   - Consider adding rate limiting middleware (e.g., express-rate-limit)
   - Limit login attempts

## Project Structure

```
server/
├── src/
│   ├── db/
│   │   ├── connection.ts      # Database connection pool
│   │   ├── schema.sql         # Database schema
│   │   └── init.ts            # Database initialization script
│   ├── middleware/
│   │   ├── auth.ts            # JWT authentication middleware
│   │   └── errorHandler.ts   # Error handling middleware
│   ├── routes/
│   │   ├── auth.ts            # Authentication routes
│   │   ├── students.ts        # Student CRUD routes
│   │   ├── exams.ts           # Exam CRUD routes
│   │   └── progress.ts        # Progress tracking routes
│   ├── types/
│   │   └── index.ts           # TypeScript type definitions
│   ├── utils/
│   │   ├── jwt.ts             # JWT utilities
│   │   └── password.ts        # Password hashing utilities
│   └── index.ts               # Main server file
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## Development

### Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:init` - Initialize database schema

### Database Migrations

For schema changes:

1. Edit `src/db/schema.sql`
2. Run `npm run db:init` (WARNING: This recreates tables)

For production, consider using a migration tool like:
- [node-pg-migrate](https://github.com/salsita/node-pg-migrate)
- [Knex.js migrations](http://knexjs.org/#Migrations)
- [Prisma Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate)

## Deployment

### Option 1: Railway

1. Install Railway CLI: `npm install -g @railway/cli`
2. Login: `railway login`
3. Initialize: `railway init`
4. Add PostgreSQL: `railway add postgresql`
5. Deploy: `railway up`

### Option 2: Render

1. Create account on [Render](https://render.com)
2. Create Web Service from Git repo
3. Add PostgreSQL database
4. Set environment variables
5. Deploy

### Option 3: Docker

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npm run build
EXPOSE 4000
CMD ["npm", "start"]
```

```bash
docker build -t easymath-backend .
docker run -p 4000:4000 --env-file .env easymath-backend
```

## Troubleshooting

### Database Connection Failed

- Check PostgreSQL is running: `pg_isready`
- Verify credentials in `.env`
- Check firewall/network settings

### JWT Token Errors

- Ensure JWT secrets are set in `.env`
- Check token expiration times
- Verify Authorization header format: `Bearer <token>`

### CORS Errors

- Set `FRONTEND_URL` in `.env` to match frontend URL
- Check that credentials are included in frontend requests

## Contributing

1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes and test
3. Commit: `git commit -m "feat: add my feature"`
4. Push and create Pull Request

## License

MIT

## Support

For issues or questions:
- Check the OpenAPI spec: `/openapi.yaml`
- Review backend architecture: `/BACKEND_ARCHITECTURE.md`
- Open an issue on GitHub
