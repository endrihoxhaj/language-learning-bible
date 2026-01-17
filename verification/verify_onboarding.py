from playwright.sync_api import sync_playwright, expect
import time
import os

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    # Go to splash
    print("Navigating to index...")
    page.goto("http://localhost:8000")

    # Wait for INIZIAMO button (Onboarding 1)
    print("Waiting for INIZIAMO button...")
    page.wait_for_selector('button:has-text("INIZIAMO")', timeout=10000)

    # Take screenshot of Onboarding 1
    os.makedirs("/home/jules/verification", exist_ok=True)
    page.screenshot(path="/home/jules/verification/onboarding_1.png")
    print("Screenshot onboarding_1.png taken.")

    # Click INIZIAMO
    print("Clicking INIZIAMO...")
    page.click('button:has-text("INIZIAMO")')

    # Wait for English button (Onboarding 2)
    # The button text is "English"
    print("Waiting for English button...")
    page.wait_for_selector('button:has-text("English")', timeout=5000)

    # Screenshot Onboarding 2
    page.screenshot(path="/home/jules/verification/onboarding_2.png")
    print("Screenshot onboarding_2.png taken.")

    # Click English
    print("Clicking English...")
    page.click('button:has-text("English")')

    # Wait for Onboarding 3
    # Check for text "Hai già studiato inglese?"
    print("Waiting for Onboarding 3 content...")
    page.wait_for_selector('h1:has-text("Hai già studiato inglese?")', timeout=5000)

    # Screenshot Onboarding 3
    page.screenshot(path="/home/jules/verification/onboarding_3.png")
    print("Screenshot onboarding_3.png taken.")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
