const App = {
    onRouteChanged: function(path) {
        console.log('Route changed to:', path);
        // Common logic: attach listeners to generic buttons
        this.attachNavigationListeners(path);

        // Page specific logic
        if (path === '/') {
            setTimeout(() => {
                Router.navigate('/onboarding/1');
            }, 3000);
        }
    },

    attachNavigationListeners: function(currentPath) {
        // Here we try to make the buttons functional based on their context
        // Since the HTML is generated from design files, they don't have IDs or specific classes for logic.
        // We have to infer intent or add specific logic based on text content or structure.

        // Example: Onboarding "Next" buttons
        if (currentPath.startsWith('/onboarding/')) {
            const nextBtn = document.querySelector('button.bg-primary');
            if (nextBtn) {
                nextBtn.onclick = () => {
                    const step = parseInt(currentPath.split('/')[2]);
                    if (step < 4) {
                        Router.navigate(`/onboarding/${step + 1}`);
                    } else {
                        // After step 4, go to Tutor Selection
                        Router.navigate('/tutor-selection');
                    }
                };
            }
        }

        if (currentPath === '/tutor-selection') {
            // Select tutor buttons
            const buttons = document.querySelectorAll('button');
            buttons.forEach(btn => {
                if (btn.innerText.includes('SCEGLI') || btn.innerText.includes('SELECT')) {
                    btn.onclick = () => Router.navigate('/study-plans');
                }
            });
        }

        if (currentPath === '/study-plans') {
            const btn = document.querySelector('button.bg-primary');
            if (btn) btn.onclick = () => Router.navigate('/home');
        }

        if (currentPath === '/home') {
            // Home Dashboard Listeners
            // "INIZIA LEZIONE" -> Lesson
            const startBtn = document.querySelector('button.bg-primary');
            if (startBtn && startBtn.innerText.includes('INIZIA')) {
                startBtn.onclick = () => Router.navigate('/lesson/tutor-speaking');
            }

            // Bottom Nav
            const navButtons = document.querySelectorAll('nav button');
            if (navButtons.length >= 4) {
                // 0: Home, 1: Lezioni, 2: Progressi, 3: Profilo
                navButtons[0].onclick = () => Router.navigate('/home');
                navButtons[1].onclick = () => {}; // Stay or List
                navButtons[2].onclick = () => Router.navigate('/progress');
                navButtons[3].onclick = () => Router.navigate('/settings');
            }
        }

        if (currentPath === '/lesson/tutor-speaking') {
            // Simulate listening and move to user speaking
            setTimeout(() => {
                // Assuming there is a "Next" or "Reply" button, or auto transition
                // For now, let's look for a mic button or similar
                const micBtn = document.querySelector('button');
                 if (micBtn) micBtn.onclick = () => Router.navigate('/lesson/user-speaking');
            }, 1000);
        }

        if (currentPath === '/lesson/user-speaking') {
             const micBtn = document.querySelector('button.rounded-full'); // Big mic button
             if (micBtn) {
                 micBtn.onclick = () => {
                     // Simulate processing -> Feedback Correct (or Correction)
                     // Randomly choose for demo
                     if (Math.random() > 0.5) {
                         Router.navigate('/lesson/feedback-correct');
                     } else {
                         Router.navigate('/lesson/feedback-correction');
                     }
                 };
             }
        }

        if (currentPath === '/lesson/feedback-correct' || currentPath === '/lesson/feedback-correction') {
             const continueBtn = document.querySelector('button.bg-primary'); // "Continua"
             if (continueBtn) {
                 continueBtn.onclick = () => Router.navigate('/lesson/recap');
             }
        }

        if (currentPath === '/lesson/recap') {
            const homeBtn = document.querySelector('button');
            if (homeBtn) homeBtn.onclick = () => Router.navigate('/home');
        }
    }
};

window.App = App;
