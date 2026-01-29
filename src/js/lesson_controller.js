// src/js/lesson_controller.js

window.LessonController = {
    init: function() {
        console.log('LessonController initialized');
        this.checkState();
    },

    checkState: function() {
        const path = window.location.pathname;

        if (path.includes('biblos_lesson__user_speaking')) {
            this.handleUserSpeaking();
        }
    },

    handleUserSpeaking: function() {
        console.log('User Speaking Mode');
        // Simulate recording for 4 seconds then finish
        setTimeout(() => {
            console.log('Recording finished, navigating to feedback...');
            if (window.Router) {
                window.Router.navigateTo('/views/biblos_lesson_feedback__correct.html');
            } else {
                window.location.href = '/views/biblos_lesson_feedback__correct.html';
            }
        }, 4000);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    window.LessonController.init();
});
