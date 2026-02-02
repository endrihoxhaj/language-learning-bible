
window.onload = function() {
    console.log("Router loaded");

    // Flow configuration
    const flow = {
        'biblos_splash_screen.html': 'biblos_onboarding_1_of_4.html',
        'biblos_onboarding_1_of_4.html': 'biblos_onboarding_2_of_4.html',
        'biblos_onboarding_2_of_4.html': 'biblos_onboarding_3_of_4.html',
        'biblos_onboarding_3_of_4.html': 'biblos_onboarding_4_of_4.html',
        'biblos_onboarding_4_of_4.html': 'biblos_placement_test.html',
        'biblos_placement_test.html': 'biblos_tutor_selection.html',
        'biblos_tutor_selection.html': 'biblos_home_dashboard.html',
        // Lesson flow
        'biblos_lesson__tutor_speaking.html': 'biblos_lesson__user_speaking.html',
        'biblos_lesson__user_speaking.html': 'biblos_lesson_feedback__correct.html',
        'biblos_lesson_feedback__correct.html': 'biblos_lesson_recap.html',
        'biblos_lesson_feedback__correction.html': 'biblos_lesson_recap.html',
        'biblos_lesson_recap.html': 'biblos_home_dashboard.html'
    };

    // Auto-navigation for splash screen
    if (window.location.pathname.includes('biblos_splash_screen') || window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
        setTimeout(() => {
            navigateTo('biblos_onboarding_1_of_4.html');
        }, 3000);
    }

    // Event Delegation
    document.addEventListener('click', function(e) {
        let target = e.target.closest('button, a, [role="button"], .clickable, .cursor-pointer');

        if (!target) return;

        // Skip input/label/select/textarea
        if (target.matches('input, label, select, textarea') || target.querySelector('input, label, select, textarea')) {
             if (target.querySelector('input, label, select, textarea')) {
                 return;
             }
        }

        // Handle Back Button
        if (target.textContent.trim() === 'arrow_back' || target.querySelector('.material-symbols-outlined')?.textContent.trim() === 'arrow_back') {
            window.history.back();
            return;
        }

        // 1. Check data-nav-target
        const navTarget = target.getAttribute('data-nav-target');
        if (navTarget) {
            navigateTo(navTarget);
            return;
        }

        // 2. Check Text Content
        // Clone to remove icons for text extraction
        const clone = target.cloneNode(true);
        clone.querySelectorAll('.material-symbols-outlined').forEach(el => el.remove());
        const text = clone.textContent.trim().replace('→', '').trim(); // Remove arrow if present

        console.log("Clicked:", text);

        if (text === 'INIZIAMO') {
            navigateTo('biblos_onboarding_2_of_4.html');
            return;
        }

        if (text === 'English' || text === 'Italiano') {
             navigateTo('biblos_onboarding_3_of_4.html');
             return;
        }

        if (text === 'CONTINUA') {
            // Determine next step based on current page
            const currentPath = window.location.pathname.split('/').pop();
            const nextScreen = flow[currentPath];
            if (nextScreen) {
                navigateTo(nextScreen);
            }
            return;
        }

        if (target.classList.contains('cursor-not-allowed')) return;

        // Fallback: check flow for generic next step
        // Only if it's a button that looks like a primary action?
        // Or if it's NOT a back button (already handled).
        // Let's rely on flow map for any other clicked button?
        // This might be risky if there are other buttons (e.g. settings).
        // But for linear flows it works.
        // For now, let's assume if we clicked a button and haven't handled it, and there is a flow entry, we go there.

        const currentPath = window.location.pathname.split('/').pop();
        if (flow[currentPath]) {
             // Maybe verify if it's a "next" button?
             // Onboarding 3 has radio buttons. Clicking them shouldn't navigate.
             // But the event listener is on `button` (and others). The radio buttons are `label`.
             // `label` is not in my selector list `button, a, [role="button"], .clickable, .cursor-pointer`.
             // Wait, Onboarding 3 labels have `cursor-pointer`?
             // "cursor-pointer" class IS in the selector.
             // So clicking a radio option (label with cursor-pointer) WILL trigger this.
             // I should NOT navigate on radio options.

             if (target.tagName === 'LABEL' || target.querySelector('input[type="radio"]')) {
                 return;
             }

             navigateTo(flow[currentPath]);
        }

    });

    function navigateTo(screenName) {
        if (!screenName) return;
        if (!screenName.endsWith('.html') && !screenName.endsWith('/')) {
             screenName += '.html';
        }

        let path = screenName;
        if (!path.startsWith('/')) {
            path = '/views/' + path;
        }

        console.log("Navigating to:", path);
        window.location.href = path;
    }
};
