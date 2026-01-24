document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', (e) => {
        // Find closest clickable element
        const target = e.target.closest('button, a, .cursor-pointer');
        if (!target) return;

        // Check if the target or any of its children are inputs/labels.
        // If so, and if we are not on a navigation button, let default behavior happen (e.g. radio selection).
        // Navigation buttons usually have high contrast backgrounds or specific classes.
        // Heuristic: If it has an input child, it's likely a form control, unless it's a known nav pattern.
        if (target.querySelector('input')) {
            // It's a container for an input (like the language cards in onboarding 3)
            // We usually want to allow selection.
            // But if it's meant to navigate upon selection (like Onboarding 2), we handle it.
            const path = window.location.pathname;
            if (path.includes('biblos_onboarding_2_of_4')) {
                 // English/Italiano selection -> Navigate
                 e.preventDefault();
                 // Logic continues below
            } else {
                 // Onboarding 3 has radio buttons + a separate "CONTINUA" button.
                 // So we should NOT prevent default here.
                 return;
            }
        } else {
             e.preventDefault();
        }

        // Icon check
        const icons = target.querySelectorAll('.material-symbols-outlined');
        let iconText = '';
        icons.forEach(icon => iconText += icon.textContent.trim() + ' ');
        iconText = iconText.trim();

        if (iconText.includes('arrow_back')) {
            window.history.back();
            return;
        }

        // Text content check
        const text = target.innerText.trim();
        const path = window.location.pathname;

        // Logging for debug
        console.log('Click:', text, 'Path:', path, 'Icon:', iconText);

        // Routing Logic

        // Onboarding Flow
        if (text.includes('INIZIAMO')) {
            window.location.href = '/views/biblos_onboarding_2_of_4.html';
        } else if (path.includes('biblos_onboarding_2_of_4')) {
            if (text.includes('English') || text.includes('Italiano')) {
                window.location.href = '/views/biblos_onboarding_3_of_4.html';
            }
        } else if (path.includes('biblos_onboarding_3_of_4') && text.includes('CONTINUA')) {
            window.location.href = '/views/biblos_onboarding_4_of_4.html';
        } else if (text.includes('Inizia il Test')) {
            window.location.href = '/views/biblos_placement_test.html';
        }

        // Placement & Tutor
        else if (path.includes('biblos_placement_test') && iconText.includes('arrow_forward')) {
            window.location.href = '/views/biblos_tutor_selection.html';
        } else if (text.includes('CONFERMA SCELTA')) {
            window.location.href = '/views/biblos_home_dashboard.html';
        }

        // Home Dashboard
        else if (path.includes('biblos_home_dashboard')) {
            if (text.includes('INIZIA LEZIONE') || text.includes('Vangelo')) {
                 window.location.href = '/views/biblos_lesson__tutor_speaking.html';
            }
        }

        // Study Plans
        else if (path.includes('biblos_study_plans')) {
             if (text.includes('CONTINUA')) {
                 window.location.href = '/views/biblos_lesson__tutor_speaking.html';
             }
        }

        // Lesson Flow
        else if (path.includes('biblos_lesson_feedback__correct') && text.includes('CONTINUA')) {
            window.location.href = '/views/biblos_lesson_recap.html';
        } else if (path.includes('biblos_lesson_recap')) {
             if (text.includes('PROSSIMA LEZIONE') || text.includes('Torna alla Home')) {
                window.location.href = '/views/biblos_home_dashboard.html';
             }
        }

        // Bottom Navigation (Text matching or icon matching)
        if (text.includes('Home') || iconText.includes('home')) {
            window.location.href = '/views/biblos_home_dashboard.html';
        } else if (text.includes('Lezioni') || iconText.includes('book_2') || iconText.includes('school')) {
            window.location.href = '/views/biblos_study_plans.html';
        } else if (text.includes('Progressi') || iconText.includes('emoji_events') || iconText.includes('bar_chart')) {
            window.location.href = '/views/biblos_progress.html';
        } else if (text.includes('Profilo') || iconText.includes('person')) {
            window.location.href = '/views/biblos_profile.html';
        }
    });
});
