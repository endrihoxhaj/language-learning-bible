import os
from bs4 import BeautifulSoup

def build_views():
    screens_dir = 'src/screens'
    views_dir = 'www/views'

    if not os.path.exists(views_dir):
        os.makedirs(views_dir)

    for root, dirs, files in os.walk(screens_dir):
        if 'code.html' in files:
            file_path = os.path.join(root, 'code.html')
            screen_name = os.path.basename(root)

            with open(file_path, 'r', encoding='utf-8') as f:
                html_content = f.read()

            soup = BeautifulSoup(html_content, 'html.parser')
            body = soup.body

            if body:
                # Get body attributes (classes, etc)
                body_attrs = body.attrs

                # Create a wrapper div with these attributes
                # We need to construct the opening tag string or use soup to create a new tag
                # But treating it as string is easier for just wrapping.

                inner_html = "".join([str(x) for x in body.contents])

                # Reconstruct the class attribute string
                class_str = ""
                if 'class' in body_attrs:
                    class_str = f' class="{" ".join(body_attrs["class"])}"'

                # Other attributes?
                other_attrs = ""
                for k, v in body_attrs.items():
                    if k != 'class':
                        other_attrs += f' {k}="{v}"'

                # Wrap in a div that acts as the screen container
                # We ensure it takes full height/width
                view_content = f'<div{class_str}{other_attrs} style="min-height: 100vh; width: 100%;">{inner_html}</div>'

                output_path = os.path.join(views_dir, f"{screen_name}.html")
                with open(output_path, 'w', encoding='utf-8') as f:
                    f.write(view_content)
                print(f"Generated {output_path} with wrapper")

if __name__ == "__main__":
    build_views()
