#!/usr/bin/env python3
import requests
import json

data = {'email': 'testuser@example.com', 'password': 'TestPassword123!'}
headers = {'Content-Type': 'application/json'}

# Test through nginx proxy on port 80
print("Testing through nginx proxy (port 80)...")

# Try register/login
response = requests.post('http://localhost/api/auth/register', json=data, headers=headers, timeout=10)
print(f'Register Status: {response.status_code}')

if response.status_code in [201, 409]:
    try:
        token = response.json()['data']['accessToken']
        print('✅ Got access token!')
    except:
        # Try login
        response = requests.post('http://localhost/api/auth/login', json=data, headers=headers, timeout=10)
        if response.status_code != 200:
            print(f'❌ Login failed: {response.status_code}')
            exit(1)
        token = response.json()['data']['accessToken']
        print('✅ Login successful!')
    
    auth = {**headers, 'Authorization': f'Bearer {token}'}
    r = requests.get('http://localhost/api/urls?page=1&limit=1', headers=auth, timeout=10)
    
    if r.status_code == 200:
        urls = r.json()['data']['data']
        if urls:
            url = urls[0]
            print(f'\n✅ Successfully retrieved URLs:')
            print(f'  Short Code: {url["shortCode"]}')
            print(f'  Short URL: {url["shortUrl"]}')
            print(f'  Click Count: {url["clickCount"]}')
            print(f'\n✅ API is working correctly!')
            print(f'✅ Rate limiting is fixed (no 429 errors)!')
    else:
        print(f'❌ Failed to get URLs: {r.status_code}')
else:
    print(f'❌ Failed to register/login: {response.status_code}')
    if response.status_code == 429:
        print('⚠️  Still getting 429 errors - rate limiter still too strict')
    print(response.text[:200])
