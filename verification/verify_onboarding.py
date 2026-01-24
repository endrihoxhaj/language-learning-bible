from playwright.sync_api import Page, expect, sync_playwright
import time

def verify_onboarding_flow(page: Page):
    # 1. Start at Splash Screen
    page.goto("http://localhost:8000/index.html")
    # Wait for auto-redirect from splash (3s set in controller)
    time.sleep(4)

    # Check we are on Onboarding 1
    # Note: URL might be /views/biblos_onboarding_1_of_4.html
    expect(page).to_have_url("http://localhost:8000/views/biblos_onboarding_1_of_4.html")

    # Click INIZIAMO
    page.get_by_text("INIZIAMO").click()

    # Check Onboarding 2
    expect(page).to_have_url("http://localhost:8000/views/biblos_onboarding_2_of_4.html")

    # Click English
    page.get_by_text("English").click()

    # Check Onboarding 3
    expect(page).to_have_url("http://localhost:8000/views/biblos_onboarding_3_of_4.html")

    # Click CONTINUA
    page.get_by_text("CONTINUA").click()

    # Check Onboarding 4
    expect(page).to_have_url("http://localhost:8000/views/biblos_onboarding_4_of_4.html")

    # Screenshot
    page.screenshot(path="/home/jules/verification/onboarding_complete.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_onboarding_flow(page)
            print("Verification successful")
        except Exception as e:
            print(f"Verification failed: {e}")
            page.screenshot(path="/home/jules/verification/failure.png")
        finally:
            browser.close()
