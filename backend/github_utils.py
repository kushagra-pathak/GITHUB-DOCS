import os
import tempfile
import shutil
import subprocess
import re
from pathlib import Path
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def clone_repo(repo_url, target_dir):
    """Clone a GitHub repository to a target directory."""
    try:
        subprocess.run(
            ["git", "clone", "--depth=1", repo_url, target_dir],
            check=True,
            capture_output=True,
            text=True
        )
        return True
    except subprocess.CalledProcessError as e:
        logger.error(f"Failed to clone repository: {e}")
        logger.error(f"Command output: {e.stderr}")
        raise Exception(f"Failed to clone repository: {e.stderr}")

def get_file_extension(filename):
    """Extract the file extension from a filename."""
    return Path(filename).suffix.lower()

def is_code_file(filename):
    """Check if a file is likely a code file based on its extension."""
    code_extensions = [
        '.py', '.js', '.jsx', '.ts', '.tsx', '.java', '.c', '.cpp', '.cs', '.go',
        '.rb', '.php', '.html', '.css', '.scss', '.less', '.json', '.yml', '.yaml',
        '.md', '.rs', '.swift', '.kt', '.sh', '.bash', '.ps1', '.sql'
    ]
    return get_file_extension(filename) in code_extensions

def read_file_safely(file_path):
    """Try to read a file with various encodings to handle potential encoding issues."""
    encodings = ['utf-8', 'latin-1', 'cp1252', 'iso-8859-1']
    
    for encoding in encodings:
        try:
            with open(file_path, 'r', encoding=encoding) as f:
                return f.read()
        except UnicodeDecodeError:
            continue
        except Exception as e:
            logger.warning(f"Error reading file {file_path}: {e}")
            return ""
    
    # If all encodings fail, try binary mode and decode with replacement
    try:
        with open(file_path, 'rb') as f:
            return f.read().decode('utf-8', errors='replace')
    except Exception as e:
        logger.warning(f"Failed to read file {file_path} even in binary mode: {e}")
        return f"[File could not be read due to encoding issues: {file_path}]"

def detect_tech_stack(files):
    """Detect technologies used in the repository based on file types and content."""
    tech_stack = set()
    
    # Check for common files and directories
    file_indicators = {
        'package.json': 'Node.js',
        'yarn.lock': 'Yarn',
        'package-lock.json': 'npm',
        'requirements.txt': 'Python',
        'Pipfile': 'Python (pipenv)',
        'Gemfile': 'Ruby',
        'go.mod': 'Go',
        'pom.xml': 'Java (Maven)',
        'build.gradle': 'Java (Gradle)',
        'composer.json': 'PHP',
        'cargo.toml': 'Rust',
        'Dockerfile': 'Docker',
        '.gitlab-ci.yml': 'GitLab CI',
        '.github/workflows': 'GitHub Actions',
        'webpack.config.js': 'Webpack',
        'tsconfig.json': 'TypeScript',
        'angular.json': 'Angular',
        'next.config.js': 'Next.js',
        'nuxt.config.js': 'Nuxt.js',
        'vue.config.js': 'Vue.js',
        'tailwind.config.js': 'Tailwind CSS',
        'android': 'Android',
        'ios': 'iOS',
        'docker-compose.yml': 'Docker Compose',
        'Jenkinsfile': 'Jenkins',
        'terraform': 'Terraform',
        'kubernetes': 'Kubernetes',
        'k8s': 'Kubernetes'
    }
    
    # Check file existence
    for file_path in files:
        file_name = os.path.basename(file_path)
        if file_name in file_indicators:
            tech_stack.add(file_indicators[file_name])
        
        # Also check directory names
        dir_path = os.path.dirname(file_path)
        for dir_indicator in file_indicators:
            if dir_indicator in dir_path:
                tech_stack.add(file_indicators[dir_indicator])
    
    # Check file extensions
    extensions_count = {}
    for file_path in files:
        ext = get_file_extension(file_path)
        if ext:
            extensions_count[ext] = extensions_count.get(ext, 0) + 1
    
    # Map extensions to technologies
    ext_to_tech = {
        '.py': 'Python',
        '.js': 'JavaScript',
        '.jsx': 'React',
        '.ts': 'TypeScript',
        '.tsx': 'React with TypeScript',
        '.java': 'Java',
        '.c': 'C',
        '.cpp': 'C++',
        '.cs': 'C#',
        '.go': 'Go',
        '.rb': 'Ruby',
        '.php': 'PHP',
        '.html': 'HTML',
        '.css': 'CSS',
        '.scss': 'SASS',
        '.less': 'LESS',
        '.rs': 'Rust',
        '.swift': 'Swift',
        '.kt': 'Kotlin',
        '.sql': 'SQL',
        '.sh': 'Shell',
        '.ps1': 'PowerShell',
        '.yaml': 'YAML',
        '.yml': 'YAML',
        '.md': 'Markdown',
        '.json': 'JSON'
    }
    
    for ext, count in extensions_count.items():
        if ext in ext_to_tech and count > 1:  # Only include if more than one file with this extension
            tech_stack.add(ext_to_tech[ext])
    
    return list(tech_stack)

