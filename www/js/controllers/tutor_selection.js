
export function initTutorSelection() {
    console.log('Initializing Tutor Selection');
    const cards = document.querySelectorAll('.group.relative');

    // We want single selection here
    cards.forEach(card => {
        card.addEventListener('click', () => {
            // Deselect all
            cards.forEach(c => {
                c.classList.remove('border-[3px]', 'border-primary', 'shadow-[0_4px_20px_rgba(0,0,0,0.06)]', 'scale-[1.01]');
                c.classList.add('border', 'border-transparent', 'shadow-[0_2px_8px_rgba(0,0,0,0.04)]');

                const badge = c.querySelector('.absolute.top-0.right-0');
                if (badge) badge.remove();

                const title = c.querySelector('h4');
                if (title) {
                    title.classList.remove('text-biblos-brown');
                    title.classList.add('text-biblos-brown/90');
                }
            });

            // Select clicked
            card.classList.remove('border', 'border-transparent', 'shadow-[0_2px_8px_rgba(0,0,0,0.04)]');
            card.classList.add('border-[3px]', 'border-primary', 'shadow-[0_4px_20px_rgba(0,0,0,0.06)]', 'scale-[1.01]');

            // Add badge
            const badge = document.createElement('div');
            badge.className = 'absolute top-0 right-0 bg-primary w-10 h-10 flex items-center justify-center rounded-bl-xl z-10 shadow-sm';
            badge.innerHTML = '<span class="material-symbols-outlined text-white font-bold" style="font-size: 24px;">check</span>';
            card.appendChild(badge);

            const title = card.querySelector('h4');
            if (title) {
                title.classList.remove('text-biblos-brown/90');
                title.classList.add('text-biblos-brown');
            }
        });
    });

    const confirmBtn = document.querySelector('.fixed button');
    if (confirmBtn) {
        confirmBtn.onclick = () => window.navigateTo('/placement_test');
    }

    const backBtn = document.querySelector('header button');
    if (backBtn) {
        backBtn.onclick = () => window.navigateTo('/onboarding/4');
    }
}
