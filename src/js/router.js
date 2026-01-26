document.addEventListener('DOMContentLoaded', () => {
    console.log('Router initialized');

    document.body.addEventListener('click', (e) => {
        // Find the closest clickable element
        // Added .cursor-pointer to catch divs that look clickable
        const target = e.target.closest('button, a, [role="button"], .clickable, .cursor-pointer');

        if (!target) return;

        if (target.closest('input, label, select, textarea')) {
            return;
        }

        const textContent = target.innerText ? target.innerText.trim().toUpperCase() : '';
        const navTarget = target.getAttribute('data-nav-target');

        console.log('Clicked:', target, 'Text:', textContent, 'NavTarget:', navTarget);

        if (navTarget) {
            e.preventDefault();
            navigateTo(navTarget);
            return;
        }

        const icon = target.querySelector('.material-symbols-outlined');
        const iconName = icon ? icon.innerText.trim() : '';

        if (iconName === 'arrow_back' || iconName === 'close') {
            e.preventDefault();
            window.history.back();
            return;
        }

        // Onboarding
        if (textContent.includes('INIZIAMO')) {
            navigateTo('/views/biblos_onboarding_2_of_4.html');
        } else if (textContent.includes('ENGLISH') || textContent.includes('ITALIANO')) {
            navigateTo('/views/biblos_onboarding_3_of_4.html');
        } else if (textContent.includes('CONTINUA')) {
            if (window.location.href.includes('onboarding_3')) {
                navigateTo('/views/biblos_onboarding_4_of_4.html');
            } else if (window.location.href.includes('feedback') || window.location.href.includes('correction')) {
                 navigateTo('/views/biblos_lesson_recap.html');
            }
        } else if (textContent.includes('INIZIA IL TEST')) {
            navigateTo('/views/biblos_placement_test.html');
        } else if (textContent.includes('CONFERMA SCELTA')) {
            navigateTo('/views/biblos_home_dashboard.html');
        } else if (iconName === 'arrow_forward') {
             if (window.location.href.includes('placement_test')) {
                 navigateTo('/views/biblos_tutor_selection.html');
             } else if (window.location.href.includes('home_dashboard')) {
                 navigateTo('/views/biblos_study_plans.html');
             } else if (window.location.href.includes('tutor_selection')) {
                 navigateTo('/views/biblos_home_dashboard.html');
             }
        }

        // Tutor Selection - Card Click
        if (window.location.href.includes('tutor_selection')) {
             // If clicked on a card (which has text content like Francesco or Paolo)
             if (textContent.includes('FRANCESCO') || textContent.includes('PAOLO') || textContent.includes('TERESA')) {
                 // Select logic would go here, but for now just navigate
                 // But wait, the design has a "Conferma" button. Maybe clicking card just selects it?
                 // The designs are static. I'll assume clicking card DOES NOTHING or selects.
                 // The "Conferma" button is the main action.
                 // But my test tried clicking the button with image.
                 // The card has an image (background-image).
                 // The test used `page.locator("button:has(img)").first.click()`.
                 // But the card is NOT a button and the image is background-image (div).
                 // So the test failed to find the element probably?
                 // Wait, "Locator.click: Timeout... waiting for locator("button:has(img)").first"
                 // This confirms it couldn't find a BUTTON with an IMG.
                 // Because the card is a DIV and image is BG-IMAGE (style).
             }
        }

        if (textContent.includes('INIZIA LEZIONE') || (iconName === 'mic' && window.location.href.includes('home_dashboard'))) {
            navigateTo('/views/biblos_lesson__tutor_speaking.html');
        }

        if (iconName === 'home') navigateTo('/views/biblos_home_dashboard.html');
        if (iconName === 'book_2') navigateTo('/views/biblos_study_plans.html');
        if (iconName === 'emoji_events' || (textContent.includes('PROGRESSI'))) navigateTo('/views/biblos_progress.html');
        if (iconName === 'person' || textContent.includes('PROFILO')) navigateTo('/views/biblos_profile.html');

        if (iconName === 'edit_note' || textContent.includes('VOCABOLARIO')) navigateTo('/views/biblos_vocabulary_review.html');

        if (window.location.href.includes('lesson__tutor_speaking')) {
            if (iconName === 'mic' || textContent.includes('PARLARE')) {
                navigateTo('/views/biblos_lesson__user_speaking.html');
            }
        }

        if (window.location.href.includes('lesson__user_speaking')) {
            if (iconName === 'mic' || textContent.includes('STOP')) {
                navigateTo('/views/biblos_lesson_feedback__correction.html');
            }
        }

        if (textContent.includes('TORNA ALLA HOME')) {
            navigateTo('/views/biblos_home_dashboard.html');
        }

    });
});

function navigateTo(path) {
    const currentPath = window.location.pathname;
    let finalPath = path;

    if (path.startsWith('/views/')) {
        if (currentPath.includes('/views/')) {
            finalPath = path.replace('/views/', './');
        } else {
            finalPath = '.' + path;
        }
    }

    console.log('Navigating to:', finalPath);
    window.location.href = finalPath;
}
