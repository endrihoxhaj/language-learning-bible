
window.LessonController = {
    init: function() {
        console.log('LessonController initialized');
        this.handleCurrentState();
    },

    handleCurrentState: function() {
        const path = window.location.pathname;

        if (path.includes('biblos_lesson__tutor_speaking')) {
            this.handleTutorSpeaking();
        } else if (path.includes('biblos_lesson__user_speaking')) {
            this.handleUserSpeaking();
        } else if (path.includes('biblos_lesson_feedback')) {
            this.handleFeedback();
        } else if (path.includes('biblos_lesson_recap')) {
             // Recap handles its own navigation usually via "CONTINUA"
        }
    },

    handleTutorSpeaking: function() {
        console.log('State: Tutor Speaking');
        // Simulate audio playing delay
        setTimeout(() => {
            console.log('Tutor finished speaking, moving to user speaking');
            // Auto transition or wait for user?
            // Usually design has a button or auto.
            // If there's a button, Router handles it.
            // If we want auto transition:
            // window.Router.navigate('biblos_lesson__user_speaking');

            // Let's assume we wait for user interaction or "ASCOLTA" completion.
            // But usually for "Tutor Speaking", it plays and then maybe waits or moves on.
            // Let's add an event listener to any "mic" button to go to user speaking
        }, 3000);
    },

    handleUserSpeaking: function() {
        console.log('State: User Speaking');
        // Look for the mic button
        const micButton = document.querySelector('.mic-pulse, .mic-button');
        if (micButton) {
            micButton.addEventListener('click', () => {
                this.stopRecording();
            });
        }

        // Simulate recording timeout
        setTimeout(() => {
             // this.stopRecording();
        }, 5000);
    },

    stopRecording: function() {
        console.log('Stopping recording...');
        // Simulate AI processing
        setTimeout(() => {
            // Randomly go to correct or correction for demo purposes
            const correct = Math.random() > 0.3;
            if (correct) {
                window.Router.navigate('biblos_lesson_feedback__correct');
            } else {
                window.Router.navigate('biblos_lesson_feedback__correction');
            }
        }, 1500);
    },

    handleFeedback: function() {
        console.log('State: Feedback');
        // Usually wait for "CONTINUA" click handled by Router
    }
};

document.addEventListener('DOMContentLoaded', () => {
    window.LessonController.init();
});
