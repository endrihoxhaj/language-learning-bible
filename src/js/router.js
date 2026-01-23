// router.js

const ROUTE_MAP = {
    // Keywords (Italian)
    'INIZIAMO': '/views/biblos_onboarding_2_of_4.html',
    'AVANTI': '/views/biblos_onboarding_3_of_4.html', // Heuristic
    'CONTINUA': '/views/biblos_onboarding_4_of_4.html', // Heuristic
    'VAI': '/views/biblos_tutor_selection.html', // Heuristic
    'INIZIA LEZIONE': '/views/biblos_lesson__tutor_speaking.html',
    'CHAT LIBERA': '/views/biblos_lesson__tutor_speaking.html', // Placeholder
    'VOCABOLARIO': '/views/biblos_vocabulary_review.html',

    // Navbar Icons
    'home': '/views/biblos_home_dashboard.html',
    'book_2': '/views/biblos_study_plans.html',
    'school': '/views/biblos_study_plans.html',
    'emoji_events': '/views/biblos_progress_statistics.html',
    'bar_chart': '/views/biblos_progress_statistics.html',
    'person': '/views/biblos_profile.html',
    'arrow_forward': null, // Often purely decorative or next step
    'arrow_back': 'BACK', // Special keyword for history.back()
    'menu': '/views/biblos_settings_screen.html', // Burger menu
};

// Heuristics for specific screens
const PATH_HEURISTICS = {
    '/views/biblos_onboarding_2_of_4.html': {
        'CONTINUA': '/views/biblos_onboarding_3_of_4.html'
    },
    '/views/biblos_onboarding_3_of_4.html': {
        'CONTINUA': '/views/biblos_onboarding_4_of_4.html'
    },
    '/views/biblos_onboarding_4_of_4.html': {
        'CONTINUA': '/views/biblos_tutor_selection.html',
        'VAI': '/views/biblos_tutor_selection.html',
        'INIZIA': '/views/biblos_tutor_selection.html'
    },
    '/views/biblos_tutor_selection.html': {
        'SELEZIONA': '/views/biblos_placement_test.html',
        'CONTINUA': '/views/biblos_placement_test.html'
    },
    '/views/biblos_placement_test.html': {
        'INIZIA TEST': '/views/biblos_home_dashboard.html', // Skip to home for now
        'SALTA': '/views/biblos_home_dashboard.html'
    },
    '/views/biblos_lesson__tutor_speaking.html': {
        'MIC': '/views/biblos_lesson__user_speaking.html' // Icon mic
    },
    '/views/biblos_lesson__user_speaking.html': {
        'STOP': '/views/biblos_lesson_feedback__correct.html'
    },
    '/views/biblos_lesson_feedback__correct.html': {
        'CONTINUA': '/views/biblos_lesson_recap.html'
    },
    '/views/biblos_lesson_feedback__correction.html': {
        'CONTINUA': '/views/biblos_lesson_recap.html'
    },
    '/views/biblos_lesson_recap.html': {
        'HOME': '/views/biblos_home_dashboard.html',
        'TORNA ALLA HOME': '/views/biblos_home_dashboard.html'
    }
};

class Router {
    constructor() {
        this.init();
    }

    init() {
        // Handle Splash Screen Timeout
        if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('biblos_splash_screen.html')) {
            console.log('Splash screen detected. Waiting 3s...');
            setTimeout(() => {
                window.location.href = '/views/biblos_onboarding_1_of_4.html';
            }, 3000);
        }

        document.addEventListener('DOMContentLoaded', () => {
            document.body.addEventListener('click', (e) => this.handleClick(e));
        });
    }

    handleClick(e) {
        let target = e.target;

        // Traverse up to find clickable element
        while (target && target !== document.body) {
            if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.getAttribute('role') === 'button') {
                break;
            }
            target = target.parentElement;
        }

        if (!target || target === document.body) return;

        // 1. Check data-nav-target
        const dataTarget = target.getAttribute('data-nav-target');
        if (dataTarget) {
            console.log('Navigating via data-nav-target:', dataTarget);
            window.location.href = dataTarget;
            return;
        }

        // 2. Extract content
        // Clone to safely manipulate
        const clone = target.cloneNode(true);
        // Remove icons from text extraction
        const icons = clone.querySelectorAll('.material-symbols-outlined');
        let iconText = '';
        if (icons.length > 0) {
            iconText = icons[0].textContent.trim();
        }
        icons.forEach(el => el.remove());

        const textContent = clone.textContent.trim().toUpperCase();

        console.log('Clicked:', { text: textContent, icon: iconText });

        // 3. Resolve destination
        let destination = this.resolveDestination(textContent, iconText);

        if (destination) {
            console.log('Navigating to:', destination);
            if (destination === 'BACK') {
                window.history.back();
            } else {
                window.location.href = destination;
            }
        } else {
            console.log('No route found for click.');
        }
    }

    resolveDestination(text, icon) {
        const currentPath = window.location.pathname;

        // Check context-specific heuristics first
        if (PATH_HEURISTICS[currentPath]) {
            if (text && PATH_HEURISTICS[currentPath][text]) return PATH_HEURISTICS[currentPath][text];
            if (icon && PATH_HEURISTICS[currentPath][icon]) return PATH_HEURISTICS[currentPath][icon];
        }

        // Check global map
        if (text && ROUTE_MAP[text]) return ROUTE_MAP[text];
        if (icon && ROUTE_MAP[icon]) return ROUTE_MAP[icon];

        return null;
    }
}

window.router = new Router();
