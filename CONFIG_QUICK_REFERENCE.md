# 🎯 Configuration Quick Reference

## Change Everything from ONE Place!

### Backend Configuration: Edit `backend/.env`
### Frontend Configuration: Edit `frontend/.env`

---

## 📝 Backend `.env` Reference

```env
# ============================================
# COPY THIS TO backend/.env AND EDIT VALUES
# ============================================

# Server Configuration
PORT=3000
NODE_ENV=development

# PostgreSQL Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=url_shortener
DB_USER=postgres
DB_PASSWORD=postgres
DB_POOL_SIZE=10

# Redis Cache Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0
REDIS_PASSWORD=

# JWT Authentication Configuration
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRY=24h
JWT_REFRESH_EXPIRY=7d

# RabbitMQ Message Queue Configuration
RABBITMQ_URL=amqp://guest:guest@localhost:5672

# Application URLs Configuration
APP_URL=http://localhost:3000
BASE_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:5173

# Rate Limiting Configuration
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100

# Logging Configuration
LOG_LEVEL=info
LOG_DIR=./logs
```

---

## 📝 Frontend `.env` Reference

```env
# ============================================
# COPY THIS TO frontend/.env AND EDIT VALUES
# ============================================

# API Configuration
VITE_API_URL=http://localhost:3000/api
VITE_BASE_URL=http://localhost:3000
```

---

## 🔄 How Configuration Works

```
┌──────────────────┐
│   .env File      │
└────────┬─────────┘
         │
         ├─→ Backend/src/config/environment.ts
         │   (Loads and validates)
         │
         ├─→ config/database.ts
         ├─→ config/redis.ts
         ├─→ config/logger.ts
         │
         └─→ All other backend files
             (Services, Controllers, Models, etc.)
             
Result: ✅ Change .env → Change applies everywhere!
```

---

## 🚀 Three Quick Start Configurations

### 1️⃣ Development (Local)

```bash
# backend/.env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PASSWORD=postgres
REDIS_HOST=localhost
RABBITMQ_URL=amqp://guest:guest@localhost:5672
JWT_SECRET=dev_secret_123
CORS_ORIGIN=http://localhost:5173
LOG_LEVEL=debug

# frontend/.env
VITE_API_URL=http://localhost:3000/api
VITE_BASE_URL=http://localhost:3000
```

### 2️⃣ Docker Compose (Local with Containers)

```bash
# backend/.env
PORT=3000
NODE_ENV=production
DB_HOST=postgres
DB_PASSWORD=strong_password_123
REDIS_HOST=redis
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672
JWT_SECRET=docker_secret_key_12345
CORS_ORIGIN=http://localhost
LOG_LEVEL=info

# frontend/.env
VITE_API_URL=http://localhost/api
VITE_BASE_URL=http://localhost
```

### 3️⃣ Production (Cloud Deployment)

```bash
# backend/.env
PORT=3000
NODE_ENV=production
DB_HOST=prod-db.example.com
DB_PASSWORD=VERY_STRONG_PASSWORD_32_CHARS
DB_POOL_SIZE=32
REDIS_HOST=prod-redis.example.com
REDIS_PASSWORD=redis_strong_password
RABBITMQ_URL=amqp://user:pass@prod-rabbitmq.example.com:5672
JWT_SECRET=GENERATE_WITH_openssl_rand_-hex_32
CORS_ORIGIN=https://yourdomain.com
LOG_LEVEL=warn

# frontend/.env
VITE_API_URL=https://yourdomain.com/api
VITE_BASE_URL=https://yourdomain.com
```

---

## 💡 What Each Setting Controls

