import os
import shutil
from pathlib import Path

SRC_DIR = Path('src')
WWW_DIR = Path('www')
VIEWS_DIR = WWW_DIR / 'views'

def clean_and_create_dirs():
    if WWW_DIR.exists():
        shutil.rmtree(WWW_DIR)
    WWW_DIR.mkdir()
    VIEWS_DIR.mkdir()
    (WWW_DIR / 'js').mkdir()
    (WWW_DIR / 'css').mkdir()

def copy_assets():
    # Copy JS
    if (SRC_DIR / 'js').exists():
        for item in (SRC_DIR / 'js').iterdir():
            shutil.copy(item, WWW_DIR / 'js')

    # Copy CSS
    if (SRC_DIR / 'css').exists():
        for item in (SRC_DIR / 'css').iterdir():
            shutil.copy(item, WWW_DIR / 'css')

def process_html(content, is_root=False):
    prefix = "" if is_root else "../"
    scripts = f"""
    <script src="{prefix}js/router.js"></script>
    <script src="{prefix}js/lesson_controller.js"></script>
    <link rel="stylesheet" href="{prefix}css/styles.css">
    """
    if "</body>" in content:
        return content.replace("</body>", f"{scripts}</body>")
    else:
        return content + scripts

def build_screens():
    screens_dir = SRC_DIR / 'screens'
    for screen_dir in screens_dir.iterdir():
        if not screen_dir.is_dir():
            continue

        screen_name = screen_dir.name

        # Determine source file
        src_file = screen_dir / 'code.html'
        if screen_name == 'biblos_progress':
            src_file = screen_dir / 'statistics' / 'code.html'

        if not src_file.exists():
            print(f"Skipping {screen_name}: code.html not found")
            continue

        # Determine destination
        if screen_name == 'biblos_home_dashboard':
            dest_file = WWW_DIR / 'index.html'
            is_root = True
        elif screen_name == 'untitled_screen':
            dest_file = VIEWS_DIR / 'biblos_profile.html'
            is_root = False
        elif screen_name == 'biblos_progress':
             dest_file = VIEWS_DIR / 'biblos_progress.html'
             is_root = False
        else:
            dest_file = VIEWS_DIR / f"{screen_name}.html"
            is_root = False

        # Read, process, write
        with open(src_file, 'r', encoding='utf-8') as f:
            content = f.read()

        content = process_html(content, is_root)

        # Fix navigation links if they are hardcoded (optional, router handles most)
        # But we might want to fix relative links if they exist.

        with open(dest_file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Processed {screen_name} -> {dest_file}")

if __name__ == "__main__":
    clean_and_create_dirs()
    copy_assets()
    build_screens()
    print("Build complete.")
