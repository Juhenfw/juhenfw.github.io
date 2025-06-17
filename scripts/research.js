// Research page specific functionality
document.addEventListener('DOMContentLoaded', () => {
    // Animate research metrics
    const metricNumbers = document.querySelectorAll('.metric-number');
    
    const metricsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const finalValue = element.textContent;
                
                // Only animate if it's a number
                if (!isNaN(finalValue)) {
                    animateNumber(element, 0, parseInt(finalValue), 2000);
                }
                
                metricsObserver.unobserve(element);
            }
        });
    }, {
        threshold: 0.5
    });

    metricNumbers.forEach(number => {
        metricsObserver.observe(number);
    });

    // Animate research areas
    const areaCards = document.querySelectorAll('.area-card');
    
    const areaObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 150);
            }
        });
    }, {
        threshold: 0.2
    });

    areaCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        areaObserver.observe(card);
    });

    // Enhanced publication interactions
    const publicationItems = document.querySelectorAll('.publication-item');
    
    publicationItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Utility function to animate numbers
function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (end - start) * easeOutQuart(progress));
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = end;
        }
    }
    
    requestAnimationFrame(update);
}

// Easing function
function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
}

