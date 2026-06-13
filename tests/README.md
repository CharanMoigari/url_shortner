# API Testing Scripts

Quick manual testing scripts to verify the API is working correctly.

## Prerequisites

```bash
pip install requests
```

## Tests

### 1. `test_backend.py` - Direct Backend Testing
Tests the backend API directly (port 3000) for local development.

```bash
# Make sure backend is running
npm run dev

# In another terminal
python3 test_backend.py
```

### 2. `test_nginx.py` - Full Stack Testing
Tests the complete stack through Nginx (port 80) reverse proxy.

```bash
# Make sure Docker Compose is running
docker-compose up

# In another terminal
python3 test_nginx.py
```

## What These Tests Do

1. ✅ Register a new user (or login if already exists)
2. ✅ Fetch user's URLs from the database
3. ✅ Test URL redirect functionality
4. ✅ Verify API responses

## Expected Output

```
Register Status: 201
✅ Got access token!
✅ Found 5 URLs

URL Details:
  Short Code: abc123
  Original: https://example.com/very/long/url
  Clicks: 42

✅ Redirect Test Status: 301
```

---

For comprehensive testing, use the backend test suite:
```bash
npm run test
npm run test:coverage
```
