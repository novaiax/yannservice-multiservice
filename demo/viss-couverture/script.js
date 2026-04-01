/* ========================================
   VISS COUVERTURE - Premium Interactions
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- NAVBAR SCROLL ---
    const navbar = document.getElementById('navbar');
    const handleScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // --- MOBILE NAV TOGGLE ---
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close nav on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // --- SCROLL REVEAL ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- BEFORE/AFTER SLIDERS (Black cover on LEFT, free slide) ---
    document.querySelectorAll('.ba-slider').forEach(slider => {
        const wrapper = slider.querySelector('.ba-wrapper');
        const before = slider.querySelector('.ba-before');
        const handle = slider.querySelector('.ba-handle');
        let isDragging = false;

        const updateSlider = (x) => {
            const rect = wrapper.getBoundingClientRect();
            let percent = ((x - rect.left) / rect.width) * 100;
            percent = Math.max(2, Math.min(98, percent));

            // Black cover on LEFT: width = percent (covers from left edge to handle)
            before.style.width = percent + '%';
            handle.style.left = percent + '%';

            // Fade out "glissez" text once user interacts
            if (percent < 45 || percent > 55) {
                before.classList.add('interacted');
            }
        };

        // Mouse events
        wrapper.addEventListener('mousedown', (e) => {
            isDragging = true;
            updateSlider(e.clientX);
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                updateSlider(e.clientX);
                e.preventDefault();
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // Touch events
        wrapper.addEventListener('touchstart', (e) => {
            isDragging = true;
            updateSlider(e.touches[0].clientX);
        }, { passive: true });

        wrapper.addEventListener('touchmove', (e) => {
            if (isDragging) {
                updateSlider(e.touches[0].clientX);
                e.preventDefault();
            }
        }, { passive: false });

        wrapper.addEventListener('touchend', () => {
            isDragging = false;
        });

        // Initialize at 50%
        before.style.width = '50%';
        handle.style.left = '50%';
    });

    // --- STAT COUNTER ANIMATION ---
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.count);
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;

                const update = () => {
                    current += step;
                    if (current < target) {
                        el.textContent = Math.floor(current);
                        requestAnimationFrame(update);
                    } else {
                        el.textContent = target;
                    }
                };
                update();
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));

    // --- SMOOTH SCROLL FOR NAV LINKS ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // --- ACTIVE NAV LINK ON SCROLL ---
    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = document.querySelectorAll('.nav-links a[href^="#"]');

    const updateActiveNav = () => {
        const scrollPos = window.scrollY + 100;
        sections.forEach(section => {
            const top = section.offsetTop - 100;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < bottom) {
                navLinksAll.forEach(link => {
                    link.style.color = '';
                    if (link.getAttribute('href') === '#' + id) {
                        link.style.color = 'var(--accent)';
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // --- PARALLAX SUBTLE ON HERO ---
    const heroBg = document.querySelector('.hero-bg img');
    if (heroBg && window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const scroll = window.scrollY;
            if (scroll < window.innerHeight) {
                heroBg.style.transform = `scale(1.05) translateY(${scroll * 0.15}px)`;
            }
        }, { passive: true });
    }

});
