document.addEventListener('DOMContentLoaded', () => {
    console.log('Router loaded');

    const flow = {
        'biblos_splash_screen.html': '/views/biblos_onboarding_1_of_4.html',
        'biblos_onboarding_1_of_4.html': '/views/biblos_onboarding_2_of_4.html',
        'biblos_onboarding_2_of_4.html': '/views/biblos_onboarding_3_of_4.html',
        'biblos_onboarding_3_of_4.html': '/views/biblos_onboarding_4_of_4.html',
        'biblos_onboarding_4_of_4.html': '/views/biblos_placement_test.html',
        'biblos_placement_test.html': '/views/biblos_tutor_selection.html',
        'biblos_tutor_selection.html': '/views/biblos_home_dashboard.html',
        // Lesson flow
        'biblos_lesson__tutor_speaking.html': '/views/biblos_lesson__user_speaking.html',
        'biblos_lesson__user_speaking.html': '/views/biblos_lesson_feedback__correction.html',
        'biblos_lesson_feedback__correction.html': '/views/biblos_lesson_recap.html',
        'biblos_lesson_feedback__correct.html': '/views/biblos_lesson_recap.html',
        'biblos_lesson_recap.html': '/views/biblos_home_dashboard.html'
    };

    const textToRoute = {
        'INIZIAMO': '/views/biblos_onboarding_1_of_4.html',
        'INIZIA LEZIONE': '/views/biblos_lesson__tutor_speaking.html',
        'Home': '/views/biblos_home_dashboard.html',
        'Lezioni': '/views/biblos_study_plans.html',
        'Progressi': '/views/biblos_progress.html',
        'Profilo': '/views/biblos_profile.html',
        'Vocabolario': '/views/biblos_vocabulary_review.html',
        'Impostazioni': '/views/biblos_settings_screen.html',
        'Annulla': '/views/biblos_lesson__tutor_speaking.html',
        'Riprova': '/views/biblos_lesson__tutor_speaking.html' // Retry
    };

    function getFileName() {
        const path = window.location.pathname;
        return path.substring(path.lastIndexOf('/') + 1);
    }

    const currentFile = getFileName();

    // Auto-advance splash screen
    if (currentFile === 'biblos_splash_screen.html' || currentFile === 'index.html' || (currentFile === '' && window.location.pathname.endsWith('/'))) {
         if (document.title.includes('Splash')) {
             setTimeout(() => {
                window.location.href = '/views/biblos_onboarding_1_of_4.html';
             }, 3000);
         }
    }

    document.body.addEventListener('click', (e) => {
        let target = e.target.closest('button, a, [role="button"], .clickable, .cursor-pointer');

        if (e.target.tagName === 'INPUT' || e.target.tagName === 'LABEL' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
            return;
        }

        if (!target) return;

        // 1. Check data-nav-target
        if (target.dataset.navTarget) {
            window.location.href = target.dataset.navTarget;
            return;
        }

        // 2. Check for arrow_back
        if (target.textContent.includes('arrow_back') || target.querySelector('.material-symbols-outlined')?.textContent.includes('arrow_back')) {
             window.history.back();
             return;
        }

        // 3. Specific Logic for Lesson interactions
        const icon = target.querySelector('.material-symbols-outlined')?.textContent.trim();

        // Mic button in tutor speaking -> User speaking
        if (currentFile.includes('biblos_lesson__tutor_speaking') && (icon === 'mic' || target.textContent.includes('parlare'))) {
            window.location.href = '/views/biblos_lesson__user_speaking.html';
            return;
        }

        // Stop/Send button in user speaking -> Feedback
        if (currentFile.includes('biblos_lesson__user_speaking') && (target.classList.contains('mic-pulse') || target.querySelector('.mic-pulse') || target.querySelector('div.bg-white.w-8'))) {
            window.location.href = '/views/biblos_lesson_feedback__correction.html';
            return;
        }

        // 4. Check text content
        const clone = target.cloneNode(true);
        const icons = clone.querySelectorAll('.material-symbols-outlined');
        icons.forEach(i => i.remove());
        const text = clone.textContent.trim();

        if (textToRoute[text]) {
            e.preventDefault();
            window.location.href = textToRoute[text];
            return;
        }

        // 5. Check flow based on current page
        if (flow[currentFile] && (text.toUpperCase() === 'CONTINUA' || text.toUpperCase() === 'INIZIAMO' || text.toUpperCase() === 'AVANTI' || text.toUpperCase() === 'VAI' || text.toUpperCase() === 'NEXT')) {
            e.preventDefault();
            window.location.href = flow[currentFile];
            return;
        }

        // 6. Default link behavior
        if (target.tagName === 'A' && target.href) {
            return;
        }

        console.log('Clicked button/link:', text);
    });
});
