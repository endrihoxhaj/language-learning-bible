import os
import re
from bs4 import BeautifulSoup

SRC_DIR = 'src/screens'
DEST_DIR = 'www/views'

if not os.path.exists(DEST_DIR):
    os.makedirs(DEST_DIR)

def process_file(code_path, output_name):
    if not os.path.exists(code_path):
        return

    with open(code_path, 'r', encoding='utf-8') as f:
        html_content = f.read()

    soup = BeautifulSoup(html_content, 'html.parser')

    # Extract body content
    body_content = ""
    if soup.body:
        # We want the inner HTML of the body
        body_content = "".join([str(x) for x in soup.body.contents])

    dest_path = os.path.join(DEST_DIR, f"{output_name}.html")
    with open(dest_path, 'w', encoding='utf-8') as f:
        f.write(body_content)
    print(f"Processed {output_name}")

def main():
    for root, dirs, files in os.walk(SRC_DIR):
        if 'code.html' in files:
            # Construct a unique name based on path relative to SRC_DIR
            rel_path = os.path.relpath(root, SRC_DIR)
            # Replace path separators with underscores for flat filename
            safe_name = rel_path.replace(os.sep, '_').replace('.', '')

            # Handle the case where the folder name itself is the screen name (top level)
            # e.g. biblos_home_dashboard -> biblos_home_dashboard
            # e.g. biblos_progress/statistics -> biblos_progress_statistics

            process_file(os.path.join(root, 'code.html'), safe_name)

if __name__ == "__main__":
    main()
