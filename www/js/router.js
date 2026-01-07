class Router {
    constructor(routes) {
        this.routes = routes;
        this.appElement = document.getElementById('app');
        window.addEventListener('popstate', this.handleLocation.bind(this));
        this.handleLocation();
    }

    async handleLocation() {
        const path = window.location.hash.slice(1) || '/';
        const route = this.routes[path] || this.routes['/404'];

        if (route) {
            try {
                const html = await fetch(route.template).then((data) => data.text());
                this.appElement.innerHTML = html;

                // Initialize controller if it exists
                if (route.controller) {
                    route.controller();
                }
            } catch (error) {
                console.error('Error loading page:', error);
            }
        }
    }

    navigate(path) {
        window.location.hash = path;
    }
}

// Define routes
const routes = {
    '/': {
        template: 'views/biblos_splash_screen.html',
        controller: () => {
            console.log('Splash Screen Loaded');
            setTimeout(() => {
                 window.router.navigate('/onboarding/1');
            }, 3000);
        }
    },
    '/onboarding/1': {
        template: 'views/biblos_onboarding_1_of_4.html',
        controller: () => window.controllers.onboarding(1)
    },
    '/onboarding/2': {
        template: 'views/biblos_onboarding_2_of_4.html',
        controller: () => window.controllers.onboarding(2)
    },
    '/onboarding/3': {
        template: 'views/biblos_onboarding_3_of_4.html',
        controller: () => window.controllers.onboarding(3)
    },
    '/onboarding/4': {
        template: 'views/biblos_onboarding_4_of_4.html',
        controller: () => window.controllers.onboarding(4)
    },
    '/home': {
        template: 'views/biblos_home_dashboard.html',
        controller: () => window.controllers.home()
    },
    '/lesson/tutor': {
        template: 'views/biblos_lesson__tutor_speaking.html',
        controller: () => window.controllers.lesson('tutor')
    },
     '/lesson/user': {
        template: 'views/biblos_lesson__user_speaking.html',
        controller: () => window.controllers.lesson('user')
    },
    '/lesson/feedback/correct': {
        template: 'views/biblos_lesson_feedback__correct.html',
        controller: () => window.controllers.lesson('feedback')
    },
     '/lesson/feedback/correction': {
        template: 'views/biblos_lesson_feedback__correction.html',
         controller: () => window.controllers.lesson('feedback')
    },
    '/lesson/recap': {
        template: 'views/biblos_lesson_recap.html',
         controller: () => window.controllers.lesson('recap')
    },
     '/placement_test': {
        template: 'views/biblos_placement_test.html',
        controller: () => window.controllers.placement_test()
    },
    '/settings': {
        template: 'views/biblos_settings_screen.html',
        controller: () => window.controllers.settings()
    },
    '/study_plans': {
        template: 'views/biblos_study_plans.html',
        controller: () => setupBottomNav()
    },
    '/tutor_selection': {
        template: 'views/biblos_tutor_selection.html',
        controller: () => window.controllers.tutor_selection()
    },
    '/vocabulary_review': {
        template: 'views/biblos_vocabulary_review.html',
         controller: () => setupBottomNav()
    },
     '/progress': {
        template: 'views/statistics.html',
         controller: () => setupBottomNav()
    },
    '/profile': {
        template: 'views/untitled_screen.html',
        controller: () => setupBottomNav()
    },
    '/404': {
        template: 'views/404.html',
    }
};


// Check view naming from script
// The script uses folder names.
// biblos_progress/statistics -> statistics.html?
// Let's check the output of the script.

window.router = new Router(routes);
