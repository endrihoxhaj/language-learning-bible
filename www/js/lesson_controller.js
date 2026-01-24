class LessonController {
    constructor() {
        this.init();
    }

    init() {
        const path = window.location.pathname;
        console.log('LessonController init:', path);

        if (path.includes('biblos_splash_screen') || path.endsWith('index.html') || path === '/') {
            setTimeout(() => {
                window.location.href = '/views/biblos_onboarding_1_of_4.html';
            }, 3000);
        }
        else if (path.includes('biblos_lesson__tutor_speaking')) {
            console.log('Tutor speaking... waiting to transition.');
            setTimeout(() => {
                window.location.href = '/views/biblos_lesson__user_speaking.html';
            }, 4000);
        }
        else if (path.includes('biblos_lesson__user_speaking')) {
            this.setupUserSpeaking();
        }
    }

    setupUserSpeaking() {
        const micButton = document.querySelector('button.mic-pulse');
        if (micButton) {
            micButton.addEventListener('click', () => {
                console.log('Mic button clicked, simulating processing...');
                // Simulate processing delay then go to feedback
                setTimeout(() => {
                    window.location.href = '/views/biblos_lesson_feedback__correct.html';
                }, 1000);
            });
        } else {
            console.warn('Mic button not found');
        }
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    window.lessonController = new LessonController();
});
