import os
import shutil

SRC_DIR = 'src'
WWW_DIR = 'www'
SCREENS_DIR = os.path.join(SRC_DIR, 'screens')
JS_DIR = os.path.join(SRC_DIR, 'js')

def clean_and_create_dirs():
    if os.path.exists(WWW_DIR):
        shutil.rmtree(WWW_DIR)
    os.makedirs(os.path.join(WWW_DIR, 'js'))
    os.makedirs(os.path.join(WWW_DIR, 'views'))

def copy_js():
    if os.path.exists(JS_DIR):
        for file in os.listdir(JS_DIR):
            if file.endswith('.js'):
                shutil.copy(os.path.join(JS_DIR, file), os.path.join(WWW_DIR, 'js', file))

def inject_scripts(content):
    scripts = """
    <script src="/js/router.js"></script>
    <script src="/js/lesson_controller.js"></script>
    """
    if '</body>' in content:
        return content.replace('</body>', scripts + '</body>')
    else:
        return content + scripts

def find_code_html(directory):
    # First check direct children
    code_path = os.path.join(directory, 'code.html')
    if os.path.exists(code_path):
        return code_path

    # Check subdirectories
    for item in os.listdir(directory):
        item_path = os.path.join(directory, item)
        if os.path.isdir(item_path):
            found = find_code_html(item_path)
            if found:
                return found
    return None

def build_views():
    for screen_name in os.listdir(SCREENS_DIR):
        screen_dir = os.path.join(SCREENS_DIR, screen_name)
        if not os.path.isdir(screen_dir):
            continue

        code_html = find_code_html(screen_dir)

        if code_html:
            with open(code_html, 'r', encoding='utf-8') as f:
                content = f.read()

            content = inject_scripts(content)

            # Determine output filename
            output_name = screen_name
            if screen_name == 'untitled_screen':
                output_name = 'biblos_profile'

            # Write to www/views/
            view_path = os.path.join(WWW_DIR, 'views', f'{output_name}.html')
            with open(view_path, 'w', encoding='utf-8') as f:
                f.write(content)

            # Special case for splash screen -> index.html
            if screen_name == 'biblos_splash_screen':
                index_path = os.path.join(WWW_DIR, 'index.html')
                with open(index_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Generated index.html from {screen_name}")

if __name__ == '__main__':
    clean_and_create_dirs()
    copy_js()
    build_views()
    print("Build complete.")
