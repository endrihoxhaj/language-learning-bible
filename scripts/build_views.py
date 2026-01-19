import os
import shutil

SRC_DIR = 'src'
WWW_DIR = 'www'
VIEWS_DIR = os.path.join(WWW_DIR, 'views')

def clean_and_create_dirs():
    if os.path.exists(WWW_DIR):
        shutil.rmtree(WWW_DIR)
    os.makedirs(VIEWS_DIR)
    os.makedirs(os.path.join(WWW_DIR, 'js'))
    os.makedirs(os.path.join(WWW_DIR, 'css'))

def copy_assets():
    # Copy JS
    src_js = os.path.join(SRC_DIR, 'js')
    if os.path.exists(src_js):
        for file in os.listdir(src_js):
             shutil.copy(os.path.join(src_js, file), os.path.join(WWW_DIR, 'js'))

    # Copy CSS
    src_css = os.path.join(SRC_DIR, 'css')
    if os.path.exists(src_css):
        for file in os.listdir(src_css):
             shutil.copy(os.path.join(src_css, file), os.path.join(WWW_DIR, 'css'))

def process_screens():
    screens_dir = os.path.join(SRC_DIR, 'screens')
    for item in os.listdir(screens_dir):
        item_path = os.path.join(screens_dir, item)
        if os.path.isdir(item_path):
            # Determine target filename
            target_name = item + '.html'
            if item == 'biblos_progress':
                code_path = os.path.join(item_path, 'statistics', 'code.html')
            elif item == 'untitled_screen':
                target_name = 'biblos_profile.html'
                code_path = os.path.join(item_path, 'code.html')
            else:
                code_path = os.path.join(item_path, 'code.html')

            if os.path.exists(code_path):
                shutil.copy(code_path, os.path.join(VIEWS_DIR, target_name))
                print(f"Copied {code_path} to {target_name}")

def create_index_html():
    # Create the shell index.html
    # This will be the entry point.
    content = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BIBLOS</title>
    <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&amp;family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&amp;display=swap" rel="stylesheet"/>
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    <script>
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#7b9f5b",
                        "primary-dark": "#5e7d43",
                        "biblos-cream": "#FDF6E3",
                        "biblos-brown": "#5D4E37",
                        "biblos-dark-brown": "#3D3426",
                        "biblos-gray": "#7A6F5D",
                        "biblos-orange": "#E57C23",
                        "background-light": "#FDF6E3",
                        "background-dark": "#191c16",
                        "background-cream": "#FDF6E3",
                        "text-dark": "#3D3426",
                        "text-subtle": "#5D4E37",
                        "text-caption": "#7A6F5D",
                        "accent-blue": "#A8C8DC",
                        "accent-green-light": "#E8F5E0",
                        "bg-inactive": "#E8E4DC",
                    },
                    fontFamily: {
                        "display": ["Lexend", "sans-serif"],
                        "body": ["Nunito", "sans-serif"],
                    },
                    borderRadius: {"DEFAULT": "1rem", "lg": "1.25rem", "xl": "1.5rem", "2xl": "2rem", "full": "9999px"},
                    boxShadow: {
                        'soft': '0 4px 20px -2px rgba(61, 52, 38, 0.08)',
                        'glow': '0 0 30px rgba(123, 159, 91, 0.3)',
                    }
                },
            },
        }
    </script>
    <style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        body {
            min-height: 100vh;
            background-color: #FDF6E3;
        }
    </style>
</head>
<body>
    <div id="app" class="h-full w-full"></div>
    <script src="js/router.js"></script>
    <script src="js/lesson_controller.js"></script>
    <script src="js/app.js"></script>
</body>
</html>"""
    with open(os.path.join(WWW_DIR, 'index.html'), 'w') as f:
        f.write(content)

if __name__ == '__main__':
    clean_and_create_dirs()
    process_screens()
    copy_assets()
    create_index_html()
