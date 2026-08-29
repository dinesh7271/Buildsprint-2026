import os
import logging
from typing import Dict, List, Tuple, Set

logger = logging.getLogger(__name__)

# Extensions associated with specific programming languages
LANGUAGE_EXTENSIONS = {
    ".py": "Python",
    ".js": "JavaScript",
    ".jsx": "JavaScript (React)",
    ".ts": "TypeScript",
    ".tsx": "TypeScript (React)",
    ".java": "Java",
    ".kt": "Kotlin",
    ".cs": "C#",
    ".cpp": "C++",
    ".cc": "C++",
    ".cxx": "C++",
    ".c": "C",
    ".h": "C/C++ Header",
    ".hpp": "C/C++ Header",
    ".go": "Go",
    ".rb": "Ruby",
    ".php": "PHP",
    ".rs": "Rust",
    ".swift": "Swift",
    ".scala": "Scala",
    ".sh": "Shell Script",
    ".pl": "Perl",
    ".pm": "Perl",
    ".html": "HTML",
    ".css": "CSS",
    ".scss": "SCSS/SASS",
    ".sql": "SQL",
}

# Directories to completely ignore during scanning
IGNORED_DIRS = {
    ".git",
    "node_modules",
    "bower_components",
    "venv",
    ".venv",
    "env",
    "__pycache__",
    "dist",
    "build",
    "target",
    "bin",
    "obj",
    "out",
    ".idea",
    ".vscode",
    ".gradle",
    "vendor",
    "tests",  # Keep tests out of main complexity analysis but maybe mention them
    "test",
    "spec",
}

# Key dependency files to check
DEPENDENCY_FILES = {
    "package.json",
    "requirements.txt",
    "Pipfile",
    "pyproject.toml",
    "setup.py",
    "Gemfile",
    "pom.xml",
    "build.gradle",
    "go.mod",
    "Cargo.toml",
    "composer.json",
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml"
}

# Framework/library signature patterns in file contents or names
FRAMEWORK_SIGNATURES = {
    "Django": (["django"], [".py"]),
    "Flask": (["flask"], [".py"]),
    "FastAPI": (["fastapi"], [".py"]),
    "Express": (["express"], [".js", ".json", ".ts"]),
    "React": (["react"], [".js", ".jsx", ".tsx", ".json"]),
    "Angular": (["@angular/core"], [".json", ".ts"]),
    "Vue": (["vue"], [".js", ".ts", ".vue", ".json"]),
    "Spring Boot": (["spring-boot", "org.springframework"], [".java", ".xml", ".gradle"]),
    "Rails": (["rails", "active_record"], [".rb", "Gemfile"]),
    "Laravel": (["laravel", "illuminate"], [".php", "composer.json"]),
    "ASP.NET": (["Microsoft.AspNetCore", "Microsoft.NET.Sdk.Web"], [".cs", ".csproj"]),
}

