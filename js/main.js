/**
 * Brian Tu Portfolio
 * Minimal gallery with scroll reveal
 */

const IMAGE_BASE = 'https://nhha9iqwle7teptc.public.blob.vercel-storage.com/PORTFOLIO-040825-';

// Client data with images, descriptions, and tags
const CLIENT_DATA = {
    'elephante': {
        description: 'Complete visual identity and merchandise design for Elephante\'s Dynasty Season North America Tour, blending Asian architectural motifs with contemporary concert aesthetics.',
        tags: ['TOUR VISUALS', 'APPAREL DESIGN', 'ART DIRECTION'],
        images: ['02', '03']
    },
    'mark-tuan': {
        description: 'Comprehensive creative direction for Mark Tuan\'s "The Other Side" album campaign, including artwork, tour visuals, physical packaging, and promotional materials.',
        tags: ['ALBUM ARTWORK', 'TOUR DESIGN', 'PACKAGING', 'ART DIRECTION'],
        images: ['06', '07', '08', '09']
    },
    '88rising': {
        description: 'Festival branding and merchandise design for Head in the Clouds music festivals across Manila and Jakarta, creating cohesive visual systems and collectible merchandise.',
        tags: ['FESTIVAL BRANDING', 'MERCHANDISE', 'EVENT DESIGN'],
        images: ['11', '12', '13']
    },
    'nike': {
        description: 'Environmental graphics and retail experience design for Nike House of Innovation flagship stores in Shanghai and New York City.',
        tags: ['RETAIL DESIGN', 'ENVIRONMENTAL GRAPHICS', 'BRAND EXPERIENCE'],
        images: ['16', '17', '19']
    },
    'jordan-brand': {
        description: 'Product design collaboration with Jordan Brand, contributing to footwear design and brand visual identity.',
        tags: ['PRODUCT DESIGN', 'FOOTWEAR', 'BRAND IDENTITY'],
        images: ['18']
    },
    'got7': {
        description: 'Album artwork and visual identity for GOT7\'s "Winter Heptagon" release, featuring striking monochromatic design with dynamic typography.',
        tags: ['ALBUM ARTWORK', 'VISUAL IDENTITY', 'TYPOGRAPHY'],
        images: ['05']
    },
    'one-pulse-events': {
        description: 'Event branding and promotional design for Spring Festival 2025 Lunar New Year Celebration at Avant Gardner, featuring bold graphics and artist lineup presentation.',
        tags: ['EVENT BRANDING', 'POSTER DESIGN', 'ART DIRECTION'],
        images: ['04']
    },
    'apollo-id-app': {
        description: 'Event design and brand partnerships for Apollo ID, including Hip Hop Night programming and Sports Illustrated Big Game Weekend experiences.',
        tags: ['EVENT DESIGN', 'BRAND PARTNERSHIPS', 'VISUAL IDENTITY'],
        images: ['14', '15']
    },
    'nebula-ny': {
        description: 'Event branding and visual design for Nebula NY\'s Hip Hop Night series, creating immersive promotional materials for live performances.',
        tags: ['EVENT BRANDING', 'POSTER DESIGN'],
        images: ['14']
    },
    'sports-illustrated': {
        description: 'Visual design for Sports Illustrated\'s exclusive Big Game Weekend party experience, merging sports culture with premium event aesthetics.',
        tags: ['EVENT DESIGN', 'BRAND COLLABORATION'],
        images: ['15']
    },
    'mission-nyc': {
        description: 'Apparel design and graphic development for Mission NYC, featuring bold Americana-inspired graphics and streetwear aesthetics.',
        tags: ['APPAREL DESIGN', 'GRAPHIC DESIGN'],
        images: ['10']
    }
};

// Default content for clients without specific portfolio images
const DEFAULT_CLIENT = {
    description: 'Creative direction, brand identity, and visual design work completed for this client.',
    tags: ['CREATIVE DIRECTION', 'BRAND IDENTITY', 'VISUAL DESIGN'],
    images: []
};

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
    const descriptionEl = clientDetail.querySelector('.work-description');
    const categoriesEl = clientDetail.querySelector('.work-categories');
    const galleryEl = clientDetail.querySelector('.client-detail-gallery');

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

    function populateClientContent(slug) {
        const data = CLIENT_DATA[slug] || DEFAULT_CLIENT;

        // Set description
        descriptionEl.textContent = data.description;

        // Set tags
        categoriesEl.innerHTML = data.tags.map(tag =>
            `<span class="work-tag">${tag}</span>`
        ).join('');

        // Set gallery images
        if (data.images && data.images.length > 0) {
            galleryEl.innerHTML = data.images.map((imgNum, index) =>
                `<div class="client-gallery-item${index === 0 && data.images.length > 1 ? ' featured' : ''}">
                    <img src="${IMAGE_BASE}${imgNum}.png" alt="${slug} work ${index + 1}" loading="lazy">
                </div>`
            ).join('');

            // Add multi-image class for grid layout
            if (data.images.length > 1) {
                galleryEl.classList.add('multi-image');
            } else {
                galleryEl.classList.remove('multi-image');
            }
        } else {
            galleryEl.innerHTML = '<div class="no-work-message">Portfolio images coming soon</div>';
            galleryEl.classList.remove('multi-image');
        }
    }

    function openClientDetail(slug, name, clickedElement) {
        // Update URL
        const url = new URL(window.location);
        url.searchParams.set('client', slug);
        history.pushState({ client: slug }, '', url);

        // Populate content
        populateClientContent(slug);

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
        populateClientContent(slug);
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
