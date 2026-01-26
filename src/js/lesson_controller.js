window.LessonController = {
    state: {
        currentStep: 0,
        totalSteps: 5,
        userSpokenText: '',
        isRecording: false
    },

    startLesson: function() {
        console.log('Lesson started');
    },

    startRecording: function() {
        this.state.isRecording = true;
        console.log('Recording started...');
    },

    stopRecording: function() {
        this.state.isRecording = false;
        console.log('Recording stopped.');
    },

    submitAudio: function() {
        console.log('Audio submitted');
        return Promise.resolve({ correct: true, feedback: "Good job!" });
    }
};
