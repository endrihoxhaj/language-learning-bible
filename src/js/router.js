
window.Router = {
    flow: {
        'biblos_splash_screen': 'biblos_onboarding_1_of_4',
        'biblos_onboarding_1_of_4': 'biblos_onboarding_2_of_4',
        'biblos_onboarding_2_of_4': 'biblos_onboarding_3_of_4',
        'biblos_onboarding_3_of_4': 'biblos_onboarding_4_of_4',
        'biblos_onboarding_4_of_4': 'biblos_placement_test',
        'biblos_placement_test': 'biblos_tutor_selection',
        'biblos_tutor_selection': 'biblos_home_dashboard',
    },

    init: function() {
        console.log('Router initialized');
        this.setupNavigation();
        this.handleAutoNavigation();
    },

    setupNavigation: function() {
        document.addEventListener('click', (e) => {
            const target = e.target.closest('[data-nav-target], button, a, [role="button"], .clickable, .cursor-pointer');

            if (!target) return;

            // Handle back navigation
            if (this.isBackNavigation(target)) {
                e.preventDefault();
                console.log('Back navigation triggered');
                window.history.back();
                return;
            }

            // Handle explicit nav target
            const navTarget = target.getAttribute('data-nav-target');
            if (navTarget) {
                e.preventDefault();
                this.navigate(navTarget);
                return;
            }

            // Handle icon triggers (e.g. arrow_forward, chevron_right)
            if (this.isNextNavigation(target)) {
                e.preventDefault();
                this.navigateNextInFlow();
                return;
            }

            // Handle text matching
            const text = this.extractText(target);
            if (text) {
                if (['INIZIAMO', 'CONTINUA', 'AVANTI', 'INIZIA IL TEST', 'INIZIA TEST'].some(kw => text.includes(kw))) {
                    e.preventDefault();
                    this.navigateNextInFlow();
                    return;
                }
                if (text.includes('INIZIA LEZIONE')) {
                    e.preventDefault();
                    this.navigate('biblos_lesson__tutor_speaking');
                    return;
                }

                // Onboarding 2 Language Selection (Italiano has chevron, but English might be selected too)
                // Assuming clicking any language option in onboarding goes next or selects it.
                // The design shows Italiano with a chevron, triggering next.
                if (window.location.pathname.includes('biblos_onboarding_2_of_4') && (text.includes('ITALIANO') || text.includes('ENGLISH'))) {
                     e.preventDefault();
                     this.navigateNextInFlow();
                     return;
                }

                // Bottom Navigation Text Matching
                if (text.includes('HOME')) {
                    e.preventDefault();
                    this.navigate('biblos_home_dashboard');
                    return;
                }
                if (text.includes('LEZIONI')) {
                     e.preventDefault();
                     // Stay or go to lessons list if exists
                     return;
                }
                if (text.includes('PROGRESSI')) {
                    e.preventDefault();
                    this.navigate('biblos_progress');
                    return;
                }
                if (text.includes('PROFILO')) {
                    e.preventDefault();
                    this.navigate('biblos_profile');
                    return;
                }
            }
        });
    },

    isBackNavigation: function(element) {
        if (element.textContent.includes('arrow_back')) return true;
        if (element.querySelector('.material-symbols-outlined') && element.querySelector('.material-symbols-outlined').textContent.includes('arrow_back')) return true;
        return false;
    },

    isNextNavigation: function(element) {
        // arrow_forward, chevron_right
        const icons = ['arrow_forward', 'chevron_right'];
        if (icons.some(icon => element.textContent.includes(icon))) return true;
        const iconEl = element.querySelector('.material-symbols-outlined');
        if (iconEl && icons.some(icon => iconEl.textContent.includes(icon))) return true;
        return false;
    },

    extractText: function(element) {
        // Clone to remove icons before getting text
        const clone = element.cloneNode(true);
        const icons = clone.querySelectorAll('.material-symbols-outlined');
        icons.forEach(icon => icon.remove());
        return clone.textContent.trim().toUpperCase();
    },

    getCurrentScreen: function() {
        const path = window.location.pathname;
        if (path === '/' || path.endsWith('index.html')) return 'biblos_splash_screen';

        // Extract filename without extension
        const parts = path.split('/');
        const filename = parts[parts.length - 1];
        return filename.replace('.html', '');
    },

    navigate: function(screenName) {
        console.log(`Navigating to ${screenName}`);
        let targetUrl;

        if (screenName === 'biblos_splash_screen') {
            targetUrl = '/index.html';
        } else if (screenName.startsWith('/')) {
             targetUrl = screenName;
        } else {
             targetUrl = `/views/${screenName}.html`;
        }

        window.location.href = targetUrl;
    },

    navigateNextInFlow: function() {
        const current = this.getCurrentScreen();
        const next = this.flow[current];
        if (next) {
            this.navigate(next);
        } else {
            console.warn(`No next flow defined for ${current}`);
        }
    },

    handleAutoNavigation: function() {
        const current = this.getCurrentScreen();
        if (current === 'biblos_splash_screen') {
            setTimeout(() => {
                this.navigateNextInFlow();
            }, 3000);
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    window.Router.init();
});
