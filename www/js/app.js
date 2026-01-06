import { navigateTo } from './router.js';

document.addEventListener('DOMContentLoaded', () => {
    navigateTo('/');
});

// Expose navigateTo globally for use in HTML event handlers
window.navigateTo = navigateTo;
