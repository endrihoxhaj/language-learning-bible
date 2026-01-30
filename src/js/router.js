document.addEventListener('DOMContentLoaded', () => {
    console.log('Router initialized');

    const flow = {
        '/index.html': '/views/biblos_onboarding_1_of_4.html',
        '/views/biblos_onboarding_1_of_4.html': '/views/biblos_onboarding_2_of_4.html',
        '/views/biblos_onboarding_2_of_4.html': '/views/biblos_onboarding_3_of_4.html',
        '/views/biblos_onboarding_3_of_4.html': '/views/biblos_onboarding_4_of_4.html',
        '/views/biblos_onboarding_4_of_4.html': '/views/biblos_placement_test.html',
        '/views/biblos_placement_test.html': '/views/biblos_tutor_selection.html',
        '/views/biblos_tutor_selection.html': '/views/biblos_home_dashboard.html',

        // Lesson Flow (Simplified)
        '/views/biblos_lesson__tutor_speaking.html': '/views/biblos_lesson__user_speaking.html',
        '/views/biblos_lesson__user_speaking.html': '/views/biblos_lesson_feedback__correct.html', // Default success path
        '/views/biblos_lesson_feedback__correct.html': '/views/biblos_lesson_recap.html',
        '/views/biblos_lesson_feedback__correction.html': '/views/biblos_lesson_recap.html',
        '/views/biblos_lesson_recap.html': '/views/biblos_home_dashboard.html',
    };

    // Auto-advance splash screen
    if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
        setTimeout(() => {
            handleNavigation('/views/biblos_onboarding_1_of_4.html');
        }, 3000);
    }

    document.body.addEventListener('click', (e) => {
        const target = e.target.closest('button, a, [role="button"], .clickable, .cursor-pointer');

        if (!target) return;

        // Preserve default behavior for inputs
        if (target.querySelector('input, label, select, textarea')) {
            return;
        }

        // Handle Back Button
        if (target.textContent.includes('arrow_back') || target.querySelector('.material-symbols-outlined')?.textContent.includes('arrow_back')) {
            e.preventDefault();
            window.history.back();
            return;
        }

        // 1. Check data-nav-target
        const navTarget = target.getAttribute('data-nav-target');
        if (navTarget) {
            e.preventDefault();
            handleNavigation(navTarget);
            return;
        }

        // 2. Text Matching
        const cleanText = getCleanText(target).toUpperCase();

        if (cleanText.includes('INIZIAMO')) {
             e.preventDefault();
             handleNavigation('/views/biblos_onboarding_2_of_4.html');
             return;
        }
        if (cleanText.includes('CONTINUA')) {
             e.preventDefault();
             if (window.location.pathname.includes('onboarding_3')) {
                 handleNavigation('/views/biblos_onboarding_4_of_4.html');
             } else {
                 navigateNext();
             }
             return;
        }
        if (cleanText.includes('INIZIA IL TEST')) {
            e.preventDefault();
            handleNavigation('/views/biblos_placement_test.html');
            return;
        }
        if (cleanText.includes('ENGLISH') || cleanText.includes('ITALIANO')) {
            if (window.location.pathname.includes('onboarding_2')) {
                e.preventDefault();
                handleNavigation('/views/biblos_onboarding_3_of_4.html');
                return;
            }
        }

        // Generic handling for screens where any main action leads to next
        if (window.location.pathname.includes('biblos_tutor_selection')) {
             e.preventDefault();
             handleNavigation('/views/biblos_home_dashboard.html');
             return;
        }

        if (window.location.pathname.includes('biblos_placement_test')) {
             // Assume any button continues (e.g. submitting answer)
             // But we might want to be more specific.
             // For now, if it's not handled above, try navigateNext
             e.preventDefault();
             navigateNext();
             return;
        }
    });

    function getCleanText(element) {
        const clone = element.cloneNode(true);
        const icons = clone.querySelectorAll('.material-symbols-outlined');
        icons.forEach(i => i.remove());
        return clone.textContent.trim();
    }

    function navigateNext() {
        const currentPath = window.location.pathname;
        let nextPath = null;

        // Direct match
        if (flow[currentPath]) {
            nextPath = flow[currentPath];
        } else {
            // Suffix match
            const key = Object.keys(flow).find(k => currentPath.endsWith(k));
            if (key) {
                nextPath = flow[key];
            }
        }

        if (nextPath) {
            handleNavigation(nextPath);
        } else {
            console.warn('No flow defined for', currentPath);
        }
    }

    window.handleNavigation = (path) => {
        // Ensure absolute path
        if (!path.startsWith('/')) {
            path = '/' + path;
        }
        window.location.href = path;
    };
});
