// ===================================
// YannService — Abonnement Site Pro
// ===================================

document.addEventListener('DOMContentLoaded', () => {

    // Mobile Menu
    const toggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');

    if (toggle && navLinks) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        navLinks.querySelectorAll('a:not(.btn-whatsapp-small):not(.btn-nav-call)').forEach(link => {
            link.addEventListener('click', () => {
                toggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Nav scroll effect
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }, { passive: true });

    // Scroll reveal
    const revealElements = document.querySelectorAll(
        '.feature-card, .option-card, .partner-card, .testimonial-card, .process-step, .conseil-card, .faq-item'
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const siblings = entry.target.parentElement.querySelectorAll(
                    '.feature-card, .option-card, .partner-card, .testimonial-card, .process-step, .conseil-card, .faq-item'
                );
                const idx = Array.from(siblings).indexOf(entry.target);
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, idx * 80);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));

    // Animated counter
    const counters = document.querySelectorAll('.stat-number[data-target]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                let current = 0;
                const increment = target / 30;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        entry.target.textContent = target + '+';
                        clearInterval(timer);
                    } else {
                        entry.target.textContent = Math.floor(current);
                    }
                }, 40);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(el => counterObserver.observe(el));

    // Testimonials carousel
    const carousel = document.querySelector('.testimonials-carousel');
    if (carousel) {
        const track = carousel.querySelector('.testimonials-track');
        const prevBtn = carousel.querySelector('.testimonials-prev');
        const nextBtn = carousel.querySelector('.testimonials-next');

        const getStep = () => {
            const card = track.querySelector('.testimonial-card');
            if (!card) return track.clientWidth;
            const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 0;
            return card.getBoundingClientRect().width + gap;
        };

        const updateButtons = () => {
            prevBtn.disabled = track.scrollLeft <= 1;
            nextBtn.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
        };

        prevBtn.addEventListener('click', () => track.scrollBy({ left: -getStep(), behavior: 'smooth' }));
        nextBtn.addEventListener('click', () => track.scrollBy({ left: getStep(), behavior: 'smooth' }));
        track.addEventListener('scroll', updateButtons, { passive: true });
        window.addEventListener('resize', updateButtons);
        updateButtons();
    }

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offset = nav.offsetHeight + 20;
                window.scrollTo({
                    top: target.getBoundingClientRect().top + window.scrollY - offset,
                    behavior: 'smooth'
                });
            }
        });
    });
});
