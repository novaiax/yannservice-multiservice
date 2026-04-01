// Mobile menu
const toggle = document.querySelector('.mobile-toggle');
const nav = document.querySelector('.nav-menu');
if (toggle) {
    toggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        toggle.classList.toggle('active');
    });
}

// Close menu on link click
document.querySelectorAll('.nav-menu a').forEach(a => {
    a.addEventListener('click', () => {
        nav.classList.remove('active');
        toggle.classList.remove('active');
    });
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Scroll animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.addEventListener('DOMContentLoaded', () => {
    const els = document.querySelectorAll('.dest-card, .imit-card, .stat, .real-item, .about-text, .about-img');
    els.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `all 0.5s ease ${(i % 4) * 0.1}s`;
        observer.observe(el);
    });
});

// Header shadow on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    header.style.boxShadow = window.scrollY > 50 ? '0 4px 20px rgba(0,0,0,.12)' : '0 4px 20px rgba(0,0,0,.08)';
});
