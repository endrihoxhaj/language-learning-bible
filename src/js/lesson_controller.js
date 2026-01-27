window.LessonController = {
    startUserSpeaking: function() {
        console.log("LessonController: startUserSpeaking");
        window.location.href = '/views/biblos_lesson__user_speaking.html';
    },
    startTutorSpeaking: function() {
        console.log("LessonController: startTutorSpeaking");
        window.location.href = '/views/biblos_lesson__tutor_speaking.html';
    },
    showFeedbackCorrect: function() {
        console.log("LessonController: showFeedbackCorrect");
        window.location.href = '/views/biblos_lesson_feedback__correct.html';
    },
    showFeedbackCorrection: function() {
        console.log("LessonController: showFeedbackCorrection");
        window.location.href = '/views/biblos_lesson_feedback__correction.html';
    },
    endLesson: function() {
        console.log("LessonController: endLesson");
         window.location.href = '/views/biblos_lesson_recap.html';
    }
};
