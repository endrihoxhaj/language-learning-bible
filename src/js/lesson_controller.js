// src/js/lesson_controller.js

class LessonController {
    constructor() {
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.attachListeners());
        } else {
            this.attachListeners();
        }
    }

    attachListeners() {
        // Delegate specific lesson interactions
        document.body.addEventListener('click', (e) => {
            // Find closest button
            const btn = e.target.closest('button');
            if (!btn) return;

            // Check for Material Symbols
            const icon = btn.querySelector('.material-symbols-outlined');
            const iconText = icon ? icon.innerText.trim() : '';

            // Check if we are in a lesson context (url contains lesson)
            const isLesson = window.location.pathname.includes('biblos_lesson');

            if (isLesson) {
                // Tutor Speaking Screen: Mic button starts user speaking
                if (iconText === 'mic') {
                   this.transitionTo('biblos_lesson__user_speaking');
                }

                // User Speaking Screen: Stop button (no icon text usually, but structure is specific)
                // The button has class 'mic-pulse' or contains a square div
                const isStopButton = btn.querySelector('div.bg-white.rounded-\\[4px\\]') || btn.classList.contains('mic-pulse');

                if (isStopButton) {
                    // Navigate to feedback (Correction or Correct)
                    // For demo purposes, we go to correction as per flow
                    this.transitionTo('biblos_lesson_feedback__correction');
                }
            }
        });

        // Handle "hold to speak" logic if needed (mousedown/mouseup)
        // For now, click is sufficient for the "mic" button based on design analysis
        // (Text says "Tieni premuto per parlare" - Hold to speak)
        // If we strictly follow "Hold to speak", we might need to handle mousedown/mouseup.
        // But for a click-through prototype, click is safer unless I implement recording logic.
        // I will add a simple mousedown/up handler for the mic button just in case,
        // but navigating on click is probably expected for the prototype flow.
    }

    transitionTo(screenName) {
        if (window.router && window.router.navigate) {
            window.router.navigate(screenName);
        } else {
            window.location.href = `/views/${screenName}.html`;
        }
    }
}

// Initialize
window.LessonController = new LessonController();
