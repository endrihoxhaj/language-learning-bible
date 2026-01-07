import os
from bs4 import BeautifulSoup
import re

def extract_body_content(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    body = soup.body
    if body:
        # Extract content inside body
        return "".join([str(x) for x in body.contents])
    return ""

def process_screens(src_dir, dest_dir):
    if not os.path.exists(dest_dir):
        os.makedirs(dest_dir)

    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file == "code.html":
                # Get the screen name from the directory name
                screen_name = os.path.basename(root)
                src_path = os.path.join(root, file)
                dest_path = os.path.join(dest_dir, f"{screen_name}.html")

                print(f"Processing {screen_name}...")

                with open(src_path, 'r', encoding='utf-8') as f:
                    content = f.read()

                body_content = extract_body_content(content)

                # Basic cleanup or transformation if needed
                # For example, fixing image paths if they were local (but they seem to be URLs)

                with open(dest_path, 'w', encoding='utf-8') as f:
                    f.write(body_content)

if __name__ == "__main__":
    src_screens = "src/screens"
    dest_views = "www/views"
    process_screens(src_screens, dest_views)
