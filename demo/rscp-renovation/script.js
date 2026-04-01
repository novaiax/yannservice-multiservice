/* ============================================
   RSCP Rénovation - Script
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ---------- Navigation ----------
    const nav = document.getElementById('nav');
    const burger = document.getElementById('navBurger');
    const navLinks = document.getElementById('navLinks');
    const links = document.querySelectorAll('.nav__link');

    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        nav.classList.toggle('nav--scrolled', currentScroll > 60);
        lastScroll = currentScroll;
    }, { passive: true });

    // Burger menu
    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    links.forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    function updateActiveLink() {
        const scrollPos = window.scrollY + window.innerHeight / 3;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav__link[href="#${id}"]`);
            if (link) {
                link.classList.toggle('active', scrollPos >= top && scrollPos < top + height);
            }
        });
    }
    window.addEventListener('scroll', updateActiveLink, { passive: true });

    // ---------- Scroll Animations ----------
    const animateElements = document.querySelectorAll('[data-animate]');

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animateElements.forEach(el => observer.observe(el));

    // ---------- Counter Animation ----------
    const counters = document.querySelectorAll('[data-count]');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.count);
                animateCounter(entry.target, target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    function animateCounter(element, target) {
        const duration = 2000;
        const start = performance.now();
        const startVal = 0;

        function update(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(startVal + (target - startVal) * eased);

            if (target > 1000) {
                element.textContent = current.toLocaleString('fr-FR');
            } else {
                element.textContent = current;
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    // ---------- Particles ----------
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 4 + 's';
            particle.style.animationDuration = (3 + Math.random() * 3) + 's';
            const size = 1 + Math.random() * 2;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particlesContainer.appendChild(particle);
        }
    }

    // ---------- Smooth Scroll ----------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'));
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ---------- Gallery Toggle (Voir plus) ----------
    const galleryToggle = document.getElementById('galleryToggle');
    const galleryGrid = document.querySelector('.gallery__grid');
    const toggleText = document.querySelector('.gallery__toggle-text');
    const toggleIcon = document.querySelector('.gallery__toggle-icon');

    if (galleryToggle && galleryGrid) {
        let expanded = false;
        galleryToggle.addEventListener('click', () => {
            expanded = !expanded;
            galleryGrid.classList.toggle('gallery--expanded', expanded);
            toggleText.textContent = expanded ? 'Voir moins' : 'Voir plus de réalisations';
            toggleIcon.style.transform = expanded ? 'rotate(180deg)' : 'rotate(0deg)';
        });
    }

    // ---------- Gallery Hover Parallax ----------
    const galleryItems = document.querySelectorAll('.gallery__item');
    galleryItems.forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            const img = item.querySelector('.gallery__img');
            if (img) {
                img.style.transform = `scale(1.05) translate(${x * 10}px, ${y * 10}px)`;
            }
        });

        item.addEventListener('mouseleave', () => {
            const img = item.querySelector('.gallery__img');
            if (img) {
                img.style.transform = 'scale(1)';
            }
        });
    });

    // ---------- Service Cards Glow Effect ----------
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', x + 'px');
            card.style.setProperty('--mouse-y', y + 'px');
        });
    });

});
