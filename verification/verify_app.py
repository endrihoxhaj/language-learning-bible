from playwright.sync_api import sync_playwright
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        print("Navigating to Home Dashboard...")
        page.goto("http://localhost:8000/views/biblos_home_dashboard.html")

        print(f"Page title: {page.title()}")

        # Ensure directory exists
        if not os.path.exists("verification"):
            os.makedirs("verification")

        screenshot_path = "verification/verification.png"
        page.screenshot(path=screenshot_path)
        print(f"Screenshot saved to {screenshot_path}")

        browser.close()

if __name__ == "__main__":
    run()
