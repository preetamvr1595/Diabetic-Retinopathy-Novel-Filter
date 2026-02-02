import requests
import json

# Test login endpoint
url = "http://127.0.0.1:5000/api/auth/login"
data = {"email": "test@test.com", "password": "test1234"}

try:
    response = requests.post(url, json=data, timeout=5)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except requests.exceptions.ConnectionError as e:
    print(f"Connection Error: {e}")
except requests.exceptions.Timeout:
    print("Request timed out")
except Exception as e:
    print(f"Error: {e}")
