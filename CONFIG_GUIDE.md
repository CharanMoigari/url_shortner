# Environment Configuration Guide

## 🎯 Quick Overview

All environment configuration is **centralized in one place**: `.env` file

Change any value in `.env` and it automatically applies throughout the entire application without needing to modify code.

---

## 📝 How to Use

### Step 1: Create Your .env File

```bash
cd backend
cp .env.example .env
```

### Step 2: Edit .env (One Place Only!)

```env
# backend/.env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PASSWORD=your_strong_password
JWT_SECRET=your_super_secret_key
# ... other variables
```

### Step 3: Restart Your Application

Changes take effect immediately on restart!

---

## 🔧 Configuration Structure

### 1. Server Configuration

```env
PORT=3000                    # Express server port
NODE_ENV=development         # development | production | test
```

**Where it's used:**
- `backend/src/index.ts` - Server startup port
- `backend/src/app.ts` - Error handling level

---

### 2. PostgreSQL Database

```env
DB_HOST=localhost           # Database host
DB_PORT=5432               # PostgreSQL default port
DB_NAME=url_shortener      # Database name
DB_USER=postgres           # Database user
DB_PASSWORD=postgres       # Database password ⚠️ Change this!
DB_POOL_SIZE=10           # Connection pool size
```

**Where it's used:**
- All database queries (5+ files import this)
- Connection pooling automatically managed

**Optimization Tips:**
```
DB_POOL_SIZE = (CPU_CORES × 2) to (CPU_CORES × 4)

Example:
- 4 CPU cores: Set to 8-16
- 8 CPU cores: Set to 16-32
```

---

### 3. Redis Cache

```env
REDIS_HOST=localhost       # Redis server host
REDIS_PORT=6379           # Redis default port
REDIS_DB=0                # Redis database number (0-15)
REDIS_PASSWORD=           # Leave blank if no password
```

**Where it's used:**
- URL caching (Cache-Aside pattern)
- Rate limiting counters
- Session storage

**Cache TTL (Time-To-Live):**
```
Hardcoded in code: 3600 seconds (1 hour)
To change: Edit backend/src/config/environment.ts, line: redis: { ttl: 3600 }
```

---

### 4. JWT Authentication

```env
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRY=24h             # Access token expiry
JWT_REFRESH_EXPIRY=7d      # Refresh token expiry
```

**Where it's used:**
- User login (generates tokens)
- Protected API routes (validates tokens)
- Token refresh endpoint

⚠️ **Production Rule:**
```
Never use default! Generate a strong secret:
  openssl rand -hex 32
```

---

### 5. RabbitMQ Message Queue

```env
RABBITMQ_URL=amqp://guest:guest@localhost:5672
```

**Where it's used:**
- Analytics event publishing (on every redirect)
- Analytics worker consumption

**URL Structure:**
```
amqp://[username]:[password]@[host]:[port]
```

---

### 6. Application URLs

```env
APP_URL=http://localhost:3000            # Backend API URL
BASE_URL=http://localhost:3000           # Base URL for short links
CORS_ORIGIN=http://localhost:5173        # Frontend origin
```

**Where it's used:**
- CORS policy validation
- Link generation for short URLs
- Frontend API requests

---

### 7. Rate Limiting

```env
RATE_LIMIT_WINDOW_MS=60000        # Time window in ms (1 minute)
RATE_LIMIT_MAX_REQUESTS=100       # Requests per window
```

**Where it's used:**
- General API endpoint limiting
- Built into Redis rate limiter

**Different Limits (Hardcoded):**
```typescript
General:        100 requests/minute
URL Creation:   20 requests/minute
Auth Attempts:  5 attempts/15 minutes
```

To change hardcoded limits, edit:
```
backend/src/config/environment.ts
```

---

### 8. Logging

```env
LOG_LEVEL=info              # error | warn | info | debug
LOG_DIR=./logs             # Directory for log files
```

**Where it's used:**
- All API requests logged
- Database queries logged
- Errors logged with stack traces

**Log Files Generated:**
```
./logs/error.log            # Only errors
./logs/combined.log         # All logs
```

---

## 🚀 Common Configuration Scenarios

### Development Setup

```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PASSWORD=postgres
REDIS_HOST=localhost
JWT_SECRET=dev_secret_123
CORS_ORIGIN=http://localhost:5173
LOG_LEVEL=debug
```

### Docker Compose Setup

