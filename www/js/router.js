const routes = {
    'INIZIAMO': 'biblos_onboarding_2_of_4',
    'CONTINUA →': 'biblos_onboarding_4_of_4',
    'INIZIA IL TEST': 'biblos_placement_test',
    'INIZIA LEZIONE': 'biblos_lesson__tutor_speaking',
    'HOME': 'biblos_home_dashboard',
    'LEZIONI': 'biblos_study_plans',
    'PROGRESSI': 'statistics',
    'PROFILO': 'biblos_settings_screen',
    'CHAT LIBERA': 'biblos_lesson__tutor_speaking', // Fallback for now
    'VOCABOLARIO': 'biblos_vocabulary_review',
    'SALT': 'biblos_home_dashboard', // Skip logic "Saltare" or similar?
    'VAI ALLA DASHBOARD': 'biblos_home_dashboard'
};

class Router {
    constructor() {
        this.app = document.getElementById('app');
        this.currentView = '';
        this.history = [];

        document.addEventListener('click', this.handleClick.bind(this));

        // Start with Splash
        this.loadView('biblos_splash_screen');

        // Auto-advance splash
        setTimeout(() => {
            if (this.currentView === 'biblos_splash_screen') {
                this.loadView('biblos_onboarding_1_of_4');
            }
        }, 3000);
    }

    async loadView(viewName) {
        // Prevent reloading same view (unless force?)
        if (this.currentView === viewName) return;

        console.log(`Navigating to ${viewName}`);

        try {
            const response = await fetch(`views/${viewName}.html`);
            if (!response.ok) throw new Error(`Failed to load view: ${viewName}`);

            const html = await response.text();
            this.app.innerHTML = html;

            this.history.push(viewName);
            this.currentView = viewName;

            window.scrollTo(0, 0);

            // Notify controller
            if (window.LessonController) {
                window.LessonController.onViewLoaded(viewName);
            }

        } catch (error) {
            console.error('Router Error:', error);
        }
    }

    handleClick(e) {
        const target = e.target.closest('button, a, .clickable, label'); // Added label for onboarding 3 radio buttons if they act as buttons
        if (!target) return;

        // Don't prevent default for inputs/labels unless we want to override behavior
        if (target.tagName === 'LABEL' || target.tagName === 'INPUT') {
            // Let the input check happen, but we might want to track state
            return;
        }

        // Back button detection
        const icon = target.querySelector('.material-symbols-outlined');
        const iconText = icon ? icon.innerText.trim() : '';
        if (iconText === 'arrow_back' || target.innerText.includes('arrow_back')) {
            e.preventDefault();
            this.goBack();
            return;
        }

        // Clean text extraction (ignoring icons)
        const clone = target.cloneNode(true);
        const icons = clone.querySelectorAll('.material-symbols-outlined');
        icons.forEach(i => i.remove());
        const cleanText = clone.innerText.trim().toUpperCase().replace(/\s+/g, ' ');
        const rawText = target.innerText.trim().toUpperCase().replace(/\s+/g, ' ');

        console.log(`Clicked clean: "${cleanText}", raw: "${rawText}"`);

        // Exact match on clean text
        if (routes[cleanText]) {
            e.preventDefault();
            this.loadView(routes[cleanText]);
            return;
        }

        // Heuristics using rawText or cleanText
        if (cleanText.includes('CONTINUA') || rawText.includes('CONTINUA')) {
            e.preventDefault();
            // Context sensitive continues
            if (this.currentView === 'biblos_onboarding_3_of_4') {
                this.loadView('biblos_onboarding_4_of_4');
            } else if (this.currentView === 'biblos_placement_test') {
                this.loadView('biblos_home_dashboard'); // Finish test
            } else if (this.currentView.includes('lesson')) {
                // Lesson flow
                this.handleLessonFlow();
            }
            return;
        }

        // Onboarding 2 Language Selection
        if (this.currentView === 'biblos_onboarding_2_of_4') {
            if (cleanText.includes('ENGLISH') || cleanText.includes('ITALIANO')) {
                e.preventDefault();
                this.loadView('biblos_onboarding_3_of_4');
            }
            return;
        }

        // Placement Test specific
        if (this.currentView === 'biblos_placement_test') {
            if (cleanText.includes('INIZIA')) {
               // Assuming logic here
            }
        }

        // Bottom Nav
        if (cleanText.includes('HOME')) { e.preventDefault(); this.loadView('biblos_home_dashboard'); return; }
        if (cleanText.includes('LEZIONI')) { e.preventDefault(); this.loadView('biblos_study_plans'); return; }
        if (cleanText.includes('PROGRESSI')) { e.preventDefault(); this.loadView('statistics'); return; }
        if (cleanText.includes('PROFILO')) { e.preventDefault(); this.loadView('biblos_settings_screen'); return; }

    }

    handleLessonFlow() {
        // Simple linear lesson flow for demo
        const lessonOrder = [
            'biblos_lesson__tutor_speaking',
            'biblos_lesson__user_speaking',
            'biblos_lesson_feedback__correct', // or correction
            'biblos_lesson_recap'
        ];

        const currentIndex = lessonOrder.indexOf(this.currentView);
        if (currentIndex !== -1 && currentIndex < lessonOrder.length - 1) {
            this.loadView(lessonOrder[currentIndex + 1]);
        } else {
            this.loadView('biblos_home_dashboard');
        }
    }

    goBack() {
        if (this.history.length > 1) {
            this.history.pop(); // remove current
            const previous = this.history[this.history.length - 1];
            // Don't push to history again, just load content and set currentView
            this.loadViewInternal(previous);
        }
    }

    async loadViewInternal(viewName) {
         try {
            const response = await fetch(`views/${viewName}.html`);
            const html = await response.text();
            this.app.innerHTML = html;
            this.currentView = viewName;
            window.scrollTo(0, 0);
            if (window.LessonController) window.LessonController.onViewLoaded(viewName);
        } catch(e) { console.error(e); }
    }
}

window.router = new Router();
