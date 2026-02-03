
class Router {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('click', (e) => this.handleClick(e));
        this.handleSplashScreen();
    }

    handleSplashScreen() {
        const isSplash = document.title.includes('Splash Screen') ||
                         window.location.pathname.includes('biblos_splash_screen');

        if (isSplash) {
            setTimeout(() => {
                this.navigate('/views/biblos_onboarding_1_of_4.html');
            }, 3000);
        }
    }

    handleClick(e) {
        const target = e.target.closest('button, a, [role="button"], .clickable, .cursor-pointer');

        // Allow default behavior for inputs
        if (e.target.closest('input, label, select, textarea')) return;

        if (!target) return;

        // Handle Back Button
        if (this.isBackButton(target)) {
            e.preventDefault();
            window.history.back();
            return;
        }

        // Handle Explicit Navigation
        const navTarget = target.getAttribute('data-nav-target');
        if (navTarget) {
            e.preventDefault();
            this.navigate(navTarget);
            return;
        }
    }

    isBackButton(element) {
        // Check if the element or any child is an arrow_back icon
        if (element.innerText.includes('arrow_back')) return true;

        const icon = element.querySelector('.material-symbols-outlined');
        if (icon && icon.innerText.trim() === 'arrow_back') return true;

        return false;
    }

    navigate(path) {
        // Ensure path starts with / if not present (though data-nav-target usually has it)
        // But local file system might be tricky.
        // In Capacitor, paths are relative to root.
        // If we are in /views/, and want to go to /views/foo.html, it works.
        // But if we are in /index.html (root), /views/foo.html works.

        window.location.href = path;
    }
}

// Initialize
window.router = new Router();
