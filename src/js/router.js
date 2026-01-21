document.addEventListener('DOMContentLoaded', () => {
    // Helper to get text content ignoring icons
    const getCleanText = (element) => {
        const clone = element.cloneNode(true);
        const icons = clone.querySelectorAll('.material-symbols-outlined');
        icons.forEach(icon => icon.remove());
        return clone.innerText.trim();
    };

    // Handle clicks
    document.body.addEventListener('click', (e) => {
        const button = e.target.closest('button') || e.target.closest('div[role="button"]') || e.target.closest('a');
        if (!button) return;

        // 1. Check for explicit data-nav-target
        if (button.dataset.navTarget) {
             window.location.href = button.dataset.navTarget;
             return;
        }

        // 2. Fallback to Text matching
        const text = getCleanText(button).toUpperCase();

        // Navigation Logic based on text content
        if (text.includes('INIZIA')) {
            window.location.href = '/views/biblos_tutor_selection.html';
        } else if (text.includes('VOCABOLARIO')) {
            window.location.href = '/views/biblos_vocabulary_review.html';
        } else if (text.includes('CHAT LIBERA')) {
            window.location.href = '/views/biblos_lesson__tutor_speaking.html'; // Start a chat
        } else if (text.includes('PROGRESSI')) {
            window.location.href = '/views/biblos_progress.html';
        } else if (text.includes('HOME')) {
            window.location.href = '/views/biblos_home_dashboard.html';
        } else if (text.includes('LEZIONI')) {
            window.location.href = '/views/biblos_study_plans.html';
        } else if (text.includes('PROFILO')) {
            window.location.href = '/views/biblos_profile.html';
        } else if (text.includes('CONTINUA') || text.includes('PROSEGUI')) {
             // Context dependent logic
             if (window.location.href.includes('onboarding_1')) window.location.href = '/views/biblos_onboarding_2_of_4.html';
             else if (window.location.href.includes('onboarding_2')) window.location.href = '/views/biblos_onboarding_3_of_4.html';
             else if (window.location.href.includes('onboarding_3')) window.location.href = '/views/biblos_onboarding_4_of_4.html';
             else if (window.location.href.includes('onboarding_4')) window.location.href = '/views/biblos_home_dashboard.html';
             else if (window.location.href.includes('tutor_selection')) window.location.href = '/views/biblos_lesson__tutor_speaking.html';
        }

        // Handle Icon-only buttons or specific classes
        if (button.querySelector('span.material-symbols-outlined')) {
             const iconText = button.querySelector('span.material-symbols-outlined').innerText;
             if (iconText === 'arrow_back') {
                 window.history.back();
             }
        }
    });
});
