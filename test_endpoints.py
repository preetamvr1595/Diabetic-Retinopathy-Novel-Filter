import requests

# Test if auth endpoints are registered
endpoints = [
    "/api/auth/login",
    "/api/auth/signup",
]

for endpoint in endpoints:
    url = f"http://127.0.0.1:5000{endpoint}"
    try:
        # Send a test request
        response = requests.post(url, json={"email": "test@test.com", "password": "test123"}, timeout=3)
        print(f"\n{endpoint}:")
        print(f"  Status: {response.status_code}")
        print(f"  Content-Type: {response.headers.get('Content-Type')}")
        print(f"  Response: {response.text[:200]}")
    except Exception as e:
        print(f"\n{endpoint}: ERROR - {e}")
