import os
import shutil

SRC_SCREENS = 'src/screens'
WWW_VIEWS = 'www/views'
WWW_JS = 'www/js'
WWW_CSS = 'www/css'
SRC_JS = 'src/js'
SRC_CSS = 'src/css'

def build():
    # clean www
    if os.path.exists('www'):
        shutil.rmtree('www')
    os.makedirs(WWW_VIEWS)
    os.makedirs(WWW_JS)
    os.makedirs(WWW_CSS)

    # Copy JS and CSS
    if os.path.exists(SRC_JS):
        for f in os.listdir(SRC_JS):
            shutil.copy(os.path.join(SRC_JS, f), WWW_JS)

    if os.path.exists(SRC_CSS):
        for f in os.listdir(SRC_CSS):
            shutil.copy(os.path.join(SRC_CSS, f), WWW_CSS)

    # Process screens
    for root, dirs, files in os.walk(SRC_SCREENS):
        if 'code.html' in files:
            # Determine output filename
            folder_name = os.path.basename(root)
            parent_name = os.path.basename(os.path.dirname(root))

            target_name = folder_name

            if folder_name == 'statistics' and parent_name == 'biblos_progress':
                target_name = 'biblos_progress'
            elif folder_name == 'untitled_screen':
                target_name = 'biblos_profile'

            # Read content
            with open(os.path.join(root, 'code.html'), 'r') as f:
                content = f.read()

            # Inject scripts
            scripts = '<script src="/js/router.js"></script>\n<script src="/js/lesson_controller.js"></script>\n'
            if '</body>' in content:
                content = content.replace('</body>', scripts + '</body>')
            else:
                content += scripts

            # Write to views
            with open(os.path.join(WWW_VIEWS, target_name + '.html'), 'w') as f:
                f.write(content)

            # If it's splash screen, also copy to index.html
            if folder_name == 'biblos_splash_screen':
                with open('www/index.html', 'w') as f:
                    f.write(content)
                print(f"Generated index.html from {folder_name}")

            print(f"Generated {target_name}.html")

if __name__ == '__main__':
    build()
