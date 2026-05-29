# QUICK START GUIDE - Interview Buddy Backend

## 5-Minute Setup

### Prerequisites
- Node.js v14+
- MongoDB (Atlas or local)
- Git

### Step 1: Clone & Navigate
```bash
cd backend
```

### Step 2: Install Dependencies
```bash
npm install
```
**Time**: ~2 minutes

### Step 3: Setup Environment
```bash
cp .env.example .env
```

Edit `.env`:
```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/interview-buddy
JWT_ACCESS_SECRET=your_random_secret_here_min_32_chars
JWT_REFRESH_SECRET=another_random_secret_min_32_chars
CLIENT_URL=http://localhost:5173
PORT=5000
NODE_ENV=development
```

**Generate random secrets:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 4: Start Server
```bash
npm run dev
```

**Expected Output:**
```
✅ MongoDB Connected: cluster.mongodb.net
📊 Database Name: interview-buddy
✅ Server started on port 5000
📌 Environment: development
🌐 Client URL: http://localhost:5173
```

### ✅ Done! Server is Running

---

## 10-Minute First Tests

### Test 1: Health Check
```bash
curl http://localhost:5000/api/health
```

**Expected**: `{"status": "ok", ...}`

### Test 2: Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

**Expected**: 
```json
{
  "success": true,
  "data": {
    "user": {...},
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

Save the `accessToken` for next step.

### Test 3: Get Profile (Using Token)
```bash
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  http://localhost:5000/api/auth/me
```

**Expected**: Returns your user profile

### Test 4: Start Interview
```bash
curl -X POST http://localhost:5000/api/interviews/start \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "domain": "Software Engineering",
    "difficulty": "Medium",
    "numberOfQuestions": 3
  }'
```

**Expected**: Interview created with questions

---

## Environment Variables Explained

```env
# Server Configuration
PORT=5000                           # Which port to run on
NODE_ENV=development                # development or production

# Database
MONGODB_URI=mongodb+srv://...       # Your MongoDB connection string

# Authentication (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_ACCESS_SECRET=random_secret_32+ # Used to sign access tokens
JWT_ACCESS_EXPIRE=1h                # How long access token lasts
JWT_REFRESH_SECRET=random_secret_32+ # Used to sign refresh tokens
JWT_REFRESH_EXPIRE=30d              # How long refresh token lasts

# Frontend
CLIENT_URL=http://localhost:5173    # Frontend URL for CORS

# Rate Limiting
RATE_LIMIT_MAX=100                  # Max requests per window
RATE_LIMIT_WINDOW=15                # Time window in minutes

# AI Service (for future use)
AI_SERVICE_URL=http://localhost:8000
```

---

## Troubleshooting

### ❌ "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### ❌ "MongoDB connection failed"
Check:
1. MONGODB_URI in .env is correct
2. MongoDB Atlas IP whitelist includes your IP
3. Username/password are correct

### ❌ "JWT_ACCESS_SECRET is not defined"
```bash
# Generate a new secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Add to .env
JWT_ACCESS_SECRET=<paste_here>
```

### ❌ "CORS error"
Update CLIENT_URL in .env to match your frontend URL:
```env
CLIENT_URL=http://localhost:3000
```

### ❌ "Rate limit exceeded"
Default allows 100 requests per 15 minutes. Wait or adjust in .env:
```env
RATE_LIMIT_MAX=1000
RATE_LIMIT_WINDOW=15
```

---

## Next Steps

After confirming server is running:

1. **Add Sample Questions**
   - Create admin account first
   - Use admin auth to POST /api/questions

2. **Frontend Integration**
   - Install frontend dependencies
   - Update API_URL to http://localhost:5000/api

3. **Database Backup**
   - Configure MongoDB backups
   - Test restore procedure

4. **Production Deployment**
   - See AUDIT_REPORT.md for checklist
   - Configure HTTPS
   - Set NODE_ENV=production

---

## API Documentation

### Quick Reference

**Registration:**
```bash
POST /api/auth/register
{ "name": "...", "email": "...", "password": "..." }
```

**Login:**
```bash
POST /api/auth/login
{ "email": "...", "password": "..." }
```

**Refresh Token:**
```bash
POST /api/auth/refresh-token
{ "refreshToken": "..." }
```

**Start Interview:**
```bash
POST /api/interviews/start
Headers: Authorization: Bearer <token>
{ "domain": "Software Engineering", "difficulty": "Medium", "numberOfQuestions": 5 }
```

**Submit Answer:**
```bash
POST /api/interviews/:id/submit-answer
Headers: Authorization: Bearer <token>
{ "questionIndex": 0, "answer": "...", "timeTaken": 120 }
```

**Get Results:**
```bash
GET /api/results/my-results
Headers: Authorization: Bearer <token>
```

For full API documentation, see `backend/README.md`

---

## Important Notes

⚠️ **Security**
- Never commit `.env` file
- Rotate JWT secrets in production
- Use HTTPS in production
- Change default passwords

⚠️ **Database**
- Always backup before major updates
- Test migrations on staging first
- Monitor connection pool size

⚠️ **Performance**
- Database queries have indexes
- API results are paginated
- Rate limiting is enabled
- Connection pooling is configured

✅ **You're Ready to Go!**
