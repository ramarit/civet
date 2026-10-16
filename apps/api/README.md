# Civet Translation API

Production-ready REST API for the Civet translation platform, built with Fastify v5.

## Features

- RESTful API design with comprehensive endpoints
- JWT authentication with refresh tokens
- API key authentication for widget integration
- Rate limiting (100 requests/minute per project)
- Request validation with Zod schemas
- Comprehensive error handling
- CORS configuration
- Health check endpoints
- PostgreSQL database with optimized schema
- Docker support for easy deployment
- TypeScript for type safety

## Architecture

```
src/
├── index.ts              # Server entry point
├── server.ts             # Fastify application setup
├── config/               # Configuration management
├── db/                   # Database client and schema
├── middleware/           # Authentication, validation, rate limiting
├── routes/               # API route handlers
├── services/             # Business logic
└── types/                # TypeScript type definitions
```

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 14+
- npm or pnpm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Configure your `.env` file with appropriate values.

4. Set up the database:
```bash
# Create database
createdb civet

# Run migrations
npm run db:migrate
```

5. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3000`.

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

### Projects

- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:projectId` - Get project details
- `PATCH /api/projects/:projectId` - Update project
- `DELETE /api/projects/:projectId` - Delete project
- `POST /api/projects/:projectId/regenerate-key` - Regenerate API key

### Translations

- `GET /api/translations?project_id=X&lang=Y` - Get translations (API key auth)
- `GET /api/translations/project/:projectId` - Get all translations
- `GET /api/translations/project/:projectId/stats` - Get translation stats
- `PUT /api/translations/project/:projectId` - Update translation
- `POST /api/translations/batch` - Batch update translations
- `DELETE /api/translations/project/:projectId/key/:key` - Delete translation key
- `DELETE /api/translations/project/:projectId/key/:key/lang/:lang` - Delete specific translation

### Languages

- `GET /api/languages/project/:projectId` - List project languages
- `POST /api/languages/project/:projectId` - Enable language
- `DELETE /api/languages/project/:projectId/lang/:languageCode` - Disable language

### Users

- `GET /api/users/me` - Get current user profile
- `PATCH /api/users/me` - Update profile
- `POST /api/users/me/password` - Update password
- `GET /api/users/me/teams` - Get user teams
- `DELETE /api/users/me` - Delete account

### Health

- `GET /api/health` - Basic health check
- `GET /api/health/detailed` - Detailed health check
- `GET /api/health/ready` - Readiness probe
- `GET /api/health/live` - Liveness probe

## Authentication

### JWT Authentication

For dashboard/admin endpoints, use JWT tokens:

```bash
# Login to get token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'

# Use token in requests
curl http://localhost:3000/api/projects \
  -H "Authorization: Bearer <access_token>"
```

### API Key Authentication

For widget endpoints, use API key:

```bash
curl http://localhost:3000/api/translations?project_id=xxx&lang=en \
  -H "X-API-Key: civet_xxxxxxxxxxxxx"
```

## Rate Limiting

- Default: 100 requests per minute per user/API key
- Widget endpoints: 100 requests per minute per project
- Configurable via environment variables

## Database Schema

The database includes:

- **users** - User accounts
- **teams** - Team/organization accounts
- **team_members** - Team membership and roles
- **projects** - Translation projects
- **project_languages** - Enabled languages per project
- **translations** - Translation key-value pairs
- **subscriptions** - Team subscription plans
- **usage_logs** - API usage tracking
- **refresh_tokens** - JWT refresh tokens

See `src/db/schema.sql` for the complete schema.

## Development

```bash
# Development with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Lint code
npm run lint
```

## Docker Deployment

Build and run with Docker:

```bash
# Build image
docker build -t civet-api .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL=postgresql://user:pass@host/db \
  -e JWT_SECRET=your-secret \
  -e JWT_REFRESH_SECRET=your-refresh-secret \
  civet-api
```

Or use Docker Compose:

```yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://civet:password@db:5432/civet
      JWT_SECRET: your-super-secret-key
      JWT_REFRESH_SECRET: your-refresh-secret
    depends_on:
      - db

  db:
    image: postgres:14-alpine
    environment:
      POSTGRES_USER: civet
      POSTGRES_PASSWORD: password
      POSTGRES_DB: civet
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## Environment Variables

See `.env.example` for all available configuration options.

Key variables:

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for access tokens (min 32 chars)
- `JWT_REFRESH_SECRET` - Secret for refresh tokens (min 32 chars)
- `CORS_ORIGIN` - Allowed CORS origins
- `RATE_LIMIT_MAX` - Max requests per window
- `RATE_LIMIT_WINDOW` - Rate limit window in ms

## Error Handling

The API uses consistent error responses:

```json
{
  "error": "Error Type",
  "message": "Human-readable error message",
  "details": "Additional details (dev only)"
}
```

Standard HTTP status codes:

- 200 - Success
- 201 - Created
- 204 - No Content
- 400 - Bad Request
- 401 - Unauthorized
- 403 - Forbidden
- 404 - Not Found
- 409 - Conflict
- 429 - Too Many Requests
- 500 - Internal Server Error

## Security

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens with short expiration (15m access, 7d refresh)
- Rate limiting on all endpoints
- SQL injection protection via parameterized queries
- CORS configuration
- Request validation with Zod schemas
- API key authentication for widgets
- Secure headers (via Fastify defaults)

## Performance

- Connection pooling for PostgreSQL
- Indexed database queries
- Efficient batch operations
- Rate limiting to prevent abuse
- Optimized for high concurrency with Fastify

## License

MIT
