class LessonController {
    constructor() {
        this.currentLessonState = {};
    }

    init(viewName) {
        console.log(`LessonController init: ${viewName}`);

        switch (viewName) {
            case 'biblos_lesson__tutor_speaking':
                this.initTutorSpeaking();
                break;
            case 'biblos_lesson__user_speaking':
                this.initUserSpeaking();
                break;
            case 'biblos_lesson_feedback__correct':
            case 'biblos_lesson_feedback__correction':
                this.initFeedback();
                break;
        }
    }

    initTutorSpeaking() {
        // Simulate audio playback visual
        const avatar = document.querySelector('img[alt*="Saint Francis"]');
        if (avatar) {
            avatar.classList.add('animate-pulse');
            setTimeout(() => {
                avatar.classList.remove('animate-pulse');
            }, 3000);
        }
    }

    initUserSpeaking() {
        // Simulate listening
        const micButton = document.querySelector('button .material-symbols-outlined[name="mic"]'); // Selector might need adjustment
        // Or just find the big mic button
        const buttons = document.querySelectorAll('button');
        buttons.forEach(btn => {
            if (btn.innerHTML.includes('mic') || btn.innerHTML.includes('stop')) {
                // Add listening animation
                const pulse = document.createElement('div');
                pulse.className = 'absolute inset-0 rounded-full bg-primary/20 animate-ping';
                btn.style.position = 'relative';
                // btn.appendChild(pulse); // Might break layout, be careful

                // Instead, lets just change the button style to look active
                btn.classList.add('ring-4', 'ring-primary/30');
            }
        });
    }

    initFeedback() {
        // Play success/fail sound?
        // For now, just logging
        console.log("Showing feedback");
    }
}

// Expose instance
window.LessonController = new LessonController();
