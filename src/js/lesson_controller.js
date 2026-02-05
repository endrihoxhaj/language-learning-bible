window.LessonController = {
    state: {},
    recognition: null,

    init: function() {
        console.log('Lesson Controller Initialized');
        const path = window.location.pathname;
        if (path.includes('biblos_lesson__tutor_speaking')) {
            this.startTutorSpeaking();
        } else if (path.includes('biblos_lesson__user_speaking')) {
            this.startUserSpeaking();
        }
    },

    startTutorSpeaking: function() {
        console.log('State: Tutor Speaking');
        // Example text, in a real app this would come from the lesson data
        const text = "Ciao! Oggi parliamo di cibo.";

        if ('speechSynthesis' in window) {
            // Cancel any pending speech
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'it-IT';
            utterance.onend = () => {
                console.log('Tutor finished speaking');
            };
            window.speechSynthesis.speak(utterance);
        } else {
            console.log('TTS not supported, using console log: ' + text);
        }
    },

    startUserSpeaking: function() {
        console.log('State: User Speaking');

        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.lang = 'it-IT';
            this.recognition.continuous = false;
            this.recognition.interimResults = false;

            this.recognition.onstart = () => {
                console.log('Voice recognition started. Speak now.');
            };

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                console.log('You said: ' + transcript);
                this.handleUserInput(transcript);
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error', event.error);
            };

            try {
                this.recognition.start();
            } catch (e) {
                console.error(e);
            }
        } else {
            console.log('Speech Recognition not supported.');
            // Fallback: Simulate success after 3 seconds for demo purposes
            setTimeout(() => {
                console.log('Simulated voice input: "Ciao"');
                this.handleUserInput("Ciao");
            }, 3000);
        }
    },

    handleUserInput: function(text) {
        console.log("Processing input:", text);
        // Logic to validate input would go here.
        // For prototype, we assume success.
    }
};

document.addEventListener('DOMContentLoaded', () => {
    window.LessonController.init();
});
