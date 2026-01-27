document.addEventListener('DOMContentLoaded', () => {
    console.log("Router initialized");

    const interactiveSelector = 'button, a, [role="button"], .clickable, .cursor-pointer';

    document.body.addEventListener('click', (event) => {
        const target = event.target.closest(interactiveSelector);
        if (!target) return;

        // Preserve default behavior for inputs
        if (event.target.closest('input, label, select, textarea')) return;

        event.preventDefault();

        // 1. Check data-nav-target
        const navTarget = target.getAttribute('data-nav-target');
        if (navTarget) {
            console.log(`Navigating to target: ${navTarget}`);
            window.location.href = navTarget.startsWith('/') ? navTarget : `/views/${navTarget}.html`;
            return;
        }

        // 2. Check for arrow_back icon
        if (target.textContent.includes('arrow_back') || target.querySelector('.material-symbols-outlined')?.textContent.includes('arrow_back')) {
            console.log("Back navigation triggered");
            window.history.back();
            return;
        }

        // 3. Check text content (heuristics)
        let text = target.innerText;
        // Remove material icons text
        const icon = target.querySelector('.material-symbols-outlined');
        if (icon) {
             text = text.replace(icon.innerText, '');
        }
        text = text.trim().toUpperCase();

        console.log(`Clicked text: ${text}`);

        if (text === 'INIZIAMO' || text === 'INIZIA') {
             window.location.href = '/views/biblos_onboarding_1_of_4.html';
        } else if (text === 'CONTINUA') {
            // Contextual navigation - crude implementation based on current path
            const currentPath = window.location.pathname;
            if (currentPath.includes('onboarding_1')) window.location.href = '/views/biblos_onboarding_2_of_4.html';
            else if (currentPath.includes('onboarding_2')) window.location.href = '/views/biblos_onboarding_3_of_4.html';
            else if (currentPath.includes('onboarding_3')) window.location.href = '/views/biblos_onboarding_4_of_4.html';
            else if (currentPath.includes('onboarding_4')) window.location.href = '/views/biblos_placement_test.html'; // Or placement test
            else if (currentPath.includes('placement_test')) window.location.href = '/views/biblos_tutor_selection.html';
             else if (currentPath.includes('tutor_selection')) window.location.href = '/views/biblos_home_dashboard.html';
            else {
                // Default fallback
                console.warn("CONTINUA clicked but unknown context");
            }
        } else if (text === 'VOCABOLARIO') {
             window.location.href = '/views/biblos_vocabulary_review.html';
        } else if (text === 'INIZIA IL TEST') {
             window.location.href = '/views/biblos_placement_test.html';
        }

        // 4. Icon heuristics
        // If the button contains a mic icon, trigger user speaking
        if (target.textContent.includes('mic') || target.querySelector('.material-symbols-outlined')?.textContent.includes('mic')) {
             if (window.LessonController) {
                 window.LessonController.startUserSpeaking();
             }
        }
    });
});
