# URL Shortener Pro - Production-Grade Scalable Application

A complete, production-ready URL shortening service built with modern technologies. Designed for SDE-1 interviews at product-based companies.

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                   Client (React + Vite)                    │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                   Nginx Load Balancer                       │
│              (Distributes requests across                   │
│               multiple backend instances)                   │
└─────────┬──────────────────────────────────┬────────────────┘
          │                                  │
   ┌──────▼──────┐                    ┌──────▼──────┐
   │  Backend 1  │                    │  Backend 2  │
   │  (Express)  │                    │  (Express)  │
   └──────┬──────┘                    └──────┬──────┘
          │                                  │
          └──────────────┬───────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
   ┌────▼────┐    ┌──────▼──────┐   ┌────▼────┐
   │PostgreSQL│    │ Redis Cache │   │RabbitMQ │
   │(Database)│    │(Cache Store)│   │(Message │
   │          │    │ + Rate Limit│   │ Queue)  │
   └──────────┘    └─────────────┘   └────┬────┘
                                           │
                                    ┌──────▼──────┐
                                    │ Analytics  │
                                    │  Worker    │
                                    │(Async Job) │
                                    └────────────┘
```

## 🎯 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + TypeScript + Vite | Modern, fast UI with type safety |
| **Backend** | Node.js + Express + TypeScript | Scalable HTTP server |
| **Database** | PostgreSQL | ACID compliance, reliability |
| **Cache** | Redis | High-speed data caching, rate limiting |
| **Message Queue** | RabbitMQ | Asynchronous analytics processing |
| **Load Balancer** | Nginx | Distribute load across multiple backends |
| **Containerization** | Docker Compose | Easy local dev & production deployment |

## ⚡ Key Features

- ✅ **JWT Authentication** - Secure user registration and login
- ✅ **URL Shortening** - Base62 encoding for short codes
- ✅ **Custom Aliases** - Users can create custom short URLs
- ✅ **URL Expiration** - Set expiration dates on URLs
- ✅ **Smart Caching** - Redis Cache-Aside pattern for performance
- ✅ **Rate Limiting** - Prevent abuse with per-IP/user rate limits
- ✅ **Search & Pagination** - Efficiently find and paginate through URLs
- ✅ **Analytics** - Track clicks, device types, browsers, referrers
- ✅ **Asynchronous Processing** - RabbitMQ for analytics event handling
- ✅ **Load Balancing** - Nginx distributes traffic across backend instances
- ✅ **Structured Logging** - Winston for comprehensive application logging
- ✅ **Health Checks** - Verify system component status
- ✅ **Docker Ready** - Complete Docker Compose setup

## 📋 Project Structure

```
url-shortener-pro/
├── backend/
│   ├── src/
│   │   ├── controllers/        # API request handlers
│   │   ├── services/           # Business logic
│   │   ├── repositories/       # Data access layer
│   │   ├── routes/             # API route definitions
│   │   ├── middleware/         # Auth, error handling, logging
│   │   ├── models/             # Database models
│   │   ├── workers/            # RabbitMQ consumer (analytics)
│   │   ├── config/             # Configuration files
│   │   ├── utils/              # Helper utilities
│   │   ├── validations/        # Input validation schemas
│   │   └── types/              # TypeScript type definitions
│   ├── migrations/             # Database migrations
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── pages/              # Page components
│   │   ├── components/         # Reusable components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── services/           # API client services
│   │   ├── context/            # React Context for state
│   │   ├── types/              # TypeScript interfaces
│   │   └── App.tsx
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── Dockerfile
│   └── .env.example
│
├── nginx/
│   ├── nginx.conf              # Nginx configuration (load balancer)
│   └── Dockerfile
│
├── docker-compose.yml          # Orchestrate all services
├── .gitignore
├── .env.example
└── README.md
```

## 🏗️ Architectural Decisions

### 1. **PostgreSQL vs MongoDB**
- ✅ **ACID Compliance** - Ensures data consistency for URLs and clicks
- ✅ **Complex Queries** - Native pagination, sorting, filtering
- ✅ **Relationships** - Foreign keys between Users and URLs
- ✅ **Indexing** - Efficient lookups on short_code and user_id
- ✅ **Industry Standard** - Most product companies use PostgreSQL

### 2. **Redis Caching**
- ✅ **Cache-Aside Pattern** - Check Redis → Query DB → Store in Redis
- ✅ **Performance** - Microsecond response times vs milliseconds
- ✅ **Rate Limiting** - Fast counter increments for throttling
- ✅ **Scalability** - Handles millions of concurrent requests

### 3. **RabbitMQ for Analytics**
- ✅ **Decoupling** - Analytics doesn't block URL redirect
- ✅ **Asynchronous** - User sees instant redirect, analytics processed later
- ✅ **Reliability** - Message persistence and retry logic
- ✅ **Scalability** - Multiple workers can process analytics in parallel

### 4. **Load Balancer (Nginx)**
- ✅ **High Availability** - If one backend fails, traffic goes to other
- ✅ **Scalability** - Easily add more backend instances
- ✅ **Horizontal Scaling** - No single point of failure
- ✅ **Session Affinity** - Could implement sticky sessions if needed

### 5. **JWT Authentication**
- ✅ **Stateless** - No session storage needed
- ✅ **Scalability** - Works seamlessly with multiple backends
- ✅ **Security** - Secure token with expiration
- ✅ **Mobile Friendly** - Perfect for mobile/SPA apps

### 6. **Base62 Encoding**
- ✅ **Short URLs** - 8 characters handle 62^8 = 218 trillion URLs
- ✅ **Readable** - No confusing characters (0/O, l/1)
- ✅ **Collision Avoidance** - Unique nanoid generation
- ✅ **Decoding** - Can reverse to get sequential IDs

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 14+
- Redis 7+
- RabbitMQ 3.12+

### Local Development Setup

```bash
# Clone repository
git clone <repo>
cd url-shortener-pro