def get_code_snippets(repo_dir, max_files=5, max_lines=30):
    """Extract code snippets from repository files."""
    code_files = []
    
    for root, _, files in os.walk(repo_dir):
        # Skip hidden directories and files
        if '/.' in root or '\\..' in root:
            continue
        
        # Skip node_modules directory
        if 'node_modules' in root or 'venv' in root or '__pycache__' in root:
            continue
        
        for file in files:
            if file.startswith('.'):
                continue
                
            file_path = os.path.join(root, file)
            rel_path = os.path.relpath(file_path, repo_dir)
            
            if is_code_file(file) and os.path.getsize(file_path) < 1000000:  # Skip files larger than 1MB
                try:
                    content = read_file_safely(file_path)
                    
                    # Get a representative snippet
                    lines = content.split('\n')
                    if len(lines) > max_lines:
                        # Take first 5 lines, then some lines from the middle, and last 5 lines
                        snippet_lines = lines[:5]
                        snippet_lines.append('...')
                        middle_start = max(5, len(lines) // 2 - 10)
                        snippet_lines.extend(lines[middle_start:middle_start+10])
                        snippet_lines.append('...')
                        snippet_lines.extend(lines[-5:])
                        snippet = '\n'.join(snippet_lines)
                    else:
                        snippet = content
                    
                    code_files.append({
                        'filename': rel_path,
                        'content': content,
                        'snippet': snippet
                    })
                    
                    if len(code_files) >= max_files:
                        break
                        
                except Exception as e:
                    logger.warning(f"Error processing file {file_path}: {e}")
    
    return code_files

def read_readme(repo_dir):
    """Find and read the README file."""
    readme_patterns = ['README.md', 'README.txt', 'README', 'readme.md', 'Readme.md']
    
    for pattern in readme_patterns:
        for root, _, files in os.walk(repo_dir):
            for file in files:
                if file.lower() == pattern.lower():
                    try:
                        content = read_file_safely(os.path.join(root, file))
                        return content
                    except Exception as e:
                        logger.warning(f"Error reading README file: {e}")
    
    return "No README file found."

def clone_and_parse_repo(repo_url):
    """Clone a repository and extract metadata."""
    temp_dir = tempfile.mkdtemp()
    
    try:
        logger.info(f"Cloning repository: {repo_url} to {temp_dir}")
        clone_repo(repo_url, temp_dir)
        
        # Get list of all files
        all_files = []
        for root, _, files in os.walk(temp_dir):
            for file in files:
                all_files.append(os.path.join(root, file))
        
        # Extract metadata
        tech_stack = detect_tech_stack(all_files)
        readme_content = read_readme(temp_dir)
        code_files = get_code_snippets(temp_dir)
        
        # Get repo name from URL
        repo_name = repo_url.rstrip('/').split('/')[-1]
        if repo_name.endswith('.git'):
            repo_name = repo_name[:-4]
        
        metadata = {
            'repo_name': repo_name,
            'repo_url': repo_url,
            'tech_stack': tech_stack,
            'readme': readme_content,
            'files': code_files
        }
        
        return metadata
        
    except Exception as e:
        logger.error(f"Error processing repository: {e}")
        raise
    finally:
        # Clean up
        try:
            # On Windows, we may need to handle file locks differently
            if os.name == 'nt':  # Windows
                import time
                time.sleep(1)  # Small delay to allow file handles to be released
                
            # Try to remove the temp directory
            shutil.rmtree(temp_dir, ignore_errors=True)
            logger.info(f"Cleaned up temporary directory: {temp_dir}")
        except Exception as e:
            logger.warning(f"Error cleaning up temp directory: {str(e)}")
            # Continue execution even if cleanup fails