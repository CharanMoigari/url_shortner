#!/usr/bin/env python3
"""
Manual API Testing Script - Through Nginx

This script tests the API through the Nginx reverse proxy (port 80).
Use this when testing the full Docker setup.

Usage:
  python3 test_nginx.py

Requirements:
  pip install requests

Prerequisites:
  docker-compose up
"""
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
        print(f'✅ Found {len(urls)} URLs')
        
        if urls:
            url = urls[0]
            print(f'\nURL Details:')
            print(f'  Short Code: {url["shortCode"]}')
            print(f'  Original: {url["originalUrl"]}')
            print(f'  Clicks: {url["clickCount"]}')
            
            # Test redirect
            response = requests.get(f'http://localhost/r/{url["shortCode"]}', allow_redirects=False, timeout=10)
            print(f'\n✅ Redirect Test Status: {response.status_code}')
