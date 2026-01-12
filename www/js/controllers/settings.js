
export function initSettings() {
    console.log('Initializing Settings');
    const toggles = document.querySelectorAll('input[type="checkbox"]');
    toggles.forEach(toggle => {
        const updateVisuals = () => {
             if(toggle.checked) {
               toggle.nextElementSibling.classList.add('bg-primary');
               toggle.nextElementSibling.classList.remove('bg-gray-300');
           } else {
               toggle.nextElementSibling.classList.remove('bg-primary');
               toggle.nextElementSibling.classList.add('bg-gray-300');
           }
        };

        toggle.addEventListener('change', updateVisuals);
        // Init state
        updateVisuals();
    });

    // Handle back button
    const backBtn = document.querySelector('header button');
    if (backBtn) {
        backBtn.onclick = () => window.navigateTo('/home'); // Or previous
    }
}
