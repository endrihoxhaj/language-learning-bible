
export function initOnboarding4() {
    console.log('Initializing Onboarding 4');
    const cards = document.querySelectorAll('.grid button');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            // Toggle selection state
            const isSelected = card.classList.contains('border-primary');

            if (isSelected) {
                // Deselect
                card.classList.remove('border-primary');
                card.classList.add('border-transparent');

                const badge = card.querySelector('.absolute');
                if (badge) badge.remove();

                const icon = card.querySelector('.w-10');
                if (icon) {
                    icon.classList.remove('text-primary');
                    icon.classList.add('text-gray-400');
                }
            } else {
                // Select
                card.classList.remove('border-transparent');
                card.classList.add('border-primary');

                // Add badge
                const badge = document.createElement('div');
                badge.className = 'absolute top-3 right-3 bg-primary rounded-full w-6 h-6 flex items-center justify-center shadow-sm';
                badge.innerHTML = '<span class="material-symbols-outlined text-white text-[16px] font-bold">check</span>';
                card.appendChild(badge);

                const icon = card.querySelector('.w-10');
                if (icon) {
                    icon.classList.remove('text-gray-400');
                    icon.classList.add('text-primary');
                }
            }
        });
    });

    const nextBtn = document.querySelector('.fixed button');
    if (nextBtn) {
        nextBtn.onclick = () => window.navigateTo('/tutor_selection');
    }
}
