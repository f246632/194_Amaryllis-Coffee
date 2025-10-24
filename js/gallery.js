// Amaryllis Coffee - Gallery & Lightbox
// Professional image gallery with lightbox functionality

(function() {
    'use strict';

    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const lightboxCounter = document.getElementById('lightboxCounter');

    let currentImageIndex = 0;
    const images = Array.from(galleryItems).map(item => ({
        src: item.querySelector('img').src,
        alt: item.querySelector('img').alt
    }));

    // Open lightbox
    function openLightbox(index) {
        currentImageIndex = index;
        updateLightboxImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Focus on close button for accessibility
        lightboxClose.focus();
    }

    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Update lightbox image
    function updateLightboxImage() {
        const image = images[currentImageIndex];
        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;
        lightboxCounter.textContent = `${currentImageIndex + 1} / ${images.length}`;

        // Preload adjacent images for smooth navigation
        preloadImage(currentImageIndex - 1);
        preloadImage(currentImageIndex + 1);
    }

    // Preload image
    function preloadImage(index) {
        if (index >= 0 && index < images.length) {
            const img = new Image();
            img.src = images[index].src;
        }
    }

    // Navigate to previous image
    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateLightboxImage();
    }

    // Navigate to next image
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateLightboxImage();
    }

    // Event Listeners
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));

        // Keyboard accessibility for gallery items
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', `Open image ${index + 1} in lightbox`);

        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(index);
            }
        });
    });

    // Lightbox controls
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', showPrevImage);
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', showNextImage);
    }

    // Close lightbox when clicking outside image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                showPrevImage();
                break;
            case 'ArrowRight':
                showNextImage();
                break;
        }
    });

    // Touch/Swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - show next
                showNextImage();
            } else {
                // Swipe right - show previous
                showPrevImage();
            }
        }
    }

    // Image loading animation
    lightboxImage.addEventListener('load', function() {
        this.style.opacity = '0';
        setTimeout(() => {
            this.style.transition = 'opacity 0.3s ease';
            this.style.opacity = '1';
        }, 10);
    });

    // Prevent image dragging
    lightboxImage.addEventListener('dragstart', (e) => e.preventDefault());

    // Gallery animations on scroll
    const galleryObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                }, index * 50);
                galleryObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    galleryItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px) scale(0.95)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        galleryObserver.observe(item);
    });

    // Context menu prevention for images (optional protection)
    galleryItems.forEach(item => {
        const img = item.querySelector('img');
        img.addEventListener('contextmenu', (e) => {
            // Optionally prevent right-click on images
            // e.preventDefault();
        });
    });

    // Accessibility: Announce image changes to screen readers
    function announceImageChange() {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.textContent = `Image ${currentImageIndex + 1} of ${images.length}`;
        lightbox.appendChild(announcement);

        setTimeout(() => announcement.remove(), 1000);
    }

    // Update announcements on image change
    const originalUpdateImage = updateLightboxImage;
    updateLightboxImage = function() {
        originalUpdateImage();
        announceImageChange();
    };

    console.log('Gallery initialized with', images.length, 'images');

})();
