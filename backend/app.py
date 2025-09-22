from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import traceback
from github_utils import clone_and_parse_repo
from ai_writer import generate_blog
import os
import requests

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

@app.route('/generate-blog', methods=['POST'])
def generate_blog_route():
    try:
        data = request.json
        repo_url = data.get('repo_url')
        
        if not repo_url:
            logger.warning("Request received without repo_url")
            return jsonify({"error": "Repository URL not provided"}), 400
        
        logger.info(f"Processing request for repository: {repo_url}")
        
        # Clone and parse the repository
        try:
            metadata = clone_and_parse_repo(repo_url)
        except Exception as e:
            logger.error(f"Error in clone_and_parse_repo: {str(e)}")
            return jsonify({"error": f"Failed to clone or parse repository: {str(e)}"}), 500
        
        # Generate the blog post
        try:
            blog_md = generate_blog(metadata)
            return jsonify({"blog": blog_md})
        except Exception as e:
            logger.error(f"Error in generate_blog: {str(e)}")
            return jsonify({"error": f"Failed to generate blog post: {str(e)}"}), 500

    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok"}), 200

@app.route('/test-env', methods=['GET'])
def test_env():
    api_key = os.environ.get("OPENROUTER_API_KEY")
    if api_key:
        key_preview = api_key[:4] + "..." + api_key[-4:] if len(api_key) > 8 else "***"
        return jsonify({
            "status": "ok",
            "api_key_present": True,
            "api_key_preview": key_preview,
            "env_vars": list(os.environ.keys())
        })
    return jsonify({
        "status": "error",
        "api_key_present": False,
        "env_vars": list(os.environ.keys())
    }), 500

@app.route('/test-openrouter', methods=['GET'])
def test_openrouter():
    try:
        api_key = os.environ.get("OPENROUTER_API_KEY")
        if not api_key:
            return jsonify({
                "status": "error",
                "message": "No API key found"
            }), 500

        # Make a simple test request to OpenRouter
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://gitdocs-tw63.onrender.com",
            "X-Title": "GitDocs"
        }
        
        payload = {
            "model": "openai/gpt-3.5-turbo",
            "messages": [
                {
                    "role": "user",
                    "content": "Hello, this is a test message."
                }
            ]
        }
        
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=10
        )
        
        return jsonify({
            "status": "ok" if response.status_code == 200 else "error",
            "status_code": response.status_code,
            "response": response.text[:200] if response.status_code != 200 else "Success",
            "headers_sent": headers
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

if __name__ == '__main__':
    logger.info("Starting Flask application")
    # Increase timeout for development server
    app.run(debug=True, host='0.0.0.0', threaded=True)