import os
import shutil

SRC_SCREENS = "src/screens"
WWW_DIR = "www"
WWW_VIEWS_DIR = os.path.join(WWW_DIR, "views")
WWW_JS_DIR = os.path.join(WWW_DIR, "js")

# Mappings: src_dir_name -> output_filename (relative to www/views, unless it is index)
SPECIAL_MAPPINGS = {
    "untitled_screen": "biblos_profile.html",
}

def build():
    # 1. Prepare directories
    if os.path.exists(WWW_DIR):
        shutil.rmtree(WWW_DIR)
    os.makedirs(WWW_VIEWS_DIR)

    # 2. Copy JS
    shutil.copytree("src/js", WWW_JS_DIR)

    # 3. Process Screens
    for item in os.listdir(SRC_SCREENS):
        item_path = os.path.join(SRC_SCREENS, item)
        if not os.path.isdir(item_path):
            continue

        code_html_path = os.path.join(item_path, "code.html")
        output_filename = f"{item}.html"

        # Handle specific cases
        if item == "biblos_progress":
            # Check for statistics subdir
            stats_path = os.path.join(item_path, "statistics", "code.html")
            if os.path.exists(stats_path):
                code_html_path = stats_path
                output_filename = "biblos_progress.html"
        elif item == "biblos_splash_screen":
            output_filename = "../index.html"
        elif item in SPECIAL_MAPPINGS:
            output_filename = SPECIAL_MAPPINGS[item]

        if not os.path.exists(code_html_path):
            print(f"Warning: No code.html found in {item_path} (checked {code_html_path})")
            continue

        with open(code_html_path, "r", encoding="utf-8") as f:
            content = f.read()

        # Inject scripts
        scripts_to_inject = """
    <script src="/js/router.js"></script>
    <script src="/js/lesson_controller.js"></script>
</body>
"""
        if "</body>" in content:
            content = content.replace("</body>", scripts_to_inject)
        else:
             content += scripts_to_inject

        output_path = os.path.join(WWW_VIEWS_DIR, output_filename)
        output_path = os.path.normpath(output_path)

        with open(output_path, "w", encoding="utf-8") as f:
            f.write(content)

        print(f"Generated {output_path}")

if __name__ == "__main__":
    build()
