/**
 * SALON LANDING PAGE - SCRIPT JS
 * Optimisé performance + conversion
 */

// ==================== STICKY HEADER ====================
const header = document.getElementById('header');
let lastScroll = 0;

function handleHeaderScroll() {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }

  lastScroll = currentScroll;
}

// Throttle scroll events for performance
let scrollTimeout;
window.addEventListener('scroll', () => {
  if (!scrollTimeout) {
    scrollTimeout = setTimeout(() => {
      handleHeaderScroll();
      handleStickyCTA();
      scrollTimeout = null;
    }, 100);
  }
});

// ==================== STICKY CTA MOBILE ====================
const stickyCTA = document.getElementById('sticky-cta');

function handleStickyCTA() {
  const scrollPosition = window.pageYOffset;
  const heroHeight = document.querySelector('.hero')?.offsetHeight || 600;

  // Show sticky CTA after scrolling past hero on mobile
  if (scrollPosition > heroHeight && window.innerWidth <= 768) {
    stickyCTA.classList.add('show');
  } else {
    stickyCTA.classList.remove('show');
  }
}

// ==================== TRACKING CLICKS (CONVERSION) ====================
// Track all CTA button clicks
const ctaButtons = document.querySelectorAll('a[href^="tel:"]');

ctaButtons.forEach(button => {
  button.addEventListener('click', function() {
    const buttonText = this.textContent.trim();
    const buttonLocation = getButtonLocation(this);

    // Console log for debugging (replace with real analytics)
    console.log('CTA Click:', {
      text: buttonText,
      location: buttonLocation,
      timestamp: new Date().toISOString()
    });

    // If you use Google Analytics, uncomment:
    // gtag('event', 'click_call', {
    //   'event_category': 'CTA',
    //   'event_label': buttonLocation,
    //   'value': 1
    // });

    // If you use Facebook Pixel, uncomment:
    // fbq('track', 'Contact', {
    //   content_name: buttonLocation
    // });
  });
});

function getButtonLocation(element) {
  if (element.closest('.hero')) return 'hero';
  if (element.closest('.header')) return 'header';
  if (element.closest('.sticky-cta')) return 'sticky_mobile';
  if (element.closest('.services')) return 'services';
  if (element.closest('.final-cta')) return 'final_cta';
  if (element.closest('.footer')) return 'footer';
  return 'other';
}

// ==================== LAZY LOAD OPTIMIZATION ====================
// Add loading animation for images
const lazyImages = document.querySelectorAll('img[loading="lazy"]');

if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';

        img.onload = () => {
          img.style.opacity = '1';
        };

        observer.unobserve(img);
      }
    });
  });

  lazyImages.forEach(img => imageObserver.observe(img));
}

// ==================== SMOOTH SCROLL FOR ANCHOR LINKS ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href !== '#' && href !== '') {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  });
});

// ==================== PERFORMANCE: DEFER NON-CRITICAL ====================
// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  // Initial checks
  handleHeaderScroll();
  handleStickyCTA();

  // Preload critical resources
  const phoneNumber = document.querySelector('a[href^="tel:"]');
  if (phoneNumber) {
    // Warm up tel: link (helps on some devices)
    phoneNumber.setAttribute('rel', 'noopener');
  }
});

// ==================== ANALYTICS HELPER ====================
// Time on page tracking
let startTime = Date.now();

window.addEventListener('beforeunload', () => {
  const timeOnPage = Math.round((Date.now() - startTime) / 1000);

  console.log('Session stats:', {
    timeOnPage: timeOnPage + 's',
    scrollDepth: Math.round((window.pageYOffset / document.body.scrollHeight) * 100) + '%'
  });

  // Send to analytics if needed
  // navigator.sendBeacon('/analytics', JSON.stringify({ timeOnPage }));
});

// ==================== MOBILE OPTIMIZATIONS ====================
// Prevent double-tap zoom on buttons (better UX)
let lastTouchEnd = 0;
document.addEventListener('touchend', (event) => {
  const now = Date.now();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}, { passive: false });

// ==================== ACCESSIBILITY ====================
// Ensure focus is visible for keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    document.body.classList.add('keyboard-nav');
  }
});

document.addEventListener('mousedown', () => {
  document.body.classList.remove('keyboard-nav');
});