def scan_directory(base_dir: str, max_files_to_index: int = 500) -> Tuple[Dict[str, any], List[str], Dict[str, str]]:
    """
    Scans the repository directory to:
    1. Identify all file counts and estimated LOC.
    2. Detect languages used based on file extensions.
    3. Locate dependency files and extract their contents.
    4. Generate a file tree mapping for codebase summary.
    
    Returns a tuple of:
    - stats: metadata dictionary containing language distribution, file counts, etc.
    - dependency_paths: list of relative paths to found dependency files.
    - dependency_contents: dict mapping relative paths to file contents (truncated if large).
    """
    total_files = 0
    total_loc = 0
    language_counts: Dict[str, int] = {}
    language_loc: Dict[str, int] = {}
    detected_frameworks: Set[str] = set()
    dependency_paths: List[str] = []
    dependency_contents: Dict[str, str] = {}
    file_list_summary: List[str] = []
    
    # Simple recursion safety / scale check
    too_many_files = False

    for root, dirs, files in os.walk(base_dir):
        # Modify dirs in-place to avoid walking down ignored directories
        dirs[:] = [d for d in dirs if d not in IGNORED_DIRS]
        
        for file in files:
            file_path = os.path.join(root, file)
            rel_path = os.path.relpath(file_path, base_dir)
            ext = os.path.splitext(file)[1].lower()
            
            # Check if it's a dependency file
            if file in DEPENDENCY_FILES:
                dependency_paths.append(rel_path)
                # Read content safely
                try:
                    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                        # Limit to 500 lines or ~20KB to avoid excessive token size
                        content_lines = f.readlines()
                        if len(content_lines) > 500:
                            content = "".join(content_lines[:500]) + "\n... [TRUNCATED DUE TO SIZE] ...\n"
                        else:
                            content = "".join(content_lines)
                        dependency_contents[rel_path] = content
                except Exception as e:
                    logger.warning(f"Failed to read dependency file {file_path}: {e}")
                    dependency_contents[rel_path] = f"Error reading file: {str(e)}"
            
            # Identify language
            lang = LANGUAGE_EXTENSIONS.get(ext)
            if lang:
                total_files += 1
                language_counts[lang] = language_counts.get(lang, 0) + 1
                
                # Estimate Lines of Code
                loc = 0
                try:
                    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                        for _ in f:
                            loc += 1
                except Exception:
                    pass
                
                total_loc += loc
                language_loc[lang] = language_loc.get(lang, 0) + loc
                
                # Add to file list summary for token-efficient overview (up to limit)
                if len(file_list_summary) < max_files_to_index:
                    file_list_summary.append(f"- {rel_path} ({lang}, LOC: {loc})")
                else:
                    too_many_files = True
                    
                # Scan content snippets for framework signatures if it's smaller
                if ext in [".py", ".js", ".ts", ".json", ".java", ".xml", ".gradle", ".rb", ".php", ".cs", ".csproj"]:
                    try:
                        # Peek at first 100 lines for signatures
                        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                            head = [next(f) for _ in range(100)]
                            file_content_snippet = "".join(head).lower()
                            for fw_name, (sig_words, sig_exts) in FRAMEWORK_SIGNATURES.items():
                                if ext in sig_exts or file in sig_exts:
                                    if any(word in file_content_snippet for word in sig_words):
                                        detected_frameworks.add(fw_name)
                    except StopIteration:
                        pass
                    except Exception:
                        pass

    # Fallback/comprehensive check on dependency files for frameworks
    for dep_path, content in dependency_contents.items():
        content_lower = content.lower()
        for fw_name, (sig_words, _) in FRAMEWORK_SIGNATURES.items():
            if any(word in content_lower for word in sig_words):
                detected_frameworks.add(fw_name)

    # Sort languages by LOC or frequency
    sorted_languages = sorted(language_counts.keys(), key=lambda l: language_loc.get(l, 0), reverse=True)
    primary_language = sorted_languages[0] if sorted_languages else "Unknown"
    
    # Build codebase summary structure
    summary_parts = []
    summary_parts.append(f"## Directory Structure and Codebase Overview")
    summary_parts.append(f"Total Source Files: {total_files}")
    summary_parts.append(f"Estimated Lines of Code (LOC): {total_loc}")
    summary_parts.append(f"Primary Language: {primary_language}")
    summary_parts.append("\n### Language Breakdown:")
    for lang in sorted_languages:
        cnt = language_counts[lang]
        loc = language_loc[lang]
        summary_parts.append(f"- {lang}: {cnt} files, ~{loc} LOC")
        
    summary_parts.append("\n### Key Files Index:")
    summary_parts.extend(file_list_summary)
    if too_many_files:
        summary_parts.append(f"- ... and more files (truncated index to stay within {max_files_to_index} files limit)")
        
    codebase_summary = "\n".join(summary_parts)

    stats = {
        "primary_language": primary_language,
        "detected_languages": sorted_languages,
        "detected_frameworks": list(detected_frameworks),
        "total_files": total_files,
        "estimated_lines_of_code": total_loc,
        "codebase_summary": codebase_summary
    }
    
    return stats, dependency_paths, dependency_contents
