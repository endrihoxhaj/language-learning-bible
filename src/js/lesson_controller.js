window.LessonController = {
    state: 'idle',

    init: function() {
        console.log('Lesson Controller Initialized');
        // Detect current page to set initial state
        if (window.location.href.includes('tutor_speaking')) {
            this.setTutorSpeaking();
        } else if (window.location.href.includes('user_speaking')) {
            this.setUserSpeaking();
        }

        // Add specific listeners for lesson interaction if needed
        const micButton = document.querySelector('button .material-symbols-outlined');
        if (micButton && micButton.innerText === 'mic') {
             micButton.closest('button').addEventListener('click', () => {
                 this.handleMicClick();
             });
        }
    },

    setTutorSpeaking: function() {
        this.state = 'tutor_speaking';
        console.log('State: Tutor Speaking');
        // logic to play audio or animate tutor
    },

    setUserSpeaking: function() {
        this.state = 'user_speaking';
        console.log('State: User Speaking');
        // logic to listen to microphone
    },

    handleMicClick: function() {
        if (this.state === 'tutor_speaking') {
            // Interrupt or switch to user speaking
            window.location.href = '/views/biblos_lesson__user_speaking.html';
        } else {
             // Maybe stop recording or process input
             console.log('Mic clicked in user speaking mode');
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    window.LessonController.init();
});
