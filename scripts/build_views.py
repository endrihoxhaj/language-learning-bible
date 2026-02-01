import os
import shutil
import re

SRC_SCREENS = 'src/screens'
SRC_JS = 'src/js'
WWW = 'www'
WWW_VIEWS = os.path.join(WWW, 'views')
WWW_JS = os.path.join(WWW, 'js')

def clean_and_create_dirs():
    if os.path.exists(WWW):
        shutil.rmtree(WWW)
    os.makedirs(WWW_VIEWS)
    os.makedirs(WWW_JS)

def copy_js():
    if os.path.exists(SRC_JS):
        for file in os.listdir(SRC_JS):
            shutil.copy(os.path.join(SRC_JS, file), WWW_JS)

def process_screens():
    # Map from source directory name to output filename (without extension)

    screens = []

    # Walk to find all code.html files
    for root, dirs, files in os.walk(SRC_SCREENS):
        if 'code.html' in files:
            # Determine logic name
            rel_path = os.path.relpath(root, SRC_SCREENS)
            # rel_path could be 'biblos_splash_screen' or 'biblos_progress/statistics'

            output_name = rel_path.replace(os.path.sep, '_') # Default fallback

            if rel_path == 'untitled_screen':
                output_name = 'biblos_profile'
            elif rel_path == 'biblos_progress/statistics' or rel_path == 'biblos_progress':
                # Check if it is the statistics folder inside biblos_progress
                if 'statistics' in rel_path:
                     output_name = 'biblos_progress'
                else:
                    output_name = 'biblos_progress_root'
            else:
                # Normal case: biblos_splash_screen -> biblos_splash_screen
                output_name = rel_path

            screens.append({
                'src': os.path.join(root, 'code.html'),
                'dest': f'{output_name}.html',
                'rel_path': rel_path
            })

    # Prepare replacements map for hrefs
    link_map = {}
    for screen in screens:
        original_ref = screen['src']
        # We need to handle relative paths that might be in the HTML
        # e.g. ../biblos_home_dashboard/code.html

        target_ref = f'/views/{screen["dest"]}'
        link_map[original_ref] = target_ref

    for screen in screens:
        with open(screen['src'], 'r', encoding='utf-8') as f:
            content = f.read()

        # Inject scripts
        scripts = """
    <script src="/js/router.js"></script>
    <script src="/js/lesson_controller.js"></script>
</body>
"""
        if '</body>' in content:
            content = content.replace('</body>', scripts)
        else:
            content += scripts

        # Fix Links
        # Regex to find hrefs pointing to code.html in src/screens
        # This is tricky because paths can be relative.
        # We look for anything ending in /code.html or just code.html

        # Strategy:
        # 1. Replace explicit paths like "src/screens/X/code.html"
        # 2. Replace relative paths like "../X/code.html"

        # We can construct a regex that matches `href=".../screens/([^/]+)/code.html"`
        # and replaces it with `/views/$1.html`

        def replace_link(match):
            path = match.group(1) # The whole path inside href

            # Extract the directory name before code.html
            # path usually ends with /code.html
            parts = path.split('/')
            if len(parts) >= 2 and parts[-1] == 'code.html':
                screen_dir = parts[-2]
                if screen_dir == 'untitled_screen':
                    return 'href="/views/biblos_profile.html"'
                if screen_dir == 'statistics':
                    return 'href="/views/biblos_progress.html"'
                return f'href="/views/{screen_dir}.html"'
            return match.group(0)

        content = re.sub(r'href=["\']([^"\']*code\.html)["\']', replace_link, content)

        # Write to views
        dest_path = os.path.join(WWW_VIEWS, screen['dest'])
        with open(dest_path, 'w', encoding='utf-8') as f:
            f.write(content)

        # If this is splash screen, also write to index.html
        if screen['dest'] == 'biblos_splash_screen.html':
            with open(os.path.join(WWW, 'index.html'), 'w', encoding='utf-8') as f:
                f.write(content)

def main():
    print("Building views...")
    clean_and_create_dirs()
    copy_js()
    process_screens()
    print("Build complete.")

if __name__ == '__main__':
    main()
