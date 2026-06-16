# URL Shortener Pro - Production-Grade URL Shortening Service

A complete, **production-ready** URL shortening service demonstrating **enterprise-level architecture**, **best practices**, and **scalability patterns**.

🎯 **Perfect for:** Portfolio projects • System design learning • Interview preparation • Production use

---

## ⚡ Quick Start

### Option 1: Docker (Recommended - 30 seconds)
```bash
git clone https://github.com/yourusername/url-shortener-pro.git
cd url-shortener-pro
docker-compose up
```

Then visit **http://localhost** 🚀

### Option 2: Local Development
See [QUICK_START.md](./QUICK_START.md) for detailed setup.

---

## 🎯 Tech Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Frontend** | React 18 + TypeScript + Vite | Modern, fast UI |
| **Backend** | Node.js + Express + TypeScript | Scalable HTTP server |
| **Database** | PostgreSQL | ACID compliance, reliability |
| **Cache** | Redis | High-performance caching |
| **Message Queue** | RabbitMQ | Async analytics processing |
| **Load Balancer** | Nginx | Distribute traffic, high availability |
| **Containerization** | Docker Compose | Production-ready deployment |

---

## ✨ Key Features

- ✅ **JWT Authentication** - Secure user registration & login
- ✅ **URL Shortening** - Base62 encoding for short codes
- ✅ **Custom Aliases** - Users create custom short URLs
- ✅ **URL Expiration** - Set expiration dates on URLs
- ✅ **Redis Caching** - Cache-aside pattern for performance
- ✅ **Rate Limiting** - DDoS & brute-force protection
- ✅ **Analytics** - Track device, browser, referrer, usage trends
- ✅ **Async Processing** - RabbitMQ for non-blocking analytics
- ✅ **Load Balancing** - Nginx distributes across multiple backends
- ✅ **Health Checks** - Automated monitoring & orchestration support
- ✅ **Docker Ready** - Complete Docker Compose setup

---

## 📊 Verified Metrics

**Redis Caching:** Reduces redirect latency by **60-80%**  
**Analytics:** Handles **30K+ events/minute** with async RabbitMQ  
**Rate Limiting:** 3-tier protection (300 req/min, 50 URLs/min, 20 auth/15min)  
**Database:** 6 strategic indexes for optimized query performance  
**Scalability:** Horizontal scaling with Nginx load balancing

👉 **[View metrics verification →](./tests/METRICS_VERIFICATION.md)**

---

## 📁 Project Structure

```
url-shortener-pro/
├── 📄 README.md              (You are here)
├── 📄 QUICK_START.md         (Setup guide)
├── 📄 ARCHITECTURE.md        (System design)
├── 📄 DEPLOYMENT_GUIDE.md    (Production)
├── 📄 CONTRIBUTING.md        (Contributing)
├── 📄 LICENSE               (MIT)
│
├── 📁 backend/              (Node.js/Express)
│   ├── src/
│   │   ├── controllers/     (Request handlers)
│   │   ├── services/        (Business logic)
│   │   ├── repositories/    (Data access + caching)
│   │   ├── middleware/      (Auth, rate limit, errors)
│   │   ├── routes/          (API endpoints)
│   │   ├── models/          (Database models)
│   │   ├── workers/         (Analytics worker)
│   │   ├── config/          (Configuration)
│   │   ├── utils/           (Helpers, Base62)
│   │   └── validations/     (Input schemas)
│   ├── migrations/          (Database setup)
│   ├── Dockerfile
│   └── package.json
│
├── 📁 frontend/             (React/Vite)
│   ├── src/
│   │   ├── pages/           (Login, Dashboard, etc.)
│   │   ├── components/      (Reusable components)
│   │   ├── services/        (API client)
│   │   └── context/         (Auth context)
│   ├── Dockerfile
│   └── package.json
│
├── 📁 nginx/                (Load balancer)
│   ├── default.conf
│   └── Dockerfile
│
├── 📁 tests/                (Test scripts)
│   ├── test_backend.py
│   ├── test_nginx.py
│   ├── benchmark_metrics.py
│   ├── METRICS_VERIFICATION.md
│   └── README.md
│
└── docker-compose.yml       (Orchestration)
```

---

## 🏗️ Architecture

