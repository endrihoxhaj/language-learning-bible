class LessonController {
    constructor() {
        console.log('LessonController initialized');
        // Wait for DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        const path = window.location.pathname;

        if (path.includes('biblos_lesson__tutor_speaking')) {
            this.handleTutorSpeaking();
        } else if (path.includes('biblos_lesson__user_speaking')) {
            this.handleUserSpeaking();
        } else if (path.includes('biblos_lesson_feedback')) {
            this.handleFeedback();
        }
    }

    handleTutorSpeaking() {
        // Simulate tutor speaking time
        console.log('Tutor is speaking...');
        setTimeout(() => {
            console.log('Tutor finished speaking');
            if (window.handleNavigation) {
                window.handleNavigation('/views/biblos_lesson__user_speaking.html');
            }
        }, 4000);
    }

    handleUserSpeaking() {
        console.log('User speaking state');
        // Find the mic button/stop button
        const stopButton = document.querySelector('button.mic-pulse') || document.querySelector('button.rounded-full.bg-sage');

        if (stopButton) {
            stopButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation(); // Stop router from handling it if we want custom logic
                console.log('User finished speaking');
                // Simulate processing -> Success or Correction
                // Default to correct feedback
                if (window.handleNavigation) {
                    window.handleNavigation('/views/biblos_lesson_feedback__correct.html');
                }
            });
        }
    }

    handleFeedback() {
        console.log('Showing feedback...');
        // If there are audio elements, play them.
        // Otherwise, wait for user interaction handled by Router.
    }
}

// Expose to window
window.LessonController = new LessonController();
