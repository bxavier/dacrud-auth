# DaCrud Auth Microservice

An authentication microservice built with Node.js, Express, TypeScript, and MongoDB that provides secure JWT-based authentication functionality.

## Overview

This microservice is part of a larger microservices architecture plan. It currently handles user authentication and authorization using JWT (JSON Web Tokens) with plans to implement additional microservices in the future.

## Features

- **JWT Authentication**: Secure token-based authentication
- **User Management**: Registration, login, and account management
- **Role-Based Access Control**: Configurable user permissions
- **TypeScript Support**
- **Express 5**
- **MongoDB Integration**: Mongoose ODM with connection retry
- **Architecture Pattern**: Controller-Service-Model pattern
- **Validation**: Zod Request validation
- **Error Handling**: Enhanced exception hierarchy with consistent responses
- **Logging**: Winston and Morgan
- **Security**: Helmet, CORS with whitelist, rate limiting
- **Multi-Environment Support**: Environment-specific configuration
- **API Documentation**: Minimal Swagger integration
- **Health Monitoring**: System health checks

## Future Plans

This authentication service is the first in a planned series of microservices. Future implementations will include:

- **User Profile Service**: Manage user profile data
- **Resource Service**: Handle application-specific resources
- **Notification Service**: Email, SMS, and push notifications
- **API Gateway**: Central entry point for all microservices

## Project Structure

```
src/
├── middlewares/         # Express middlewares
├── resources/           # API resources (controllers, services, models)
├── utils/               # Utility functions, interfaces, and helpers
│   └── exceptions/      # Exception hierarchy for error handling
├── app.ts               # Express app configuration
└── index.ts             # Application entry point
```

## Architecture

This microservice follows a modular architecture:

1. **Controller**: HTTP requests and responses
2. **Service**: Business logic
3. **Model**: Data schema and database

Each resource (like User) follows this pattern, providing clear separation of concerns.

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB instance

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file:
   ```
   NODE_ENV=development
   PORT=3000
   MONGO_PATH=localhost:27017
   MONGO_USER=admin
   MONGO_PASSWORD=password
   MONGO_DATABASE=auth_database
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=1h
   JWT_REFRESH_EXPIRES_IN=7d
   APP_URL=http://localhost:3000
   SMTP_HOST=smtp.example.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=user
   SMTP_PASSWORD=password
   EMAIL_FROM=noreply@example.com
   RATE_LIMIT_WINDOW=900000
   RATE_LIMIT_MAX=100
   AUTH_RATE_LIMIT_WINDOW=3600000
   AUTH_RATE_LIMIT_MAX=10
   LOG_LEVEL=info
   ```

### Environment-Specific Configuration

The application supports multiple environment configurations:

- `.env` - Base configuration for all environments
- `.env.development` - Development-specific overrides
- `.env.test` - Test-specific overrides
- `.env.production` - Production-specific overrides
- `.env.[environment].local` - Local overrides (not committed to repository)

Files are loaded in cascading order, with later files overriding earlier ones.

### Running the Application

Development mode:

```
npm run dev
```

Production build:

```
npm run build
npm start
```

## Example Resource

Complete User resource:

- `user.controller.ts`: Route definitions and request handling
- `user.service.ts`: Business logic
- `user.model.ts`: Mongoose schema and model
- `user.interface.ts`: TypeScript interface
- `user.validation.ts`: Zod validation schemas

This provides a comprehensive template for creating additional resources.

## Validation

Request validation is powered by Zod, ensuring data integrity:

```typescript
// Example validation
export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});
```

## API Documentation

The API is documented using minimal Swagger annotations directly in controllers:

```typescript
/**
 * @openapi
 * /resource:
 *   get:
 *     summary: Get resources
 *     tags: [Resources]
 *     responses:
 *       200:
 *         description: Success
 */
```

Access the documentation at `http://localhost:3000/docs`

## Health Monitoring

The application includes a comprehensive health endpoint that provides system information:

- `/health` - Complete system health including:
  - Database connection status
  - CPU usage and cores
  - Memory utilization
  - Disk space
  - Application uptime
  - Node.js and Express versions

This single endpoint provides all the necessary information for monitoring the application.

## Error Handling

The application uses a comprehensive exception hierarchy for consistent error handling:

```
ApiException                  // Base class for all API errors
├── HttpException             // Base for HTTP errors
    ├── ValidationException   // 400 - Validation errors
    ├── BadRequestException   // 400 - Invalid request
    ├── UnauthorizedException // 401 - Authentication required
    ├── ForbiddenException    // 403 - Permissions issues
    ├── NotFoundException     // 404 - Resource not found
    ├── ConflictException     // 409 - Resource conflicts
    └── ServerException       // 500 - Server errors
```

All errors return a consistent JSON response:

```json
{
  "status": 404,
  "message": "User not found",
  "code": "RESOURCE_NOT_FOUND",
  "errors": [...] // Optional details
}
```

The error middleware now handles specific MongoDB error types:

- Validation errors (mongoose.Error.ValidationError)
- Cast errors (mongoose.Error.CastError)
- Duplicate key errors (code 11000)

In development mode, error responses include the full error message and stack trace for easier debugging.

## Security

### Rate Limiting

The API is protected with rate limiting:

- **Global Rate Limit**: Applies to all API endpoints
  - Default: 100 requests per 15-minute window
- **Authentication Rate Limit**: Stricter limits for authentication endpoints
  - Default: 10 requests per hour

Rate limits are configurable through environment variables.

### CORS Configuration

Cross-Origin Resource Sharing is configured with a whitelist approach:

- Only specified origins are allowed
- Supports cookies and authentication headers
- Custom methods and headers can be configured

### Content Security Policy

When running in production, Content Security Policy headers are enabled via Helmet for additional security.

## License

MIT
