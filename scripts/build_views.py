import os
import shutil

SRC_DIR = 'src'
SCREENS_DIR = os.path.join(SRC_DIR, 'screens')
JS_DIR = os.path.join(SRC_DIR, 'js')
WWW_DIR = 'www'
WWW_VIEWS_DIR = os.path.join(WWW_DIR, 'views')
WWW_JS_DIR = os.path.join(WWW_DIR, 'js')

def main():
    print("Starting build process...")

    # 1. Clean and Create directories
    if os.path.exists(WWW_DIR):
        shutil.rmtree(WWW_DIR)

    os.makedirs(WWW_VIEWS_DIR)
    os.makedirs(WWW_JS_DIR)
    print(f"Created directories: {WWW_VIEWS_DIR}, {WWW_JS_DIR}")

    # 2. Copy JS
    if os.path.exists(JS_DIR):
        for item in os.listdir(JS_DIR):
            s = os.path.join(JS_DIR, item)
            d = os.path.join(WWW_JS_DIR, item)
            if os.path.isfile(s):
                shutil.copy2(s, d)
        print("Copied JS files.")
    else:
        print("Warning: JS directory not found.")

    # 3. Process Screens
    if os.path.exists(SCREENS_DIR):
        for screen_name in os.listdir(SCREENS_DIR):
            screen_path = os.path.join(SCREENS_DIR, screen_name)
            if not os.path.isdir(screen_path):
                continue

            code_path = os.path.join(screen_path, 'code.html')
            if not os.path.exists(code_path):
                # Try to find code.html in subdirectories
                found = False
                for root, dirs, files in os.walk(screen_path):
                    if 'code.html' in files:
                        code_path = os.path.join(root, 'code.html')
                        found = True
                        break

                if not found:
                    print(f"Skipping {screen_name}: code.html not found")
                    continue

            # Determine target filename
            target_name = screen_name + '.html'
            if screen_name == 'untitled_screen':
                target_name = 'biblos_profile.html'

            # Read content
            with open(code_path, 'r', encoding='utf-8') as f:
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

            # Write to views
            with open(os.path.join(WWW_VIEWS_DIR, target_name), 'w', encoding='utf-8') as f:
                f.write(content)

            # Special handling for Splash Screen -> index.html
            if screen_name == 'biblos_splash_screen':
                with open(os.path.join(WWW_DIR, 'index.html'), 'w', encoding='utf-8') as f:
                    f.write(content)
                print("Created index.html from biblos_splash_screen")

        print("Processed screens.")
    else:
        print("Error: Screens directory not found.")

    print("Build complete.")

if __name__ == "__main__":
    main()
