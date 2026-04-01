/* ============================================
   HB AUTO - Premium Garage Automobile Metz
   JavaScript: Animations, Navigation, Counters
   ============================================ */

(function () {
    'use strict';

    // --- HEADER SCROLL ---
    const header = document.getElementById('header');
    let lastScroll = 0;

    function handleScroll() {
        const currentScroll = window.scrollY;
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    // --- BURGER MENU ---
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');

    if (burger && nav) {
        burger.addEventListener('click', function () {
            burger.classList.toggle('active');
            nav.classList.toggle('active');
            document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
        });

        // Close nav on link click
        nav.querySelectorAll('.nav-link').forEach(function (link) {
            link.addEventListener('click', function () {
                burger.classList.remove('active');
                nav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // --- SMOOTH SCROLL ---
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                var headerHeight = header ? header.offsetHeight : 0;
                var targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- SCROLL ANIMATIONS ---
    var animateElements = document.querySelectorAll('[data-animate]');

    function checkVisibility() {
        var windowHeight = window.innerHeight;
        animateElements.forEach(function (el) {
            var rect = el.getBoundingClientRect();
            if (rect.top < windowHeight * 0.88) {
                el.classList.add('animated');
            }
        });
    }

    window.addEventListener('scroll', checkVisibility, { passive: true });
    window.addEventListener('load', checkVisibility);
    // Run once on DOMContentLoaded too
    checkVisibility();

    // --- COUNTER ANIMATION ---
    var counters = document.querySelectorAll('[data-count]');
    var countersAnimated = new Set();

    function animateCounter(el) {
        var target = parseInt(el.getAttribute('data-count'), 10);
        var duration = 2000;
        var startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            // Ease out cubic
            var eased = 1 - Math.pow(1 - progress, 3);
            var current = Math.floor(eased * target);
            el.textContent = current.toLocaleString('fr-FR');
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target.toLocaleString('fr-FR');
            }
        }

        requestAnimationFrame(step);
    }

    function checkCounters() {
        counters.forEach(function (el) {
            if (countersAnimated.has(el)) return;
            var rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.9) {
                countersAnimated.add(el);
                animateCounter(el);
            }
        });
    }

    window.addEventListener('scroll', checkCounters, { passive: true });
    window.addEventListener('load', checkCounters);

    // --- ACTIVE NAV LINK ---
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-link');

    function updateActiveNav() {
        var scrollPos = window.scrollY + 150;
        sections.forEach(function (section) {
            var top = section.offsetTop;
            var height = section.offsetHeight;
            var id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(function (link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // --- PARALLAX HERO (subtle) ---
    var heroBg = document.querySelector('.hero-bg img');
    if (heroBg) {
        window.addEventListener('scroll', function () {
            var scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                heroBg.style.transform = 'scale(1.05) translateY(' + (scrolled * 0.15) + 'px)';
            }
        }, { passive: true });
    }

})();