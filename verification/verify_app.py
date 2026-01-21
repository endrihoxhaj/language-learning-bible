
from playwright.sync_api import Page, expect, sync_playwright

def test_app_navigation(page: Page):
    # 1. Arrange: Go to the home dashboard (assuming it's the main entry or redirect works)
    # The server is serving 'www', so root should redirect to splash or we can go directly to home.
    # The router.js logic handles navigation.

    # Let's start at home dashboard
    page.goto("http://localhost:8000/views/biblos_home_dashboard.html")

    # 2. Assert: Verify we are on the dashboard
    expect(page.get_by_text("BIBLOS", exact=True)).to_be_visible()
    expect(page.get_by_text("Buongiorno, Marco!")).to_be_visible()

    # 3. Act: Click "INIZIA LEZIONE"
    # The button has text "INIZIA LEZIONE".
    # Note: getCleanText implementation in router.js handles the click.
    # Playwright's click should trigger the event listener.
    start_button = page.get_by_role("button", name="INIZIA LEZIONE")
    start_button.click()

    # 4. Assert: Navigation to Tutor Selection
    # Router logic: if text.includes('INIZIA') -> '/views/biblos_tutor_selection.html'
    # We wait for navigation.
    expect(page).to_have_url("http://localhost:8000/views/biblos_tutor_selection.html")

    # 5. Screenshot: Capture the tutor selection screen
    page.screenshot(path="verification/navigation_test.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_app_navigation(page)
        finally:
            browser.close()
