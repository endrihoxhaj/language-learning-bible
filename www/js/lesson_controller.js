const LessonController = {
    start: function(viewName) {
        console.log('LessonController: View loaded', viewName);

        if (viewName.includes('lesson__tutor_speaking')) {
            this.initTutorSpeaking();
        } else if (viewName.includes('lesson__user_speaking')) {
            this.initUserSpeaking();
        } else if (viewName.includes('lesson_feedback')) {
            this.initFeedback();
        }
    },

    initTutorSpeaking: function() {
        // Simulate Tutor Audio
        console.log('Tutor speaking...');
        const playBtn = document.querySelector('button');
        if (playBtn) {
            playBtn.addEventListener('click', () => {
                // Navigate to user speaking after "audio" finishes or user clicks
                 if (window.Router) {
                    window.Router.loadView('biblos_lesson__user_speaking.html');
                }
            });
        }
    },

    initUserSpeaking: function() {
        // Setup mic interaction
        const micButtons = document.querySelectorAll('button');
        micButtons.forEach(btn => {
            if (btn.innerText.includes('PARLA') || btn.querySelector('.material-symbols-outlined')?.textContent.includes('mic')) {
                btn.onclick = (e) => {
                    e.stopPropagation(); // Prevent default router navigation if it clashes
                    console.log('Simulating recording...');
                    btn.classList.add('bg-red-500'); // Visual feedback

                    setTimeout(() => {
                        btn.classList.remove('bg-red-500');
                        // Randomly go to correct or correction
                        const success = Math.random() > 0.3;
                        const nextView = success ? 'biblos_lesson_feedback__correct.html' : 'biblos_lesson_feedback__correction.html';
                        if (window.Router) window.Router.loadView(nextView);
                    }, 2000);
                };
            }
        });
    },

    initFeedback: function() {
        // Auto proceed after delay or wait for click
        const continueBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('CONTINUA'));
        if (continueBtn) {
            continueBtn.onclick = (e) => {
                e.stopPropagation();
                if (window.Router) window.Router.loadView('biblos_lesson_recap.html');
            }
        }
    }
};

window.LessonController = LessonController;
