/* ============================================
   LION COLOR — Premium Interactions
   Multi-page navigation, animations, slider, lightbox
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // === UNIVERSAL ===
    initNavbar();
    initAnimations();
    initCounters();
    initFloatingCta();

    // === CONDITIONAL ===
    if (document.getElementById('avisTrack')) initAvisSlider();
    if (document.querySelector('.gallery-item')) initLightbox();
});

/* ——— NAVBAR ——— */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    // Scroll detection
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    // Hamburger toggle
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close on link click
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // Active page detection (multi-page)
    const currentPage = document.body.getAttribute('data-page');
    const pageMap = {
        'accueil': 'index.html',
        'services': 'services.html',
        'realisations': 'realisations.html',
        'avis': 'avis.html',
        'contact': 'contact.html'
    };

    if (currentPage && pageMap[currentPage]) {
        // Desktop nav
        document.querySelectorAll('.nav-links a').forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href') === pageMap[currentPage]) {
                a.classList.add('active');
            }
        });
        // Mobile nav
        document.querySelectorAll('.mobile-menu a:not(.mobile-cta)').forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href') === pageMap[currentPage]) {
                a.classList.add('active');
            }
        });
    }

    // Smooth scroll for anchor links on same page
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = navbar.offsetHeight + 20;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });
}

/* ——— SCROLL ANIMATIONS ——— */
function initAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, parseInt(delay));
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
}

/* ——— COUNTER ANIMATION ——— */
function initCounters() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'));
                if (!target) return;
                const duration = 2000;
                const start = performance.now();

                function update(now) {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease out cubic
                    const eased = 1 - Math.pow(1 - progress, 3);
                    el.textContent = Math.round(eased * target);
                    if (progress < 1) requestAnimationFrame(update);
                }
                requestAnimationFrame(update);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-count]').forEach(el => observer.observe(el));
}

/* ——— FLOATING CTA ——— */
function initFloatingCta() {
    const cta = document.getElementById('floatingCta');
    if (!cta) return;

    window.addEventListener('scroll', () => {
        cta.classList.toggle('visible', window.scrollY > 600);
    }, { passive: true });
}

/* ——— AVIS SLIDER ——— */
function initAvisSlider() {
    const track = document.getElementById('avisTrack');
    const prevBtn = document.getElementById('avisPrev');
    const nextBtn = document.getElementById('avisNext');
    const dotsContainer = document.getElementById('avisDots');
    if (!track || !prevBtn || !nextBtn) return;

    const cards = track.querySelectorAll('.avis-card');
    let currentIndex = 0;
    let perView = getPerView();
    let totalSlides = Math.ceil(cards.length / perView);

    function getPerView() {
        if (window.innerWidth >= 1024) return 3;
        if (window.innerWidth >= 640) return 2;
        return 1;
    }

    function updateSlider() {
        const cardWidth = 100 / perView;
        cards.forEach(c => c.style.flex = `0 0 ${cardWidth}%`);
        const offset = -(currentIndex * (100 / perView));
        track.style.transform = `translateX(${offset}%)`;
        updateDots();
    }

    function createDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.className = 'avis-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Avis page ${i + 1}`);
            dot.addEventListener('click', () => {
                currentIndex = i * perView;
                updateSlider();
            });
            dotsContainer.appendChild(dot);
        }
    }

    function updateDots() {
        if (!dotsContainer) return;
        const activePage = Math.floor(currentIndex / perView);
        dotsContainer.querySelectorAll('.avis-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === activePage);
        });
    }

    prevBtn.addEventListener('click', () => {
        currentIndex = Math.max(0, currentIndex - perView);
        updateSlider();
    });

    nextBtn.addEventListener('click', () => {
        const maxIndex = cards.length - perView;
        currentIndex = Math.min(maxIndex, currentIndex + perView);
        updateSlider();
    });

    // Drag / Touch support
    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;

    track.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        track.classList.add('dragging');
    });

    track.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].clientX;
    }, { passive: true });

    const onMove = (clientX) => {
        if (!isDragging) return;
        currentTranslate = clientX - startX;
    };

    track.addEventListener('mousemove', (e) => onMove(e.clientX));
    track.addEventListener('touchmove', (e) => onMove(e.touches[0].clientX), { passive: true });

    const onEnd = () => {
        if (!isDragging) return;
        isDragging = false;
        track.classList.remove('dragging');

        if (Math.abs(currentTranslate) > 50) {
            if (currentTranslate < 0) {
                currentIndex = Math.min(cards.length - perView, currentIndex + 1);
            } else {
                currentIndex = Math.max(0, currentIndex - 1);
            }
        }
        currentTranslate = 0;
        updateSlider();
    };

    track.addEventListener('mouseup', onEnd);
    track.addEventListener('mouseleave', onEnd);
    track.addEventListener('touchend', onEnd);

    // Resize handler
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            perView = getPerView();
            totalSlides = Math.ceil(cards.length / perView);
            currentIndex = Math.min(currentIndex, cards.length - perView);
            createDots();
            updateSlider();
        }, 200);
    });

    createDots();
    updateSlider();
}

/* ——— LIGHTBOX ——— */
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const lightboxCounter = document.getElementById('lightboxCounter');
    if (!lightbox || !lightboxImg) return;

    const items = document.querySelectorAll('.gallery-item');
    const images = Array.from(items).map(item => item.querySelector('img').src);
    let currentImg = 0;

    function open(index) {
        currentImg = index;
        lightboxImg.src = images[currentImg];
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        updateCounter();
    }

    function close() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function prev() {
        currentImg = (currentImg - 1 + images.length) % images.length;
        lightboxImg.src = images[currentImg];
        updateCounter();
    }

    function next() {
        currentImg = (currentImg + 1) % images.length;
        lightboxImg.src = images[currentImg];
        updateCounter();
    }

    function updateCounter() {
        if (lightboxCounter) {
            lightboxCounter.textContent = `${currentImg + 1} / ${images.length}`;
        }
    }

    items.forEach((item, i) => {
        item.addEventListener('click', () => open(i));
    });

    if (lightboxClose) lightboxClose.addEventListener('click', close);
    if (lightboxPrev) lightboxPrev.addEventListener('click', prev);
    if (lightboxNext) lightboxNext.addEventListener('click', next);

    // Close on backdrop click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) close();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowLeft') prev();
        if (e.key === 'ArrowRight') next();
    });
}
