
// Generic Controller Setup

window.controllers = {
    onboarding: (step) => {
        console.log(`Onboarding Step ${step}`);
        // Specific selector for the main action button
        const nextBtn = document.querySelector('main button.bg-primary') || document.querySelector('main button.bg-biblos-gold');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (step < 4) {
                    window.router.navigate(`/onboarding/${step + 1}`);
                } else {
                    window.router.navigate('/tutor_selection');
                }
            });
        }
    },

    tutor_selection: () => {
        // Find the confirm/continue button.
        // Based on typical design, it's likely a primary button at the bottom.
        const confirmBtn = document.querySelector('button.bg-primary') || document.querySelector('button.bg-biblos-gold');
        if(confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                 window.router.navigate('/placement_test');
            });
        }

        // Also handle selection cards if they are interactive
        // This part depends on the specific HTML structure of tutor selection
    },

    placement_test: () => {
         const continueBtn = document.querySelector('button.bg-primary');
         if (continueBtn) {
            continueBtn.addEventListener('click', () => {
                 window.router.navigate('/home');
            });
         }
    },

    home: () => {
         const startLessonBtn = Array.from(document.querySelectorAll('button')).find(btn => btn.innerText.toLowerCase().includes('inizia lezione'));
         if (startLessonBtn) {
             startLessonBtn.addEventListener('click', () => window.router.navigate('/lesson/tutor'));
         }

         const vocabBtn = Array.from(document.querySelectorAll('button')).find(btn => btn.innerText.toLowerCase().includes('vocabolario'));
         if (vocabBtn) {
             vocabBtn.addEventListener('click', () => window.router.navigate('/vocabulary_review'));
         }

        setupBottomNav();
    },

    lesson: (type) => {
         // Logic for lesson flow
         // We need to find the specific "Continue" or "Check" button
         // Avoid hooking up the "Mic" button to navigation if it's meant for recording

         const actionBtn = document.querySelector('button.bg-primary') || document.querySelector('button.bg-biblos-gold');

         if (actionBtn) {
            actionBtn.addEventListener('click', () => {
                if (type === 'tutor') window.router.navigate('/lesson/user');
                if (type === 'user') window.router.navigate('/lesson/feedback/correct'); // or correction, simulated
                if (type === 'feedback') window.router.navigate('/lesson/recap');
                if (type === 'recap') window.router.navigate('/home');
            });
         }
    },

    settings: () => {
        setupBottomNav();

        // Re-implement the toggle logic from the inline script
        const toggles = document.querySelectorAll('input[type="checkbox"]');
        toggles.forEach(toggle => {
            toggle.addEventListener('change', function() {
               if(this.checked) {
                   this.nextElementSibling.classList.add('bg-primary');
                   this.nextElementSibling.classList.remove('bg-gray-300');
               } else {
                   this.nextElementSibling.classList.remove('bg-primary');
                   this.nextElementSibling.classList.add('bg-gray-300');
               }
            });
            // Init state
            if(toggle.checked) {
               toggle.nextElementSibling.classList.add('bg-primary');
               toggle.nextElementSibling.classList.remove('bg-gray-300');
            }
        });

        // Back button
        const backBtn = document.querySelector('header button');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                window.history.back();
            });
        }
    }
};

function setupBottomNav() {
    const navButtons = document.querySelectorAll('nav button');
     navButtons.forEach(btn => {
         const text = btn.innerText.toLowerCase();
         if(text.includes('home')) {
             btn.addEventListener('click', () => window.router.navigate('/home'));
         } else if(text.includes('lezioni')) {
              btn.addEventListener('click', () => window.router.navigate('/study_plans'));
         } else if(text.includes('progressi')) {
              btn.addEventListener('click', () => window.router.navigate('/progress'));
         } else if(text.includes('profilo')) {
              // Redirect to what we suspect is the profile screen (untitled_screen or settings)
              // The designs have 'untitled_screen' which might be it, or maybe 'biblos_settings_screen' IS the profile logic
              // Reviewer said "untitled_screen.html (which appears to be the Profile screen)"
              // Let's try that.
              btn.addEventListener('click', () => window.router.navigate('/profile'));
         }
     });
}
