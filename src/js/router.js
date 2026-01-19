class Router {
    constructor() {
        this.app = document.getElementById('app');
        this.routes = {
            'splash': 'views/biblos_splash_screen.html',
            'home': 'views/biblos_home_dashboard.html',
            'lesson_tutor': 'views/biblos_lesson__tutor_speaking.html',
            'lesson_user': 'views/biblos_lesson__user_speaking.html',
            'lesson_correct': 'views/biblos_lesson_feedback__correct.html',
            'lesson_correction': 'views/biblos_lesson_feedback__correction.html',
            'recap': 'views/biblos_lesson_recap.html',
            'onboarding1': 'views/biblos_onboarding_1_of_4.html',
            'onboarding2': 'views/biblos_onboarding_2_of_4.html',
            'onboarding3': 'views/biblos_onboarding_3_of_4.html',
            'onboarding4': 'views/biblos_onboarding_4_of_4.html',
            'placement': 'views/biblos_placement_test.html',
            'progress': 'views/biblos_progress.html',
            'settings': 'views/biblos_settings_screen.html',
            'study_plans': 'views/biblos_study_plans.html',
            'tutor_selection': 'views/biblos_tutor_selection.html',
            'vocab': 'views/biblos_vocabulary_review.html',
            'profile': 'views/biblos_profile.html',
        };
        this.currentRoute = null;
        this.history = [];
    }

    async init() {
        // Start with splash
        await this.navigate('splash');

        // Auto navigate from splash
        setTimeout(() => {
            if (this.currentRoute === 'splash') {
                this.navigate('onboarding1');
            }
        }, 3000);
    }

    async navigate(routeKey) {
        if (!this.routes[routeKey]) {
            console.error('Route not found:', routeKey);
            return;
        }

        try {
            const response = await fetch(this.routes[routeKey]);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const html = await response.text();

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const bodyContent = doc.body.innerHTML;

            this.app.innerHTML = bodyContent;

            // Update history only if it's a new route (simple history management)
            if (this.currentRoute !== routeKey) {
                this.history.push(routeKey);
            }
            this.currentRoute = routeKey;

            this.attachListeners();

            if (window.LessonController) {
                window.LessonController.onPageLoad(routeKey);
            }

            // Scroll to top
            window.scrollTo(0, 0);

        } catch (e) {
            console.error('Navigation error:', e);
        }
    }

    attachListeners() {
        const clickableElements = document.querySelectorAll('button, a, .clickable, [role="button"]');
        clickableElements.forEach(el => {
            el.addEventListener('click', (e) => {
                // If it's a link with href, let it be unless it's handled here.
                // But most are buttons.
                this.handleInteraction(el, e);
            });
        });
    }

    handleInteraction(el, e) {
        // Extract clean text
        const clone = el.cloneNode(true);
        clone.querySelectorAll('.material-symbols-outlined').forEach(i => i.remove());
        const text = clone.innerText.trim().toUpperCase();

        const iconEl = el.querySelector('.material-symbols-outlined');
        const iconText = iconEl ? iconEl.innerText.trim() : '';

        console.log(`Interaction: Text="${text}", Icon="${iconText}"`);

        // Navigation Logic
        if (text.includes('INIZIAMO')) {
            this.navigate('onboarding2');
        } else if (text.includes('INIZIA LEZIONE') || text.includes('START LESSON')) {
            this.navigate('lesson_tutor');
        } else if (text.includes('INIZIA') || text.includes('START') || text.includes('BEGIN')) {
            // Check context or fallback
            if (this.currentRoute === 'onboarding4') {
                 this.navigate('tutor_selection');
            } else {
                 this.navigate('lesson_tutor');
            }
        } else if (text.includes('VOCABOLARIO')) {
            this.navigate('vocab');
        } else if (text.includes('PROGRESSI') || (text.includes('PROGRESS') && !text.includes('LESSON'))) {
            this.navigate('progress');
        } else if (text.includes('CHAT LIBERA')) {
            this.navigate('lesson_tutor');
        } else if (text === 'HOME') {
            this.navigate('home');
        } else if (text === 'LEZIONI') {
            this.navigate('study_plans');
        } else if (text === 'PROFILO' || text === 'PROFILE') {
            this.navigate('profile');
        } else if (text.includes('CONTINUA') || text.includes('CONTINUE') || text.includes('NEXT')) {
            this.handleContinue();
        } else if (text.includes('ACCEDI') || text.includes('LOGIN')) {
            this.navigate('home');
        } else if (text.includes('CREA ACCOUNT') || text.includes('SIGN UP')) {
            this.navigate('onboarding1');
        } else if (text.includes('ITALIANO') || text.includes('ENGLISH')) {
             // Language selection
             this.navigate('onboarding3');
        } else if (text.includes('CONFERMA SCELTA') || text.includes('CONFIRM')) {
             this.navigate('placement');
        } else if (text.includes('INIZIA IL TEST') || text.includes('START TEST')) {
             this.navigate('tutor_selection');
        } else if (text.includes('VAI ALLA HOME')) {
            this.navigate('home');
        } else if (text.includes('TRADUCI')) {
            // Lesson specific, handled by LessonController potentially, but here strictly nav
        } else if (text.includes('SELECT')) {
            // Could be tutor selection
            if (this.currentRoute === 'tutor_selection') {
                this.navigate('placement');
            }
        }

        // Icon based navigation
        if (iconText === 'arrow_back') {
            this.goBack();
        } else if (iconText === 'settings') {
            this.navigate('settings');
        } else if (iconText === 'close') {
            this.navigate('home');
        } else if (iconText === 'home') {
             this.navigate('home');
        } else if (iconText === 'book_2') {
            this.navigate('study_plans');
        } else if (iconText === 'emoji_events') {
            this.navigate('progress');
        } else if (iconText === 'person') {
            this.navigate('profile');
        } else if (iconText === 'mic') {
             // Handled by LessonController usually, but if it triggers nav:
             if (this.currentRoute === 'lesson_tutor') {
                 // Simulate user speaking interaction
                 this.navigate('lesson_user');
             }
        }
    }

    handleContinue() {
        const flow = {
            'onboarding1': 'onboarding2',
            'onboarding2': 'onboarding3',
            'onboarding3': 'onboarding4',
            'onboarding4': 'tutor_selection',
            'tutor_selection': 'placement',
            'placement': 'home',
            'lesson_feedback__correct': 'recap',
            'lesson_feedback__correction': 'recap',
            'lesson_recap': 'home',
            'lesson_tutor': 'lesson_user',
            'lesson_user': 'lesson_correct' // Default to correct for demo
        };

        if (flow[this.currentRoute]) {
            this.navigate(flow[this.currentRoute]);
        } else {
            console.log('No continue path for:', this.currentRoute);
        }
    }

    goBack() {
        if (this.history.length > 1) {
            this.history.pop(); // current
            const prev = this.history[this.history.length - 1]; // peek previous
            // We should probably just navigate to prev.
            // But if we just call navigate, it adds to history.
            // Let's just navigate to prev and handle history carefully or just let it stack.
            // For simplicity, just navigate.
            this.navigate(prev);
            this.history.pop(); // Remove the duplicate added by navigate
        } else {
            this.navigate('home');
        }
    }
}

// Global instance
window.router = new Router();
