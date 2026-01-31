import os
import shutil

SRC_DIR = 'src'
SCREENS_DIR = os.path.join(SRC_DIR, 'screens')
JS_DIR = os.path.join(SRC_DIR, 'js')
WWW_DIR = 'www'
WWW_VIEWS_DIR = os.path.join(WWW_DIR, 'views')
WWW_JS_DIR = os.path.join(WWW_DIR, 'js')

def ensure_dir(directory):
    if not os.path.exists(directory):
        os.makedirs(directory)

def clean_build():
    if os.path.exists(WWW_DIR):
        shutil.rmtree(WWW_DIR)
    ensure_dir(WWW_DIR)
    ensure_dir(WWW_VIEWS_DIR)
    ensure_dir(WWW_JS_DIR)

def copy_js():
    if os.path.exists(JS_DIR):
        for filename in os.listdir(JS_DIR):
            shutil.copy(os.path.join(JS_DIR, filename), WWW_JS_DIR)

def process_html(content, is_index=False):
    # Inject scripts
    # Adjust path based on location (index is in root, views in views/)
    script_path_prefix = "js/" if is_index else "../js/"

    scripts = f"""
    <script src="{script_path_prefix}router.js"></script>
    <script src="{script_path_prefix}lesson_controller.js"></script>
    """

    if "</body>" in content:
        return content.replace("</body>", f"{scripts}</body>")
    else:
        return content + scripts

def build_views():
    print("Building views...")

    screens = os.listdir(SCREENS_DIR)

    for screen_dir in screens:
        src_folder = os.path.join(SCREENS_DIR, screen_dir)
        if not os.path.isdir(src_folder):
            continue

        # Determine source file and dest name
        src_file = os.path.join(src_folder, 'code.html')
        dest_name = f"{screen_dir}.html"

        # Handle special cases
        if screen_dir == 'untitled_screen':
            dest_name = 'biblos_profile.html'
        elif screen_dir == 'biblos_progress':
            # Check for statistics subdirectory
            stats_dir = os.path.join(src_folder, 'statistics')
            if os.path.exists(stats_dir):
                src_file = os.path.join(stats_dir, 'code.html')
            else:
                # Fallback if regular code.html exists
                if not os.path.exists(src_file):
                    continue
            dest_name = 'biblos_progress.html'

        if not os.path.exists(src_file):
            print(f"Skipping {screen_dir}: code.html not found")
            continue

        with open(src_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Process Splash Screen separately as index.html
        if screen_dir == 'biblos_splash_screen':
            processed_content = process_html(content, is_index=True)
            with open(os.path.join(WWW_DIR, 'index.html'), 'w', encoding='utf-8') as f:
                f.write(processed_content)

            # Also create a view copy
            processed_view_content = process_html(content, is_index=False)
            with open(os.path.join(WWW_VIEWS_DIR, dest_name), 'w', encoding='utf-8') as f:
                f.write(processed_view_content)
        else:
            processed_content = process_html(content, is_index=False)
            with open(os.path.join(WWW_VIEWS_DIR, dest_name), 'w', encoding='utf-8') as f:
                f.write(processed_content)

    print("Build complete.")

if __name__ == "__main__":
    clean_build()
    copy_js()
    build_views()
