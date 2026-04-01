/* ==============================================
   NOVALYSE — Script principal
   Premium animations, navigation, interactions
   ============================================== */

(function () {
    'use strict';

    /* --- HEADER SCROLL (hide/show + bg) --- */
    var header = document.getElementById('header');
    var lastScroll = 0;
    var scrollThreshold = 5;

    function onScroll() {
        var y = window.scrollY;

        if (y > 60) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }

        /* Hide header on scroll down, show on scroll up */
        if (Math.abs(y - lastScroll) > scrollThreshold) {
            if (y > lastScroll && y > 400) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            lastScroll = y;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* --- MOBILE MENU --- */
    var burger = document.getElementById('burger');
    var mobileMenu = document.getElementById('mobileMenu');

    if (burger && mobileMenu) {
        burger.addEventListener('click', function () {
            var isOpen = mobileMenu.classList.toggle('active');
            burger.classList.toggle('active');
            burger.setAttribute('aria-expanded', isOpen);
            mobileMenu.setAttribute('aria-hidden', !isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        var mobileLinks = mobileMenu.querySelectorAll('a');
        for (var i = 0; i < mobileLinks.length; i++) {
            mobileLinks[i].addEventListener('click', function () {
                mobileMenu.classList.remove('active');
                burger.classList.remove('active');
                burger.setAttribute('aria-expanded', 'false');
                mobileMenu.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            });
        }
    }

    /* --- SCROLL REVEAL with stagger --- */
    var reveals = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var delay = entry.target.getAttribute('data-delay') || 0;
                    setTimeout(function () {
                        entry.target.classList.add('visible');
                    }, parseInt(delay, 10));
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.06,
            rootMargin: '0px 0px -40px 0px'
        });

        reveals.forEach(function (el) {
            revealObserver.observe(el);
        });
    } else {
        reveals.forEach(function (el) {
            el.classList.add('visible');
        });
    }

    /* --- COUNTER ANIMATION (smooth easing) --- */
    var counters = document.querySelectorAll('[data-count]');

    function animateCount(el, target) {
        var duration = 2200;
        var start = performance.now();

        function step(now) {
            var elapsed = now - start;
            var progress = Math.min(elapsed / duration, 1);
            /* custom ease-out-quart for premium feel */
            var eased = 1 - Math.pow(1 - progress, 4);
            el.textContent = Math.round(eased * target);
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }

        requestAnimationFrame(step);
    }

    if ('IntersectionObserver' in window && counters.length) {
        var counterObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var target = parseInt(entry.target.getAttribute('data-count'), 10);
                    animateCount(entry.target, target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        counters.forEach(function (c) {
            counterObserver.observe(c);
        });
    }

    /* --- PARALLAX HERO --- */
    var heroBgImg = document.querySelector('.hero__bg-img');
    var heroContent = document.querySelector('.hero__content');

    if (heroBgImg && window.innerWidth > 768) {
        var ticking = false;
        window.addEventListener('scroll', function () {
            if (!ticking) {
                requestAnimationFrame(function () {
                    var y = window.scrollY;
                    if (y < window.innerHeight * 1.2) {
                        heroBgImg.style.transform = 'scale(' + (1.05 + y * 0.0002) + ') translateY(' + (y * 0.15) + 'px)';
                        if (heroContent) {
                            heroContent.style.opacity = Math.max(0, 1 - y / (window.innerHeight * 0.7));
                            heroContent.style.transform = 'translateY(' + (y * 0.08) + 'px)';
                        }
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    /* --- IMAGE REVEAL on hover (service cards, gallery) --- */
    var hoverImages = document.querySelectorAll('.service-card__img img, .gallery__item img, .realisation-card__img img');
    hoverImages.forEach(function (img) {
        img.addEventListener('mouseenter', function () {
            img.style.transition = 'transform .8s cubic-bezier(0.16, 1, 0.3, 1)';
        });
        img.addEventListener('mouseleave', function () {
            img.style.transition = 'transform .6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        });
    });

    /* --- SMOOTH SCROLL (anchor links) --- */
    var anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var href = anchor.getAttribute('href');
            if (href === '#') return;
            var target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                var offset = header ? header.offsetHeight + 16 : 80;
                var top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

    /* --- FILTER BUTTONS (realisations page) --- */
    var filterBtns = document.querySelectorAll('.filter-btn');
    var cards = document.querySelectorAll('.realisation-card');

    if (filterBtns.length && cards.length) {
        filterBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var filter = btn.getAttribute('data-filter');

                filterBtns.forEach(function (b) { b.classList.remove('filter-btn--active'); });
                btn.classList.add('filter-btn--active');

                var visibleIndex = 0;
                cards.forEach(function (card) {
                    var cat = card.getAttribute('data-category');
                    if (filter === 'all' || cat === filter) {
                        card.classList.remove('hidden');
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        var delay = visibleIndex * 60;
                        visibleIndex++;
                        setTimeout(function () {
                            card.style.transition = 'opacity .5s cubic-bezier(0.16, 1, 0.3, 1), transform .5s cubic-bezier(0.16, 1, 0.3, 1)';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, delay + 30);
                    } else {
                        card.classList.add('hidden');
                    }
                });
            });
        });
    }

    /* --- MAGNETIC BUTTONS (desktop only) --- */
    if (window.innerWidth > 1024) {
        var magneticBtns = document.querySelectorAll('.btn--glow');
        magneticBtns.forEach(function (btn) {
            btn.addEventListener('mousemove', function (e) {
                var rect = btn.getBoundingClientRect();
                var x = e.clientX - rect.left - rect.width / 2;
                var y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = 'translate(' + (x * 0.15) + 'px,' + (y * 0.15) + 'px)';
            });
            btn.addEventListener('mouseleave', function () {
                btn.style.transform = 'translate(0,0)';
                btn.style.transition = 'transform .4s cubic-bezier(0.16, 1, 0.3, 1), background .3s, color .3s, box-shadow .3s';
            });
            btn.addEventListener('mouseenter', function () {
                btn.style.transition = 'transform .15s ease-out, background .3s, color .3s, box-shadow .3s';
            });
        });
    }

    /* --- CONTACT FORM --- */
    var form = document.getElementById('contactForm');

    if (form) {
        var urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('sent') === 'true') {
            var wrap = form.closest('.contact-page__form-wrap') || form.parentElement;
            wrap.innerHTML = '<div style="text-align:center;padding:60px 20px;">' +
                '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1a9f4a" stroke-width="1.5" style="margin-bottom:16px"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>' +
                '<h3 style="font-family:var(--font-heading);font-size:24px;color:var(--dark);text-transform:uppercase;margin-bottom:12px">Demande envoyee</h3>' +
                '<p style="color:var(--text-secondary);font-size:15px;line-height:1.6">Merci pour votre demande. Notre equipe vous recontactera sous 48h maximum.</p>' +
                '</div>';
            window.history.replaceState({}, '', window.location.pathname);
        }

        form.addEventListener('submit', function () {
            var btn = form.querySelector('button[type="submit"]');
            btn.textContent = 'Envoi en cours...';
            btn.style.opacity = '0.7';
            btn.disabled = true;
        });
    }

    /* --- PROGRESS BAR (scroll indicator at top) --- */
    var progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', function () {
        var winH = document.documentElement.scrollHeight - window.innerHeight;
        var pct = (window.scrollY / winH) * 100;
        progressBar.style.width = pct + '%';
    }, { passive: true });

})();
