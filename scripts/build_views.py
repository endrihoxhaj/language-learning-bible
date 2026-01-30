import os
import shutil

# Paths
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_DIR = os.path.join(ROOT_DIR, 'src')
SCREENS_DIR = os.path.join(SRC_DIR, 'screens')
JS_SRC_DIR = os.path.join(SRC_DIR, 'js')
WWW_DIR = os.path.join(ROOT_DIR, 'www')
WWW_VIEWS_DIR = os.path.join(WWW_DIR, 'views')
WWW_JS_DIR = os.path.join(WWW_DIR, 'js')

def clean_and_setup_dirs():
    if os.path.exists(WWW_DIR):
        shutil.rmtree(WWW_DIR)
    os.makedirs(WWW_VIEWS_DIR)
    os.makedirs(WWW_JS_DIR)

def process_html(content):
    # Inject scripts before closing body tag
    scripts = """
    <script src="/js/router.js"></script>
    <script src="/js/lesson_controller.js"></script>
    """
    if '</body>' in content:
        return content.replace('</body>', scripts + '</body>')
    return content + scripts

def copy_js_files():
    if os.path.exists(JS_SRC_DIR):
        for file in os.listdir(JS_SRC_DIR):
            if file.endswith('.js'):
                shutil.copy(os.path.join(JS_SRC_DIR, file), WWW_JS_DIR)
                print(f"Copied {file} to {WWW_JS_DIR}")

def build_views():
    clean_and_setup_dirs()
    copy_js_files()

    for screen_name in os.listdir(SCREENS_DIR):
        screen_path = os.path.join(SCREENS_DIR, screen_name)
        if not os.path.isdir(screen_path):
            continue

        # Determine source HTML path
        # Handle 'biblos_progress' specifically as it has a nested 'statistics' folder
        if screen_name == 'biblos_progress':
            html_path = os.path.join(screen_path, 'statistics', 'code.html')
        else:
            html_path = os.path.join(screen_path, 'code.html')

        if not os.path.exists(html_path):
            print(f"Skipping {screen_name}: code.html not found at {html_path}")
            continue

        with open(html_path, 'r', encoding='utf-8') as f:
            content = f.read()

        processed_content = process_html(content)

        # Determine destination path
        if screen_name == 'biblos_splash_screen':
            dest_path = os.path.join(WWW_DIR, 'index.html')
        elif screen_name == 'untitled_screen':
            dest_path = os.path.join(WWW_VIEWS_DIR, 'biblos_profile.html')
        elif screen_name == 'biblos_progress':
            dest_path = os.path.join(WWW_VIEWS_DIR, 'biblos_progress.html')
        else:
            dest_path = os.path.join(WWW_VIEWS_DIR, f"{screen_name}.html")

        with open(dest_path, 'w', encoding='utf-8') as f:
            f.write(processed_content)

        print(f"Built {screen_name} -> {dest_path}")

if __name__ == "__main__":
    build_views()
