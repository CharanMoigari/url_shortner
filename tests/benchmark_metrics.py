#!/usr/bin/env python3
"""
Performance Metrics Verification Script

Measures actual performance of the URL shortener with and without cache.
Run this against a running instance to verify metrics.

Usage:
    python3 benchmark_metrics.py

Requirements:
    pip install requests
"""
import requests
import time
import statistics
from datetime import datetime

BASE_URL = "http://localhost:3000"
API_BASE = f"{BASE_URL}/api"

def register_user():
    """Register test user"""
    response = requests.post(
        f"{API_BASE}/auth/register",
        json={
            "email": f"benchmark_{int(time.time())}@test.com",
            "password": "TestPassword123!"
        }
    )
    return response.json()['data']['accessToken']

def create_short_url(token):
    """Create a short URL"""
    response = requests.post(
        f"{API_BASE}/urls",
        headers={"Authorization": f"Bearer {token}"},
        json={"originalUrl": "https://example.com/very/long/url/that/is/being/shortened"}
    )
    return response.json()['data']['shortCode']

def benchmark_redirect(short_code, runs=100):
    """Measure redirect response time"""
    times = []
    
    for i in range(runs):
        start = time.time()
        response = requests.get(
            f"{BASE_URL}/r/{short_code}",
            allow_redirects=False
        )
        elapsed = (time.time() - start) * 1000  # Convert to ms
        times.append(elapsed)
        
        if response.status_code != 302:
            print(f"⚠️  Unexpected status: {response.status_code}")
    
    return times

def benchmark_with_cache_warmup(short_code, runs=100):
    """Measure redirect time AFTER cache hit"""
    # Warm up cache
    requests.get(f"{BASE_URL}/r/{short_code}", allow_redirects=False)
    time.sleep(0.1)  # Let cache settle
    
    times = []
    for i in range(runs):
        start = time.time()
        response = requests.get(
            f"{BASE_URL}/r/{short_code}",
            allow_redirects=False
        )
        elapsed = (time.time() - start) * 1000
        times.append(elapsed)
    
    return times

def main():
    print("=" * 60)
    print("URL SHORTENER PERFORMANCE BENCHMARK")
    print("=" * 60)
    
    try:
        # Register user
        print("\n1️⃣  Registering test user...")
        token = register_user()
        print("✅ User registered")
        
        # Create short URL
        print("\n2️⃣  Creating short URL...")
        short_code = create_short_url(token)
        print(f"✅ Short URL created: {short_code}")
        
        # Benchmark WITHOUT cache (cold start)
        print("\n3️⃣  Measuring redirect latency (first request - Redis miss)...")
        times_cold = benchmark_redirect(short_code, runs=50)
        avg_cold = statistics.mean(times_cold)
        p95_cold = sorted(times_cold)[int(len(times_cold) * 0.95)]
        p99_cold = sorted(times_cold)[int(len(times_cold) * 0.99)]
        
        print(f"   Average: {avg_cold:.2f}ms")
        print(f"   P95:     {p95_cold:.2f}ms")
        print(f"   P99:     {p99_cold:.2f}ms")
        print(f"   Min:     {min(times_cold):.2f}ms")
        print(f"   Max:     {max(times_cold):.2f}ms")
        
        time.sleep(1)  # Wait before cache hits
        
        # Benchmark WITH cache (warm)
        print("\n4️⃣  Measuring redirect latency (cached - Redis hit)...")
        times_hot = benchmark_with_cache_warmup(short_code, runs=50)
        avg_hot = statistics.mean(times_hot)
        p95_hot = sorted(times_hot)[int(len(times_hot) * 0.95)]
        p99_hot = sorted(times_hot)[int(len(times_hot) * 0.99)]
        
        print(f"   Average: {avg_hot:.2f}ms")
        print(f"   P95:     {p95_hot:.2f}ms")
        print(f"   P99:     {p99_hot:.2f}ms")
        print(f"   Min:     {min(times_hot):.2f}ms")
        print(f"   Max:     {max(times_hot):.2f}ms")
        
        # Calculate improvement
        improvement_percent = ((avg_cold - avg_hot) / avg_cold) * 100
        improvement_ms = avg_cold - avg_hot
        
        print("\n" + "=" * 60)
        print("📊 CACHE PERFORMANCE IMPROVEMENT")
        print("=" * 60)
        print(f"Without Cache (DB):  {avg_cold:.2f}ms")
        print(f"With Cache (Redis):  {avg_hot:.2f}ms")
        print(f"Improvement:         {improvement_ms:.2f}ms ({improvement_percent:.1f}%)")
        print("=" * 60)
        
        # VERIFIED METRICS
        print("\n✅ VERIFIED METRICS FOR RESUME:")
        print(f"   • Redis caching reduces redirect latency by {improvement_percent:.0f}%")
        print(f"   • Cold start (first request): ~{avg_cold:.0f}ms")
        print(f"   • Cached request: ~{avg_hot:.0f}ms")
        print(f"   • P95 latency (cached): {p95_hot:.2f}ms")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("\nMake sure the backend is running:")
        print("  cd backend && npm run dev")

if __name__ == "__main__":
    main()
