import os
import shutil
import re
import logging
from urllib.parse import urlparse
import git

logger = logging.getLogger(__name__)

class RepositoryCloneError(Exception):
    """Custom exception raised when git repository cloning fails."""
    pass

def validate_github_url(url: str) -> bool:
    """
    Validates if the provided string is a valid public GitHub URL.
    """
    try:
        parsed = urlparse(url)
        if parsed.netloc not in ("github.com", "www.github.com"):
            return False
        # Must have at least two parts in path: /owner/repo
        path_parts = [p for p in parsed.path.split("/") if p]
        if len(path_parts) < 2:
            return False
        return True
    except Exception:
        return False

def get_repo_name_from_url(url: str) -> str:
    """
    Extracts the repository name from the GitHub URL.
    """
    parsed = urlparse(url)
    path_parts = [p for p in parsed.path.split("/") if p]
    if path_parts:
        # Strip trailing .git if present
        repo_name = path_parts[-1]
        if repo_name.endswith(".git"):
            repo_name = repo_name[:-4]
        return repo_name
    return "unknown-repo"

def clone_repository(github_url: str, dest_dir: str) -> str:
    """
    Clones a public GitHub repository using GitPython with depth=1 (shallow clone).
    Returns the path to the cloned repository.
    Raises RepositoryCloneError if cloning fails or URL is invalid.
    """
    if not validate_github_url(github_url):
        raise RepositoryCloneError(f"Invalid public GitHub URL provided: '{github_url}'")
    
    # Ensure destination directory is clean
    repo_name = get_repo_name_from_url(github_url)
    target_path = os.path.join(dest_dir, repo_name)
    
    if os.path.exists(target_path):
        try:
            shutil.rmtree(target_path)
        except Exception as e:
            logger.warning(f"Failed to clear existing directory {target_path}: {e}")
            
    os.makedirs(target_path, exist_ok=True)
    
    logger.info(f"Cloning {github_url} to {target_path} (depth=1)...")
    try:
        git.Repo.clone_from(github_url, target_path, depth=1)
        logger.info(f"Successfully cloned {github_url}")
        return target_path
    except git.exc.GitCommandError as ge:
        logger.error(f"Git command failed: {ge.stderr}")
        # Clean up directory if clone failed
        if os.path.exists(target_path):
            try:
                shutil.rmtree(target_path)
            except Exception:
                pass
        raise RepositoryCloneError(
            f"Failed to clone repository. Ensure it is public and exists. Error details: {ge.stderr.strip()}"
        )
    except Exception as e:
        logger.error(f"Unexpected error while cloning: {e}")
        if os.path.exists(target_path):
            try:
                shutil.rmtree(target_path)
            except Exception:
                pass
        raise RepositoryCloneError(f"Unexpected error while cloning repository: {str(e)}")

def cleanup_cloned_repository(repo_path: str) -> None:
    """
    Removes the cloned repository directory to free space.
    """
    if os.path.exists(repo_path):
        try:
            # Simple permission work-around for git directories if needed
            # Git repositories sometimes have read-only files under .git
            def onerror(func, path, exc_info):
                import stat
                if not os.access(path, os.W_OK):
                    os.chmod(path, stat.S_IWUSR)
                    func(path)
                else:
                    raise exc_info[1]
                    
            shutil.rmtree(repo_path, onerror=onerror)
            logger.info(f"Cleaned up repository directory: {repo_path}")
        except Exception as e:
            logger.warning(f"Error cleaning up repository {repo_path}: {e}")
