/**
 * Brian Tu Portfolio
 * Minimal gallery with scroll reveal
 */

document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initImageLoading();
    initImageOverlay();
    initClientDetail();
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

/**
 * Client Detail View
 * Cinematic flying name animation with dramatic reveal
 */
function initClientDetail() {
    const clientItems = document.querySelectorAll('.clients-list li[data-client]');
    const clientDetail = document.getElementById('clientDetail');
    const clientNameEl = clientDetail.querySelector('.client-detail-name');
    const closeBtn = clientDetail.querySelector('.client-detail-close');
    const flyingName = document.getElementById('flyingClientName');

    let isAnimating = false;

    // Open client detail on click
    clientItems.forEach(item => {
        item.addEventListener('click', () => {
            if (isAnimating) return;
            const clientSlug = item.dataset.client;
            const clientName = item.textContent;
            openClientDetail(clientSlug, clientName, item);
        });
    });

    // Close button
    closeBtn.addEventListener('click', closeClientDetail);

    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && clientDetail.classList.contains('active')) {
            closeClientDetail();
        }
    });

    // Handle browser back/forward
    window.addEventListener('popstate', (e) => {
        if (e.state && e.state.client) {
            const item = document.querySelector(`[data-client="${e.state.client}"]`);
            if (item) {
                showClientDetailInstant(e.state.client, item.textContent);
            }
        } else {
            hideClientDetail();
        }
    });

    // Check URL on page load
    const urlParams = new URLSearchParams(window.location.search);
    const clientParam = urlParams.get('client');
    if (clientParam) {
        const item = document.querySelector(`[data-client="${clientParam}"]`);
        if (item) {
            // Delay to allow page to render first, then show instantly
            setTimeout(() => {
                showClientDetailInstant(clientParam, item.textContent);
            }, 100);
        }
    }

    function openClientDetail(slug, name, clickedElement) {
        // Update URL
        const url = new URL(window.location);
        url.searchParams.set('client', slug);
        history.pushState({ client: slug }, '', url);

        // Trigger the cinematic animation
        animateClientName(clickedElement, name, slug);
    }

    function animateClientName(sourceElement, name, slug) {
        isAnimating = true;

        // Get source position (the clicked list item)
        const sourceRect = sourceElement.getBoundingClientRect();
        const sourceStyles = window.getComputedStyle(sourceElement);

        // Get target position (top left header area)
        const targetTop = window.innerWidth <= 600
            ? window.innerWidth * 0.06
            : window.innerWidth * 0.04;
        const targetLeft = targetTop;

        // Set up flying element at source position
        flyingName.textContent = name;
        flyingName.style.top = sourceRect.top + 'px';
        flyingName.style.left = sourceRect.left + 'px';
        flyingName.style.fontSize = sourceStyles.fontSize;
        flyingName.style.letterSpacing = sourceStyles.letterSpacing;

        // Remove any previous classes
        flyingName.classList.remove('animating', 'fade-out');
        clientDetail.classList.remove('animation-complete', 'closing');

        // Show the overlay background
        clientDetail.classList.add('active');
        document.body.classList.add('client-detail-open');
        clientNameEl.textContent = name;

        // Force reflow to ensure starting position is rendered
        void flyingName.offsetWidth;

        // Make flying name visible
        flyingName.style.opacity = '1';

        // Small delay before starting the flight animation
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                // Add animating class for smooth transition
                flyingName.classList.add('animating');

                // Animate to target position with size change
                flyingName.style.top = targetTop + 'px';
                flyingName.style.left = targetLeft + 'px';
                flyingName.style.fontSize = 'clamp(0.7rem, 1.2vw, 0.9rem)';
                flyingName.style.letterSpacing = '0.15em';
            });
        });

        // After flight animation completes
        setTimeout(() => {
            // Fade out flying name and show static one
            flyingName.classList.add('fade-out');

            // Mark animation as complete to trigger content fade in
            clientDetail.classList.add('animation-complete');

            // Clean up flying element after fade
            setTimeout(() => {
                flyingName.style.opacity = '0';
                flyingName.classList.remove('animating', 'fade-out');
                isAnimating = false;
            }, 150);
        }, 900);
    }

    // Instant show for URL navigation (no animation)
    function showClientDetailInstant(slug, name) {
        clientNameEl.textContent = name;
        clientDetail.classList.add('active', 'animation-complete');
        document.body.classList.add('client-detail-open');
    }

    function closeClientDetail() {
        if (isAnimating) return;

        // Update URL back to home
        const url = new URL(window.location);
        url.searchParams.delete('client');
        history.pushState({}, '', url.pathname);

        hideClientDetail();
    }

    function hideClientDetail() {
        // Add closing animation class
        clientDetail.classList.add('closing');

        // After closing animation
        setTimeout(() => {
            clientDetail.classList.remove('active', 'animation-complete', 'closing');
            document.body.classList.remove('client-detail-open');
        }, 500);
    }
}
