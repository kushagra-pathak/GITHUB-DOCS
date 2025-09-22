# Save this as test_openrouter.py
import requests
import os
from dotenv import load_dotenv
import json

load_dotenv()

API_KEY = os.getenv("OPENROUTER_API_KEY")
API_URL = "https://openrouter.ai/api/v1/chat"
MODEL = "deepseek-ai/deepseek-coder"  # The model you're trying to use

def test_api():
    print(f"Testing OpenRouter API with key: {API_KEY[:4]}...{API_KEY[-4:] if len(API_KEY) > 8 else '***'}")
    
    try:
        response = requests.post(
            API_URL,
            headers={
                "Authorization": f"Bearer {API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": MODEL,
                "messages": [{"role": "user", "content": "Hello, please respond with a simple 'Hello back'"}],
                "temperature": 0.7,
                "max_tokens": 20
            },
            timeout=30
        )
        
        print(f"Response status code: {response.status_code}")
        print(f"Response content: {response.content}")
        
        if response.status_code == 200:
            data = response.json()
            print("API connection successful!")
            print(f"Model response: {data['choices'][0]['message']['content']}")
        else:
            print(f"API error: {response.text}")
            
    except Exception as e:
        print(f"Error testing API: {str(e)}")

if __name__ == "__main__":
    test_api()