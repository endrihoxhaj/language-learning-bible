document.addEventListener('DOMContentLoaded', () => {
    console.log('Lesson Controller initialized');

    const getCurrentPage = () => {
        const path = window.location.pathname;
        const page = path.split('/').pop().replace('.html', '');
        return page;
    };

    const currentPage = getCurrentPage();

    // --- Tutor Speaking Page ---
    if (currentPage === 'biblos_lesson__tutor_speaking') {
        const micButtons = document.querySelectorAll('button');
        micButtons.forEach(btn => {
            if (btn.querySelector('.material-symbols-outlined')?.textContent.includes('mic')) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('Mic clicked, going to user speaking...');
                    window.location.href = '/views/biblos_lesson__user_speaking.html';
                });
            }
        });
    }

    // --- User Speaking Page ---
    if (currentPage === 'biblos_lesson__user_speaking') {
        console.log('User speaking mode...');
        // Simulate listening for 3 seconds then success
        setTimeout(() => {
            console.log('Finished speaking, going to feedback...');
            window.location.href = '/views/biblos_lesson_feedback__correct.html';
        }, 3000);
    }

    // --- Feedback / Recap pages are handled by Router's "CONTINUA" flow ---
});
