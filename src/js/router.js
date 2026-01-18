class Router {
    constructor() {
        this.init();
    }

    init() {
        // Attach event listeners to all clickable elements that look like navigation
        document.addEventListener('click', (e) => {
            let target = e.target;

            // Traverse up to find button or anchor
            while (target && target.tagName !== 'BUTTON' && target.tagName !== 'A' && target.tagName !== 'DIV') {
                target = target.parentElement;
                if (!target) return;
            }

            if (!target) return;

            // Simple heuristic for navigation based on text content
            const text = target.innerText.trim().toUpperCase();

            // Handle Icon-only buttons (heuristic)
            const icon = target.querySelector('.material-symbols-outlined');
            const iconName = icon ? icon.innerText.trim() : '';

            // Handle specific navigation logic
            if (this.shouldNavigate(text, iconName)) {
                // e.preventDefault(); // Might not need this if we are just redirecting
                const nextRoute = this.getNextRoute(text, iconName);
                if (nextRoute) {
                    window.location.href = nextRoute;
                }
            }
        });
    }

    shouldNavigate(text, iconName) {
        // Expanded keywords to include Italian terms found in designs
        const keywords = [
            'CONTINUA', 'INIZIAMO', 'INIZIA', 'LOGIN', 'SIGN UP', 'PROFILE', 'HOME', 'START', 'NEXT', 'BACK',
            'LEZIONI', 'PROGRESSI', 'PROFILO', 'CHAT LIBERA', 'VOCABOLARIO', 'PIANI DI STUDIO'
        ];
        const icons = ['arrow_back', 'close', 'person', 'settings', 'home', 'book_2', 'emoji_events', 'menu_book', 'bolt', 'forum', 'edit_note', 'arrow_forward'];

        return keywords.some(k => text.includes(k)) || icons.includes(iconName);
    }

    getNextRoute(text, iconName) {
        const currentPath = window.location.pathname;

        // GLOBAL NAVIGATION (Bottom Bar & Headers)
        if (iconName === 'arrow_back') {
            return 'javascript:history.back()';
        }
        if (text.includes('HOME') || iconName === 'home') return 'biblos_home_dashboard.html';
        if (text.includes('PROFILO') || text.includes('PROFILE') || iconName === 'person') return 'biblos_profile.html';
        if (text.includes('PROGRESSI') || text.includes('PROGRESS') || iconName === 'emoji_events' || iconName === 'bar_chart') return 'biblos_progress.html';
        if (text.includes('LEZIONI') || text.includes('LESSONS') || iconName === 'book_2' || iconName === 'school') return 'biblos_study_plans.html';
        if (iconName === 'settings') return 'biblos_settings_screen.html';

        // SPLASH SCREEN -> ONBOARDING
        if (currentPath.includes('biblos_splash_screen')) {
             return 'biblos_onboarding_1_of_4.html';
        }

        // ONBOARDING FLOW
        if (currentPath.includes('biblos_onboarding_1_of_4')) return 'biblos_onboarding_2_of_4.html';
        if (currentPath.includes('biblos_onboarding_2_of_4')) return 'biblos_onboarding_3_of_4.html';
        if (currentPath.includes('biblos_onboarding_3_of_4')) return 'biblos_onboarding_4_of_4.html';
        if (currentPath.includes('biblos_onboarding_4_of_4')) return 'biblos_tutor_selection.html';

        // TUTOR SELECTION -> PLACEMENT TEST (or HOME)
        if (currentPath.includes('biblos_tutor_selection')) return 'biblos_placement_test.html';

        // PLACEMENT TEST -> HOME
        if (currentPath.includes('biblos_placement_test')) return 'biblos_home_dashboard.html';

        // HOME DASHBOARD NAVIGATION
        if (currentPath.includes('biblos_home_dashboard')) {
            if (text.includes('INIZIA LEZIONE') || text.includes('START') || text.includes('CONTINUE')) {
                return 'biblos_lesson__tutor_speaking.html';
            }
            if (text.includes('VOCABOLARIO') || iconName === 'edit_note') return 'biblos_vocabulary_review.html';
            if (text.includes('CHAT LIBERA') || iconName === 'forum') return 'biblos_lesson__tutor_speaking.html'; // Assuming Chat leads to a lesson-like interface
        }

        // STUDY PLANS
        if (currentPath.includes('biblos_study_plans')) {
            if (text.includes('CONTINUA') || iconName === 'arrow_forward') return 'biblos_lesson__tutor_speaking.html';
            // Specific cards might lead to lessons too, default to standard lesson for now
        }

        // VOCABULARY REVIEW
        if (currentPath.includes('biblos_vocabulary_review')) {
             // Logic to next flashcard or finish?
             // For now, let's say "CONTINUAMO" or "BRAVO" leads to Home or Next.
             if (text.includes('CONTINUIAMO') || text.includes('CONTINUA')) return 'biblos_home_dashboard.html';
        }

        // LESSON FLOW
        // Tutor Speaking -> User Speaking
        if (currentPath.includes('biblos_lesson__tutor_speaking')) {
             // Mic button triggers recording (handled in lesson_controller), but clicking it might also navigate for prototype
             if (iconName === 'mic') return 'biblos_lesson__user_speaking.html';
        }

        // User Speaking -> Feedback (simulated)
        if (currentPath.includes('biblos_lesson__user_speaking')) {
            // Simulate random success/correction for demo
             if (iconName === 'mic' || iconName === 'stop') {
                 return Math.random() > 0.5 ? 'biblos_lesson_feedback__correct.html' : 'biblos_lesson_feedback__correction.html';
             }
        }

        // Feedback -> Next part or Recap
        if (currentPath.includes('biblos_lesson_feedback')) {
            if (text.includes('CONTINUA') || text.includes('NEXT')) return 'biblos_lesson_recap.html';
            // Fallback for any click
            return 'biblos_lesson_recap.html';
        }

        // Recap -> Home
        if (currentPath.includes('biblos_lesson_recap')) {
             if (text.includes('HOME') || text.includes('DASHBOARD') || text.includes('CONTINUA')) return 'biblos_home_dashboard.html';
        }

        return null;
    }
}

// Initialize Router
new Router();
