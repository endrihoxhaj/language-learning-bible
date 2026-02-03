
class LessonController {
    constructor() {
        this.init();
    }

    init() {
        console.log('LessonController initialized');
        this.handleCurrentScreen();
    }

    handleCurrentScreen() {
        const path = window.location.pathname;

        if (path.includes('biblos_lesson__tutor_speaking')) {
            this.playTutorAudio();
        } else if (path.includes('biblos_lesson__user_speaking')) {
            this.startListening();
        }
    }

    playTutorAudio() {
        console.log('Playing tutor audio...');
        // Simulation: wait a bit then maybe highlight something
    }

    startListening() {
        console.log('Listening to user...');
        // Simulation: activate mic visualization
    }
}

window.lessonController = new LessonController();
