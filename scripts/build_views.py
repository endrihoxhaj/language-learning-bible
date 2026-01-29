import os
import shutil
import re

SRC_DIR = 'src'
SCREENS_DIR = os.path.join(SRC_DIR, 'screens')
WWW_DIR = 'www'
VIEWS_DIR = os.path.join(WWW_DIR, 'views')
JS_DIR = os.path.join(WWW_DIR, 'js')

def main():
    print("Starting build process...")

    # 1. Prepare directories
    if os.path.exists(WWW_DIR):
        shutil.rmtree(WWW_DIR)
    os.makedirs(VIEWS_DIR)
    os.makedirs(JS_DIR)

    # 2. Copy JS
    src_js = os.path.join(SRC_DIR, 'js')
    if os.path.exists(src_js):
        for item in os.listdir(src_js):
            s = os.path.join(src_js, item)
            d = os.path.join(JS_DIR, item)
            if os.path.isdir(s):
                shutil.copytree(s, d)
            else:
                shutil.copy2(s, d)
    print("Copied JS files.")

    # 3. Process Screens
    for item in os.listdir(SCREENS_DIR):
        screen_path = os.path.join(SCREENS_DIR, item)
        if not os.path.isdir(screen_path):
            continue

        # Find code.html. It might be in a subdir (e.g. statistics)
        html_file = None
        for root, dirs, files in os.walk(screen_path):
            if 'code.html' in files:
                html_file = os.path.join(root, 'code.html')
                break

        if not html_file:
            print(f"Skipping {item}: No code.html found")
            continue

        # Determine output filename
        output_filename = f"{item}.html"
        if item == 'biblos_splash_screen':
            output_filename = '../index.html'
        elif item == 'biblos_progress':
            output_filename = 'biblos_progress.html'
        elif item == 'untitled_screen':
            output_filename = 'biblos_profile.html'

        # Determine output path
        if output_filename == '../index.html':
            output_path = os.path.join(WWW_DIR, 'index.html')
        else:
            output_path = os.path.join(VIEWS_DIR, output_filename)

        # Read content
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Inject scripts
        scripts = """
    <script src="/js/router.js"></script>
    <script src="/js/lesson_controller.js"></script>
    """
        if '</body>' in content:
            content = content.replace('</body>', scripts + '</body>')
        else:
            content += scripts

        # Write content
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(content)

        print(f"Processed {item} -> {output_path}")

    print("Build complete.")

if __name__ == '__main__':
    main()
