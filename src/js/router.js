// src/js/router.js

const flow = {
    // Onboarding Flow
    '/views/biblos_splash_screen.html': { next: '/views/biblos_onboarding_1_of_4.html', delay: 3000 },
    '/views/biblos_onboarding_1_of_4.html': { next: '/views/biblos_onboarding_2_of_4.html' },
    '/views/biblos_onboarding_2_of_4.html': { next: '/views/biblos_onboarding_3_of_4.html' },
    '/views/biblos_onboarding_3_of_4.html': { next: '/views/biblos_onboarding_4_of_4.html' },
    '/views/biblos_onboarding_4_of_4.html': { next: '/views/biblos_placement_test.html' },
    '/views/biblos_placement_test.html': { next: '/views/biblos_tutor_selection.html' },
    '/views/biblos_tutor_selection.html': { next: '/views/biblos_home_dashboard.html' },

    // Lesson Flow
    '/views/biblos_home_dashboard.html': {
        'INIZIA LEZIONE': '/views/biblos_lesson__tutor_speaking.html'
    },
    '/views/biblos_lesson__tutor_speaking.html': { next: '/views/biblos_lesson__user_speaking.html' },
    '/views/biblos_lesson__user_speaking.html': { next: '/views/biblos_lesson_feedback__correct.html' },
    '/views/biblos_lesson_feedback__correct.html': { next: '/views/biblos_lesson_recap.html' },
    '/views/biblos_lesson_recap.html': { next: '/views/biblos_home_dashboard.html' }
};

window.Router = {
    navigateTo: function(path) {
        console.log('Navigating to:', path);
        window.location.href = path;
    },

    goBack: function() {
        window.history.back();
    },

    init: function() {
        console.log('Router initialized');
        this.attachListeners();
        this.checkAutoRedirect();
    },

    attachListeners: function() {
        // Back button
        document.querySelectorAll('button').forEach(btn => {
            if (btn.innerText.includes('arrow_back')) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.goBack();
                });
            }
        });

        document.addEventListener('click', (e) => {
            const target = e.target.closest('[data-nav-target]');
            if (target) {
                e.preventDefault();
                const nextPath = target.getAttribute('data-nav-target');
                this.navigateTo(nextPath);
                return;
            }

            // Text matching fallback
            const clickable = e.target.closest('button, a, [role="button"], .clickable, .cursor-pointer');
            if (clickable) {
                if (clickable.querySelector('input, label, select, textarea')) return;

                const clone = clickable.cloneNode(true);
                clone.querySelectorAll('.material-symbols-outlined').forEach(el => el.remove());
                const text = clone.innerText.trim();

                console.log('Clicked text:', text);

                // Find current page key
                const currentPath = window.location.pathname;
                let pageKey = Object.keys(flow).find(key => currentPath.endsWith(key));

                if (pageKey && flow[pageKey]) {
                    const pageConfig = flow[pageKey];
                    // Direct text match
                    if (pageConfig[text]) {
                        e.preventDefault();
                        this.navigateTo(pageConfig[text]);
                    }
                }
            }
        });
    },

    checkAutoRedirect: function() {
        const currentPath = window.location.pathname;
        let pageKey = Object.keys(flow).find(key => currentPath.endsWith(key));

        if (pageKey) {
             const config = flow[pageKey];
             if (config.delay && config.next) {
                 setTimeout(() => {
                     this.navigateTo(config.next);
                 }, config.delay);
             }
        }

        // Root fallback
        if (currentPath.endsWith('/') || currentPath.endsWith('/index.html')) {
             setTimeout(() => {
                this.navigateTo('/views/biblos_onboarding_1_of_4.html');
            }, 3000);
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    window.Router.init();
});
