/**
 * Module: Observer
 * Menggunakan Intersection Observer API untuk mengamati performa scroll & memicu animasi.
 */

export function initScrollAnimations() {
    const observerOptions = {
        root: null, // Menggunakan layar perangkat sebagai area pantau
        threshold: 0.1, // Berjalan saat 10% elemen masuk layar
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animasi Progress Bar Skill
                if (entry.target.classList.contains('progress-bar')) {
                    const fillElement = entry.target.querySelector('.fill');
                    if (fillElement) {
                        const targetWidth = fillElement.getAttribute('data-width') || '100%';
                        fillElement.style.width = targetWidth; // Isi bar hingga persentase target
                    }
                } 
                // Animasi Timeline Experience (Fade and Slide-in)
                else if (entry.target.classList.contains('tl-item')) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }

                // Setelah teranimasi sekali, stop observasi elemen ini agar hemat baterai
                observer.unobserve(entry.target);
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Daftarkan Progress Bar
    const skillBars = document.querySelectorAll('.progress-bar');
    skillBars.forEach(bar => {
        const fill = bar.querySelector('.fill');
        if (fill) {
            // Pindahkan width bawaan ke attribute pembantu agar bisa kita animasi dari 0%
            const currentWidth = fill.style.width || '100%';
            fill.setAttribute('data-width', currentWidth);
            fill.style.width = '0%'; 
            fill.style.transition = 'width 1.2s cubic-bezier(0.25, 1, 0.5, 1)';
            observer.observe(bar);
        }
    });

    // Daftarkan Timeline Items
    const tlItems = document.querySelectorAll('.tl-item');
    tlItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-15px)';
        item.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        observer.observe(item);
    });
}