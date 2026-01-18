# NextJS App Backend

A Node.js/Express backend server for the NextJS e-commerce application.

## Features

- **RESTful API** for items and authentication
- **JWT Authentication** with role-based access control
- **Input Validation** using express-validator
- **Security Middleware** (Helmet, CORS, Rate Limiting)
- **Error Handling** with detailed error responses
- **Mock Database** with sample data
- **Admin Panel Support** with statistics endpoints

## API Endpoints

### Items

- `GET /api/items` - Get all items (with optional filtering and pagination)
- `GET /api/items/:id` - Get single item
- `POST /api/items` - Create new item (admin only)
- `PUT /api/items/:id` - Update item (admin only)
- `DELETE /api/items/:id` - Delete item (admin only)
- `GET /api/items/stats` - Get items statistics (admin only)

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `GET /api/auth/users` - Get all users (admin only)
- `POST /api/auth/verify-token` - Verify JWT token

### Health Check

- `GET /health` - Server health check

## Installation

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy environment variables:

   ```bash
   copy .env.example .env
   ```

4. Update the `.env` file with your configuration:
   ```
   PORT=4000
   NODE_ENV=development
   JWT_SECRET=your-super-secret-jwt-key-here-change-in-production
   CORS_ORIGIN=https://nextjsapp-three-lime.vercel.app
   ```

## Running the Server

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start on `https://nextappbackend2.vercel.app`

## Default Users

The server comes with two pre-configured users:

### Admin User

- **Email:** admin@example.com
- **Password:** password123
- **Role:** admin

### Regular User

- **Email:** user@example.com
- **Password:** password123
- **Role:** user

## API Usage Examples

### Get All Items

```bash
curl https://nextappbackend2.vercel.app/api/items
```

### Login

```bash
curl -X POST https://nextappbackend2.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

### Create New Item (Admin Only)

```bash
curl -X POST https://nextappbackend2.vercel.app/api/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "New Product",
    "description": "Product description",
    "price": 99.99,
    "image": "https://example.com/image.jpg"
  }'
```

## Project Structure

```
backend/
├── data/
│   ├── items.js          # Mock items database
│   └── users.js          # Mock users database
├── middleware/
│   ├── auth.js           # Authentication middleware
│   ├── errorHandler.js   # Error handling middleware
│   └── validation.js     # Input validation middleware
├── routes/
│   ├── auth.js           # Authentication routes
│   └── items.js          # Items routes
├── .env.example          # Environment variables template
├── .gitignore           # Git ignore file
├── package.json         # Dependencies and scripts
├── README.md            # This file
└── server.js            # Main server file
```

## Security Features

- **JWT Authentication** for secure user sessions
- **Password Hashing** using bcryptjs
- **Rate Limiting** to prevent abuse
- **Input Validation** to prevent malicious data
- **CORS Protection** for cross-origin requests
- **Helmet** for security headers
- **Environment Variables** for sensitive configuration

## Development Notes

- The server uses mock data stored in memory
- Data will reset when the server restarts
- For production, replace mock databases with a real database (MongoDB, PostgreSQL, etc.)
- Update JWT_SECRET in production with a strong, unique key
- Configure proper CORS origins for production deployment
