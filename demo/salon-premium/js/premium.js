/* =====================================================
   PAGE PREMIUM — INTERACTIONS & SLIDER
   ===================================================== */

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#' || href === '') return;

    e.preventDefault();
    const target = document.querySelector(href);

    if (target) {
      const offset = 80;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ==================== BEFORE/AFTER SLIDER ====================
class BeforeAfterSlider {
  constructor(container) {
    this.container = container;
    this.handle = container.querySelector('.slider-handle');
    this.imgAfter = container.querySelector('.img-after');
    this.isDragging = false;

    this.init();
  }

  init() {
    if (!this.handle || !this.imgAfter) return;

    // Mouse events
    this.handle.addEventListener('mousedown', this.startDrag.bind(this));
    document.addEventListener('mousemove', this.drag.bind(this));
    document.addEventListener('mouseup', this.stopDrag.bind(this));

    // Touch events for mobile
    this.handle.addEventListener('touchstart', this.startDrag.bind(this), { passive: false });
    document.addEventListener('touchmove', this.drag.bind(this), { passive: false });
    document.addEventListener('touchend', this.stopDrag.bind(this));

    // Click on container to move handle
    this.container.addEventListener('click', this.moveToClick.bind(this));
  }

  startDrag(e) {
    e.preventDefault();
    this.isDragging = true;
    this.handle.style.cursor = 'ew-resize';
    document.body.style.cursor = 'ew-resize';
  }

  stopDrag() {
    this.isDragging = false;
    this.handle.style.cursor = 'ew-resize';
    document.body.style.cursor = 'default';
  }

  drag(e) {
    if (!this.isDragging) return;
    e.preventDefault();

    this.updatePosition(e);
  }

  moveToClick(e) {
    // Don't trigger if clicking on handle
    if (e.target.closest('.slider-handle')) return;

    this.updatePosition(e);
  }

  updatePosition(e) {
    const containerRect = this.container.getBoundingClientRect();
    const containerWidth = containerRect.width;

    // Get X position (handle both mouse and touch events)
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const x = clientX - containerRect.left;

    // Calculate percentage (constrain between 0% and 100%)
    let percentage = (x / containerWidth) * 100;
    percentage = Math.max(0, Math.min(100, percentage));

    // Update handle position
    this.handle.style.left = `${percentage}%`;

    // Update clip-path for after image
    this.imgAfter.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
  }
}

// Initialize all before/after sliders
document.addEventListener('DOMContentLoaded', () => {
  const sliders = document.querySelectorAll('.slider-container');
  sliders.forEach(slider => new BeforeAfterSlider(slider));
});

// ==================== STICKY BAR VISIBILITY ====================
const stickyBar = document.getElementById('stickyBar');
let lastScrollTop = 0;
const scrollThreshold = 300;

function handleStickyBar() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  // Show sticky bar after scrolling down past threshold
  if (scrollTop > scrollThreshold) {
    stickyBar.style.transform = 'translateY(0)';
  } else {
    stickyBar.style.transform = 'translateY(100%)';
  }

  lastScrollTop = scrollTop;
}

// Throttle scroll event for performance
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      handleStickyBar();
      ticking = false;
    });
    ticking = true;
  }
});

// Initialize sticky bar position
stickyBar.style.transform = 'translateY(100%)';
stickyBar.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';

// ==================== INTERSECTION OBSERVER (FADE IN) ====================
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe sections for fade-in effect
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.results, .signature-offers, .why-us, .reviews, .team, .infos, .faq');

  sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
  });
});

// ==================== LAZY LOADING IMAGES ====================
if ('loading' in HTMLImageElement.prototype) {
  // Browser supports native lazy loading
  const images = document.querySelectorAll('img[loading="lazy"]');
  images.forEach(img => {
    img.src = img.src;
  });
} else {
  // Fallback for browsers that don't support native lazy loading
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
  document.body.appendChild(script);
}

// ==================== GALLERY IMAGE CLICK (OPTIONAL) ====================
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', function() {
    // Add subtle scale effect on click
    this.style.transform = 'scale(0.98)';
    setTimeout(() => {
      this.style.transform = '';
    }, 150);
  });
});

// ==================== PHONE NUMBER CLICK TRACKING ====================
document.querySelectorAll('a[href^="tel:"]').forEach(link => {
  link.addEventListener('click', function() {
    // You can add analytics tracking here
    console.log('Phone call initiated');
  });
});

// ==================== PREVENT ZOOM ON DOUBLE TAP (iOS) ====================
let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
  const now = Date.now();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}, { passive: false });

// ==================== PERFORMANCE: PREFETCH IMPORTANT RESOURCES ====================
const prefetchLinks = [
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com'
];

prefetchLinks.forEach(url => {
  const link = document.createElement('link');
  link.rel = 'dns-prefetch';
  link.href = url;
  document.head.appendChild(link);
});

// ==================== CONSOLE MESSAGE ====================
console.log('%c✂️ Salon Éclat — Premium Page', 'font-size: 16px; font-weight: bold; color: #0f0f0f;');
console.log('%cPage optimisée pour la conversion', 'font-size: 12px; color: #757575;');
