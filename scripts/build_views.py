import os
import shutil
from bs4 import BeautifulSoup

SRC_SCREENS_DIR = 'src/screens'
SRC_JS_DIR = 'src/js'
SRC_CSS_DIR = 'src/css'
SRC_INDEX = 'src/index.html'

WWW_DIR = 'www'
DEST_VIEWS_DIR = 'www/views'
DEST_JS_DIR = 'www/js'
DEST_CSS_DIR = 'www/css'

# Mapping for renaming specific screens
RENAME_MAP = {
    'untitled_screen': 'biblos_profile'
}

def process_file(file_path, screen_name):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        soup = BeautifulSoup(content, 'html.parser')
        body = soup.body

        if body:
            # Extract content inside body
            body_content = "".join([str(x) for x in body.contents])

            # Write to destination
            dest_name = RENAME_MAP.get(screen_name, screen_name)
            dest_path = os.path.join(DEST_VIEWS_DIR, f"{dest_name}.html")

            with open(dest_path, 'w', encoding='utf-8') as f:
                f.write(body_content)
            print(f"Processed {screen_name} -> {dest_name}.html")
        else:
            print(f"Warning: No body tag found in {file_path}")

    except Exception as e:
        print(f"Error processing {file_path}: {e}")

def main():
    # Ensure directories exist
    os.makedirs(DEST_VIEWS_DIR, exist_ok=True)
    os.makedirs(DEST_JS_DIR, exist_ok=True)
    os.makedirs(DEST_CSS_DIR, exist_ok=True)

    # Copy Index
    if os.path.exists(SRC_INDEX):
        shutil.copy(SRC_INDEX, os.path.join(WWW_DIR, 'index.html'))
        print("Copied index.html")

    # Copy JS
    if os.path.exists(SRC_JS_DIR):
        for file in os.listdir(SRC_JS_DIR):
            full_file_name = os.path.join(SRC_JS_DIR, file)
            if os.path.isfile(full_file_name):
                shutil.copy(full_file_name, DEST_JS_DIR)
        print("Copied JS files")

    # Copy CSS
    if os.path.exists(SRC_CSS_DIR):
        for file in os.listdir(SRC_CSS_DIR):
            full_file_name = os.path.join(SRC_CSS_DIR, file)
            if os.path.isfile(full_file_name):
                shutil.copy(full_file_name, DEST_CSS_DIR)
        print("Copied CSS files")

    # Process Views
    for root, dirs, files in os.walk(SRC_SCREENS_DIR):
        if 'code.html' in files:
            # Determine screen name from path relative to SRC_SCREENS_DIR
            rel_path = os.path.relpath(root, SRC_SCREENS_DIR)
            # Replace path separators with underscore for flat structure
            screen_name = rel_path.replace(os.path.sep, '_')

            process_file(os.path.join(root, 'code.html'), screen_name)

if __name__ == '__main__':
    main()
