/* ============================================
   CARREAUX DESIGN - Premium JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- Navbar Scroll ---
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-links a');

    const handleScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
        updateActiveLink();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    function updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.scrollY + 150;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // --- Mobile Nav Toggle ---
    const navToggle = document.getElementById('navToggle');
    const navLinksContainer = document.getElementById('navLinks');

    if (navToggle && navLinksContainer) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = navLinksContainer.classList.contains('mobile-open');

            if (isOpen) {
                closeMobileNav();
            } else {
                openMobileNav();
            }
        });

        // Close mobile nav on link click
        navLinksContainer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                closeMobileNav();
            });
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (navLinksContainer.classList.contains('mobile-open') &&
                !navLinksContainer.contains(e.target) &&
                !navToggle.contains(e.target)) {
                closeMobileNav();
            }
        });

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinksContainer.classList.contains('mobile-open')) {
                closeMobileNav();
            }
        });
    }

    function openMobileNav() {
        navToggle.classList.add('active');
        navLinksContainer.classList.add('mobile-open');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileNav() {
        navToggle.classList.remove('active');
        navLinksContainer.classList.remove('mobile-open');
        document.body.style.overflow = '';
    }

    // --- Scroll Animations ---
    const animatedElements = document.querySelectorAll('[data-animate]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, parseInt(delay));
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));

    // --- Counter Animation ---
    const counters = document.querySelectorAll('[data-count]');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    function animateCounter(el) {
        const target = parseInt(el.dataset.count);
        const duration = 2000;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target);

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    // --- Hero Particles ---
    const particlesContainer = document.getElementById('heroParticles');
    if (particlesContainer) {
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'hero-particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.width = (Math.random() * 3 + 1) + 'px';
            particle.style.height = particle.style.width;
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
            particle.style.opacity = Math.random() * 0.5 + 0.1;
            particlesContainer.appendChild(particle);
        }
    }

    // --- Avis Slider ---
    const track = document.getElementById('avisTrack');
    const prevBtn = document.getElementById('avisPrev');
    const nextBtn = document.getElementById('avisNext');

    if (track && prevBtn && nextBtn) {
        let currentIndex = 0;
        const cards = track.querySelectorAll('.avis-card');
        const totalCards = cards.length;
        const gap = 20;

        function getCardsPerView() {
            if (window.innerWidth >= 992) return 3;
            if (window.innerWidth >= 640) return 2;
            return 1;
        }

        function slideToIndex(index) {
            const perView = getCardsPerView();
            const maxIndex = Math.max(0, totalCards - perView);
            currentIndex = Math.max(0, Math.min(index, maxIndex));

            // Calculate offset based on actual card width
            const firstCard = cards[0];
            if (!firstCard) return;
            const cardWidth = firstCard.offsetWidth + gap;
            const offset = currentIndex * cardWidth;
            track.style.transform = `translateX(-${offset}px)`;

            // Update button states
            prevBtn.style.opacity = currentIndex === 0 ? '0.3' : '1';
            nextBtn.style.opacity = currentIndex >= maxIndex ? '0.3' : '1';
        }

        prevBtn.addEventListener('click', () => slideToIndex(currentIndex - 1));
        nextBtn.addEventListener('click', () => slideToIndex(currentIndex + 1));

        // Touch swipe support
        let startX = 0;
        let isDragging = false;

        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            clearInterval(autoSlideInterval);
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;
            const diff = startX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) {
                if (diff > 0) slideToIndex(currentIndex + 1);
                else slideToIndex(currentIndex - 1);
            }
            startAutoSlide();
        }, { passive: true });

        // Mouse drag support
        let mouseStartX = 0;
        let isMouseDragging = false;

        track.addEventListener('mousedown', (e) => {
            mouseStartX = e.clientX;
            isMouseDragging = true;
            track.style.cursor = 'grabbing';
            clearInterval(autoSlideInterval);
        });

        document.addEventListener('mousemove', (e) => {
            if (!isMouseDragging) return;
            e.preventDefault();
        });

        document.addEventListener('mouseup', (e) => {
            if (!isMouseDragging) return;
            isMouseDragging = false;
            track.style.cursor = 'grab';
            const diff = mouseStartX - e.clientX;
            if (Math.abs(diff) > 40) {
                if (diff > 0) slideToIndex(currentIndex + 1);
                else slideToIndex(currentIndex - 1);
            }
            startAutoSlide();
        });

        // Reset on resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => slideToIndex(currentIndex), 150);
        });

        // Auto-slide
        let autoSlideInterval;

        function startAutoSlide() {
            clearInterval(autoSlideInterval);
            autoSlideInterval = setInterval(() => {
                const perView = getCardsPerView();
                if (currentIndex >= totalCards - perView) {
                    slideToIndex(0);
                } else {
                    slideToIndex(currentIndex + 1);
                }
            }, 5000);
        }

        // Pause on hover
        track.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
        track.addEventListener('mouseleave', () => startAutoSlide());

        // Init
        slideToIndex(0);
        startAutoSlide();
    }

    // --- Gallery Lightbox ---
    const galleryItems = document.querySelectorAll('.gallery-item img');

    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <button class="lightbox-close" aria-label="Fermer">&times;</button>
        <img src="" alt="Réalisation Carreaux Design">
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('img');
    const lightboxClose = lightbox.querySelector('.lightbox-close');

    galleryItems.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    lightboxClose.addEventListener('click', (e) => {
        e.stopPropagation();
        closeLightbox();
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offset = navbar.offsetHeight;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // --- Parallax on hero (subtle) ---
    window.addEventListener('scroll', () => {
        const heroImg = document.querySelector('.hero-bg-img');
        if (heroImg && window.scrollY < window.innerHeight) {
            heroImg.style.transform = `translateY(${window.scrollY * 0.3}px) scale(1.1)`;
        }
    }, { passive: true });

    // Initial scroll check
    handleScroll();
});
