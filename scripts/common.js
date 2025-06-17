// Enhanced common functionality across all pages

// Performance optimized loading screen
window.addEventListener('load', () => {
    const loading = document.getElementById('loading');
    if (loading) {
        // Add a minimum loading time for better UX
        const minLoadTime = 1200;
        const startTime = performance.now();
        
        const hideLoading = () => {
            loading.style.opacity = '0';
            loading.style.transform = 'scale(0.9)';
            setTimeout(() => {
                loading.style.display = 'none';
            }, 800);
        };
        
        const elapsedTime = performance.now() - startTime;
        const remainingTime = Math.max(0, minLoadTime - elapsedTime);
        
        setTimeout(hideLoading, remainingTime);
    }
});

// Enhanced DOM ready functionality
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeScrollAnimations();
    initializeHeaderEffects();
    initializeAccessibility();
    initializePerformanceOptimizations();
});

// Enhanced navigation system
function initializeNavigation() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.getElementById('nav-links');
    const body = document.body;

    if (!mobileMenuToggle || !navLinks) return;

    // Mobile menu toggle with enhanced animations
    mobileMenuToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const isActive = mobileMenuToggle.classList.contains('active');
        
        if (isActive) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    function openMobileMenu() {
        mobileMenuToggle.classList.add('active');
        navLinks.classList.add('active');
        body.style.overflow = 'hidden';
        
        // Add stagger animation to menu items
        const menuItems = navLinks.querySelectorAll('a');
        menuItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            setTimeout(() => {
                item.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100 + 200);
        });
    }

    function closeMobileMenu() {
        mobileMenuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        body.style.overflow = '';
        
        // Reset menu item styles
        const menuItems = navLinks.querySelectorAll('a');
        menuItems.forEach(item => {
            item.style.transition = '';
            item.style.opacity = '';
            item.style.transform = '';
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenuToggle.contains(e.target) && !navLinks.contains(e.target)) {
            closeMobileMenu();
        }
    });

    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            closeMobileMenu();
        }
    });
}

// Enhanced scroll animations with Intersection Observer
function initializeScrollAnimations() {
    // Create multiple observers for different animation types
    const fadeInObserver = createObserver('fade-in', {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    const slideInLeftObserver = createObserver('slide-in-left', {
        threshold: 0.2,
        rootMargin: '0px 0px -30px 0px'
    });

    const slideInRightObserver = createObserver('slide-in-right', {
        threshold: 0.2,
        rootMargin: '0px 0px -30px 0px'
    });

    const scaleInObserver = createObserver('scale-in', {
        threshold: 0.3,
        rootMargin: '0px 0px -20px 0px'
    });

    function createObserver(className, options) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Unobserve after animation to improve performance
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        // Observe all elements with the specified class
        document.querySelectorAll(`.${className}`).forEach(el => {
            observer.observe(el);
        });

        return observer;
    }
}

// Enhanced header effects with scroll optimization
function initializeHeaderEffects() {
    const header = document.getElementById('header');
    if (!header) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateHeader() {
        const currentScrollY = window.scrollY;
        
        // Add/remove scrolled class
        if (currentScrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header based on scroll direction
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestTick, { passive: true });
}

// Enhanced accessibility features
function initializeAccessibility() {
    // Improve focus management
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });

    // Add skip link functionality
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-color);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 10000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add main content ID if it doesn't exist
    const mainContent = document.querySelector('main, .main-content');
    if (mainContent && !mainContent.id) {
        mainContent.id = 'main-content';
    }
}

// Performance optimizations
function initializePerformanceOptimizations() {
    // Lazy load images
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Preload critical resources on hover
    document.querySelectorAll('a[href]').forEach(link => {
        if (link.hostname === window.location.hostname) {
            link.addEventListener('mouseenter', () => {
                const linkElement = document.createElement('link');
                linkElement.rel = 'prefetch';
                linkElement.href = link.href;
                document.head.appendChild(linkElement);
            }, { once: true });
        }
    });

    // Optimize scroll performance
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        document.body.classList.add('scrolling');
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            document.body.classList.remove('scrolling');
        }, 100);
    }, { passive: true });
}

// Smooth scrolling for anchor links
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                history.pushState(null, null, href);
            }
        });
    });
}

// Initialize smooth scrolling
initializeSmoothScrolling();

// Utility functions
const utils = {
    // Debounce function for performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for scroll events
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Check if element is in viewport
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Animate number counters
    animateCounter(element, start, end, duration = 2000) {
        const startTime = performance.now();
        const startValue = parseInt(start) || 0;
        const endValue = parseInt(end) || 0;
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = Math.floor(startValue + (endValue - startValue) * easeOutQuart(progress));
            element.textContent = current + (element.dataset.suffix || '');
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }
};

// Easing functions
function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
}

function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

// Export utilities for use in other scripts
window.portfolioUtils = utils;

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is not visible
        document.body.classList.add('page-hidden');
    } else {
        // Resume animations when page becomes visible
        document.body.classList.remove('page-hidden');
    }
});

// Add CSS for page hidden state
const style = document.createElement('style');
style.textContent = `
    .page-hidden * {
        animation-play-state: paused !important;
    }
    
    .keyboard-navigation *:focus {
        outline: 2px solid var(--primary-color) !important;
        outline-offset: 2px !important;
    }
    
    .scrolling * {
        pointer-events: none;
    }
`;
document.head.appendChild(style);
