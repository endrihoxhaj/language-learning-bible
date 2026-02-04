
import os
import shutil
from pathlib import Path

SRC_DIR = Path("src")
SCREENS_DIR = SRC_DIR / "screens"
JS_DIR = SRC_DIR / "js"
WWW_DIR = Path("www")
VIEWS_DIR = WWW_DIR / "views"
WWW_JS_DIR = WWW_DIR / "js"

def setup_directories():
    if WWW_DIR.exists():
        shutil.rmtree(WWW_DIR)
    WWW_DIR.mkdir()
    VIEWS_DIR.mkdir()
    WWW_JS_DIR.mkdir()

def copy_js():
    if JS_DIR.exists():
        for file in JS_DIR.glob("*.js"):
            shutil.copy(file, WWW_JS_DIR)

def process_html(content):
    # Inject scripts before </body>
    scripts = """
    <script src="/js/router.js"></script>
    <script src="/js/lesson_controller.js"></script>
    </body>
    """
    if "</body>" in content:
        return content.replace("</body>", scripts)
    else:
        return content + scripts

def build_screens():
    for root, dirs, files in os.walk(SCREENS_DIR):
        if "code.html" in files:
            source_path = Path(root) / "code.html"
            folder_name = Path(root).name

            # Determine destination
            dest_name = f"{folder_name}.html"
            dest_folder = VIEWS_DIR

            # Mappings
            if folder_name == "biblos_splash_screen":
                dest_name = "index.html"
                dest_folder = WWW_DIR
            elif folder_name == "statistics" and Path(root).parent.name == "biblos_progress":
                dest_name = "biblos_progress.html"
                dest_folder = VIEWS_DIR
            elif folder_name == "untitled_screen":
                dest_name = "biblos_profile.html"
                dest_folder = VIEWS_DIR

            # Read, Process, Write
            with open(source_path, "r") as f:
                content = f.read()

            content = process_html(content)

            dest_path = dest_folder / dest_name
            with open(dest_path, "w") as f:
                f.write(content)

            print(f"Built {folder_name} -> {dest_path}")

def main():
    print("Starting build...")
    setup_directories()
    copy_js()
    build_screens()
    print("Build complete.")

if __name__ == "__main__":
    main()
