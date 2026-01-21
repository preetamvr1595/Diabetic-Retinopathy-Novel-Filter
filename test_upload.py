import requests
import os
import sys

# Create a dummy image
fname = "test_image.jpg"
with open(fname, "wb") as f:
    f.write(os.urandom(1024))

url = "http://127.0.0.1:5000/api/upload"
print(f"Testing upload to {url}...")
try:
    with open(fname, "rb") as f:
        files = {"image": (fname, f, "image/jpeg")}
        response = requests.post(url, files=files, timeout=5)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
finally:
    if os.path.exists(fname):
        os.remove(fname)
