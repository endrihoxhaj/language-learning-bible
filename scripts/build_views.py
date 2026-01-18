import os
import shutil
from bs4 import BeautifulSoup

# Define paths
SRC_DIR = 'src'
SCREENS_DIR = os.path.join(SRC_DIR, 'screens')
WWW_DIR = 'www'
VIEWS_DIR = os.path.join(WWW_DIR, 'views')

# Create www structure
if os.path.exists(WWW_DIR):
    shutil.rmtree(WWW_DIR)
os.makedirs(VIEWS_DIR)
os.makedirs(os.path.join(WWW_DIR, 'js'))
os.makedirs(os.path.join(WWW_DIR, 'css'))

# Map screen names to friendlier file names if needed
# For now, we'll use the folder name as the view name

def process_screen(folder_name):
    code_path = os.path.join(SCREENS_DIR, folder_name, 'code.html')
    # Special handling for biblos_progress which has a nested statistics folder
    if folder_name == 'biblos_progress' and not os.path.exists(code_path):
        code_path = os.path.join(SCREENS_DIR, folder_name, 'statistics', 'code.html')

    if not os.path.exists(code_path):
        print(f"Skipping {folder_name}: code.html not found")
        return

    with open(code_path, 'r', encoding='utf-8') as f:
        html_content = f.read()

    soup = BeautifulSoup(html_content, 'html.parser')

    # Extract body content.
    # NOTE: The provided HTMLs are full pages.
    # For a simple approach, we will save the FULL HTML but inject our router script.
    # A better approach would be to extract the body and inject it into a shell.
    # Given the designs might have unique headers/styles (though they seem consistent),
    # let's try to extract the main content.

    # Actually, looking at the splash screen, it has specific body classes.
    # Let's just copy the file for now and inject the router script at the end of body.

    # We also need to fix local links if any.

    # Inject router script
    if soup.body:
        script_tag = soup.new_tag('script', src='../js/router.js')
        soup.body.append(script_tag)

        # Inject lesson controller if it's a lesson
        if 'lesson' in folder_name:
             lesson_script = soup.new_tag('script', src='../js/lesson_controller.js')
             soup.body.append(lesson_script)

    output_path = os.path.join(VIEWS_DIR, f'{folder_name}.html')

    # Handle user profile mapping from memory
    if folder_name == 'untitled_screen':
        output_path = os.path.join(VIEWS_DIR, 'biblos_profile.html')

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(str(soup))

    print(f"Processed {folder_name} -> {output_path}")

# Process all screens
for folder in os.listdir(SCREENS_DIR):
    if os.path.isdir(os.path.join(SCREENS_DIR, folder)):
        process_screen(folder)

# Copy global assets
# Check if src/js and src/css exist (we created them in the plan)
if os.path.exists(os.path.join(SRC_DIR, 'js')):
    for file in os.listdir(os.path.join(SRC_DIR, 'js')):
        shutil.copy(os.path.join(SRC_DIR, 'js', file), os.path.join(WWW_DIR, 'js'))

if os.path.exists(os.path.join(SRC_DIR, 'css')):
    for file in os.listdir(os.path.join(SRC_DIR, 'css')):
        shutil.copy(os.path.join(SRC_DIR, 'css', file), os.path.join(WWW_DIR, 'css'))

# Create a redirecting index.html in www root
# It will redirect to splash screen
index_content = """
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="refresh" content="0; url=views/biblos_splash_screen.html" />
</head>
<body>
    <p>Redirecting...</p>
    <script>
        window.location.href = "views/biblos_splash_screen.html";
    </script>
</body>
</html>
"""
with open(os.path.join(WWW_DIR, 'index.html'), 'w') as f:
    f.write(index_content)

print("Build complete.")
