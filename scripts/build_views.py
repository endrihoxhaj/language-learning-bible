import os
import glob
from bs4 import BeautifulSoup

def build_views():
    source_dir = 'src/screens'
    output_dir = 'www/views'

    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Walk through the source directory
    for root, dirs, files in os.walk(source_dir):
        if 'code.html' in files:
            # Determine the view name from the parent directory
            view_name = os.path.basename(root)
            input_path = os.path.join(root, 'code.html')
            output_path = os.path.join(output_dir, f'{view_name}.html')

            print(f"Processing {input_path} -> {output_path}")

            with open(input_path, 'r', encoding='utf-8') as f:
                html_content = f.read()

            soup = BeautifulSoup(html_content, 'html.parser')

            # Extract body content
            if soup.body:
                # We want the inner HTML of the body.
                # decode_contents() returns the string representation of the children
                body_content = soup.body.decode_contents()

                # Check for styles inside head that might be needed
                # Some designs might have specific <style> tags in head
                head_styles = ""
                if soup.head:
                    styles = soup.head.find_all('style')
                    for style in styles:
                        head_styles += str(style) + "\n"

                # We prepend any head styles to the body content so they are preserved
                # when injected into the main page. Ideally these should be in a separate CSS file
                # or the main page's head, but injecting them into the view is a quick way to ensure
                # they apply. Scope might be an issue but let's try this first.

                full_content = head_styles + body_content

                with open(output_path, 'w', encoding='utf-8') as f_out:
                    f_out.write(full_content)
            else:
                print(f"Warning: No <body> tag found in {input_path}")

if __name__ == "__main__":
    build_views()
