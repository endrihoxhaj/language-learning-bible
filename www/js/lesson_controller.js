// lesson_controller.js

class LessonController {
    constructor() {
        console.log('LessonController initialized');
        this.state = {
            isRecording: false,
            currentLesson: null,
            progress: 0
        };
        this.init();
    }

    init() {
        // Find lesson elements
        const micButton = document.querySelector('button .material-symbols-outlined');
        if (micButton && micButton.textContent.trim() === 'mic') {
            const btn = micButton.closest('button');
            btn.addEventListener('click', (e) => this.handleMicClick(e));
        }
    }

    startLesson(lessonId) {
        console.log('Starting lesson:', lessonId);
        this.state.currentLesson = lessonId;
    }

    handleMicClick(e) {
        // e.preventDefault(); // Don't prevent default if router handles navigation
        console.log('Mic clicked');
        // Logic to simulate recording or API call would go here
        this.toggleRecording();
    }

    toggleRecording() {
        this.state.isRecording = !this.state.isRecording;
        console.log('Recording state:', this.state.isRecording);

        if (this.state.isRecording) {
            // Simulate AI listening
            console.log('AI Listening...');
        } else {
            console.log('Processing speech...');
        }
    }

    // Called by pages to update progress
    updateProgress(percent) {
        this.state.progress = percent;
        console.log('Progress updated:', percent);
    }
}

window.LessonController = new LessonController();
