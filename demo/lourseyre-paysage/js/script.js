/* ============================================
   LOURSEYRE MICHEL ESPACE VERT
   Main JavaScript
   ============================================ */

(function () {
    'use strict';

    /* --- MOBILE MENU --- */
    var menuToggle = document.getElementById('menuToggle');
    var mobileNav = document.getElementById('mobileNav');

    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', function () {
            menuToggle.classList.toggle('active');
            mobileNav.classList.toggle('open');
            document.body.classList.toggle('nav-open');
        });

        document.addEventListener('click', function (e) {
            if (mobileNav.classList.contains('open') &&
                !mobileNav.contains(e.target) &&
                !menuToggle.contains(e.target)) {
                menuToggle.classList.remove('active');
                mobileNav.classList.remove('open');
                document.body.classList.remove('nav-open');
            }
        });

        var mobileLinks = mobileNav.querySelectorAll('a');
        mobileLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                menuToggle.classList.remove('active');
                mobileNav.classList.remove('open');
                document.body.classList.remove('nav-open');
            });
        });
    }

    /* --- HEADER SCROLL --- */
    var header = document.getElementById('header');
    var lastScroll = 0;

    function handleScroll() {
        var scrollY = window.pageYOffset || document.documentElement.scrollTop;
        if (header) {
            if (scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        lastScroll = scrollY;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    /* --- COUNTER ANIMATION --- */
    function animateCounters() {
        var counters = document.querySelectorAll('[data-target]');
        counters.forEach(function (counter) {
            if (counter.dataset.animated) return;
            var rect = counter.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.85 && rect.bottom > 0) {
                counter.dataset.animated = 'true';
                var target = parseInt(counter.dataset.target, 10);
                var duration = 2000;
                var start = 0;
                var startTime = null;

                function step(timestamp) {
                    if (!startTime) startTime = timestamp;
                    var progress = Math.min((timestamp - startTime) / duration, 1);
                    var eased = 1 - Math.pow(1 - progress, 3);
                    counter.textContent = Math.floor(eased * target);
                    if (progress < 1) {
                        requestAnimationFrame(step);
                    } else {
                        counter.textContent = target;
                    }
                }

                requestAnimationFrame(step);
            }
        });
    }

    /* --- SCROLL REVEAL --- */
    function revealOnScroll() {
        var reveals = document.querySelectorAll('.reveal');
        reveals.forEach(function (el) {
            var rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.88 && rect.bottom > 0) {
                el.classList.add('visible');
            }
        });
    }

    /* --- ADD REVEAL CLASSES --- */
    function initReveals() {
        var selectors = [
            '.section-header',
            '.service-card',
            '.review-card',
            '.value-card',
            '.engagement-item',
            '.service-detail-grid',
            '.about-page-grid',
            '.about-text',
            '.contact-grid',
            '.contact-page-grid',
            '.zone-content',
            '.cta-content',
            '.gallery-filters',
            '.stat-block',
            '.about-exp-badge'
        ];

        selectors.forEach(function (sel) {
            var items = document.querySelectorAll(sel);
            items.forEach(function (item, index) {
                item.classList.add('reveal');
                if (index < 6) {
                    item.classList.add('reveal-delay-' + Math.min(index + 1, 3));
                }
            });
        });
    }

    /* --- GALLERY FILTER --- */
    function initGalleryFilters() {
        var filterBtns = document.querySelectorAll('.filter-btn');
        var galleryItems = document.querySelectorAll('.gallery-item');

        if (filterBtns.length === 0) return;

        filterBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                filterBtns.forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');

                var filter = btn.dataset.filter;

                galleryItems.forEach(function (item) {
                    if (filter === 'all' || item.dataset.category === filter) {
                        item.classList.remove('hidden');
                        item.style.display = '';
                    } else {
                        item.classList.add('hidden');
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    /* --- HERO PARALLAX --- */
    function heroParallax() {
        var heroBg = document.querySelector('.hero-bg');
        if (!heroBg) return;
        var scrollY = window.pageYOffset;
        if (scrollY < window.innerHeight) {
            heroBg.style.transform = 'scale(1.05) translateY(' + (scrollY * 0.15) + 'px)';
        }
    }

    /* --- SMOOTH SCROLL --- */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                var headerH = header ? header.offsetHeight : 72;
                var top = target.getBoundingClientRect().top + window.pageYOffset - headerH;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

    /* --- LIGHTBOX (simple) --- */
    function initLightbox() {
        var galleryItems = document.querySelectorAll('.gallery-item img');
        if (galleryItems.length === 0) return;

        var lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = '<div class="lightbox-overlay"></div><div class="lightbox-content"><img src="" alt=""><button class="lightbox-close" aria-label="Fermer">&times;</button></div>';
        document.body.appendChild(lightbox);

        var lbImg = lightbox.querySelector('img');
        var lbClose = lightbox.querySelector('.lightbox-close');
        var lbOverlay = lightbox.querySelector('.lightbox-overlay');

        var style = document.createElement('style');
        style.textContent = '.lightbox{position:fixed;inset:0;z-index:9999;display:none;align-items:center;justify-content:center}.lightbox.open{display:flex}.lightbox-overlay{position:absolute;inset:0;background:rgba(0,0,0,.92)}.lightbox-content{position:relative;z-index:2;max-width:90vw;max-height:90vh}.lightbox-content img{max-width:90vw;max-height:85vh;object-fit:contain;display:block}.lightbox-close{position:absolute;top:-40px;right:0;background:none;border:none;color:#fff;font-size:2rem;cursor:pointer;padding:8px}';
        document.head.appendChild(style);

        galleryItems.forEach(function (img) {
            img.style.cursor = 'pointer';
            img.addEventListener('click', function () {
                lbImg.src = this.src;
                lbImg.alt = this.alt;
                lightbox.classList.add('open');
                document.body.style.overflow = 'hidden';
            });
        });

        function closeLightbox() {
            lightbox.classList.remove('open');
            document.body.style.overflow = '';
        }

        lbClose.addEventListener('click', closeLightbox);
        lbOverlay.addEventListener('click', closeLightbox);
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeLightbox();
        });
    }

    /* --- SCROLL LISTENERS --- */
    function onScroll() {
        animateCounters();
        revealOnScroll();
        heroParallax();
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    /* --- INIT --- */
    function init() {
        initReveals();
        initGalleryFilters();
        initLightbox();
        onScroll();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();