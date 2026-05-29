# Interview Buddy - Backend API

AI-Based Interview Platform Backend built with Node.js, Express, and MongoDB.

## Project Structure

```
backend/
├── config/              # Configuration files
│   ├── database.js     # MongoDB connection
│   └── jwt.js          # JWT token utilities
├── controllers/         # Business logic
│   ├── authController.js
│   ├── interviewController.js
│   ├── resultController.js
│   ├── questionController.js
│   └── userController.js
├── models/             # MongoDB schemas
│   ├── User.js
│   ├── Interview.js
│   ├── Question.js
│   └── Result.js
├── routes/             # API endpoints
│   ├── authRoutes.js
│   ├── interviewRoutes.js
│   ├── resultRoutes.js
│   ├── questionRoutes.js
│   └── userRoutes.js
├── middleware/         # Custom middleware
│   ├── auth.js        # Authentication & authorization
│   └── errorHandler.js # Error handling
├── utils/              # Utilities
│   ├── constants.js    # Application constants
│   └── validation.js   # Input validation
├── .env.example        # Environment variables template
├── app.js              # Express app setup
├── server.js           # Server entry point
└── package.json        # Dependencies
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Variables

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Fill in the required values:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/interview-buddy
JWT_ACCESS_SECRET=your_access_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
CLIENT_URL=http://localhost:5173
```

### 3. Generate JWT Secrets (Optional)

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Run this command twice to get two different secrets for access and refresh tokens.

### 4. Start the Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh-token` - Refresh access token
- `GET /api/auth/me` - Get current user profile

### Interviews
- `POST /api/interviews/start` - Start a new interview
- `GET /api/interviews/my-interviews` - Get user's interviews
- `GET /api/interviews/:id` - Get interview details
- `POST /api/interviews/:interviewId/submit-answer` - Submit answer
- `POST /api/interviews/:interviewId/complete` - Complete interview

### Questions (Admin Only)
- `GET /api/questions` - Get all questions
- `GET /api/questions/:id` - Get question details
- `POST /api/questions` - Create question
- `PUT /api/questions/:id` - Update question
- `DELETE /api/questions/:id` - Delete question
- `PATCH /api/questions/:id/deactivate` - Deactivate question

### Users
- `GET /api/users/stats` - Get user statistics
- `PUT /api/users/profile` - Update user profile
- `GET /api/users` - Get all users (Admin only)
- `PATCH /api/users/:id/deactivate` - Deactivate user (Admin only)
- `PATCH /api/users/:id/activate` - Activate user (Admin only)

### Results
- `GET /api/results/my-results` - Get user's results
- `GET /api/results/:interviewId` - Get interview result
- `POST /api/results` - Create result

### Health Check
- `GET /api/health` - Check server status

## Authentication

Include JWT token in request headers:

```
Authorization: Bearer <your_access_token>
```

## Testing

### Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### Start Interview (Replace with actual token)
```bash
curl -X POST http://localhost:5000/api/interviews/start \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_access_token>" \
  -d '{
    "domain": "Software Engineering",
    "difficulty": "Medium",
    "numberOfQuestions": 5
  }'
```

## Error Handling

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

## Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT authentication with separate access/refresh tokens
- ✅ Role-based access control (RBAC)
- ✅ CORS enabled
- ✅ Helmet for security headers
- ✅ Rate limiting
- ✅ Input validation with Joi
- ✅ Error handling middleware

## MongoDB Indexes

Indexes are automatically created for:
- `User.email` - for faster login queries
- `Interview.user` - for user interview queries
- `Question.domain, difficulty` - for question filtering
- `Result.user` - for user result queries

## Common Issues

### MongoDB Connection Failed
- Check MONGODB_URI in .env
- Ensure MongoDB is running
- Check IP whitelist in MongoDB Atlas

### JWT Token Errors
- Token might have expired
- Use refresh endpoint to get new token
- Check JWT_ACCESS_SECRET and JWT_REFRESH_SECRET

### CORS Issues
- Update CLIENT_URL in .env
- Add http:// or https:// prefix

## Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT secrets (32+ characters)
- [ ] Use MongoDB Atlas with IP whitelist
- [ ] Enable HTTPS
- [ ] Set up monitoring
- [ ] Configure rate limiting appropriately
- [ ] Add logging with Winston
- [ ] Test all endpoints thoroughly

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
