window.LessonController = {
    state: 'init',

    init: function() {
        console.log('Lesson Controller Initialized');
        this.attachListeners();
    },

    attachListeners: function() {
        const micButton = document.querySelector('button .material-symbols-outlined');
        if (micButton && micButton.innerText === 'mic') {
            micButton.closest('button').addEventListener('click', () => {
                this.handleMicClick();
            });
        }
    },

    handleMicClick: function() {
        console.log('Mic clicked');
        // Simulate recording -> processing -> response flow
        if (window.location.href.includes('tutor_speaking')) {
            window.location.href = '/views/biblos_lesson__user_speaking.html';
        } else if (window.location.href.includes('user_speaking')) {
            // Simulate processing
            setTimeout(() => {
                window.location.href = '/views/biblos_lesson_feedback__correct.html';
            }, 1000);
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    window.LessonController.init();
});
