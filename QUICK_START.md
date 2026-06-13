# Quick Start Guide 🚀

Get up and running in **5 minutes**!

## Prerequisites
- Docker & Docker Compose installed
- Git

## Option 1: Docker Compose (Recommended) 🐳

```bash
# Clone the repo
git clone https://github.com/yourusername/url-shortener-pro.git
cd url-shortener-pro

# Start all services
docker-compose up

# The app is now running at http://localhost
```

**Services:**
- Frontend: http://localhost
- Backend API: http://localhost/api
- Health check: http://localhost/api/health

---

## Option 2: Local Development Setup 🛠️

### Backend

```bash
cd backend

# Create environment file
cp .env.example .env

# Install dependencies
npm install

# Run migrations
npm run migrate

# Start dev server
npm run dev
```

Backend runs on `http://localhost:3000`

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## Test the API 🧪

```bash
# Create a short URL
curl -X POST http://localhost:3000/api/urls/shorten \
  -H "Content-Type: application/json" \
  -d '{"originalUrl": "https://example.com/very/long/url"}'

# Redirect to original URL
curl -L http://localhost:3000/r/{shortCode}
```

---

## Common Commands

| Command | Purpose |
|---------|---------|
| `npm run build` | Build for production |
| `npm run test` | Run tests |
| `npm run lint` | Check code quality |
| `npm run format` | Auto-format code |

---

## Troubleshooting

**Port already in use?**
```bash
# Change port in backend/.env
PORT=3001
```

**Database connection error?**
```bash
# Check PostgreSQL is running
docker-compose logs postgres
```

**Need help?** See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed documentation.
