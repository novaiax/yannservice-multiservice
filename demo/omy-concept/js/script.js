/* ================================================
   OMY CONCEPT - JavaScript
   Progressive enhancement: site works without JS
   ================================================ */

(function () {
  'use strict';

  var body = document.body;
  var header = document.getElementById('header');

  /* ================================================
     PAGE LOAD REVEAL
     ================================================ */
  body.classList.add('is-loaded');

  /* ================================================
     HEADER SCROLL (hide/show + shrink)
     ================================================ */
  var lastScroll = 0;
  var scrollTicking = false;

  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;

    if (y > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Hide header on scroll down, show on scroll up
    if (y > 400) {
      if (y > lastScroll + 5) {
        header.classList.add('header-hidden');
      } else if (y < lastScroll - 5) {
        header.classList.remove('header-hidden');
      }
    } else {
      header.classList.remove('header-hidden');
    }

    lastScroll = y;
    scrollTicking = false;
  }

  window.addEventListener('scroll', function () {
    if (!scrollTicking) {
      requestAnimationFrame(onScroll);
      scrollTicking = true;
    }
  }, { passive: true });
  onScroll();

  /* ================================================
     PARALLAX HERO
     ================================================ */
  var heroImg = document.querySelector('.hero-bg img');
  var heroBg = document.querySelector('.hero-bg');

  if (heroImg && heroBg) {
    var parallaxTicking = false;
    window.addEventListener('scroll', function () {
      if (!parallaxTicking) {
        requestAnimationFrame(function () {
          var y = window.pageYOffset;
          var heroH = document.querySelector('.hero');
          if (heroH && y < heroH.offsetHeight) {
            heroBg.style.transform = 'translateY(' + (y * 0.35) + 'px) scale(1.1)';
          }
          parallaxTicking = false;
        });
        parallaxTicking = true;
      }
    }, { passive: true });
    heroBg.style.transform = 'scale(1.1)';
  }

  /* ================================================
     HAMBURGER MENU
     ================================================ */
  var hamburger = document.getElementById('hamburger');
  var navMobile = document.getElementById('nav-mobile');

  if (hamburger && navMobile) {
    hamburger.addEventListener('click', function () {
      var isOpen = navMobile.classList.contains('open');
      navMobile.classList.toggle('open');
      hamburger.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', String(!isOpen));
      body.style.overflow = isOpen ? '' : 'hidden';
    });

    navMobile.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navMobile.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        body.style.overflow = '';
      });
    });

    document.addEventListener('click', function (e) {
      if (
        navMobile.classList.contains('open') &&
        !navMobile.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        navMobile.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        body.style.overflow = '';
      }
    });
  }

  /* ================================================
     SCROLL ANIMATIONS (staggered children)
     ================================================ */
  var animElements = document.querySelectorAll('[data-animate]');

  if ('IntersectionObserver' in window && animElements.length > 0) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // Stagger children animation
            var children = entry.target.querySelectorAll('.service-card, .avis-card, .value-card, .gallery-item, .gallery-full-item, .certif-card, .number-item, .zone-cities span');
            children.forEach(function (child, i) {
              child.style.transitionDelay = (i * 0.08) + 's';
              child.classList.add('child-visible');
            });

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -60px 0px' }
    );

    animElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    animElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ================================================
     COUNTER ANIMATION (stats)
     ================================================ */
  function animateCounter(el, target, suffix) {
    suffix = suffix || '';
    var duration = 2000;
    var start = 0;
    var startTime = null;

    function easeOutExpo(t) {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = easeOutExpo(progress);
      var current = Math.round(start + (target - start) * eased);
      el.textContent = current + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  var statNumbers = document.querySelectorAll('.stat-number, .number-value');
  if (statNumbers.length > 0 && 'IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var text = el.textContent.trim();

          if (text === '+50') animateCounter(el, 50, '+');
          else if (text === '10+') animateCounter(el, 10, '+');
          else if (text === '100%') animateCounter(el, 100, '%');
          else if (text === '30km') animateCounter(el, 30, 'km');

          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  /* ================================================
     HERO TEXT REVEAL (word by word)
     ================================================ */
  var heroH1 = document.querySelector('.hero-content h1');
  if (heroH1) {
    var html = heroH1.innerHTML;
    var words = html.split(/(<br\s*\/?>)/gi);
    var result = '';
    words.forEach(function (part) {
      if (part.match(/<br\s*\/?>/i)) {
        result += part;
      } else {
        var subwords = part.split(/\s+/);
        subwords.forEach(function (w, i) {
          if (w.trim()) {
            result += '<span class="word-reveal"><span class="word-inner">' + w + '</span></span> ';
          }
        });
      }
    });
    heroH1.innerHTML = result.trim();
  }

  /* ================================================
     IMAGE REVEAL ON SCROLL
     ================================================ */
  var revealImages = document.querySelectorAll('.service-img, .about-img, .about-story-img, .service-detail-img, .gallery-item, .gallery-full-item');

  if ('IntersectionObserver' in window && revealImages.length > 0) {
    var imgObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('img-revealed');
          imgObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealImages.forEach(function (el) {
      el.classList.add('img-reveal');
      imgObserver.observe(el);
    });
  }

  /* ================================================
     MAGNETIC BUTTONS (desktop)
     ================================================ */
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.btn-primary, .btn-outline').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = 'translate(' + (x * 0.15) + 'px, ' + (y * 0.15) + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
      });
    });
  }

  /* ================================================
     SMOOTH SECTION DIVIDER LINES
     ================================================ */
  document.querySelectorAll('.section-header').forEach(function (el) {
    var line = document.createElement('div');
    line.className = 'section-line';
    el.appendChild(line);
  });

  /* ================================================
     GALLERY FILTERS (with animation)
     ================================================ */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var galleryItems = document.querySelectorAll('.gallery-full-item');

  if (filterBtns.length > 0 && galleryItems.length > 0) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = this.getAttribute('data-filter');

        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');

        galleryItems.forEach(function (item, i) {
          if (filter === 'all' || item.getAttribute('data-category') === filter) {
            item.style.transitionDelay = (i * 0.04) + 's';
            item.classList.remove('hidden');
          } else {
            item.style.transitionDelay = '0s';
            item.classList.add('hidden');
          }
        });
      });
    });
  }

  /* ================================================
     SMOOTH SCROLL ANCHOR LINKS
     ================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var offset = header ? header.offsetHeight + 20 : 80;
        var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ================================================
     TILT EFFECT ON SERVICE CARDS (desktop)
     ================================================ */
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.service-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = 'perspective(800px) rotateY(' + (x * 6) + 'deg) rotateX(' + (-y * 6) + 'deg) translateY(-4px)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }

  /* ================================================
     LIGHTBOX (enhanced with transition)
     ================================================ */
  var lightbox = null;

  function createLightbox() {
    lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML =
      '<div class="lightbox-overlay"></div>' +
      '<div class="lightbox-content">' +
      '<img src="" alt="">' +
      '<button class="lightbox-close" aria-label="Fermer">&times;</button>' +
      '<button class="lightbox-prev" aria-label="Précédent">&#8592;</button>' +
      '<button class="lightbox-next" aria-label="Suivant">&#8594;</button>' +
      '</div>';
    document.body.appendChild(lightbox);

    var style = document.createElement('style');
    style.textContent =
      '.lightbox{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity .4s ease}' +
      '.lightbox.active{opacity:1;pointer-events:auto}' +
      '.lightbox-overlay{position:absolute;inset:0;background:rgba(0,0,0,.92);cursor:pointer}' +
      '.lightbox-content{position:relative;z-index:1;max-width:90vw;max-height:90vh;transform:scale(.92);transition:transform .4s cubic-bezier(.16,1,.3,1)}' +
      '.lightbox.active .lightbox-content{transform:scale(1)}' +
      '.lightbox-content img{max-width:90vw;max-height:85vh;object-fit:contain;display:block}' +
      '.lightbox-close{position:absolute;top:-48px;right:0;background:none;border:none;color:#fff;font-size:2rem;cursor:pointer;padding:8px;line-height:1;opacity:.7;transition:opacity .3s}' +
      '.lightbox-close:hover{opacity:1}' +
      '.lightbox-prev,.lightbox-next{position:absolute;top:50%;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);color:#fff;font-size:1.2rem;cursor:pointer;padding:12px 16px;transition:all .3s;backdrop-filter:blur(4px)}' +
      '.lightbox-prev{left:-60px;transform:translateY(-50%)}' +
      '.lightbox-next{right:-60px;transform:translateY(-50%)}' +
      '.lightbox-prev:hover,.lightbox-next:hover{background:rgba(255,255,255,.2);border-color:rgba(255,255,255,.4)}' +
      '@media(max-width:768px){.lightbox-prev{left:8px}.lightbox-next{right:8px}}';
    document.head.appendChild(style);

    lightbox.querySelector('.lightbox-overlay').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', function () { navigateLightbox(-1); });
    lightbox.querySelector('.lightbox-next').addEventListener('click', function () { navigateLightbox(1); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    });
  }

  var lightboxImages = [];
  var lightboxIndex = 0;

  function collectLightboxImages() {
    lightboxImages = [];
    document.querySelectorAll('.gallery-item:not(.hidden) img, .gallery-full-item:not(.hidden) img').forEach(function (img) {
      lightboxImages.push({ src: img.src, alt: img.alt });
    });
  }

  function openLightbox(src, alt) {
    if (!lightbox) createLightbox();
    collectLightboxImages();
    lightboxIndex = lightboxImages.findIndex(function (img) { return img.src === src; });
    if (lightboxIndex < 0) lightboxIndex = 0;
    var img = lightbox.querySelector('img');
    img.src = src;
    img.alt = alt || '';
    lightbox.classList.add('active');
    body.style.overflow = 'hidden';
  }

  function navigateLightbox(dir) {
    if (!lightbox || lightboxImages.length === 0) return;
    lightboxIndex = (lightboxIndex + dir + lightboxImages.length) % lightboxImages.length;
    var img = lightbox.querySelector('img');
    img.style.opacity = '0';
    img.style.transform = 'translateX(' + (dir * 30) + 'px)';
    setTimeout(function () {
      img.src = lightboxImages[lightboxIndex].src;
      img.alt = lightboxImages[lightboxIndex].alt;
      img.style.transform = 'translateX(' + (-dir * 30) + 'px)';
      requestAnimationFrame(function () {
        img.style.transition = 'all .3s ease';
        img.style.opacity = '1';
        img.style.transform = 'translateX(0)';
        setTimeout(function () { img.style.transition = ''; }, 300);
      });
    }, 150);
  }

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('active');
      body.style.overflow = '';
    }
  }

  document.querySelectorAll('.gallery-item, .gallery-full-item').forEach(function (item) {
    item.addEventListener('click', function () {
      var img = this.querySelector('img');
      if (img) openLightbox(img.src, img.alt);
    });
  });

  /* ================================================
     SCROLL PROGRESS BAR
     ================================================ */
  var progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', function () {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    var pct = h > 0 ? (window.pageYOffset / h) * 100 : 0;
    progressBar.style.width = pct + '%';
  }, { passive: true });

})();
