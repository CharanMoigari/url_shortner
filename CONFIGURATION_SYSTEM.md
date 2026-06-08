# ✅ Centralized Configuration System - Complete Setup

## 📚 What's New

Your project now has a **completely centralized configuration system**. Change values in ONE place and they apply everywhere.

---

## 🗂️ Configuration Files Structure

```
url-shortener-pro/
│
├── backend/
│   ├── .env.example          ← Template (commit to git)
│   ├── .env                  ← Your config (NEVER commit!)
│   └── src/config/
│       ├── environment.ts    ← Centralized config loader
│       ├── database.ts       ← Uses env config
│       ├── redis.ts          ← Uses env config
│       ├── logger.ts         ← Uses env config
│       └── index.ts          ← Re-exports environment.ts
│
├── frontend/
│   ├── .env.example          ← Template
│   ├── .env                  ← Your config
│   └── src/config/
│       └── index.ts          ← Centralized config
│
├── CONFIG_GUIDE.md           ← Detailed guide
├── CONFIG_QUICK_REFERENCE.md ← Quick lookup
├── setup-env.sh              ← Auto-generator (macOS/Linux)
└── setup-env.ps1             ← Auto-generator (Windows)
```

---

## 🚀 Quick Start (3 Steps)

### Step 1: Generate Configuration

**Windows:**
```powershell
cd url-shortener-pro
.\setup-env.ps1
```

**macOS/Linux:**
```bash
cd url-shortener-pro
chmod +x setup-env.sh
./setup-env.sh
```

### Step 2: Start Your Services

```bash
# Terminal 1: PostgreSQL
# Terminal 2: Redis
# Terminal 3: RabbitMQ
```

### Step 3: Run Backend

```bash
cd backend
npm install
npm run migrate
npm run dev
```

---

## 📝 How It Works

### Backend Configuration Flow

```
1. You edit: backend/.env
   ↓
2. dotenv loads: src/config/environment.ts
   ↓
3. Validates all required variables
   ↓
4. All config files import from environment.ts
   ├─ config/database.ts
   ├─ config/redis.ts
   ├─ config/logger.ts
   │
   └─ All services use env config
      ├─ AuthService
      ├─ URLService
      ├─ AnalyticsService
      └─ All Controllers

Result: ✅ ONE .env file controls everything!
```

### Frontend Configuration Flow

```
1. You edit: frontend/.env
   ↓
2. Vite loads: src/config/index.ts
   ↓
3. All components use config
   ├─ src/services/api.ts
   ├─ src/context/AuthContext.tsx
   └─ All Pages

Result: ✅ ONE .env file controls frontend!
```

---

## 🔧 Configuration Files at a Glance

### Backend: `backend/src/config/environment.ts`

```typescript
export const env = {
  PORT: 3000,
  
  database: {
    host: 'localhost',
    port: 5432,
    database: 'url_shortener',
    user: 'postgres',
    password: 'postgres',
    poolSize: 10,
  },
  
  redis: {
    host: 'localhost',
    port: 6379,
    db: 0,
    password: undefined,
    ttl: 3600,
  },
  
  jwt: {
    secret: 'your_jwt_secret',
    expiryShort: '24h',
    expiryLong: '7d',
  },
  
  rabbitmq: {
    url: 'amqp://guest:guest@localhost:5672',
  },
  
  app: {
    url: 'http://localhost:3000',
    corsOrigin: 'http://localhost:5173',
  },
  
  rateLimit: {
    windowMs: 60000,
    general: 100,
    urlCreation: 20,
    authAttempts: 5,
  },
  
  logging: {
    level: 'info',
    dir: './logs',
  },
};
```

**Usage everywhere:**
```typescript
import { env } from './config/environment';

// In database.ts
const pool = new Pool(env.database);

// In redis.ts
const client = Redis.createClient(env.redis);

// In logger.ts
const logger = createLogger({ level: env.logging.level });

// In middleware
const rateLimit = env.rateLimit.general;
```

### Frontend: `frontend/src/config/index.ts`

```typescript
export const config = {
  api: {
    baseUrl: 'http://localhost:3000/api',
    timeout: 30000,
    retryAttempts: 3,
  },
  
  app: {
    baseUrl: 'http://localhost:3000',
    appName: 'URL Shortener Pro',
  },
  
  auth: {
    storageKey: 'url_shortener_auth',
  },
  
  pagination: {
    defaultLimit: 10,
  },
  
  features: {
    enableAnalytics: true,
    enableSearch: true,
  },
};
```

**Usage everywhere:**
```typescript
import config from './config';

// In api.ts
const apiClient = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
});

// In Dashboard.tsx
const [limit] = useState(config.pagination.defaultLimit);
```

---

## 📋 What You Can Change and Where

| What to Change | File | Variable |
|---|---|---|
| Database password | `backend/.env` | `DB_PASSWORD` |
| Redis server | `backend/.env` | `REDIS_HOST`, `REDIS_PORT` |
| JWT secret | `backend/.env` | `JWT_SECRET` |
| API endpoint | `frontend/.env` | `VITE_API_URL` |
| Port | `backend/.env` | `PORT` |
| Log level | `backend/.env` | `LOG_LEVEL` |
| Token expiry | `backend/.env` | `JWT_EXPIRY` |
| Rate limit | `backend/.env` or code | `RATE_LIMIT_MAX_REQUESTS` |
| CORS origin | `backend/.env` | `CORS_ORIGIN` |

