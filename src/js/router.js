document.addEventListener('DOMContentLoaded', () => {

    // Define the sequential flow where applicable
    const flow = {
        'biblos_splash_screen': 'biblos_onboarding_1_of_4',
        'biblos_onboarding_1_of_4': 'biblos_onboarding_2_of_4',
        'biblos_onboarding_2_of_4': 'biblos_onboarding_3_of_4',
        'biblos_onboarding_3_of_4': 'biblos_onboarding_4_of_4',
        'biblos_onboarding_4_of_4': 'biblos_placement_test',
        'biblos_placement_test': 'biblos_tutor_selection',
        'biblos_tutor_selection': 'biblos_home_dashboard',

        // Lesson flow
        'biblos_home_dashboard': 'biblos_lesson__tutor_speaking',
        'biblos_lesson__tutor_speaking': 'biblos_lesson__user_speaking',
        'biblos_lesson__user_speaking': 'biblos_lesson_feedback__correct',
        'biblos_lesson_feedback__correct': 'biblos_lesson_recap',
        'biblos_lesson_feedback__correction': 'biblos_lesson_recap',
        'biblos_lesson_recap': 'biblos_home_dashboard',
    };

    // Keyword mapping for specific jumps
    const keywordMap = {
        'INIZIA LEZIONE': 'biblos_lesson__tutor_speaking',
        'HOME': 'biblos_home_dashboard',
        'LEZIONI': 'biblos_study_plans',
        'PROGRESSI': 'biblos_progress',
        'PROFILO': 'biblos_profile',
        'VOCABOLARIO': 'biblos_vocabulary_review'
    };

    function getCurrentScreen() {
        const path = window.location.pathname;
        if (path === '/' || path.endsWith('index.html')) {
            return 'biblos_splash_screen';
        }
        const match = path.match(/\/views\/(.*?)\.html/);
        return match ? match[1] : null;
    }

    function navigateTo(screenName) {
        if (!screenName) return;

        const targetUrl = `/views/${screenName}.html`;

        console.log(`Navigating to: ${targetUrl}`);
        window.location.href = targetUrl;
    }

    const currentScreen = getCurrentScreen();
    console.log(`Current screen: ${currentScreen}`);

    // Splash Screen Timeout
    if (currentScreen === 'biblos_splash_screen') {
        setTimeout(() => {
            navigateTo(flow['biblos_splash_screen']);
        }, 3000);
    }

    // Click Handler
    document.addEventListener('click', (e) => {
        // Find closest clickable element
        const target = e.target.closest('button, a, [role="button"], .clickable, .cursor-pointer');
        if (!target) return;

        // Prevent default if it's not a link or input
        if (target.tagName !== 'A' && !target.closest('input, label, select, textarea')) {
            e.preventDefault();
        }

        console.log('Clicked:', target);

        // 1. Check data-nav-target
        const navTarget = target.getAttribute('data-nav-target');
        if (navTarget) {
            navigateTo(navTarget);
            return;
        }

        // Prepare text for matching
        const clone = target.cloneNode(true);
        // Remove material icons from text content to avoid "arrow_forward" being part of the text
        clone.querySelectorAll('.material-symbols-outlined').forEach(el => el.remove());
        const text = clone.textContent.trim().toUpperCase();
        const fullText = target.textContent; // includes icon names

        console.log('Text:', text);
        console.log('Full text:', fullText);

        // 2. Keyword Map (Global Navigation)
        for (const [key, value] of Object.entries(keywordMap)) {
            if (text.includes(key)) {
                navigateTo(value);
                return;
            }
        }

        // 3. Sequential Flow (Next/Continue buttons)
        const nextKeywords = ['INIZIAMO', 'INIZIA IL TEST', 'CONTINUA', 'AVANTI'];
        if (nextKeywords.some(k => text.includes(k))) {
             if (flow[currentScreen]) {
                 navigateTo(flow[currentScreen]);
                 return;
             }
        }

        // 4. Icon Triggers (arrow_forward, chevron_right) acting as "Next"
        if (fullText.includes('arrow_forward') || fullText.includes('chevron_right')) {
             if (flow[currentScreen]) {
                 navigateTo(flow[currentScreen]);
                 return;
             }
        }

        // 5. Back Button
        if (fullText.includes('arrow_back')) {
            window.history.back();
            return;
        }

    });
});
