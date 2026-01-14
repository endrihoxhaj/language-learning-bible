import os
from bs4 import BeautifulSoup

SRC_DIR = 'src/screens'
DEST_DIR = 'www/views'

def find_code_html(directory):
    for root, dirs, files in os.walk(directory):
        if 'code.html' in files:
            return os.path.join(root, 'code.html')
    return None

def build_views():
    if not os.path.exists(DEST_DIR):
        os.makedirs(DEST_DIR)

    for item in os.listdir(SRC_DIR):
        item_path = os.path.join(SRC_DIR, item)
        if os.path.isdir(item_path):
            code_file = find_code_html(item_path)

            if code_file and os.path.exists(code_file):
                print(f"Processing {item} from {code_file}...")
                with open(code_file, 'r', encoding='utf-8') as f:
                    soup = BeautifulSoup(f, 'html.parser')

                if soup.body:
                    body_classes = soup.body.get('class', [])
                    content = "".join([str(x) for x in soup.body.contents])

                    # Create a wrapper with the body classes
                    wrapper = f'<div id="screen-wrapper" class="{" ".join(body_classes)} h-full w-full">\n{content}\n</div>'

                    dest_file = os.path.join(DEST_DIR, f'{item}.html')
                    with open(dest_file, 'w', encoding='utf-8') as f:
                        f.write(wrapper)
                else:
                    print(f"Warning: No body found in {code_file}")
            else:
                 print(f"Warning: No code.html found in {item_path}")

if __name__ == "__main__":
    build_views()