---

## 🔐 Security Best Practices

### For Development

```env
# backend/.env
NODE_ENV=development
JWT_SECRET=dev_secret_123
DB_PASSWORD=postgres
CORS_ORIGIN=http://localhost:5173
```

### For Production

```env
# backend/.env
NODE_ENV=production
JWT_SECRET=<use: openssl rand -hex 32>
DB_PASSWORD=<strong random password>
CORS_ORIGIN=https://yourdomain.com
APP_URL=https://yourdomain.com
LOG_LEVEL=warn
DB_POOL_SIZE=32
```

**Never commit `.env` to git!** (Already in `.gitignore`)

---

## ✨ Features of This System

### ✅ Centralized
- One `.env` file per environment
- All config in one place

### ✅ Validated
- Required variables checked on startup
- Missing variables cause clear error messages

### ✅ Type-Safe
- TypeScript interfaces for all config
- IDE autocomplete support

### ✅ Backward Compatible
- `config/index.ts` re-exports for old code
- All existing imports still work

### ✅ Easy to Scale
- Can add new variables easily
- Default values for optional settings

### ✅ Environment-Specific
- Different configs for dev/staging/production
- Just swap `.env` file

---

## 📖 Documentation Files

| File | Purpose |
|------|---------|
| `CONFIG_QUICK_REFERENCE.md` | Quick lookup table |
| `CONFIG_GUIDE.md` | Detailed guide with examples |
| `setup-env.ps1` | Windows config generator |
| `setup-env.sh` | macOS/Linux config generator |

---

## 🎯 Common Tasks

### Change Database Password

```bash
# Edit backend/.env
DB_PASSWORD=new_strong_password

# Restart backend
npm run dev
```

### Change API URL for Frontend

```bash
# Edit frontend/.env
VITE_API_URL=http://new-domain.com/api

# Rebuild frontend
npm run build
```

### Deploy with Different Config

```bash
# Copy production config
cp backend/.env.prod backend/.env

# Deploy
docker-compose up -d
```

### Reset to Default Config

```bash
# Restore from template
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

---

## 🧪 Testing Your Configuration

### Check Backend Config Loads

```bash
cd backend
npm install
npm run dev

# Look for: "Connected to database"
# Look for: "Redis connected"
```

### Check Frontend Config Loads

```bash
cd frontend
npm install
npm run dev

# Look for: "API URL: http://localhost:3000/api"
```

### Verify .env Values Are Used

```bash
# In backend, check that environment.ts validates:
import { env } from './src/config/environment';
console.log(env.database.host); // Should show your value

# In frontend, check that config loads:
import config from './src/config';
console.log(config.api.baseUrl); // Should show your value
```

---

## 🚨 Troubleshooting

### Problem: "Cannot find module 'dotenv'"

```bash
# Solution: Install dependencies
cd backend
npm install
```

### Problem: "Required environment variable missing"

```bash
# Solution: Check .env file
cat backend/.env

# Or regenerate:
./setup-env.ps1  # Windows
./setup-env.sh   # macOS/Linux
```

### Problem: "Connection refused"

```bash
# Solution: Verify REDIS_HOST and DB_HOST are correct
# Check services are running:
# - PostgreSQL on port 5432
# - Redis on port 6379
# - RabbitMQ on port 5672
```

### Problem: "Config changes not taking effect"

```bash
# Solution: Restart the application (dotenv loads at startup)
npm run dev
```

---

## 📊 Configuration Checklist

### Development Setup
- [ ] Run `setup-env.ps1` or `setup-env.sh`
- [ ] Install PostgreSQL locally
- [ ] Install Redis locally
- [ ] Install RabbitMQ locally
- [ ] Run `npm run migrate`
- [ ] `npm run dev`

### Docker Compose Setup
- [ ] Verify `docker-compose.yml` reads from `backend/.env`
- [ ] Run `docker-compose up -d`
- [ ] Backend should auto-connect to Docker services

### Production Setup
- [ ] Generate strong `JWT_SECRET`
- [ ] Use strong `DB_PASSWORD`
- [ ] Set `NODE_ENV=production`
- [ ] Set correct `CORS_ORIGIN`
- [ ] Increase `DB_POOL_SIZE`
- [ ] Use `https://` URLs

---

## 🎓 Summary

| Aspect | Before | After |
|--------|--------|-------|
| Config Files | 4 separate files | 1 `.env` file |
| To Change Password | Edit database.ts + code | Edit 1 line in .env |
| Type Safety | Dynamic values | TypeScript interfaces |
| Validation | No validation | All required vars checked |
| Documentation | Scattered | Centralized with guides |
| Environment Switching | Complex | Simple .env swap |

**Result: ✅ Easiest configuration system to maintain!**

---

## 🚀 Next Steps

1. **Run setup script** to generate `.env`
2. **Start services** (PostgreSQL, Redis, RabbitMQ)
3. **Start backend** with `npm run dev`
4. **Start frontend** with `npm run dev`
5. **Make changes** to `.env` as needed
6. **Restart services** for changes to take effect

**That's it! Your configuration system is ready! 🎉**
