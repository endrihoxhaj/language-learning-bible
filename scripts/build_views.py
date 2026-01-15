import os
from bs4 import BeautifulSoup

SOURCE_DIR = 'src/screens'
DEST_DIR = 'www/views'

def build_views():
    if not os.path.exists(DEST_DIR):
        os.makedirs(DEST_DIR)

    for folder_name in os.listdir(SOURCE_DIR):
        folder_path = os.path.join(SOURCE_DIR, folder_name)
        if not os.path.isdir(folder_path):
            continue

        html_file = os.path.join(folder_path, 'code.html')
        if not os.path.exists(html_file):
            # Try looking one level deeper
            found = False
            for sub in os.listdir(folder_path):
                sub_path = os.path.join(folder_path, sub)
                if os.path.isdir(sub_path):
                    html_file_sub = os.path.join(sub_path, 'code.html')
                    if os.path.exists(html_file_sub):
                        html_file = html_file_sub
                        found = True
                        break
            if not found:
                print(f"Skipping {folder_name}: code.html not found")
                continue

        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()

        soup = BeautifulSoup(content, 'html.parser')

        # Extract body content
        if soup.body:
            body_content = soup.body.decode_contents()
        else:
            # Fallback if no body tag
            body_content = str(soup)

        # Handle file naming
        if folder_name == 'untitled_screen':
            output_filename = 'biblos_profile.html'
        else:
            output_filename = f"{folder_name}.html"

        output_path = os.path.join(DEST_DIR, output_filename)

        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(body_content)

        print(f"Generated {output_filename} from {folder_name}")

if __name__ == "__main__":
    build_views()
