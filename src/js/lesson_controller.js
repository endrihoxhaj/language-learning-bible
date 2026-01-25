window.LessonController = {
    init: function() {
        const path = window.location.pathname;
        if (path.includes('user_speaking')) {
            this.startUserSpeaking();
        } else if (path.includes('tutor_speaking')) {
            // Tutor speaking logic
        }
    },

    startUserSpeaking: function() {
         console.log('User speaking...');
         // Simulate recording duration then auto transition to feedback
         setTimeout(() => {
             // In a real app, this would be after silence detection or button release
             // navigating to feedback
             window.location.href = '/views/biblos_lesson_feedback__correct.html';
         }, 3000);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    window.LessonController.init();
});
