import os
import shutil
import re

SRC_DIR = 'src'
SCREENS_DIR = os.path.join(SRC_DIR, 'screens')
JS_DIR = os.path.join(SRC_DIR, 'js')
WWW_DIR = 'www'
VIEWS_DIR = os.path.join(WWW_DIR, 'views')
WWW_JS_DIR = os.path.join(WWW_DIR, 'js')

# Mappings: source_folder -> destination_filename (without .html)
MAPPINGS = {
    'untitled_screen': 'biblos_profile',
    'biblos_splash_screen': 'biblos_splash_screen', # Also index.html handled specially
    'biblos_progress': 'biblos_progress',
}

def clean_build_dir():
    if os.path.exists(WWW_DIR):
        shutil.rmtree(WWW_DIR)
    os.makedirs(VIEWS_DIR)
    os.makedirs(WWW_JS_DIR)

def copy_js():
    if os.path.exists(JS_DIR):
        for item in os.listdir(JS_DIR):
            s = os.path.join(JS_DIR, item)
            d = os.path.join(WWW_JS_DIR, item)
            if os.path.isdir(s):
                shutil.copytree(s, d)
            else:
                shutil.copy2(s, d)
    else:
        print(f"Warning: {JS_DIR} does not exist.")

def process_screens():
    if not os.path.exists(SCREENS_DIR):
        print(f"Error: {SCREENS_DIR} does not exist.")
        return

    for item in os.listdir(SCREENS_DIR):
        src_path = os.path.join(SCREENS_DIR, item)
        if not os.path.isdir(src_path):
            continue

        # Determine input file path
        code_html_path = os.path.join(src_path, 'code.html')

        # Special case for biblos_progress which has a nested 'statistics' folder according to memory
        # Memory says: "biblos_progress directory (containing statistics/code.html) to biblos_progress.html"
        if item == 'biblos_progress':
             nested_path = os.path.join(src_path, 'statistics', 'code.html')
             if os.path.exists(nested_path):
                 code_html_path = nested_path

        if not os.path.exists(code_html_path):
            print(f"Skipping {item}: code.html not found at {code_html_path}")
            continue

        # Determine output filename
        dest_filename = MAPPINGS.get(item, item) + '.html'
        dest_path = os.path.join(VIEWS_DIR, dest_filename)

        # Read content
        with open(code_html_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Inject scripts
        scripts_to_inject = [
            '<script src="/js/router.js"></script>',
            '<script src="/js/lesson_controller.js"></script>'
        ]
        scripts_block = '\n'.join(scripts_to_inject)

        if '</body>' in content:
            content = content.replace('</body>', f'{scripts_block}\n</body>')
        else:
            content += f'\n{scripts_block}'

        # Write content
        with open(dest_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Processed {item} -> {dest_path}")

        # Handle Splash Screen -> index.html
        if item == 'biblos_splash_screen':
            index_path = os.path.join(WWW_DIR, 'index.html')
            with open(index_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Processed {item} -> {index_path}")

if __name__ == '__main__':
    clean_build_dir()
    copy_js()
    process_screens()
    print("Build complete.")
