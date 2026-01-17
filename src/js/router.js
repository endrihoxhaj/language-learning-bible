window.routes = {
    'splash': 'biblos_splash_screen.html',
    'home': 'biblos_home_dashboard.html',
    'onboarding1': 'biblos_onboarding_1_of_4.html',
    'onboarding2': 'biblos_onboarding_2_of_4.html',
    'onboarding3': 'biblos_onboarding_3_of_4.html',
    'onboarding4': 'biblos_onboarding_4_of_4.html',
    'tutor_selection': 'biblos_tutor_selection.html',
    'placement_test': 'biblos_placement_test.html',
    'plans': 'biblos_study_plans.html',
    'progress': 'biblos_progress_statistics.html',
    'profile': 'biblos_profile.html',
    'lesson_tutor': 'biblos_lesson__tutor_speaking.html',
    'lesson_user': 'biblos_lesson__user_speaking.html',
    'lesson_feedback': 'biblos_lesson_feedback__correct.html',
    'lesson_correction': 'biblos_lesson_feedback__correction.html',
    'lesson_recap': 'biblos_lesson_recap.html',
    'vocab_review': 'biblos_vocabulary_review.html',
    'settings': 'biblos_settings_screen.html'
};

let currentView = '';

window.loadView = async function(viewName) {
    // console.log(`Loading view: ${viewName}`);
    try {
        const response = await fetch(`views/${viewName}`);
        if (!response.ok) throw new Error(`View ${viewName} not found`);
        const html = await response.text();
        document.getElementById('app').innerHTML = html;
        currentView = viewName;
        window.scrollTo(0, 0);

        // Post-load logic
        if (viewName === routes['splash']) {
            setTimeout(() => {
                loadView(routes['onboarding1']);
            }, 3000);
        }

        // Initialize Lesson Controller if needed
        if (window.LessonController) {
            window.LessonController.onViewLoaded(viewName);
        }

    } catch (e) {
        console.error('Error loading view:', e);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.loadView(window.routes['splash']);
});

document.body.addEventListener('click', (e) => {
    let target = e.target.closest('button, a, .clickable');
    if (!target) return;

    e.preventDefault();

    // Text content cleanup
    const clone = target.cloneNode(true);
    clone.querySelectorAll('.material-symbols-outlined').forEach(el => el.remove());
    const text = clone.textContent.trim().toUpperCase();

    // Icon
    const icon = target.querySelector('.material-symbols-outlined');
    const iconName = icon ? icon.textContent.trim() : '';

    // Class based detection
    const isMic = target.querySelector('.material-symbols-outlined') && target.querySelector('.material-symbols-outlined').textContent === 'mic';

    console.log(`Clicked: "${text}", Icon: "${iconName}"`);

    // Navigation Rules
    if (text.includes('INIZIAMO')) {
        window.loadView(window.routes['onboarding2']);
    } else if (text.includes('CREA ACCOUNT')) {
        window.loadView(window.routes['onboarding1']);
    } else if (text === 'ACCEDI') {
         window.loadView(window.routes['home']);
    } else if (text.includes('ENGLISH') || text.includes('ITALIANO')) {
        if (currentView === window.routes['onboarding2']) {
            window.loadView(window.routes['onboarding3']);
        }
    } else if (text.includes('CONTINUA')) {
        handleContinua();
    } else if (text.includes('INIZIA LEZIONE')) {
        window.loadView(window.routes['lesson_tutor']);
    } else if (text === 'HOME' || iconName === 'home') {
        window.loadView(window.routes['home']);
    } else if (text === 'LEZIONI' || iconName === 'book_2') {
        window.loadView(window.routes['plans']);
    } else if (text === 'PROGRESSI' || iconName === 'emoji_events') {
        window.loadView(window.routes['progress']);
    } else if (text === 'PROFILO' || iconName === 'person') {
        window.loadView(window.routes['profile']);
    } else if (text.includes('CHAT LIBERA') || text.includes('VOCABOLARIO')) {
        window.loadView(window.routes['vocab_review']);
    } else if (iconName === 'arrow_back') {
        // Simple back logic or home
        window.loadView(window.routes['home']);
    } else if (iconName === 'mic' || isMic) {
        // Lesson interaction is handled by LessonController usually, but navigation might be needed
        // If we are in lesson_user, mic might trigger feedback
        if (currentView === window.routes['lesson_user']) {
            // Simulate processing then go to feedback
             setTimeout(() => {
                // Randomly correct or incorrect for demo
                Math.random() > 0.5 ? window.loadView(window.routes['lesson_feedback']) : window.loadView(window.routes['lesson_correction']);
             }, 1000);
        }
    } else if (text === 'VAI') { // Button in lesson feedback
         window.loadView(window.routes['lesson_recap']);
    }
});

function handleContinua() {
    if (currentView === window.routes['splash']) window.loadView(window.routes['onboarding1']);
    else if (currentView === window.routes['onboarding1']) window.loadView(window.routes['onboarding2']);
    else if (currentView === window.routes['onboarding2']) window.loadView(window.routes['onboarding3']);
    else if (currentView === window.routes['onboarding3']) window.loadView(window.routes['onboarding4']);
    else if (currentView === window.routes['onboarding4']) window.loadView(window.routes['tutor_selection']);
    else if (currentView === window.routes['tutor_selection']) window.loadView(window.routes['placement_test']);
    else if (currentView === window.routes['placement_test']) window.loadView(window.routes['home']);
    else if (currentView === window.routes['lesson_recap']) window.loadView(window.routes['home']);
    else if (currentView === window.routes['lesson_feedback']) window.loadView(window.routes['lesson_recap']);
    else if (currentView === window.routes['lesson_correction']) window.loadView(window.routes['lesson_recap']);
    else {
        window.loadView(window.routes['home']);
    }
}
