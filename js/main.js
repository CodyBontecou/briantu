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
 * Click client names to see detailed work overview
 */
function initClientDetail() {
    const clientItems = document.querySelectorAll('.clients-list li[data-client]');
    const clientDetail = document.getElementById('clientDetail');
    const clientNameEl = clientDetail.querySelector('.client-detail-name');
    const closeBtn = clientDetail.querySelector('.client-detail-close');

    // Open client detail on click
    clientItems.forEach(item => {
        item.addEventListener('click', () => {
            const clientSlug = item.dataset.client;
            const clientName = item.textContent;
            openClientDetail(clientSlug, clientName);
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
                showClientDetail(e.state.client, item.textContent);
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
            // Delay to allow page to render first
            setTimeout(() => {
                showClientDetail(clientParam, item.textContent);
            }, 100);
        }
    }

    function openClientDetail(slug, name) {
        // Update URL
        const url = new URL(window.location);
        url.searchParams.set('client', slug);
        history.pushState({ client: slug }, '', url);

        showClientDetail(slug, name);
    }

    function showClientDetail(slug, name) {
        clientNameEl.textContent = name;
        clientDetail.classList.add('active');
        document.body.classList.add('client-detail-open');
    }

    function closeClientDetail() {
        // Update URL back to home
        const url = new URL(window.location);
        url.searchParams.delete('client');
        history.pushState({}, '', url.pathname);

        hideClientDetail();
    }

    function hideClientDetail() {
        clientDetail.classList.remove('active');
        document.body.classList.remove('client-detail-open');
    }
}