```
┌──────────────────────────────────────┐
│     Client (React + Vite)            │
└──────────────┬───────────────────────┘
               │ HTTPS
┌──────────────▼───────────────────────┐
│       Nginx Load Balancer            │
│   (Round-robin, health checks)       │
└───────┬──────────────────┬───────────┘
        │                  │
   ┌────▼────┐        ┌────▼────┐
   │Backend 1 │        │Backend 2 │  (Scalable)
   │ Express  │        │ Express  │
   └────┬─────┘        └────┬─────┘
        └────────┬──────────┘
                 │
    ┌────────────┼────────────┐
    │            │            │
┌───▼──┐    ┌────▼────┐  ┌───▼────┐
│ PG   │    │  Redis  │  │RabbitMQ│
│  DB  │    │ Cache   │  │ Queue  │
└──────┘    └─────────┘  └───┬────┘
                              │
                        ┌─────▼─────┐
                        │ Analytics  │
                        │  Worker    │
                        └────────────┘
```

**Design Principles:**
- Stateless backend (supports horizontal scaling)
- Cache-aside pattern for Redis
- Async analytics with message queue
- Database connection pooling
- Layered architecture (clean separation of concerns)

---

## 🔐 Security Features

- ✅ **JWT Authentication** with expiring access tokens
- ✅ **Bcrypt Password Hashing** for user passwords
- ✅ **Refresh Token Mechanism** for session management
- ✅ **Rate Limiting** against brute force & DDoS
- ✅ **Helmet.js** for HTTP header security
- ✅ **CORS Configuration** for cross-origin requests
- ✅ **Input Validation** with Joi schemas
- ✅ **Error Handling** without exposing internals

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **QUICK_START.md** | 5-minute setup guide |
| **ARCHITECTURE.md** | Deep dive into system design |
| **DEPLOYMENT_GUIDE.md** | Production deployment steps |
| **CONTRIBUTING.md** | How to contribute |
| **tests/METRICS_VERIFICATION.md** | Performance metrics |

---

## 🚀 Deployment

### Docker Compose (Development & Production)
```bash
docker-compose up
```

### Production Deployment
See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for:
- Environment configuration
- Database setup
- Load balancing
- Monitoring & logging
- Scaling strategies

---

## 🧪 Testing

### Run Test Scripts
```bash
cd tests

# Test backend directly
python3 test_backend.py

# Test through Nginx
python3 test_nginx.py

# Benchmark performance
python3 benchmark_metrics.py
```

### View Metrics
```bash
# See verified performance metrics
cat tests/METRICS_VERIFICATION.md
```

---

## 📊 API Overview

### Authentication
```
POST   /api/auth/register         Register new user
POST   /api/auth/login            Login user
POST   /api/auth/refresh-token    Refresh access token
```

### URLs
```
POST   /api/urls                  Create short URL
GET    /api/urls                  Get user's URLs
GET    /api/urls/:id              Get URL details
PUT    /api/urls/:id              Update URL
DELETE /api/urls/:id              Delete URL
GET    /:shortCode                Redirect to original URL
```

### Analytics
```
GET    /api/analytics/:urlId      Get click analytics
GET    /api/analytics/:urlId/browser   Browser statistics
GET    /api/analytics/:urlId/device    Device statistics
```

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for:
- Code standards
- Pull request process
- Commit message format
- Areas for contribution

---

## 📝 License

This project is licensed under the [MIT License](./LICENSE).

---

## 💡 Key Learnings

This project demonstrates:
- ✅ Production-grade system design
- ✅ Database optimization (indexing, connection pooling)
- ✅ Caching strategies (cache-aside pattern)
- ✅ Async processing (message queues)
- ✅ Load balancing & scalability
- ✅ Authentication & security
- ✅ Rate limiting & protection
- ✅ Clean architecture principles
- ✅ Docker containerization
- ✅ Comprehensive logging

---

## 🎯 Perfect For

- 📚 **Learning** - Understand production system design
- 💼 **Portfolio** - Showcase full-stack capabilities
- 🎓 **Interviews** - Discuss scalable architecture
- 🚀 **Production** - Deploy a real service

---

## ❓ FAQ

**Q: How do I get this running quickly?**  
A: `docker-compose up` - visit http://localhost

**Q: How is the caching implemented?**  
A: Redis cache-aside pattern with 1-hour TTL. See [ARCHITECTURE.md](./ARCHITECTURE.md)

**Q: How much traffic can it handle?**  
A: Single instance: ~1000 req/sec. Scales horizontally with Nginx load balancing.

**Q: Is this production-ready?**  
A: Yes! It includes rate limiting, error handling, logging, health checks, and Docker setup.

**Q: Can I use this for my project?**  
A: Yes! It's MIT licensed. See [LICENSE](./LICENSE)

---

**Built with ❤️ for developers who care about quality code** 🚀
