import requests
import os
import json
from dotenv import load_dotenv
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Try to load from .env file first (for local development)
load_dotenv()

OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"
API_KEY = os.environ.get("OPENROUTER_API_KEY")  # Changed from os.getenv to os.environ.get
MODEL = "openai/gpt-4o-mini"

# Log environment variable status
if API_KEY:
    key_preview = API_KEY[:4] + "..." + API_KEY[-4:] if len(API_KEY) > 8 else "***"
    logger.info(f"API key found in environment: {key_preview}")
else:
    logger.error("No API key found in environment variables")
    logger.error("Please ensure OPENROUTER_API_KEY is set in your environment")
    logger.error("Current environment variables: " + ", ".join(os.environ.keys()))

def sanitize_text(text):
    """Sanitize text to ensure it can be safely processed and sent to API."""
    if not isinstance(text, str):
        return ""
    # Replace or remove problematic characters and ensure UTF-8 compatibility
    return text.encode('utf-8', errors='replace').decode('utf-8')

def generate_local_blog(metadata):
    """Generate a simple blog post locally when API is unavailable."""
    repo_name = metadata.get('repo_name', 'Unknown Repository')
    repo_url = metadata.get('repo_url', '')
    tech_stack = ', '.join(metadata.get('tech_stack', ['Unknown']))
    readme = metadata.get('readme', 'No README available.')[:500]  # Just use a short excerpt
    
    # Get first file snippet if available
    code_example = ""
    if metadata.get('files') and len(metadata.get('files')) > 0:
        first_file = metadata.get('files')[0]
        code_example = f"""
## Code Example

Here's a snippet from `{first_file.get('filename', 'example.py')}`:

```
{first_file.get('snippet', '# No code available')}
```
"""
    
    # Generate a simple blog structure
    blog = f"""# {repo_name}

## Introduction

This blog post explores the GitHub repository [{repo_name}]({repo_url}), which appears to be built using {tech_stack}.

## Overview

{readme}

## Features

Based on the repository analysis, here are the main features:

- Feature 1: The repository provides functionality related to {repo_name.replace('-', ' ')}
- Feature 2: It uses {tech_stack} to implement its core functionality
- Feature 3: It includes a well-structured codebase with multiple components

{code_example}

## Conclusion

The {repo_name} repository demonstrates a practical implementation of {tech_stack} technologies. It provides a solid foundation for understanding how these technologies can be used together effectively.
"""
    return blog

