/* LP Beauty Nails - interactivity */
(function(){
  'use strict';

  // ── Nav scroll state ──
  var nav = document.getElementById('nav');
  var lastY = 0;
  function onScroll(){
    var y = window.scrollY || window.pageYOffset;
    if (nav) nav.classList.toggle('scrolled', y > 24);
    lastY = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── Mobile menu ──
  var toggle = document.getElementById('navToggle');
  var links  = document.getElementById('navLinks');
  if (toggle && links){
    toggle.addEventListener('click', function(){
      var open = links.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    links.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        links.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // ── Reveal on scroll ──
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting){
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('visible'); });
  }

  // ── Hero parallax (subtle) ──
  var heroBg = document.querySelector('.hero-bg-img');
  if (heroBg && window.matchMedia('(min-width: 768px)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    window.addEventListener('scroll', function(){
      var y = window.scrollY || window.pageYOffset;
      if (y < window.innerHeight){
        heroBg.style.transform = 'translateY(' + (y * 0.18) + 'px) scale(1.08)';
      }
    }, { passive: true });
  }

  // ── Gallery filters (realisations.html) ──
  var filterBtns = document.querySelectorAll('.filter-btn');
  var galleryItems = document.querySelectorAll('.gallery-grid-page .gallery-item');
  if (filterBtns.length && galleryItems.length){
    filterBtns.forEach(function(btn){
      btn.addEventListener('click', function(){
        filterBtns.forEach(function(b){
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        var f = btn.getAttribute('data-filter');
        galleryItems.forEach(function(item){
          var cat = item.getAttribute('data-cat');
          var match = (f === 'all' || cat === f);
          item.classList.toggle('hidden', !match);
        });
      });
    });
  }

  // ── Smooth scroll for in-page anchors ──
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      var id = a.getAttribute('href');
      if (id.length > 1){
        var target = document.querySelector(id);
        if (target){
          e.preventDefault();
          var top = target.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      }
    });
  });

  // ── Form: success indicator if ?envoye=1 ──
  if (window.location.search.indexOf('envoye=1') !== -1){
    var form = document.querySelector('.contact-form');
    if (form){
      var ok = document.createElement('div');
      ok.style.cssText = 'background:#1B1815;color:#F0D87A;padding:18px 22px;margin-bottom:24px;font-size:14px;letter-spacing:0.5px;';
      ok.textContent = "Merci ! Votre message a bien été envoyé. Je vous réponds rapidement.";
      form.parentNode.insertBefore(ok, form);
      window.scrollTo({ top: form.offsetTop - 120, behavior: 'smooth' });
    }
  }
})();
