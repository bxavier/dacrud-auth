# DaCrud Auth Microservice

A secure authentication microservice built with Node.js, Express, TypeScript, and MongoDB.

## Features

- JWT Authentication
- User Management (Registration, Login, Account Management)
- Role-Based Access Control
- Request Validation with Zod
- Error Handling with Custom Exceptions
- Logging with Winston
- Security (Helmet, CORS, Rate Limiting)
- API Documentation (Swagger)
- Health Monitoring

## Project Structure

```
src/
├── auth/                    # JWT token handling
├── core/                    # Core services (config, database, email, logger, exceptions)
├── docs/                    # API documentation
├── shared/                  # Shared code (interfaces, models)
├── middlewares/            # Express middlewares
├── resources/              # Business logic
│   ├── auth/              # Authentication endpoints
│   ├── user/              # User management
│   └── health/            # System health checks
├── app.ts                  # Express app setup
└── index.ts               # Entry point
```

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB

### Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env` file with required variables (see `.env.example`)
4. Run in development: `npm run dev`
5. Build for production: `npm run build && npm start`

## API Documentation

Access the Swagger documentation at `http://localhost:3000/docs`

## Error Handling

The application uses a consistent error response format:

```json
{
  "status": 404,
  "message": "User not found",
  "code": "RESOURCE_NOT_FOUND"
}
```

## Security

- Rate limiting on all endpoints
- CORS with whitelist
- Helmet for security headers
- JWT-based authentication

## License

MIT
