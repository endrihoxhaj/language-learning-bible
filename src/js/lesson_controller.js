class LessonController {
    constructor() {
        this.currentLessonState = null;
        this.synth = window.speechSynthesis;
    }

    onPageLoad(routeKey) {
        console.log('LessonController: Page Loaded', routeKey);
        this.currentLessonState = routeKey;

        if (routeKey === 'lesson_tutor') {
            setTimeout(() => this.initTutorSpeaking(), 500);
        } else if (routeKey === 'lesson_user') {
            this.initUserSpeaking();
        }
    }

    initTutorSpeaking() {
        // Try to find the dialogue text in the speech bubble
        // Usually in a p tag inside a white rounded div
        const bubbles = document.querySelectorAll('div.bg-white.rounded-2xl p');
        let textToSpeak = "";

        if (bubbles.length > 0) {
            textToSpeak = bubbles[0].innerText;
        }

        if (textToSpeak && this.synth) {
            console.log("Speaking:", textToSpeak);
            // Cancel previous
            this.synth.cancel();

            const utterThis = new SpeechSynthesisUtterance(textToSpeak);
            // Detect language? Default to English for the tutor in the example (teaching English)
            // But if the text is Italian, we should switch.
            // Simple heuristic: if it contains Italian words?
            // For now, let's assume English lesson.
            utterThis.lang = 'en-US';
            this.synth.speak(utterThis);
        }
    }

    initUserSpeaking() {
        console.log("User speaking mode initialized");
        // Here we would use Web Speech API (SpeechRecognition) if supported
        if ('webkitSpeechRecognition' in window) {
            // const recognition = new webkitSpeechRecognition();
            // recognition.start();
            console.log("Speech recognition supported but not fully implemented in this prototype.");
        }
    }
}

window.LessonController = new LessonController();
