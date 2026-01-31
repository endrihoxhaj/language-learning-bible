// src/js/router.js

const flow = {
    'biblos_splash_screen': 'biblos_onboarding_1_of_4',
    'biblos_onboarding_1_of_4': 'biblos_onboarding_2_of_4',
    'biblos_onboarding_2_of_4': 'biblos_onboarding_3_of_4',
    'biblos_onboarding_3_of_4': 'biblos_onboarding_4_of_4',
    'biblos_onboarding_4_of_4': 'biblos_placement_test',
    'biblos_placement_test': 'biblos_tutor_selection',
    'biblos_tutor_selection': 'biblos_home_dashboard',
    // Lesson flow
    'biblos_home_dashboard': 'biblos_lesson__tutor_speaking',
    'biblos_lesson__tutor_speaking': 'biblos_lesson__user_speaking',
    'biblos_lesson__user_speaking': 'biblos_lesson_feedback__correction',
    'biblos_lesson_feedback__correction': 'biblos_lesson_recap',
    'biblos_lesson_feedback__correct': 'biblos_lesson_recap',
    'biblos_lesson_recap': 'biblos_home_dashboard'
};

function getCurrentScreen() {
    const path = window.location.pathname;
    if (path.endsWith('index.html') || path === '/' || path.endsWith('/')) {
        return 'biblos_splash_screen';
    }
    const match = path.match(/\/views\/(.+)\.html$/);
    return match ? match[1] : null;
}

function navigate(target) {
    if (!target) return;
    // Handle special cases if any (e.g., untitled_screen -> biblos_profile.html)
    // But the build script renames it, so we should target the built name.

    // Check if we are running in a nested path (not likely in Capacitor, but good to be safe)
    // Use absolute path
    window.location.href = `/views/${target}.html`;
}

document.addEventListener('DOMContentLoaded', () => {
    const current = getCurrentScreen();
    // Splash screen timeout
    if (current === 'biblos_splash_screen') {
        setTimeout(() => {
            if (flow[current]) {
                navigate(flow[current]);
            }
        }, 3000);
    }

    // Handle clicks
    document.addEventListener('click', (event) => {
        let targetElement = event.target.closest('button, a, [role="button"], .clickable, .cursor-pointer');

        if (!targetElement) return;

        // Preserve default behavior for inputs
        if (targetElement.closest('input, label, select, textarea')) return;

        // Prevent default link behavior if we are handling it
        // event.preventDefault(); // careful, only if we actually handle it?
        // Better not prevent default unless it's an <a> tag pointing somewhere we don't want.
        // But here we are building a SPA-like experience with multi-pages.

        // Handle arrow_back
        const materialSymbol = targetElement.querySelector('.material-symbols-outlined');
        const hasBackIcon = (materialSymbol && materialSymbol.innerText.trim() === 'arrow_back') || targetElement.innerText.includes('arrow_back');

        if (hasBackIcon) {
            window.history.back();
            return;
        }

        // Check data-nav-target
        const navTarget = targetElement.getAttribute('data-nav-target');
        if (navTarget) {
            navigate(navTarget);
            return;
        }

        // Check text content
        let text = targetElement.innerText.trim();
        // Remove icon text if present to avoid ligatures messing up matching
        if (materialSymbol) {
            const iconText = materialSymbol.innerText;
            text = text.replace(iconText, '').trim();
        }
        // Remove common arrows
        text = text.replace('→', '').replace('arrow_forward', '').trim();

        // Debug log
        console.log('Clicked:', text);

        // Map text to actions/targets
        if (['INIZIAMO', 'CONTINUA', 'Next', 'Start', 'AVANTI'].includes(text.toUpperCase())) {
            const current = getCurrentScreen();
            if (flow[current]) {
                navigate(flow[current]);
            }
        }
        // Handle Onboarding 2 language selection
        else if (text === 'English' || text === 'Italiano') {
            navigate('biblos_onboarding_3_of_4');
        }
        // Handle other specific text if needed
    });
});

// Expose navigate for other scripts
window.router = { navigate, flow };
