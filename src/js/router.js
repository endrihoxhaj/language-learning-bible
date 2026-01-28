document.addEventListener('DOMContentLoaded', () => {
    console.log('Router initialized');

    // --- Navigation Flow Configuration ---
    const flow = {
        'biblos_onboarding_1_of_4': 'biblos_onboarding_2_of_4',
        'biblos_onboarding_2_of_4': 'biblos_onboarding_3_of_4',
        'biblos_onboarding_3_of_4': 'biblos_onboarding_4_of_4',
        'biblos_onboarding_4_of_4': 'biblos_placement_test',
        'biblos_placement_test': 'biblos_tutor_selection',
        'biblos_tutor_selection': 'biblos_home_dashboard',
        'biblos_lesson_feedback__correct': 'biblos_lesson_recap',
        'biblos_lesson_recap': 'biblos_home_dashboard'
    };

    // --- Helper to get current page name ---
    const getCurrentPage = () => {
        const path = window.location.pathname;
        const page = path.split('/').pop().replace('.html', '');
        return page || 'index';
    };

    // --- Navigation Function ---
    window.navigateTo = (pageName) => {
        console.log(`Navigating to ${pageName}`);
        // Handle root path or already in views
        if (pageName === 'index') {
             window.location.href = '/index.html';
             return;
        }

        const target = `/views/${pageName}.html`;
        window.location.href = target;
    };

    // --- Splash Screen Auto-Redirect ---
    const currentPage = getCurrentPage();
    if (currentPage === 'index' || currentPage === '') {
        console.log('Splash screen detected, starting timer...');
        setTimeout(() => {
            window.navigateTo('biblos_onboarding_1_of_4');
        }, 3000);
        return; // Stop further processing
    }

    // --- Click Handler ---
    document.body.addEventListener('click', (e) => {
        // Find closest clickable element
        const target = e.target.closest('button, a, div[role="button"], .clickable');
        if (!target) return;

        // Skip if specifically excluded or likely interactive input
        if (target.closest('input, textarea, select')) return;

        // Prevent default only if we are handling it
        // e.preventDefault(); // Careful with this, might break normal links

        // 1. Check data-nav-target
        if (target.dataset.navTarget) {
            e.preventDefault();
            window.navigateTo(target.dataset.navTarget);
            return;
        }

        // 2. Check for Back Button (Icon)
        const icon = target.querySelector('.material-symbols-outlined') || (target.classList.contains('material-symbols-outlined') ? target : null);
        if (icon && icon.textContent.trim() === 'arrow_back') {
             e.preventDefault();
             window.history.back();
             return;
        }

        // 3. Text Content Matching
        // Clone and remove icons to get clean text
        const clone = target.cloneNode(true);
        clone.querySelectorAll('.material-symbols-outlined').forEach(el => el.remove());
        const text = clone.textContent.trim().toUpperCase();

        console.log(`Clicked: ${text}`);

        if (text.includes('INIZIAMO') || text.includes('CONTINUA') || text.includes('INIZIA LEZIONE') || text === 'NEXT') {
            e.preventDefault();
            if (text.includes('INIZIA LEZIONE')) {
                 window.navigateTo('biblos_lesson__tutor_speaking');
            } else if (flow[currentPage]) {
                window.navigateTo(flow[currentPage]);
            }
            return;
        }

        if (text.includes('INIZIA IL TEST')) {
            e.preventDefault();
            window.navigateTo('biblos_placement_test');
            return;
        }

        if (text.includes('VOCABOLARIO')) {
             e.preventDefault();
             window.navigateTo('biblos_vocabulary_review');
             return;
        }

        // Bottom Nav text matching
        if (text.includes('PROGRESSI')) {
             e.preventDefault();
             window.navigateTo('biblos_progress');
             return;
        }
        if (text.includes('PROFILO')) {
             e.preventDefault();
             window.navigateTo('biblos_profile');
             return;
        }
        if (text.includes('LEZIONI')) {
             e.preventDefault();
             window.navigateTo('biblos_study_plans');
             return;
        }
        if (text.includes('HOME')) {
             e.preventDefault();
             window.navigateTo('biblos_home_dashboard');
             return;
        }

        // 4. Icon Matching (Mic is handled by LessonController usually, but fallback here)
        // If the Lesson Controller is loaded, it should have attached a listener.
        // We shouldn't interfere if it's not a navigation event.
    });
});
