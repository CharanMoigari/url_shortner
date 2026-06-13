#!/usr/bin/env python3
"""
Manual API Testing Script - Direct Backend

This script tests the API by hitting the backend directly (port 3000).
Useful for local development testing.

Usage:
  python3 test_backend.py

Requirements:
  pip install requests
"""
import requests
import json

data = {'email': 'testuser@example.com', 'password': 'TestPassword123!'}
headers = {'Content-Type': 'application/json'}

# Try register/login
response = requests.post('http://localhost:3000/api/auth/register', json=data, headers=headers)
print(f'Register Status: {response.status_code}')

if response.status_code in [201, 409]:
    try:
        token = response.json()['data']['accessToken']
    except:
        # Try login
        response = requests.post('http://localhost:3000/api/auth/login', json=data, headers=headers)
        if response.status_code != 200:
            print(f'Login failed: {response.status_code}')
            exit(1)
        token = response.json()['data']['accessToken']
    
    auth = {**headers, 'Authorization': f'Bearer {token}'}
    r = requests.get('http://localhost:3000/api/urls?page=1&limit=1', headers=auth)
    
    if r.status_code == 200:
        urls = r.json()['data']['data']
        if urls:
            url = urls[0]
            print(f'\nURL Info:')
            print(f'  Short Code: {url["shortCode"]}')
            print(f'  Original URL: {url["originalUrl"]}')
            print(f'  Clicks: {url["clickCount"]}')
            
            # Test redirect
            response = requests.get(f'http://localhost:3000/r/{url["shortCode"]}', allow_redirects=False)
            print(f'\n✅ Redirect Status: {response.status_code}')