# Start all services with Docker Compose
docker-compose up -d

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Run backend in dev mode
cd ../backend
npm run dev

# In another terminal, run frontend
cd frontend
npm run dev
```

Backend: http://localhost:3000
Frontend: http://localhost:5173

## 📚 API Documentation

### Authentication

**Register**
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure_password"
}
```

**Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure_password"
}
```

### URL Management

**Create Short URL**
```http
POST /api/urls
Authorization: Bearer <token>
Content-Type: application/json

{
  "originalUrl": "https://example.com/very/long/url",
  "customAlias": "my-custom-code",  // optional
  "expiresAt": "2024-12-31T23:59:59Z"  // optional
}
```

**Get All URLs**
```http
GET /api/urls?page=1&limit=20&search=example&sort=createdAt
Authorization: Bearer <token>
```

**Redirect to Original URL**
```http
GET /:shortCode
```

**Delete URL**
```http
DELETE /api/urls/:urlId
Authorization: Bearer <token>
```

## 📊 Database Schema

### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### urls
```sql
CREATE TABLE urls (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  short_code VARCHAR(20) UNIQUE NOT NULL,
  original_url TEXT NOT NULL,
  click_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  INDEX (short_code),
  INDEX (user_id)
);
```

### analytics
```sql
CREATE TABLE analytics (
  id UUID PRIMARY KEY,
  url_id UUID REFERENCES urls(id),
  browser VARCHAR(50),
  device VARCHAR(50),
  referrer TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (url_id),
  INDEX (timestamp)
);
```

## 🔒 Security Features

- ✅ bcrypt for password hashing
- ✅ JWT token expiration
- ✅ Rate limiting per IP/user
- ✅ Input validation with Joi
- ✅ SQL injection prevention (parameterized queries)
- ✅ CORS configuration
- ✅ Environment variables for secrets

## 🧪 Testing

Tests included for:
- Authentication controllers
- URL services
- Repository layer
- Middleware
- Utilities

Run tests:
```bash
npm run test
npm run test:coverage
```

## 📈 Performance Metrics

Target metrics:
- URL redirect: < 50ms (with caching)
- Create short URL: < 100ms
- List URLs: < 200ms
- P99 latency across 1000 RPS: < 500ms

## 🐳 Docker Deployment

```bash
# Build all images
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Scale backend instances
docker-compose up -d --scale backend=3
```

## 📝 License

MIT

---

Built for SDE-1 interviews at product companies. Demonstrates:
- Clean Architecture
- Scalable System Design
- Production-Ready Code
- DevOps Practices
- Database Optimization
- Caching Strategies
- Message Queues
- Load Balancing
