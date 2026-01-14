class LessonController {
    constructor() {
        this.currentLesson = null;
        this.score = 0;
    }

    init(lessonId) {
        console.log('Lesson initialized:', lessonId);
        this.currentLesson = lessonId;
        this.score = 0;
    }

    onViewLoaded(viewName) {
        console.log('View loaded in LessonController:', viewName);

        if (viewName === 'biblos_lesson__tutor_speaking') {
            this.playTutorAudio();
        }

        if (viewName === 'biblos_lesson__user_speaking') {
            this.startListening();
        }
    }

    playTutorAudio() {
        console.log('Playing tutor audio...');
        // Simulate audio playback
        setTimeout(() => {
            console.log('Audio finished');
        }, 2000);
    }

    startListening() {
        console.log('Listening for user input...');
        // Simulate listening
        const micButton = document.querySelector('button .material-symbols-outlined[innerText="mic"]');
        if (micButton) {
            micButton.parentElement.classList.add('animate-pulse');
        }
    }
}

window.LessonController = new LessonController();
