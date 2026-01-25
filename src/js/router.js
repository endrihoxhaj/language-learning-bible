document.addEventListener('DOMContentLoaded', () => {
    // Splash screen auto-navigation
    if (document.title.includes('Splash') || window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('biblos_splash_screen.html')) {
        setTimeout(() => {
            navigateTo('biblos_onboarding_1_of_4');
        }, 3000);
    }

    document.body.addEventListener('click', (e) => {
        let target = e.target;

        while (target && target !== document.body) {

            // 1. Preserve default behavior for inputs
            if (['INPUT', 'LABEL', 'SELECT', 'TEXTAREA'].includes(target.tagName)) {
                return;
            }

            // 2. Explicit navigation target
            const navTarget = target.getAttribute('data-nav-target');
            if (navTarget) {
                e.preventDefault();
                navigateTo(navTarget);
                return;
            }

            // 3. Icon Handling
            const iconText = target.innerText.trim() || target.querySelector('.material-symbols-outlined')?.innerText.trim();

            if (iconText === 'arrow_back') {
                 e.preventDefault();
                 window.history.back();
                 return;
            }

            if (iconText === 'mic') {
                e.preventDefault();
                navigateTo('biblos_lesson__user_speaking');
                return;
            }

            // 4. Text Matching
            const clone = target.cloneNode(true);
            const icons = clone.querySelectorAll('.material-symbols-outlined');
            icons.forEach(i => i.remove());
            const text = clone.textContent.trim().toUpperCase();

            if (text === 'INIZIAMO' || text === 'INIZIA') {
                e.preventDefault();
                navigateTo('biblos_onboarding_2_of_4');
                return;
            }

            if (text === 'CONTINUA' || text === 'AVANTI') {
                e.preventDefault();
                 const path = window.location.pathname;
                 if (path.includes('onboarding_2')) navigateTo('biblos_onboarding_3_of_4');
                 else if (path.includes('onboarding_3')) navigateTo('biblos_onboarding_4_of_4');
                 else if (path.includes('onboarding_4')) navigateTo('biblos_placement_test');
                 else if (path.includes('placement_test')) navigateTo('biblos_tutor_selection');
                 else if (path.includes('tutor_selection')) navigateTo('biblos_home_dashboard');
                 else if (path.includes('feedback')) navigateTo('biblos_lesson_recap');
                 else if (path.includes('recap')) navigateTo('biblos_home_dashboard');
                 return;
            }

            if (text === 'VOCABOLARIO') {
                e.preventDefault();
                navigateTo('biblos_vocabulary_review');
                return;
            }

            if (text === 'PROFILO' || text === 'PROFILE') {
                 e.preventDefault();
                 navigateTo('biblos_profile');
                 return;
            }

            // Fallback for placement test options or tutor selection
            // If the user clicks on an option, we might want to proceed or select.
            // For now, let's assume clicking an option in placement test proceeds.
            if (window.location.pathname.includes('placement_test') && (target.tagName === 'BUTTON' || target.classList.contains('bg-white'))) {
                // Heuristic for options
                // navigateTo('biblos_tutor_selection');
                // Wait, usually there is a continue button.
            }

            target = target.parentElement;
        }
    });
});

function navigateTo(screenName) {
    if (screenName === 'biblos_profile') {
        window.location.href = '/views/biblos_profile.html';
        return;
    }

    if (!screenName.startsWith('/')) {
        window.location.href = `/views/${screenName}.html`;
    } else {
        window.location.href = screenName;
    }
}
