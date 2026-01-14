class Router {
    constructor() {
        this.app = document.getElementById('app');
        this.currentView = null;
        this.routes = {
            'biblos_splash_screen': {
                default: 'biblos_onboarding_1_of_4'
            },
            'biblos_onboarding_1_of_4': {
                'CONTINUA': 'biblos_onboarding_2_of_4',
                'INIZIAMO': 'biblos_onboarding_2_of_4',
                'SALTA': 'biblos_home_dashboard'
            },
            'biblos_onboarding_2_of_4': {
                'English': 'biblos_onboarding_3_of_4',
                'Italiano': 'biblos_onboarding_3_of_4'
            },
            'biblos_onboarding_3_of_4': {
                'CONTINUA': 'biblos_onboarding_4_of_4',
                'CONTINUA →': 'biblos_onboarding_4_of_4'
            },
            'biblos_onboarding_4_of_4': {
                'VAI ALLA HOME': 'biblos_home_dashboard',
                'INIZIA': 'biblos_home_dashboard',
                'INIZIAMO': 'biblos_home_dashboard',
                'CONTINUA': 'biblos_home_dashboard',
                'Inizia il Test': 'biblos_placement_test',
                'INIZIA IL TEST': 'biblos_placement_test'
            },
            'biblos_placement_test': {
                'arrow_forward': 'biblos_home_dashboard',
                'close': 'biblos_home_dashboard'
            },
            'biblos_home_dashboard': {
                'INIZIA LEZIONE': 'biblos_tutor_selection',
                'Vocabolario': 'biblos_vocabulary_review',
                'Chat Libera': 'biblos_tutor_selection'
            },
            'biblos_tutor_selection': {
                'CONFERMA SCELTA': 'biblos_lesson__tutor_speaking',
                'Scegli': 'biblos_lesson__tutor_speaking'
            },
            'biblos_lesson__tutor_speaking': {
                'mic': 'biblos_lesson__user_speaking',
                'TOCCA PER PARLARE': 'biblos_lesson__user_speaking'
            },
            'biblos_lesson__user_speaking': {
                'STOP_BUTTON': 'biblos_lesson_feedback__correct', // Mapped via special logic
                'Stop': 'biblos_lesson_feedback__correct',
                'Invia': 'biblos_lesson_feedback__correct'
            },
            'biblos_lesson_feedback__correct': {
                'CONTINUA': 'biblos_lesson_recap'
            },
            'biblos_lesson_feedback__correction': {
                'RIPROVA': 'biblos_lesson__user_speaking',
                'CONTINUA': 'biblos_lesson_recap'
            },
            'biblos_lesson_recap': {
                'TORNA ALLA HOME': 'biblos_home_dashboard'
            },
            'biblos_vocabulary_review': {
                'TORNA': 'biblos_home_dashboard'
            }
        };

        // Global navigation (Bottom bar)
        this.globalRoutes = {
            'Home': 'biblos_home_dashboard',
            'Lezioni': 'biblos_study_plans',
            'Progressi': 'biblos_progress',
            'Profilo': 'biblos_profile'
        };

        // Bind click events globally
        document.addEventListener('click', (e) => this.handleClick(e));

        // Start app
        this.loadView('biblos_splash_screen');

        // Auto-advance splash screen
        setTimeout(() => {
            if (this.currentView === 'biblos_splash_screen') {
                this.loadView('biblos_onboarding_1_of_4');
            }
        }, 3000);
    }

    async loadView(viewName) {
        console.log(`Loading view: ${viewName}`);
        try {
            const response = await fetch(`views/${viewName}.html`);
            if (!response.ok) throw new Error(`View ${viewName} not found`);
            const html = await response.text();
            this.app.innerHTML = html;
            this.currentView = viewName;

            // Initialize Lesson Logic if applicable
            if (window.LessonController) {
                window.LessonController.init(viewName);
            }
        } catch (error) {
            console.error('Error loading view:', error);
            this.app.innerHTML = `<div class="p-4 text-red-500">Error loading view: ${viewName}<br>${error.message}</div>`;
        }
    }

    handleClick(e) {
        // Traverse up to find the clicked button or link
        let target = e.target.closest('button, a');
        if (!target) return;

        e.preventDefault();

        // Extract clean text
        const clone = target.cloneNode(true);
        // Remove icons for text extraction
        clone.querySelectorAll('.material-symbols-outlined').forEach(el => el.remove());
        let text = clone.innerText.trim();

        // Fallback to icon name if text is empty
        if (!text) {
            const icon = target.querySelector('.material-symbols-outlined');
            if (icon) {
                text = icon.textContent.trim();
            }
        }

        // Special detection for the "Stop" button in user_speaking which has no text or icon but a specific inner structure
        // <div class="bg-white rounded-[4px] w-8 h-8 shadow-sm"></div>
        if (!text && this.currentView === 'biblos_lesson__user_speaking') {
            const stopDiv = target.querySelector('div.bg-white.rounded-\\[4px\\]');
            if (stopDiv) {
                text = 'STOP_BUTTON';
            }
        }

        console.log(`Clicked: "${text}" in view: ${this.currentView}`);

        // 1. Check Global Routes
        if (this.globalRoutes[text]) {
            this.loadView(this.globalRoutes[text]);
            return;
        }

        // 2. Check Contextual Routes
        const viewRoutes = this.routes[this.currentView];
        if (viewRoutes) {
            // Check exact match
            if (viewRoutes[text]) {
                this.loadView(viewRoutes[text]);
                return;
            }

            // Check if text contains the key (to handle icons/flags + text)
            const partialKey = Object.keys(viewRoutes).find(k => text.includes(k));
            if (partialKey) {
                this.loadView(viewRoutes[partialKey]);
                return;
            }

            // Check partial match (case insensitive)
            const key = Object.keys(viewRoutes).find(k => k.toUpperCase() === text.toUpperCase());
            if (key) {
                this.loadView(viewRoutes[key]);
                return;
            }
        }

        // 3. Fallback / Debug
        console.warn(`No route found for "${text}" in ${this.currentView}`);
    }
}

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
    window.router = new Router();
});
