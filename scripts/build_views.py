import os
import shutil

SRC_SCREENS = 'src/screens'
WWW_VIEWS = 'www/views'
WWW_ROOT = 'www'
SRC_JS = 'src/js'
WWW_JS = 'www/js'

def build():
    # Clean and create www directory
    if os.path.exists(WWW_ROOT):
        shutil.rmtree(WWW_ROOT)
    os.makedirs(WWW_VIEWS)
    os.makedirs(WWW_JS)

    # Process screens
    for item in os.listdir(SRC_SCREENS):
        item_path = os.path.join(SRC_SCREENS, item)
        if os.path.isdir(item_path):
            output_name = item
            real_code_path = None

            # Check for standard location
            if os.path.exists(os.path.join(item_path, 'code.html')):
                real_code_path = os.path.join(item_path, 'code.html')
            # Check for biblos_progress/statistics case
            elif item == 'biblos_progress' and os.path.exists(os.path.join(item_path, 'statistics', 'code.html')):
                real_code_path = os.path.join(item_path, 'statistics', 'code.html')

            if not real_code_path:
                print(f"Skipping {item}: No code.html found")
                continue

            # Special name override
            if item == 'untitled_screen':
                output_name = 'biblos_profile'

            # Destination path
            if item == 'biblos_splash_screen':
                dest = os.path.join(WWW_ROOT, 'index.html')
            else:
                dest = os.path.join(WWW_VIEWS, output_name + '.html')

            with open(real_code_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # Inject scripts
            # We add ../ for views to access js which is at root/js, but for index.html it is ./js
            # Actually, using absolute paths /js/... works if we serve from www root.
            scripts = '\n<script src="/js/router.js"></script>\n<script src="/js/lesson_controller.js"></script>\n'

            if '</body>' in content:
                content = content.replace('</body>', scripts + '</body>')
            else:
                content += scripts

            with open(dest, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Built {dest}")

    # Copy JS
    if os.path.exists(SRC_JS):
        for js_file in os.listdir(SRC_JS):
            shutil.copy(os.path.join(SRC_JS, js_file), WWW_JS)
            print(f"Copied {js_file} to {WWW_JS}")
    else:
        print(f"Warning: {SRC_JS} does not exist yet.")

if __name__ == '__main__':
    build()