| Variable | What It Does | Example |
|----------|---|---|
| **PORT** | Express server port | `3000` |
| **NODE_ENV** | App mode (dev/prod) | `development` |
| **DB_HOST** | Database server address | `localhost` or `prod-db.aws.com` |
| **DB_PASSWORD** | PostgreSQL password | `postgres` or `Strong@Pass123!` |
| **DB_POOL_SIZE** | Max DB connections | `10` to `32` |
| **REDIS_HOST** | Cache server address | `localhost` or `prod-redis.aws.com` |
| **JWT_SECRET** | Token signing key | Random hex string (openssl) |
| **JWT_EXPIRY** | Token duration | `24h`, `48h`, `7d` |
| **RABBITMQ_URL** | Analytics queue | `amqp://user:pass@host:5672` |
| **CORS_ORIGIN** | Allowed frontend URL | `http://localhost:5173` |
| **LOG_LEVEL** | Logging verbosity | `debug`, `info`, `warn`, `error` |
| **VITE_API_URL** | Backend API endpoint | `http://localhost:3000/api` |

---

## ⚡ Quick Setup Steps

### Step 1: Clone/Create .env Files

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

### Step 2: Edit Values (One Place Each!)

```bash
# Edit backend/.env
vim backend/.env          # macOS/Linux
notepad backend\.env      # Windows

# Edit frontend/.env
vim frontend/.env         # macOS/Linux
notepad frontend\.env     # Windows
```

### Step 3: Save & Restart Services

```bash
# Restart will reload new env values
npm run dev
docker-compose up -d      # If using Docker
```

---

## 🔐 Security Best Practices

### ✅ DO:
- ✅ Generate strong JWT_SECRET: `openssl rand -hex 32`
- ✅ Use strong database passwords
- ✅ Keep `.env` in `.gitignore` (already done)
- ✅ Change default passwords before deployment
- ✅ Use HTTPS URLs in production

### ❌ DON'T:
- ❌ Commit `.env` to Git
- ❌ Use default passwords in production
- ❌ Share `.env` file over email/chat
- ❌ Copy secrets to code comments
- ❌ Use `http://` in production

---

## 🐳 Docker Compose Auto-Loading

```bash
# Docker Compose automatically reads backend/.env
docker-compose up -d

# Override a single value (if needed)
docker-compose up -d -e JWT_SECRET=new_secret

# Check what's loaded
docker-compose config
```

---

## 🚨 Troubleshooting Configuration Issues

### Problem: "Missing required environment variables"

```bash
# Solution: Check .env file exists and has all variables
cat backend/.env

# Or copy from example:
cp backend/.env.example backend/.env
```

### Problem: "Connection refused to database"

```bash
# Check DB_HOST is correct
ping localhost                          # or your actual host
psql -h localhost -U postgres -d url_shortener
```

### Problem: "Changes not taking effect"

```bash
# Restart the app (dotenv loads at startup)
npm run dev
# or
docker-compose restart backend1 backend2
```

### Problem: "CORS error in frontend"

```bash
# Fix: Update CORS_ORIGIN in backend/.env to match frontend URL
# For localhost:
CORS_ORIGIN=http://localhost:5173

# For production:
CORS_ORIGIN=https://yourdomain.com
```

---

## 📊 Environment Variables Checklist

### Required (Will error if missing):
- [ ] `JWT_SECRET` - Token signing key
- [ ] `DB_HOST` - Database server
- [ ] `DB_USER` - Database user
- [ ] `DB_PASSWORD` - Database password
- [ ] `DB_NAME` - Database name
- [ ] `REDIS_HOST` - Redis server
- [ ] `RABBITMQ_URL` - Message queue

### Optional (Have defaults):
- [ ] `PORT` - Default: 3000
- [ ] `NODE_ENV` - Default: development
- [ ] `CORS_ORIGIN` - Default: http://localhost:5173
- [ ] `LOG_LEVEL` - Default: info

---

## 🎓 Summary Table

| When | What to Edit | Where to Look |
|------|---|---|
| Change database password | `backend/.env` | `DB_PASSWORD=` |
| Change cache server | `backend/.env` | `REDIS_HOST=` |
| Change token secret | `backend/.env` | `JWT_SECRET=` |
| Change API endpoint | `frontend/.env` | `VITE_API_URL=` |
| Change port | `backend/.env` | `PORT=` |
| Change log level | `backend/.env` | `LOG_LEVEL=` |
| Change rate limits | `backend/src/config/environment.ts` | Line `rateLimit:` |

**ONE PLACE, COMPLETE CONTROL! 🎯**
