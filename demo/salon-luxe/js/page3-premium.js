/**
 * PAGE 3 - FULL PREMIUM (APPEL ONLY)
 * JavaScript pour interactions et animations
 */

(function() {
    'use strict';

    // ===========================
    // STICKY CALL BAR MANAGEMENT
    // ===========================
    const stickyBar = document.getElementById('stickyBar');
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateStickyBar() {
        const currentScrollY = window.scrollY;

        // Afficher la barre après 100px de scroll
        if (currentScrollY > 100) {
            stickyBar.style.transform = 'translateY(0)';
            stickyBar.style.opacity = '1';
        } else {
            stickyBar.style.transform = 'translateY(100%)';
            stickyBar.style.opacity = '0';
        }

        lastScrollY = currentScrollY;
        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(updateStickyBar);
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // ===========================
    // SMOOTH SCROLL
    // ===========================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Ignore les liens vides ou juste "#"
            if (!href || href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.getBoundingClientRect().top + window.scrollY - 80;

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===========================
    // INTERSECTION OBSERVER - ANIMATIONS
    // ===========================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observer les éléments à animer
    const animatedElements = document.querySelectorAll(
        '.ba-item, .pack-card, .review-card, .info-card, .diff-item, .service-category, .product-category, .faq-item'
    );

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // ===========================
    // LAZY LOADING IMAGES
    // ===========================
    if ('loading' in HTMLImageElement.prototype) {
        // Le navigateur supporte le lazy loading natif
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.src;
        });
    } else {
        // Fallback pour les navigateurs plus anciens
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ===========================
    // TRACK CALL CLICKS (ANALYTICS)
    // ===========================
    function trackCallClick(source) {
        // Tracker l'événement d'appel
        if (typeof gtag !== 'undefined') {
            gtag('event', 'call_click', {
                'event_category': 'engagement',
                'event_label': source,
                'value': 1
            });
        }

        // Console log pour debugging
        console.log('Call tracked from:', source);
    }

    // Ajouter le tracking sur tous les boutons d'appel
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener('click', function() {
            const source = this.closest('section')?.className || 'unknown';
            trackCallClick(source);
        });
    });

    // ===========================
    // TRACK MAPS CLICKS
    // ===========================
    function trackMapsClick(source) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'maps_click', {
                'event_category': 'engagement',
                'event_label': source,
                'value': 1
            });
        }
        console.log('Maps tracked from:', source);
    }

    document.querySelectorAll('a[href*="maps.google"]').forEach(link => {
        link.addEventListener('click', function() {
            const source = this.closest('section')?.className || 'unknown';
            trackMapsClick(source);
        });
    });

    // ===========================
    // TRACK WHATSAPP CLICKS
    // ===========================
    function trackWhatsAppClick(source) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'whatsapp_click', {
                'event_category': 'engagement',
                'event_label': source,
                'value': 1
            });
        }
        console.log('WhatsApp tracked from:', source);
    }

    document.querySelectorAll('a[href^="https://wa.me"]').forEach(link => {
        link.addEventListener('click', function() {
            const source = this.closest('section')?.className || 'sticky-bar';
            trackWhatsAppClick(source);
        });
    });

    // ===========================
    // PERFORMANCE - PRELOAD HERO IMAGE
    // ===========================
    const heroSection = document.querySelector('.hero-premium');
    if (heroSection) {
        const heroBg = window.getComputedStyle(heroSection).backgroundImage;
        if (heroBg && heroBg !== 'none') {
            const img = new Image();
            const url = heroBg.match(/url\(["']?(.+?)["']?\)/);
            if (url && url[1]) {
                img.src = url[1];
            }
        }
    }

    // ===========================
    // HOVER EFFECTS FOR GALLERY
    // ===========================
    const galleryItems = document.querySelectorAll('.ba-item');
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });

        item.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
    });

    // ===========================
    // PACK CARDS HOVER EFFECTS
    // ===========================
    const packCards = document.querySelectorAll('.pack-card');
    packCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Légère rotation au hover
            this.style.transition = 'all 0.3s ease';
        });
    });

    // ===========================
    // DETECT USER INTERACTION TIME
    // ===========================
    let interactionStartTime = Date.now();
    let hasInteracted = false;

    function trackTimeOnPage() {
        if (!hasInteracted) {
            hasInteracted = true;
            const timeSpent = Math.round((Date.now() - interactionStartTime) / 1000);

            if (typeof gtag !== 'undefined') {
                gtag('event', 'time_to_interaction', {
                    'event_category': 'engagement',
                    'event_label': 'seconds',
                    'value': timeSpent
                });
            }
            console.log('Time to first interaction:', timeSpent, 'seconds');
        }
    }

    // Tracker le premier clic
    document.addEventListener('click', trackTimeOnPage, { once: true });

    // ===========================
    // SCROLL PROGRESS INDICATOR (Optionnel)
    // ===========================
    function updateScrollProgress() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;

        // Vous pouvez ajouter un indicateur visuel ici si nécessaire
        // document.getElementById('scrollProgress').style.width = scrolled + '%';
    }

    window.addEventListener('scroll', updateScrollProgress, { passive: true });

    // ===========================
    // ACCESSIBILITY - FOCUS VISIBLE
    // ===========================
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('user-is-tabbing');
        }
    });

    document.addEventListener('mousedown', function() {
        document.body.classList.remove('user-is-tabbing');
    });

    // ===========================
    // DETECT MOBILE / TABLET
    // ===========================
    function isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    if (isMobile()) {
        document.body.classList.add('is-mobile');

        // Sur mobile, assurer que les liens tel: fonctionnent
        console.log('Mobile device detected');
    } else {
        document.body.classList.add('is-desktop');
    }

    // ===========================
    // PREVENT DOUBLE TAP ZOOM ON BUTTONS (iOS)
    // ===========================
    const buttons = document.querySelectorAll('a[href^="tel:"], .btn-primary-large, .btn-call-service, .btn-pack');
    buttons.forEach(button => {
        button.addEventListener('touchend', function(e) {
            // Empêcher le double-tap zoom sur iOS
            e.preventDefault();
            this.click();
        }, { passive: false });
    });

    // ===========================
    // CACHE WARM-UP - PRECONNECT
    // ===========================
    function warmUpConnections() {
        const links = [
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com',
            'https://maps.google.com',
            'https://www.google-analytics.com'
        ];

        links.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = url;
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
    }

    // Warmup après le chargement de la page
    if (document.readyState === 'complete') {
        warmUpConnections();
    } else {
        window.addEventListener('load', warmUpConnections);
    }

    // ===========================
    // VISIBILITY CHANGE - PAUSE ANIMATIONS
    // ===========================
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // Page n'est plus visible
            console.log('Page hidden');
        } else {
            // Page est visible à nouveau
            console.log('Page visible');
        }
    });

    // ===========================
    // ERROR HANDLING FOR IMAGES
    // ===========================
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            console.warn('Image failed to load:', this.src);
            // Optionnel: afficher une image de fallback
            // this.src = '/path/to/fallback-image.jpg';
        });
    });

    // ===========================
    // READY STATE
    // ===========================
    console.log('Page 3 Premium - JavaScript loaded successfully');

    // Log pour debugging
    if (window.location.search.includes('debug=true')) {
        console.log('Debug mode enabled');
        console.log('Sticky bar element:', stickyBar);
        console.log('Animated elements count:', animatedElements.length);
        console.log('Is mobile:', isMobile());
    }

})();