```env
NODE_ENV=production
PORT=3000
DB_HOST=postgres              # Docker service name
DB_PASSWORD=strong_password
REDIS_HOST=redis              # Docker service name
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672
JWT_SECRET=generate_strong_secret
CORS_ORIGIN=http://localhost
```

### Production Setup

```env
NODE_ENV=production
PORT=3000
DB_HOST=prod.db.example.com
DB_PASSWORD=VERY_STRONG_PASSWORD_HERE
DB_POOL_SIZE=32               # Higher for production load
REDIS_HOST=prod.redis.example.com
REDIS_PASSWORD=redis_password
RABBITMQ_URL=amqp://prod_user:prod_pass@prod.rabbitmq.example.com:5672
JWT_SECRET=GENERATE_STRONG_SECRET_WITH_OPENSSL
CORS_ORIGIN=https://yourdomain.com
LOG_LEVEL=warn
APP_URL=https://yourdomain.com/api
BASE_URL=https://yourdomain.com
```

---

## 📋 How Changes Propagate

### Example: Changing Database Password

```
1. Update .env
   DB_PASSWORD=new_strong_password
   
2. Restart backend
   npm run dev
   
3. backend/src/config/environment.ts loads .env
   
4. Loads all config files
   - database.ts (uses env.database)
   - redis.ts (uses env.redis)
   - logger.ts (uses env.logging)
   - etc.
   
5. Controllers, Services, Repositories all use env config
   
6. ✅ Change applied everywhere!
```

### Files That Import Configuration

```typescript
// Automatic via centralized config
backend/src/config/database.ts      → imports env
backend/src/config/redis.ts         → imports env
backend/src/config/logger.ts        → imports env
backend/src/models/User.ts          → uses config via database
backend/src/middleware/rateLimit.ts → uses env.rateLimit
backend/src/app.ts                  → uses env.cors, env.logging
backend/src/index.ts                → uses env.PORT, env.NODE_ENV
// ... and everywhere else that needs config
```

---

## 🔐 Security Checklist

**Never commit these to Git:**
```
❌ .env (contains secrets)
✅ .env.example (template only)
```

Already in `.gitignore`:
```gitignore
.env
.env.local
.env.*.local
```

**Before Production:**
- [ ] Change JWT_SECRET to random value (`openssl rand -hex 32`)
- [ ] Change DB_PASSWORD to strong password
- [ ] Set NODE_ENV=production
- [ ] Set appropriate CORS_ORIGIN
- [ ] Increase DB_POOL_SIZE for load
- [ ] Change REDIS_PASSWORD if needed
- [ ] Set LOG_LEVEL=warn (not debug)

---

## 🐳 Docker Compose Usage

Docker Compose automatically sets environment variables from `.env`:

```bash
# Reads backend/.env automatically
docker-compose up -d

# Override individual variables
docker-compose up -d -e JWT_SECRET=new_secret
```

---

## ✅ Validation

The system validates all required variables on startup:

```typescript
// In backend/src/config/environment.ts
const requiredEnvVars = [
  'JWT_SECRET',
  'DB_HOST',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
  'REDIS_HOST',
  'RABBITMQ_URL'
];

// If missing:
// ❌ Error: Missing required environment variables: DB_PASSWORD, JWT_SECRET
```

---

## 📞 Troubleshooting

### "Missing required environment variables"

```bash
# Check your .env file exists
ls -la backend/.env

# Copy from example if missing
cp backend/.env.example backend/.env

# Verify all required vars are set
grep -E "^(JWT_SECRET|DB_|REDIS_|RABBITMQ)" backend/.env
```

### "Connection refused"

```bash
# Check services are running
# For Docker Compose:
docker-compose ps

# For local development:
redis-cli ping              # Check Redis
psql -c "SELECT 1"         # Check PostgreSQL
```

### "Config changes not applied"

```bash
# Restart the application (dotenv reloads on startup)
npm run dev

# For Docker Compose:
docker-compose restart backend1 backend2
```

---

## 🎓 Summary

| To Change | Edit This File | Scope |
|-----------|---|---|
| Database | `.env` (DB_* vars) | All database operations |
| Cache | `.env` (REDIS_* vars) | All caching operations |
| Auth | `.env` (JWT_* vars) | All authentication |
| API | `.env` (APP_URL, CORS_ORIGIN) | API routes |
| Rate Limit | `.env` (RATE_LIMIT_*) | API rate limiting |
| Logging | `.env` (LOG_*) | All logging |

**One file, complete control! 🎯**
