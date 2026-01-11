
class Router {
    constructor(routes) {
        this.routes = routes;
        this.appElement = document.getElementById('app');
        this.currentRoute = null;

        window.addEventListener('popstate', () => {
            this.handleRoute();
        });

        // Intercept clicks for SPA navigation
        document.addEventListener('click', (e) => {
            // Find closest anchor tag or element with data-route
            const target = e.target.closest('[data-route]');
            if (target) {
                e.preventDefault();
                const route = target.getAttribute('data-route');
                this.navigate(route);
            }
        });
    }

    async navigate(path) {
        window.history.pushState({}, '', '#' + path);
        await this.handleRoute();
    }

    async handleRoute() {
        const hash = window.location.hash.slice(1) || 'splash';

        // Find route configuration
        const routeConfig = this.routes[hash] || this.routes['splash'];

        if (routeConfig) {
            this.currentRoute = hash;
            try {
                const response = await fetch(routeConfig.view);
                if (!response.ok) throw new Error(`Could not load view: ${routeConfig.view}`);
                const html = await response.text();

                // Inject HTML
                this.appElement.innerHTML = html;

                // Run controller if exists
                if (routeConfig.controller) {
                    routeConfig.controller();
                }

                // Post-process links to add data-route if possible
                this.attachDynamicLinks();

            } catch (error) {
                console.error('Navigation error:', error);
                this.appElement.innerHTML = '<div class="p-4 text-red-500">Error loading page.</div>';
            }
        }
    }

    attachDynamicLinks() {
        const buttons = this.appElement.querySelectorAll('button, a');
        buttons.forEach(btn => {
            const text = btn.innerText.toLowerCase().trim();
            const icon = btn.querySelector('.material-symbols-outlined')?.innerText;

            // Global Back Button
            if (icon === 'arrow_back' || btn.querySelector('.material-symbols-outlined')?.innerText === 'arrow_back') {
                btn.onclick = () => window.history.back();
                return;
            }

            // Navbar Logic (Global)
            if (text.includes('home') || icon === 'home') {
                btn.onclick = () => this.navigate('dashboard');
                return;
            }
            if (text.includes('lezioni') || icon === 'school' || icon === 'book_2') {
                btn.onclick = () => this.navigate('study_plans');
                return;
            }
            if (text.includes('progressi') || icon === 'bar_chart' || icon === 'emoji_events') {
                btn.onclick = () => this.navigate('progress');
                return;
            }
            if (text.includes('profilo') || icon === 'person') {
                btn.onclick = () => this.navigate('settings');
                return;
            }

            // Route Specific Logic
            if (this.currentRoute === 'splash') {
                 if (text.includes('iniziamo') || text.includes('start')) {
                     btn.onclick = () => this.navigate('onboarding_1');
                 }
            }
            else if (this.currentRoute === 'onboarding_1') {
                if (text.includes('iniziamo') || text.includes('start')) {
                    btn.onclick = () => this.navigate('onboarding_2');
                }
            }
            else if (this.currentRoute === 'onboarding_2') {
                // Language selection
                if (text.includes('english') || text.includes('italiano')) {
                    btn.onclick = () => this.navigate('onboarding_3');
                }
            }
            else if (this.currentRoute === 'onboarding_3') {
                if (text.includes('continua')) {
                    btn.onclick = () => this.navigate('onboarding_4');
                }
            }
            else if (this.currentRoute === 'onboarding_4') {
                if (text.includes('inizia il test') || text.includes('start test')) {
                    btn.onclick = () => this.navigate('placement_test');
                }
            }
            else if (this.currentRoute === 'placement_test') {
                 // Check if it's the finish button (usually at bottom or arrow_forward)
                 if (icon === 'arrow_forward' || text.includes('continua')) {
                    btn.onclick = () => this.navigate('tutor_selection'); // Usually follows placement
                 }
                 // Handle option selection (mock)
                 if (btn.querySelector('input[type="radio"]') || btn.classList.contains('group')) {
                     // Just visual feedback, handled by CSS usually
                 }
            }
            else if (this.currentRoute === 'tutor_selection') {
                if (text.includes('conferma') || text.includes('confirm')) {
                    btn.onclick = () => this.navigate('dashboard'); // Or study plans
                }
                // Handle tutor cards
                if (btn.classList.contains('group')) {
                    // Select tutor logic
                }
            }
            else if (this.currentRoute === 'dashboard') {
                if (text.includes('chat') || text.includes('libera')) {
                    btn.onclick = () => this.navigate('lesson_tutor');
                } else if (text.includes('inizia lezione')) {
                    btn.onclick = () => this.navigate('lesson_tutor');
                } else if (text.includes('vocabolario')) {
                    btn.onclick = () => this.navigate('vocabulary');
                }
            }
            else if (this.currentRoute === 'study_plans') {
                if (text.includes('continua')) {
                    btn.onclick = () => this.navigate('lesson_tutor'); // Continue lesson
                }
            }
        });
    }
}

const routes = {
    'splash': { view: 'views/biblos_splash_screen.html', controller: null },
    'onboarding_1': { view: 'views/biblos_onboarding_1_of_4.html', controller: null },
    'onboarding_2': { view: 'views/biblos_onboarding_2_of_4.html', controller: null },
    'onboarding_3': { view: 'views/biblos_onboarding_3_of_4.html', controller: null },
    'onboarding_4': { view: 'views/biblos_onboarding_4_of_4.html', controller: null },
    'placement_test': { view: 'views/biblos_placement_test.html', controller: null },
    'dashboard': { view: 'views/biblos_home_dashboard.html', controller: null },
    'lesson_tutor': { view: 'views/biblos_lesson__tutor_speaking.html', controller: () => window.lessonController.init('lesson_tutor') },
    'lesson_user': { view: 'views/biblos_lesson__user_speaking.html', controller: () => window.lessonController.init('lesson_user') },
    'lesson_recap': { view: 'views/biblos_lesson_recap.html', controller: null },
    'lesson_feedback_correct': { view: 'views/biblos_lesson_feedback__correct.html', controller: () => window.lessonController.init('lesson_feedback_correct') },
    'lesson_feedback_correction': { view: 'views/biblos_lesson_feedback__correction.html', controller: () => window.lessonController.init('lesson_feedback_correction') },
    'settings': { view: 'views/biblos_settings_screen.html', controller: null },
    'study_plans': { view: 'views/biblos_study_plans.html', controller: null },
    'tutor_selection': { view: 'views/biblos_tutor_selection.html', controller: null },
    'vocabulary': { view: 'views/biblos_vocabulary_review.html', controller: null },
    'progress': { view: 'views/biblos_progress_statistics.html', controller: null },
};

window.router = new Router(routes);
window.router.handleRoute();
