window.LessonController = {
    startLesson: function() {
        window.location.href = '/views/biblos_lesson__tutor_speaking.html';
    },
    startUserSpeaking: function() {
        window.location.href = '/views/biblos_lesson__user_speaking.html';
    },
    provideFeedback: function(isCorrect) {
        if (isCorrect) {
            window.location.href = '/views/biblos_lesson_feedback__correct.html';
        } else {
            window.location.href = '/views/biblos_lesson_feedback__correction.html';
        }
    },
    endLesson: function() {
        window.location.href = '/views/biblos_lesson_recap.html';
    },
    goHome: function() {
        window.location.href = '/views/biblos_home_dashboard.html';
    }
};

console.log('LessonController loaded');