def generate_blog(metadata):
    """Generate a blog post based on repository metadata."""
    try:
        tech_stack = ', '.join(metadata.get('tech_stack', ['Unknown']))
        readme = sanitize_text(metadata.get('readme', ''))[:2000]
        repo_name = metadata.get('repo_name', 'Unknown Repository')
        repo_url = metadata.get('repo_url', '')
        
        # Build code snippet section
        code_snippets = ""
        for file in metadata.get('files', [])[:3]:
            filename = sanitize_text(file.get('filename', ''))
            snippet = sanitize_text(file.get('snippet', ''))
            code_snippets += f"### {filename}:\n```\n{snippet}\n```\n\n"

        # Create the prompt
        prompt = (
            f"Write a comprehensive technical blog post about the GitHub repository '{repo_name}' ({repo_url}).\n\n"
            f"Tech Stack: {tech_stack}\n\n"
            f"README Excerpt:\n{readme}\n\n"
            f"Code Snippets:\n{code_snippets}\n\n"
            "Write a detailed technical blog post following these guidelines:\n\n"
            "1. Introduction (2-3 paragraphs):\n"
            "   - Clearly explain the repository's purpose and main problem it solves\n"
            "   - Provide context about the technology domain\n"
            "   - Highlight the unique value proposition\n\n"
            "2. Technical Overview (3-4 paragraphs):\n"
            "   - Explain the architecture and design patterns used\n"
            "   - Detail how different components interact\n"
            "   - Discuss the technical decisions and their rationale\n\n"
            "3. Key Features (4-5 bullet points with explanations):\n"
            "   - Focus on technical capabilities and implementation details\n"
            "   - Explain how each feature works under the hood\n"
            "   - Include relevant code snippets with detailed explanations\n\n"
            "4. Code Deep Dive (2-3 sections):\n"
            "   - Break down the most important code snippets\n"
            "   - Explain the implementation details and patterns used\n"
            "   - Include inline comments explaining complex logic\n"
            "   - Show how to use the code with practical examples\n\n"
            "5. Best Practices and Considerations (2-3 paragraphs):\n"
            "   - Discuss performance implications\n"
            "   - Mention security considerations\n"
            "   - Suggest optimization opportunities\n\n"
            "6. Conclusion (2 paragraphs):\n"
            "   - Summarize the technical achievements\n"
            "   - Suggest potential improvements or extensions\n\n"
            "Formatting Guidelines:\n"
            "1. Use proper markdown formatting with headers, code blocks, and lists\n"
            "2. Include inline code references using backticks\n"
            "3. Use tables for comparing features or options\n"
            "4. Add emphasis on important technical terms\n\n"
            "Technical Requirements:\n"
            "1. Ensure all technical explanations are accurate and precise\n"
            "2. Use proper technical terminology\n"
            "3. Include relevant code examples with explanations\n"
            "4. Maintain a professional but accessible technical tone\n"
            "5. Focus on implementation details and technical depth\n"
        )

        # Debug the API key
        if not API_KEY:
            logger.error("OpenRouter API key not found. Please set OPENROUTER_API_KEY in your environment variables.")
            logger.info("Falling back to local blog generation")
            return generate_local_blog(metadata)
        
        key_preview = API_KEY[:4] + "..." + API_KEY[-4:] if len(API_KEY) > 8 else "***" 
        logger.info(f"Using API key starting with {key_preview}")
        
        # Try to use the API
        try:
            logger.info(f"Sending request to OpenRouter API for model: {MODEL}")
            
            # Prepare the API request
            headers = {
                "Authorization": f"Bearer {API_KEY}",
                "Content-Type": "application/json",
                "HTTP-Referer": "https://gitdocs-tw63.onrender.com",
                "X-Title": "GitDocs"
            }
            
            payload = {
                "model": MODEL,
                "messages": [
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                "temperature": 0.7,
                "max_tokens": 1500,
                "stream": False  # Ensure we're not using streaming
            }
            
            # Send the request with a shorter timeout
            try:
                response = requests.post(
                    OPENROUTER_API_URL,
                    headers=headers,
                    json=payload,
                    timeout=30  # 30 second timeout for the API request
                )
                
                # Log the response status and headers for debugging
                logger.info(f"OpenRouter API response status: {response.status_code}")
                
                # Check if the response is valid
                if response.status_code == 200:
                    try:
                        response_data = response.json()
                        logger.info("Successfully parsed JSON response")
                        
                        if "choices" in response_data and len(response_data["choices"]) > 0:
                            if "message" in response_data["choices"][0]:
                                content = response_data["choices"][0]["message"]["content"]
                                logger.info("Successfully extracted blog content")
                                return content
                            else:
                                logger.warning("Response format unexpected - missing 'message' field")
                        else:
                            logger.warning("Response format unexpected - missing 'choices' field")
                    
                    except json.JSONDecodeError as e:
                        logger.error(f"Failed to parse JSON response: {str(e)}")
                        logger.info(f"Response content (first 200 chars): {response.text[:200]}")
                else:
                    logger.error(f"API returned error code {response.status_code}")
                    logger.info(f"Error response: {response.text[:200]}")
                
            except requests.Timeout:
                logger.error("Request to OpenRouter API timed out after 30 seconds")
            except requests.RequestException as e:
                logger.error(f"Request to OpenRouter API failed: {str(e)}")
            
            # If we get here, something went wrong with the API
            logger.info("Falling back to local blog generation")
            return generate_local_blog(metadata)
            
        except Exception as e:
            logger.error(f"Exception during API request: {str(e)}")
            logger.info("Falling back to local blog generation")
            return generate_local_blog(metadata)
            
    except Exception as e:
        logger.error(f"Error in generate_blog function: {str(e)}")
        return generate_local_blog(metadata)