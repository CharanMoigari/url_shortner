#!/usr/bin/env python3
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
            print(f'  Short URL: {url["shortUrl"]}')
            print(f'  Click Count: {url["clickCount"]}')
            print(f'\nSUCCESS: API is working correctly!')
    else:
        print(f'Failed to get URLs: {r.status_code}')
else:
    print(f'Failed to register/login: {response.status_code}')
    print(response.text[:200])
