import os
import shutil

SRC_DIR = 'src'
WWW_DIR = 'www'
VIEWS_DIR = os.path.join(WWW_DIR, 'views')
JS_DIR = os.path.join(WWW_DIR, 'js')

RENAME_MAP = {
    'untitled_screen': 'biblos_profile',
    'statistics': 'biblos_progress'
}

NAV_SCRIPTS = """
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script src="../js/router.js"></script>
<script src="../js/lesson_controller.js"></script>
"""

def main():
    if os.path.exists(WWW_DIR):
        shutil.rmtree(WWW_DIR)
    os.makedirs(VIEWS_DIR)
    os.makedirs(JS_DIR)

    src_js = os.path.join(SRC_DIR, 'js')
    if os.path.exists(src_js):
        for item in os.listdir(src_js):
            s = os.path.join(src_js, item)
            d = os.path.join(JS_DIR, item)
            if os.path.isfile(s):
                shutil.copy2(s, d)

    screens_dir = os.path.join(SRC_DIR, 'screens')
    for root, dirs, files in os.walk(screens_dir):
        if 'code.html' in files:
            folder_name = os.path.basename(root)
            if folder_name == 'statistics' and 'biblos_progress' in root:
                file_name = 'biblos_progress.html'
            else:
                name_key = folder_name
                file_name = RENAME_MAP.get(name_key, name_key) + '.html'

            source_path = os.path.join(root, 'code.html')
            dest_path = os.path.join(VIEWS_DIR, file_name)

            print(f"Processing {folder_name} -> {file_name}")

            with open(source_path, 'r', encoding='utf-8') as f:
                content = f.read()

            if '</head>' in content:
                content = content.replace('</head>', NAV_SCRIPTS + '</head>')
            else:
                content = NAV_SCRIPTS + content

            with open(dest_path, 'w', encoding='utf-8') as f:
                f.write(content)

            if folder_name == 'biblos_splash_screen':
                index_path = os.path.join(WWW_DIR, 'index.html')
                index_scripts = NAV_SCRIPTS.replace('../js/', './js/')

                with open(source_path, 'r', encoding='utf-8') as f:
                    index_content = f.read()

                if '</head>' in index_content:
                    index_content = index_content.replace('</head>', index_scripts + '</head>')

                with open(index_path, 'w', encoding='utf-8') as f:
                    f.write(index_content)
                print(f"Created index.html from {folder_name}")

if __name__ == '__main__':
    main()
