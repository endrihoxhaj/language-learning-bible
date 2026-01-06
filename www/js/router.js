// Simple router
const routes = {
    '/': 'biblos_splash_screen',
    '/onboarding/1': 'biblos_onboarding_1_of_4',
    '/onboarding/2': 'biblos_onboarding_2_of_4',
    '/onboarding/3': 'biblos_onboarding_3_of_4',
    '/onboarding/4': 'biblos_onboarding_4_of_4',
    '/home': 'biblos_home_dashboard',
    '/placement_test': 'biblos_placement_test',
    '/lesson/tutor': 'biblos_lesson__tutor_speaking',
    '/lesson/user': 'biblos_lesson__user_speaking',
    '/lesson/feedback/correct': 'biblos_lesson_feedback__correct',
    '/lesson/feedback/correction': 'biblos_lesson_feedback__correction',
    '/lesson/recap': 'biblos_lesson_recap',
    '/progress': 'biblos_progress',
    '/settings': 'biblos_settings_screen',
    '/study_plans': 'biblos_study_plans',
    '/tutor_selection': 'biblos_tutor_selection',
    '/vocabulary': 'biblos_vocabulary_review',
};

// Import controllers
import { initOnboarding4 } from './controllers/onboarding4.js';
import { initTutorSelection } from './controllers/tutor_selection.js';
import { initSettings } from './controllers/settings.js';

let cleanupFunction = null;

export async function navigateTo(path) {
    // Cleanup previous view listeners if needed
    if (cleanupFunction) {
        cleanupFunction();
        cleanupFunction = null;
    }
    document.body.onclick = null;

    const viewName = routes[path];
    if (!viewName) {
        console.error(`No route found for path: ${path}`);
        return;
    }
    console.log(`Navigating to ${path} (${viewName})`);

    try {
        const response = await fetch(`views/${viewName}.html`);
        if (!response.ok) {
            throw new Error(`Failed to load view: ${viewName}`);
        }
        const html = await response.text();
        document.getElementById('app').innerHTML = html;

        attachEventListeners(path);

    } catch (error) {
        console.error('Navigation error:', error);
        document.getElementById('app').innerHTML = `<p>Error loading page: ${error.message}</p>`;
    }
}

function attachBottomNavListeners() {
    const nav = document.querySelector('nav');
    if (!nav) return;

    // Home
    const homeBtn = nav.querySelector('button:nth-child(1)');
    if (homeBtn) homeBtn.onclick = () => navigateTo('/home');

    // Lezioni (Study Plans?)
    const lessonsBtn = nav.querySelector('button:nth-child(2)');
    if (lessonsBtn) lessonsBtn.onclick = () => navigateTo('/study_plans');

    // Progress
    const progressBtn = nav.querySelector('button:nth-child(3)');
    if (progressBtn) progressBtn.onclick = () => navigateTo('/progress');

    // Profile (Settings?)
    const profileBtn = nav.querySelector('button:nth-child(4)');
    if (profileBtn) profileBtn.onclick = () => navigateTo('/settings');
}

function attachEventListeners(currentPath) {
    console.log('Attaching event listeners for', currentPath);

    // Common bottom nav logic for pages that have it
    attachBottomNavListeners();

    // Helper to find button by text content
    const findButtonByText = (text) => {
        const buttons = Array.from(document.querySelectorAll('button, a, div[role="button"]'));
        return buttons.find(b => b.textContent.toLowerCase().includes(text.toLowerCase()));
    };

    if (currentPath === '/') {
        const timer = setTimeout(() => navigateTo('/onboarding/1'), 3000);
        const handler = () => navigateTo('/onboarding/1');
        document.body.onclick = handler;

        cleanupFunction = () => {
            clearTimeout(timer);
            document.body.onclick = null;
        };
    }

    if (currentPath === '/onboarding/1') {
        const btn = document.querySelector('button');
        if (btn) btn.onclick = () => navigateTo('/onboarding/2');
    }

    if (currentPath === '/onboarding/2') {
        const nextBtn = document.querySelector('button.bg-primary') || document.querySelector('button');
        if (nextBtn) nextBtn.onclick = () => navigateTo('/onboarding/3');
    }

    if (currentPath === '/onboarding/3') {
        const nextBtn = document.querySelector('button.bg-primary') || document.querySelector('button');
        if (nextBtn) nextBtn.onclick = () => navigateTo('/onboarding/4');
    }

    if (currentPath === '/onboarding/4') {
        initOnboarding4();
    }

    if (currentPath === '/tutor_selection') {
        initTutorSelection();
    }

    if (currentPath === '/placement_test') {
        const nextBtn = document.querySelector('.fixed.bottom-6 button');
        if (nextBtn) nextBtn.onclick = () => navigateTo('/home');

        const closeBtn = document.querySelector('button.rounded-full');
        if (closeBtn) closeBtn.onclick = () => navigateTo('/onboarding/4');
    }

    if (currentPath === '/home') {
        const startBtn = findButtonByText('INIZIA LEZIONE');
        if (startBtn) startBtn.onclick = () => navigateTo('/lesson/tutor');

        const micBtn = document.querySelector('button span.material-symbols-outlined[class*="mic"]')?.closest('button');
        if (micBtn && !startBtn) micBtn.onclick = () => navigateTo('/lesson/tutor');
    }

    if (currentPath === '/lesson/tutor') {
         const timer = setTimeout(() => navigateTo('/lesson/user'), 5000);
         cleanupFunction = () => clearTimeout(timer);
    }

    if (currentPath === '/lesson/user') {
         const micBtn = document.querySelector('button');
         if (micBtn) micBtn.onclick = () => navigateTo('/lesson/feedback/correct');
    }

    if (currentPath === '/lesson/feedback/correct') {
        const continueBtn = document.querySelector('button');
        if (continueBtn) continueBtn.onclick = () => navigateTo('/lesson/recap');
    }

    if (currentPath === '/lesson/recap') {
        const finishBtn = document.querySelector('button');
        if (finishBtn) finishBtn.onclick = () => navigateTo('/home');
    }

    if (currentPath === '/settings') {
        initSettings();
    }

}

window.addEventListener('popstate', () => {
    navigateTo(window.location.pathname);
});
