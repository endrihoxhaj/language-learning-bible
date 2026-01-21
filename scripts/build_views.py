import os
import shutil
from pathlib import Path

# Paths
SRC_DIR = Path("src")
SCREENS_DIR = SRC_DIR / "screens"
WWW_DIR = Path("www")
VIEWS_DIR = WWW_DIR / "views"

# Clean build directory
if WWW_DIR.exists():
    shutil.rmtree(WWW_DIR)
WWW_DIR.mkdir()
VIEWS_DIR.mkdir()

# Copy Assets
if (SRC_DIR / "js").exists():
    shutil.copytree(SRC_DIR / "js", WWW_DIR / "js")
if (SRC_DIR / "css").exists():
    shutil.copytree(SRC_DIR / "css", WWW_DIR / "css")

# Script to inject
INJECT_SCRIPTS = """
<script src="/js/router.js"></script>
<script src="/js/lesson_controller.js"></script>
"""

# Process Screens
for screen_dir in SCREENS_DIR.iterdir():
    if screen_dir.is_dir():
        # Determine base filename
        filename = screen_dir.name
        if filename == "untitled_screen":
            filename = "biblos_profile"

        # 1. Process Main Code
        code_file = screen_dir / "code.html"
        if code_file.exists():
            content = code_file.read_text(encoding="utf-8")
            if "</body>" in content:
                content = content.replace("</body>", f"{INJECT_SCRIPTS}</body>")
            else:
                content += INJECT_SCRIPTS

            output_path = VIEWS_DIR / f"{filename}.html"
            output_path.write_text(content, encoding="utf-8")
            print(f"Built {output_path}")

        # 2. Process Statistics/Nested Code if exists
        # We save this as <filename>_statistics.html
        stats_code_file = screen_dir / "statistics" / "code.html"
        if stats_code_file.exists():
             content = stats_code_file.read_text(encoding="utf-8")
             if "</body>" in content:
                content = content.replace("</body>", f"{INJECT_SCRIPTS}</body>")
             else:
                content += INJECT_SCRIPTS

             # Create a unique name for the nested view
             output_path = VIEWS_DIR / f"{filename}_statistics.html"
             output_path.write_text(content, encoding="utf-8")
             print(f"Built {output_path} (nested)")

# Create Entry Point (Redirect to Splash or Home)
index_content = """
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="refresh" content="0; url=/views/biblos_splash_screen.html" />
</head>
<body>
    <p>Redirecting...</p>
</body>
</html>
"""
(WWW_DIR / "index.html").write_text(index_content, encoding="utf-8")
print("Built index.html")
