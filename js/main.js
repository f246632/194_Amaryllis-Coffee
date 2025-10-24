// Amaryllis Coffee - Main JavaScript
// Professional, Clean, Modern

(function() {
    'use strict';

    // ===================================
    // NAVIGATION
    // ===================================
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navbar scroll effect
    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavbarScroll);

    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Close mobile menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Smooth scrolling for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active nav link on scroll
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('.section, .hero');
        const scrollPos = window.scrollY + navbar.offsetHeight + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);

    // ===================================
    // HERO SLIDER
    // ===================================
    const heroSlides = document.querySelectorAll('.hero-slide');
    let currentSlide = 0;

    function nextSlide() {
        heroSlides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % heroSlides.length;
        heroSlides[currentSlide].classList.add('active');
    }

    // Auto-advance slides every 5 seconds
    if (heroSlides.length > 1) {
        setInterval(nextSlide, 5000);
    }

    // ===================================
    // MENU TABS
    // ===================================
    const menuTabs = document.querySelectorAll('.menu-tab');
    const menuCategories = document.querySelectorAll('.menu-category');

    menuTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const category = this.getAttribute('data-category');

            // Update active tab
            menuTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // Show corresponding category
            menuCategories.forEach(cat => {
                if (cat.getAttribute('data-category') === category) {
                    cat.classList.add('active');
                } else {
                    cat.classList.remove('active');
                }
            });
        });
    });

    // ===================================
    // CONTACT FORM
    // ===================================
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            // Validate
            if (!name || !email || !subject || !message) {
                showNotification('Bitte füllen Sie alle Felder aus.', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showNotification('Bitte geben Sie eine gültige E-Mail-Adresse ein.', 'error');
                return;
            }

            // In a real application, send data to server
            // For now, show success message
            showNotification('Vielen Dank für Ihre Nachricht! Wir werden uns bald bei Ihnen melden.', 'success');
            contactForm.reset();
        });
    }

    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Notification system
    function showNotification(message, type = 'success') {
        // Remove existing notifications
        const existingNotif = document.querySelector('.notification');
        if (existingNotif) {
            existingNotif.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            padding: 1rem 2rem;
            border-radius: 10px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
            z-index: 10001;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    // Add notification animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // ===================================
    // SCROLL ANIMATIONS
    // ===================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for scroll animation
    const animatedElements = document.querySelectorAll('.feature-card, .menu-item, .gallery-item, .review-card, .info-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // ===================================
    // LAZY LOADING IMAGES
    // ===================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // ===================================
    // PERFORMANCE OPTIMIZATION
    // ===================================

    // Debounce function for scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Optimized scroll handler
    const optimizedScroll = debounce(function() {
        handleNavbarScroll();
        updateActiveNavLink();
    }, 10);

    window.addEventListener('scroll', optimizedScroll);

    // ===================================
    // ACCESSIBILITY ENHANCEMENTS
    // ===================================

    // Keyboard navigation for menu tabs
    menuTabs.forEach((tab, index) => {
        tab.setAttribute('role', 'tab');
        tab.setAttribute('tabindex', index === 0 ? '0' : '-1');

        tab.addEventListener('keydown', function(e) {
            let newIndex;

            if (e.key === 'ArrowRight') {
                newIndex = (index + 1) % menuTabs.length;
            } else if (e.key === 'ArrowLeft') {
                newIndex = (index - 1 + menuTabs.length) % menuTabs.length;
            } else if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
                return;
            } else {
                return;
            }

            e.preventDefault();
            menuTabs[newIndex].focus();
            menuTabs[newIndex].click();
        });
    });

    // Focus trap for mobile menu
    function trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'a[href], button:not([disabled]), textarea, input, select'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        element.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            }
        });
    }

    if (navMenu) {
        trapFocus(navMenu);
    }

    // ===================================
    // INITIALIZATION
    // ===================================

    // Set initial active nav link
    updateActiveNavLink();

    // Announce page load for screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = 'Seite geladen';
    document.body.appendChild(announcement);

    // Add screen reader only class
    const srOnlyStyle = document.createElement('style');
    srOnlyStyle.textContent = `
        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border-width: 0;
        }
    `;
    document.head.appendChild(srOnlyStyle);

    console.log('Amaryllis Coffee website loaded successfully!');

})();
