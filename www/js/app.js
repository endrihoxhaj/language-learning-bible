
// App initialization logic

document.addEventListener('DOMContentLoaded', () => {
    console.log('BIBLOS App Initialized');

    // Simulate splash screen delay
    if (!window.location.hash || window.location.hash === '#splash') {
        setTimeout(() => {
            window.router.navigate('onboarding_1');
        }, 3000);
    }
});
