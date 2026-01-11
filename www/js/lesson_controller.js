// AI/Lesson Controller Logic
class LessonController {
    constructor() {
        this.tutorState = 'idle'; // idle, speaking, listening, feedback
        this.recognition = null;
        this.synthesis = null;
        this.currentView = '';
    }

    init(viewName) {
        this.currentView = viewName;
        console.log(`Lesson Controller initialized for ${viewName}`);

        if (viewName === 'lesson_tutor') {
            this.handleTutorView();
        } else if (viewName === 'lesson_user') {
            this.handleUserSpeakingView();
        } else if (viewName === 'lesson_feedback_correct' || viewName === 'lesson_feedback_correction') {
            this.handleFeedbackView();
        }
    }

    handleTutorView() {
        // Find microphone button to transition to user speaking
        const micButton = document.querySelector('button .material-symbols-outlined:contains("mic")')?.parentElement
            || document.querySelector('button[class*="bg-primary"]'); // Fallback selector based on class

        if (micButton) {
            micButton.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation(); // Stop router from auto-handling if it conflicts
                window.router.navigate('lesson_user');
            };
        }

        // Simulate Tutor Speaking text-to-speech
        const textElement = document.querySelector('p.text-text-dark');
        if (textElement && 'speechSynthesis' in window) {
            // Optional: Auto speak
            // const utterance = new SpeechSynthesisUtterance(textElement.innerText);
            // window.speechSynthesis.speak(utterance);
        }

        // Handle Translate button
        const translateBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Traduci'));
        if (translateBtn) {
            translateBtn.onclick = () => {
                alert('Translation: Benvenuti alla cena parrocchiale! Vorresti del pane?');
            }
        }
    }

    handleUserSpeakingView() {
        // Find stop/send button
        const stopButton = document.querySelector('.mic-pulse') || document.querySelector('.bg-sage');

        // Find text display for transcription
        const transcriptionDisplay = document.querySelector('.text-brown-text.dark\\:text-white.text-lg');

        if (stopButton) {
            // Simulate holding/recording
            let recording = true;

            stopButton.onclick = () => {
                // Determine random outcome for demo purposes: Correct or Correction
                const isCorrect = Math.random() > 0.5;
                if (isCorrect) {
                    window.router.navigate('lesson_feedback_correct');
                } else {
                    window.router.navigate('lesson_feedback_correction');
                }
            };
        }

        // Simulate real-time transcription
        if (transcriptionDisplay) {
            const originalText = transcriptionDisplay.innerText;
            // You could animate this
        }
    }

    handleFeedbackView() {
        const continueBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.toUpperCase().includes('CONTINUA'));
        if (continueBtn) {
            continueBtn.onclick = () => {
                window.router.navigate('lesson_recap'); // or back to dashboard/next lesson
            };
        }

        const retryBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.toUpperCase().includes('RIPROVA'));
        if (retryBtn) {
            retryBtn.onclick = () => {
                window.router.navigate('lesson_user');
            };
        }
    }
}

window.lessonController = new LessonController();
