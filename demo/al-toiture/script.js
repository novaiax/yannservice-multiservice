/* ============================================
   AL TOITURE 68 - Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- Navbar scroll effect ---
    const navbar = document.getElementById('navbar');
    const handleScroll = () => {
        navbar.classList.toggle('navbar--scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // --- Mobile menu ---
    const burger = document.getElementById('navBurger');
    const navLinks = document.getElementById('navLinks');

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);

    const toggleMenu = () => {
        burger.classList.toggle('active');
        navLinks.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    };

    burger.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) toggleMenu();
        });
    });

    // --- Scroll animations ---
    const animatedEls = document.querySelectorAll('[data-animate]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, i * 80);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    animatedEls.forEach(el => observer.observe(el));

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // --- Counter animation for hero stats ---
    const statNumbers = document.querySelectorAll('.hero__stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    if (statNumbers.length > 0) {
        statsObserver.observe(document.querySelector('.hero__stats'));
    }

    function animateStats() {
        statNumbers.forEach(stat => {
            const originalText = stat.getAttribute('data-value') || stat.textContent;
            stat.setAttribute('data-value', originalText);

            // Handle "5/5" format
            if (originalText.includes('/')) {
                const parts = originalText.split('/');
                const num = parseInt(parts[0]);
                const denom = parts[1];
                let current = 0;
                const increment = Math.max(1, Math.ceil(num / 30));
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= num) {
                        current = num;
                        clearInterval(timer);
                    }
                    stat.textContent = current + '/' + denom;
                }, 50);
                return;
            }

            const num = parseInt(originalText);
            if (isNaN(num)) return;

            const suffix = originalText.replace(/[0-9]/g, '');
            let current = 0;
            const increment = Math.max(1, Math.ceil(num / 40));
            const timer = setInterval(() => {
                current += increment;
                if (current >= num) {
                    current = num;
                    clearInterval(timer);
                }
                stat.textContent = current + suffix;
            }, 30);
        });
    }
});