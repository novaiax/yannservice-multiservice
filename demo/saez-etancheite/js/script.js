/* ============================================
   SAEZ ÉTANCHÉITÉ - JavaScript
   Progressive enhancement - site works without JS
   ============================================ */
(function(){
    'use strict';

    /* --- Header scroll effect --- */
    var header = document.getElementById('siteHeader');
    var lastScroll = 0;
    function onScroll(){
        var y = window.pageYOffset || document.documentElement.scrollTop;
        if(y > 50){
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        lastScroll = y;
    }
    window.addEventListener('scroll', onScroll, {passive:true});
    onScroll();

    /* --- Mobile menu toggle --- */
    var menuToggle = document.getElementById('menuToggle');
    var mainNav = document.getElementById('mainNav');
    if(menuToggle && mainNav){
        menuToggle.addEventListener('click', function(){
            var isOpen = mainNav.classList.toggle('open');
            menuToggle.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });
        /* Close menu on link click */
        var navLinks = mainNav.querySelectorAll('a');
        for(var i = 0; i < navLinks.length; i++){
            navLinks[i].addEventListener('click', function(){
                mainNav.classList.remove('open');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        }
    }

    /* --- Scroll animations (Intersection Observer) --- */
    var animateElements = document.querySelectorAll('[data-animate]');
    if('IntersectionObserver' in window && animateElements.length > 0){
        var observer = new IntersectionObserver(function(entries){
            for(var j = 0; j < entries.length; j++){
                if(entries[j].isIntersecting){
                    entries[j].target.classList.add('visible');
                    observer.unobserve(entries[j].target);
                }
            }
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });
        for(var k = 0; k < animateElements.length; k++){
            observer.observe(animateElements[k]);
        }
    } else {
        /* Fallback: show all elements immediately */
        for(var m = 0; m < animateElements.length; m++){
            animateElements[m].classList.add('visible');
        }
    }

    /* --- Gallery filter (realisations page) --- */
    var filterBtns = document.querySelectorAll('.filter-btn');
    var galleryItems = document.querySelectorAll('.gallery-full-item');
    if(filterBtns.length > 0 && galleryItems.length > 0){
        for(var f = 0; f < filterBtns.length; f++){
            filterBtns[f].addEventListener('click', function(){
                /* Update active button */
                for(var b = 0; b < filterBtns.length; b++){
                    filterBtns[b].classList.remove('active');
                }
                this.classList.add('active');
                var filter = this.getAttribute('data-filter');
                /* Filter items */
                for(var g = 0; g < galleryItems.length; g++){
                    var cat = galleryItems[g].getAttribute('data-category');
                    if(filter === 'all' || cat === filter){
                        galleryItems[g].style.display = '';
                    } else {
                        galleryItems[g].style.display = 'none';
                    }
                }
            });
        }
    }

    /* --- Smooth scroll for anchor links --- */
    var anchors = document.querySelectorAll('a[href^="#"]');
    for(var a = 0; a < anchors.length; a++){
        anchors[a].addEventListener('click', function(e){
            var target = this.getAttribute('href');
            if(target && target.length > 1){
                var el = document.querySelector(target);
                if(el){
                    e.preventDefault();
                    var headerH = header ? header.offsetHeight : 0;
                    var top = el.getBoundingClientRect().top + window.pageYOffset - headerH;
                    window.scrollTo({top: top, behavior: 'smooth'});
                }
            }
        });
    }

    /* --- Contact form basic validation feedback --- */
    var contactForm = document.getElementById('contactForm');
    if(contactForm){
        contactForm.addEventListener('submit', function(e){
            var btn = contactForm.querySelector('button[type="submit"]');
            if(btn){
                btn.textContent = 'Envoi en cours...';
                btn.style.opacity = '0.7';
                btn.style.pointerEvents = 'none';
            }
        });
        /* Check for sent parameter */
        if(window.location.search.indexOf('sent=true') !== -1){
            var wrapper = contactForm.parentElement;
            if(wrapper){
                var msg = document.createElement('div');
                msg.style.cssText = 'padding:24px;background:rgba(0,136,255,.1);border:1px solid rgba(0,136,255,.3);margin-bottom:24px;text-align:center;';
                msg.innerHTML = '<p style="color:#0088FF;font-family:Oswald,sans-serif;font-size:1.1rem;text-transform:uppercase;margin:0 0 8px">Message envoyé avec succès</p><p style="color:#a0a0a0;font-size:.9rem;margin:0">Nous vous recontacterons sous 24 heures. Merci pour votre confiance.</p>';
                wrapper.insertBefore(msg, contactForm);
                contactForm.style.display = 'none';
            }
        }
    }

})();