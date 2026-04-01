/* ============================================
   MS CARRELAGE 13 — Premium Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ========== NAVBAR SCROLL ==========
    const navbar = document.getElementById('navbar');
    const floatingCta = document.getElementById('floatingCta');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        navbar.classList.toggle('scrolled', scrollY > 60);
        floatingCta.classList.toggle('visible', scrollY > 600);
        lastScroll = scrollY;
    }, { passive: true });

    // ========== MOBILE MENU ==========
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ========== SCROLL ANIMATIONS ==========
    const animateElements = document.querySelectorAll('[data-animate]');
    const animateObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, delay);
                animateObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    animateElements.forEach(el => animateObserver.observe(el));

    // ========== COUNTER ANIMATION ==========
    const counters = document.querySelectorAll('[data-count]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.count);
                const duration = 2000;
                const start = performance.now();

                const animate = (now) => {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    el.textContent = Math.floor(eased * target);
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        el.textContent = target;
                    }
                };
                requestAnimationFrame(animate);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(el => counterObserver.observe(el));

    // ========== AVIS SLIDER ==========
    const track = document.getElementById('avisTrack');
    const prevBtn = document.getElementById('avisPrev');
    const nextBtn = document.getElementById('avisNext');
    const dotsContainer = document.getElementById('avisDots');

    if (track && prevBtn && nextBtn) {
        let currentSlide = 0;
        let isDragging = false;
        let startX = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;

        const getCardsPerView = () => {
            if (window.innerWidth >= 1024) return 3;
            if (window.innerWidth >= 640) return 2;
            return 1;
        };

        const cards = track.querySelectorAll('.avis-card');
        const totalCards = cards.length;

        const getMaxSlide = () => Math.max(0, totalCards - getCardsPerView());

        const updateDots = () => {
            const maxSlide = getMaxSlide();
            const perView = getCardsPerView();
            const dotCount = Math.ceil(totalCards / perView);
            dotsContainer.innerHTML = '';
            for (let i = 0; i < dotCount; i++) {
                const dot = document.createElement('div');
                dot.className = 'avis-dot' + (i === Math.floor(currentSlide / perView) ? ' active' : '');
                dot.addEventListener('click', () => {
                    currentSlide = Math.min(i * perView, maxSlide);
                    slideTo(currentSlide);
                });
                dotsContainer.appendChild(dot);
            }
        };

        const slideTo = (index) => {
            const perView = getCardsPerView();
            const maxSlide = getMaxSlide();
            currentSlide = Math.max(0, Math.min(index, maxSlide));
            const cardWidth = cards[0].offsetWidth + 20; // gap
            currentTranslate = -currentSlide * cardWidth;
            prevTranslate = currentTranslate;
            track.style.transform = `translateX(${currentTranslate}px)`;
            track.style.transition = 'transform 0.4s ease';
            updateDots();
        };

        prevBtn.addEventListener('click', () => slideTo(currentSlide - 1));
        nextBtn.addEventListener('click', () => slideTo(currentSlide + 1));

        // Touch/drag support
        const dragStart = (e) => {
            isDragging = true;
            startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
            track.style.transition = 'none';
            track.classList.add('dragging');
        };

        const dragMove = (e) => {
            if (!isDragging) return;
            const currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
            const diff = currentX - startX;
            currentTranslate = prevTranslate + diff;
            track.style.transform = `translateX(${currentTranslate}px)`;
        };

        const dragEnd = () => {
            if (!isDragging) return;
            isDragging = false;
            track.classList.remove('dragging');
            const diff = currentTranslate - prevTranslate;
            const threshold = 50;
            if (diff < -threshold) {
                slideTo(currentSlide + 1);
            } else if (diff > threshold) {
                slideTo(currentSlide - 1);
            } else {
                slideTo(currentSlide);
            }
        };

        track.addEventListener('mousedown', dragStart);
        track.addEventListener('mousemove', dragMove);
        track.addEventListener('mouseup', dragEnd);
        track.addEventListener('mouseleave', dragEnd);
        track.addEventListener('touchstart', dragStart, { passive: true });
        track.addEventListener('touchmove', dragMove, { passive: true });
        track.addEventListener('touchend', dragEnd);

        // Init
        updateDots();
        window.addEventListener('resize', () => {
            slideTo(Math.min(currentSlide, getMaxSlide()));
        });
    }

    // ========== LIGHTBOX ==========
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const lightboxCounter = document.getElementById('lightboxCounter');
    const galleryItems = document.querySelectorAll('.gallery-item');
    let currentImage = 0;

    const images = Array.from(galleryItems).map(item => item.querySelector('img').src);

    const openLightbox = (index) => {
        currentImage = index;
        lightboxImg.src = images[currentImage];
        lightboxCounter.textContent = `${currentImage + 1} / ${images.length}`;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    const navigateLightbox = (dir) => {
        currentImage = (currentImage + dir + images.length) % images.length;
        lightboxImg.src = images[currentImage];
        lightboxCounter.textContent = `${currentImage + 1} / ${images.length}`;
    };

    galleryItems.forEach((item, i) => {
        item.addEventListener('click', () => openLightbox(i));
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    lightboxNext.addEventListener('click', () => navigateLightbox(1));

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });

    // ========== SMOOTH SCROLL ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offset = navbar.offsetHeight + 20;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ========== ACTIVE NAV LINK ==========
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const updateActiveLink = () => {
        const scrollPos = window.scrollY + navbar.offsetHeight + 100;
        sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-links a[href="#${id}"]`);
            if (link) {
                link.classList.toggle('active', scrollPos >= top && scrollPos < bottom);
            }
        });
    };

    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();
});
