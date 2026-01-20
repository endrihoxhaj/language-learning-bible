document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', (e) => {
        let target = e.target.closest('button, a, div[role="button"]');
        if (!target) return;

        // Clone to safely remove icons for text extraction
        const clone = target.cloneNode(true);
        const icons = clone.querySelectorAll('.material-symbols-outlined');
        icons.forEach(icon => icon.remove());

        const text = clone.innerText.trim().toUpperCase();
        // Check for icon content if available
        const iconElement = target.querySelector('.material-symbols-outlined');
        const iconText = iconElement ? iconElement.innerText.trim() : '';

        console.log('Clicked:', text, 'Icon:', iconText);

        // Navigation Logic
        // Use absolute paths assuming the app is served from the 'www' root

        if (text.includes('INIZIA') || text.includes('START')) {
            window.location.href = '/views/biblos_lesson__tutor_speaking.html';
        } else if (text.includes('VOCABOLARIO') || text.includes('VOCABULARY')) {
            window.location.href = '/views/biblos_vocabulary_review.html';
        } else if (text.includes('PROGRESSI') || text.includes('PROGRESS')) {
            window.location.href = '/views/biblos_progress.html';
        } else if (text.includes('CHAT LIBERA') || text.includes('FREE CHAT')) {
            window.location.href = '/views/biblos_lesson__user_speaking.html';
        } else if (text.includes('HOME')) {
            window.location.href = '/index.html';
        } else if (text.includes('LEZIONI') || text.includes('LESSONS')) {
            window.location.href = '/views/biblos_study_plans.html';
        } else if (text.includes('PROFILO') || text.includes('PROFILE')) {
            window.location.href = '/views/biblos_profile.html';
        } else if (text.includes('TUTOR')) {
             window.location.href = '/views/biblos_tutor_selection.html';
        } else if (iconText === 'arrow_forward') {
             // Heuristic: If inside a progress section, go to progress
             if (target.closest('section') && target.closest('section').innerText.toUpperCase().includes('PERCORSO')) {
                 window.location.href = '/views/biblos_progress.html';
             }
        }
    });
});
