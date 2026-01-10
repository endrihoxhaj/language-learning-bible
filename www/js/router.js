const Router = {
    routes: {
        '/': 'biblos_splash_screen',
        '/onboarding/1': 'biblos_onboarding_1_of_4',
        '/onboarding/2': 'biblos_onboarding_2_of_4',
        '/onboarding/3': 'biblos_onboarding_3_of_4',
        '/onboarding/4': 'biblos_onboarding_4_of_4',
        '/tutor-selection': 'biblos_tutor_selection',
        '/study-plans': 'biblos_study_plans',
        '/placement-test': 'biblos_placement_test',
        '/home': 'biblos_home_dashboard',
        '/lesson/tutor-speaking': 'biblos_lesson__tutor_speaking',
        '/lesson/user-speaking': 'biblos_lesson__user_speaking',
        '/lesson/feedback-correct': 'biblos_lesson_feedback__correct',
        '/lesson/feedback-correction': 'biblos_lesson_feedback__correction',
        '/lesson/recap': 'biblos_lesson_recap',
        '/vocabulary-review': 'biblos_vocabulary_review',
        '/progress': 'statistics', // mapped to statistics.html
        '/settings': 'biblos_settings_screen',
    },

    init: function() {
        window.addEventListener('hashchange', () => this.handleHashChange());
        this.handleHashChange();
    },

    handleHashChange: function() {
        let hash = window.location.hash.slice(1) || '/';
        this.loadRoute(hash);
    },

    loadRoute: async function(path) {
        console.log('Navigating to', path);
        const viewName = this.routes[path];
        if (!viewName) {
            console.error('Route not found:', path);
            return;
        }

        try {
            const response = await fetch(`views/${viewName}.html`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const html = await response.text();

            // Fade out effect (optional, simplified for now)
            const app = document.getElementById('app');
            app.innerHTML = html;

            // Trigger page logic
            if (window.App && window.App.onRouteChanged) {
                window.App.onRouteChanged(path);
            }
        } catch (e) {
            console.error('Failed to load view:', e);
        }
    },

    navigate: function(path) {
        window.location.hash = path;
    }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    Router.init();
});
