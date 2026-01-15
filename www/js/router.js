const Router = {
    containerId: 'app-container',
    currentView: null,

    // Explicit mappings for common terms
    routes: {
        'home': 'biblos_home_dashboard.html',
        'lezioni': 'biblos_study_plans.html',
        'progressi': 'biblos_progress.html',
        'profilo': 'biblos_profile.html',
        'inizia lezione': 'biblos_lesson__tutor_speaking.html',
        'vocabolario': 'biblos_vocabulary_review.html',
        'impostazioni': 'biblos_settings_screen.html',
        'chat libera': 'biblos_tutor_selection.html', // Guessing
        'iniziamo': 'biblos_onboarding_1_of_4.html',
        'continua': 'next_step', // Context dependent
    },

    // Contextual flows
    flows: {
        'onboarding': [
            'biblos_onboarding_1_of_4.html',
            'biblos_onboarding_2_of_4.html',
            'biblos_onboarding_3_of_4.html',
            'biblos_onboarding_4_of_4.html',
            'biblos_tutor_selection.html',
            'biblos_placement_test.html',
            'biblos_home_dashboard.html'
        ],
        'lesson': [
            'biblos_lesson__tutor_speaking.html',
            'biblos_lesson__user_speaking.html',
            'biblos_lesson_feedback__correct.html', // or correction
            'biblos_lesson_recap.html',
            'biblos_home_dashboard.html'
        ]
    },

    init: function() {
        console.log('Router initialized');
        // Start with Splash Screen
        this.loadView('biblos_splash_screen.html');

        // Setup global click listener
        document.body.addEventListener('click', (e) => {
            const target = e.target.closest('button, a, .clickable');
            if (target) {
                this.handleNavigation(target);
            }
        });

        // Splash screen timeout
        setTimeout(() => {
            if (this.currentView === 'biblos_splash_screen.html') {
                this.loadView('biblos_onboarding_1_of_4.html');
            }
        }, 3000);
    },

    loadView: async function(viewName) {
        console.log('Loading view:', viewName);
        try {
            const response = await fetch(`views/${viewName}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const html = await response.text();

            const container = document.getElementById(this.containerId);
            container.innerHTML = html;
            this.currentView = viewName;

            // Execute scripts if any (simplified)
            // Note: innerHTML doesn't execute scripts.
            // We might need to manually handle specific view logic here or in LessonController.
            if (window.LessonController) {
                window.LessonController.start(viewName);
            }

            // Re-initialize Tailwind or icons if needed (usually handled by CSS)

        } catch (e) {
            console.error('Failed to load view:', e);
        }
    },

    handleNavigation: function(element) {
        // 1. Extract text content (ignoring icons)
        let text = this.extractText(element).toLowerCase();
        let icon = this.extractIcon(element);

        console.log(`Navigating: text="${text}", icon="${icon}"`);

        // Check explicit routes
        if (this.routes[text]) {
            const dest = this.routes[text];
            if (dest === 'next_step') {
                this.handleNextStep();
            } else {
                this.loadView(dest);
            }
            return;
        }

        // Icon based navigation
        if (icon) {
            if (icon === 'home') this.loadView('biblos_home_dashboard.html');
            if (icon === 'book_2' || icon === 'school') this.loadView('biblos_study_plans.html');
            if (icon === 'emoji_events' || icon === 'bar_chart') this.loadView('biblos_progress.html');
            if (icon === 'person') this.loadView('biblos_profile.html');
            if (icon === 'settings') this.loadView('biblos_settings_screen.html');
            if (icon === 'arrow_back') this.handleBack();
        }

        // Fallback or specific logic
        if (text.includes('placement test')) {
            this.loadView('biblos_placement_test.html');
        }
    },

    extractText: function(element) {
        // Clone to not modify DOM
        let clone = element.cloneNode(true);
        // Remove icons
        clone.querySelectorAll('.material-symbols-outlined').forEach(e => e.remove());
        return clone.textContent.trim();
    },

    extractIcon: function(element) {
        const iconEl = element.querySelector('.material-symbols-outlined');
        return iconEl ? iconEl.textContent.trim() : null;
    },

    handleNextStep: function() {
        // Simple sequential flow logic
        if (this.currentView.includes('onboarding')) {
            const idx = this.flows.onboarding.indexOf(this.currentView);
            if (idx !== -1 && idx < this.flows.onboarding.length - 1) {
                this.loadView(this.flows.onboarding[idx + 1]);
            }
        } else if (this.currentView.includes('lesson')) {
             const idx = this.flows.lesson.indexOf(this.currentView);
            if (idx !== -1 && idx < this.flows.lesson.length - 1) {
                this.loadView(this.flows.lesson[idx + 1]);
            }
        }
    },

    handleBack: function() {
        // Simple back logic or default to Home
        this.loadView('biblos_home_dashboard.html');
    }
};

window.Router = Router;
