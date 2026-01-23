import os
import shutil
import re

SRC_DIR = 'src'
WWW_DIR = 'www'
SCREENS_DIR = os.path.join(SRC_DIR, 'screens')
JS_DIR = os.path.join(SRC_DIR, 'js')
CSS_DIR = os.path.join(SRC_DIR, 'css')

WWW_VIEWS_DIR = os.path.join(WWW_DIR, 'views')
WWW_JS_DIR = os.path.join(WWW_DIR, 'js')
WWW_CSS_DIR = os.path.join(WWW_DIR, 'css')

def main():
    # Clean and create directories
    if os.path.exists(WWW_DIR):
        shutil.rmtree(WWW_DIR)

    os.makedirs(WWW_VIEWS_DIR)
    os.makedirs(WWW_JS_DIR)
    os.makedirs(WWW_CSS_DIR)

    # Copy JS and CSS
    if os.path.exists(JS_DIR):
        for file in os.listdir(JS_DIR):
            if file.endswith('.js'):
                shutil.copy(os.path.join(JS_DIR, file), WWW_JS_DIR)

    if os.path.exists(CSS_DIR):
        for file in os.listdir(CSS_DIR):
            if file.endswith('.css'):
                shutil.copy(os.path.join(CSS_DIR, file), WWW_CSS_DIR)

    # Process Screens
    for root, dirs, files in os.walk(SCREENS_DIR):
        if 'code.html' in files:
            process_screen(root)

    # Copy Splash to index.html
    splash_path = os.path.join(SCREENS_DIR, 'biblos_splash_screen', 'code.html')
    if os.path.exists(splash_path):
        process_file(splash_path, os.path.join(WWW_DIR, 'index.html'))
    else:
        print("Warning: Splash screen not found at " + splash_path)

def process_screen(folder_path):
    # Determine output filename
    rel_path = os.path.relpath(folder_path, SCREENS_DIR)

    if rel_path == 'untitled_screen':
        output_name = 'biblos_profile.html'
    else:
        # Replace slashes with underscores for flat structure
        output_name = rel_path.replace(os.sep, '_') + '.html'

    output_path = os.path.join(WWW_VIEWS_DIR, output_name)
    input_path = os.path.join(folder_path, 'code.html')

    process_file(input_path, output_path)
    print(f"Processed {rel_path} -> {output_name}")

def process_file(input_path, output_path):
    with open(input_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Inject scripts
    scripts = '\n<script src="/js/router.js"></script>\n<script src="/js/lesson_controller.js"></script>\n'

    if '</body>' in content:
        content = content.replace('</body>', scripts + '</body>')
    else:
        content += scripts

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == '__main__':
    main()
