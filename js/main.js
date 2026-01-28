/**
 * Brian Tu Portfolio
 * Minimal gallery with scroll reveal
 */

document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initImageLoading();
    initImageOverlay();
});

/**
 * Reveal gallery items and hero on scroll
 */
function initScrollReveal() {
    const hero = document.querySelector('.hero');
    const items = document.querySelectorAll('.gallery-item');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe hero section
    if (hero) {
        observer.observe(hero);
    }

    items.forEach(item => observer.observe(item));
}

/**
 * Handle image loading states
 */
function initImageLoading() {
    const images = document.querySelectorAll('.image-wrapper img');

    images.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
        }
    });
}

/**
 * Image overlay interaction
 * Click to reveal frosted overlay with image details
 */
function initImageOverlay() {
    const imageWrappers = document.querySelectorAll('.image-wrapper');

    imageWrappers.forEach(wrapper => {
        // Toggle overlay on click
        wrapper.addEventListener('click', (e) => {
            // If clicking the close button or already active, close it
            if (e.target.classList.contains('overlay-close') || wrapper.classList.contains('active')) {
                wrapper.classList.remove('active');
            } else {
                // Close any other active overlays first
                imageWrappers.forEach(w => w.classList.remove('active'));
                wrapper.classList.add('active');
            }
        });
    });

    // Close overlay on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            imageWrappers.forEach(wrapper => wrapper.classList.remove('active'));
        }
    });

    // Close overlay when clicking outside gallery
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.image-wrapper')) {
            imageWrappers.forEach(wrapper => wrapper.classList.remove('active'));
        }
    });
}
