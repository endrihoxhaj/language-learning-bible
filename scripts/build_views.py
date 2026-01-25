import os
import shutil

SRC_DIR = 'src'
WWW_DIR = 'www'
SCREENS_DIR = os.path.join(SRC_DIR, 'screens')

def build():
    # Clean and create www
    if os.path.exists(WWW_DIR):
        shutil.rmtree(WWW_DIR)
    os.makedirs(WWW_DIR)
    os.makedirs(os.path.join(WWW_DIR, 'views'))
    os.makedirs(os.path.join(WWW_DIR, 'js'))
    os.makedirs(os.path.join(WWW_DIR, 'css'))

    # Copy assets
    # Using dirs_exist_ok=True requires Python 3.8+
    shutil.copytree(os.path.join(SRC_DIR, 'js'), os.path.join(WWW_DIR, 'js'), dirs_exist_ok=True)
    shutil.copytree(os.path.join(SRC_DIR, 'css'), os.path.join(WWW_DIR, 'css'), dirs_exist_ok=True)

    # Process screens
    if os.path.exists(SCREENS_DIR):
        for screen_name in os.listdir(SCREENS_DIR):
            screen_path = os.path.join(SCREENS_DIR, screen_name)
            if not os.path.isdir(screen_path):
                continue

            code_html = os.path.join(screen_path, 'code.html')
            # Handle recursive search if needed, but assuming flat screens dir structure
            # Some screens might be nested? The listing showed biblos_progress/statistics/code.html logic?
            # "biblos_progress/statistics/code.html" was in index.html list.
            # But list_files just showed directories.
            # Let's assume direct subdirectories for now.
            # If code.html is missing, check subdirectories?

            if not os.path.exists(code_html):
                # Try finding code.html in subdirectories
                found = False
                for root, dirs, files in os.walk(screen_path):
                    if 'code.html' in files:
                        code_html = os.path.join(root, 'code.html')
                        found = True
                        break
                if not found:
                    continue

            with open(code_html, 'r', encoding='utf-8') as f:
                content = f.read()

            # Inject scripts
            scripts = """
        <script src="/js/router.js"></script>
        <script src="/js/lesson_controller.js"></script>
    </body>
    """
            content = content.replace('</body>', scripts)

            # Determine output path
            if screen_name == 'biblos_splash_screen':
                output_path = os.path.join(WWW_DIR, 'index.html')
            elif screen_name == 'untitled_screen':
                output_path = os.path.join(WWW_DIR, 'views', 'biblos_profile.html')
            else:
                output_path = os.path.join(WWW_DIR, 'views', f'{screen_name}.html')

            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(content)

            print(f"Built {screen_name} -> {output_path}")

if __name__ == '__main__':
    build()
