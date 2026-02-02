
window.LessonController = (function() {
    console.log("LessonController loaded");

    function init() {
        const path = window.location.pathname;

        if (path.includes('biblos_lesson__tutor_speaking')) {
            initTutorSpeaking();
        } else if (path.includes('biblos_lesson__user_speaking')) {
            initUserSpeaking();
        }
    }

    function initTutorSpeaking() {
        console.log("Initializing Tutor Speaking");

        document.addEventListener('click', (e) => {
            const target = e.target.closest('button');
            if (!target) return;

            const icon = target.querySelector('.material-symbols-outlined');
            if (icon && icon.textContent.trim() === 'mic') {
                e.preventDefault(); // Prevent default if any
                window.location.href = 'biblos_lesson__user_speaking.html';
            }
        });
    }

    function initUserSpeaking() {
        console.log("Initializing User Speaking");

        const stopBtn = document.querySelector('.mic-pulse');
        if (stopBtn) {
            stopBtn.addEventListener('click', (e) => {
                e.preventDefault();
                // Simulate processing delay then navigate
                setTimeout(() => {
                    window.location.href = 'biblos_lesson_feedback__correct.html';
                }, 1000);
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    return {
        init: init
    };
})();
