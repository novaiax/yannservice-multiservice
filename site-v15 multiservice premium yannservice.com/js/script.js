// ===================================
// YANNWZSERVICE.COM - Main JavaScript
// ===================================

console.log('%c YANNWZSERVICE.COM - Site de conversion', 'color: #0066FF; font-size: 16px; font-weight: bold;');

// ===================================
// FIX: Supprimer les scrollbars internes
// ===================================
(function() {
    // Fonction pour forcer overflow visible sur tous les éléments
    function fixOverflow() {
        const allElements = document.querySelectorAll('section, div, main, article, aside, .container');
        allElements.forEach(el => {
            const style = window.getComputedStyle(el);
            if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
                el.style.overflowY = 'visible';
            }
            if (style.maxHeight && style.maxHeight !== 'none' && !el.classList.contains('nav-links') && !el.classList.contains('faq-answer')) {
                el.style.maxHeight = 'none';
            }
        });
    }

    // Exécuter au chargement
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fixOverflow);
    } else {
        fixOverflow();
    }

    // Exécuter aussi après un court délai (pour les éléments chargés dynamiquement)
    setTimeout(fixOverflow, 100);
    setTimeout(fixOverflow, 500);
})();

// ===================================
// MOBILE MENU TOGGLE
// ===================================

const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuToggle && navLinks) {
    function toggleMenu(e) {
        e.preventDefault();
        e.stopPropagation();

        const isActive = navLinks.classList.contains('active');

        if (isActive) {
            navLinks.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        } else {
            navLinks.classList.add('active');
            mobileMenuToggle.classList.add('active');
        }
    }

    mobileMenuToggle.addEventListener('click', toggleMenu);
    mobileMenuToggle.addEventListener('touchend', function(e) {
        e.preventDefault();
        toggleMenu(e);
    });

    // Close menu when clicking on a link
    const links = document.querySelectorAll('.nav-link, .nav-cta a');
    links.forEach(function(link) {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navLinks.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            navLinks.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
    });
}

// ===================================
// SMOOTH SCROLL WITH OFFSET
// ===================================

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

// ===================================
// NAVIGATION SCROLL EFFECT
// ===================================

const nav = document.querySelector('.nav');

function handleNavScroll() {
    if (window.scrollY > 10) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', throttle(handleNavScroll, 100));
handleNavScroll();

// ===================================
// FAQ ACCORDION
// ===================================

const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        const isActive = faqItem.classList.contains('active');

        // Close all FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });

        // Open clicked item if it wasn't active
        if (!isActive) {
            faqItem.classList.add('active');
        }
    });
});

// ===================================
// TOAST NOTIFICATIONS
// ===================================

function showToast(title, message, type = 'info', duration = 5000) {
    let container = document.getElementById('toastContainer');

    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon;
    if (type === 'success') {
        icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>`;
    } else if (type === 'error') {
        icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>`;
    } else {
        icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>`;
    }

    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="4" x2="4" y2="12"/>
                <line x1="4" y1="4" x2="12" y2="12"/>
            </svg>
        </button>
    `;

    container.appendChild(toast);

    if (duration > 0) {
        setTimeout(() => {
            toast.classList.add('removing');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    return toast;
}

// ===================================
// FORM SUBMISSION
// ===================================

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;

        // Disable button and show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = 'Envoi en cours...';

        try {
            // Show sending toast
            const sendingToast = showToast(
                'Envoi en cours',
                'Transmission de votre demande...',
                'info',
                0
            );

            // Get form data
            const formData = new FormData(contactForm);

            // Send form to Web3Forms
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            // Close sending toast
            sendingToast.classList.add('removing');
            setTimeout(() => sendingToast.remove(), 300);

            if (response.ok && data.success) {
                // Show success message
                showToast(
                    'Message envoy avec succs !',
                    'Je vous rponds sous 24h.',
                    'success',
                    7000
                );

                // Reset form
                contactForm.reset();

                // Scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                // Show error message
                showToast(
                    'Erreur d\'envoi',
                    data.message || 'Une erreur est survenue. Veuillez ressayer.',
                    'error',
                    8000
                );
            }
        } catch (error) {
            console.error('Error:', error);

            showToast(
                'Erreur de connexion',
                'Impossible d\'envoyer le message. Contactez-moi directement  yannwzservice@gmail.com',
                'error',
                10000
            );
        } finally {
            // Re-enable button and restore original text
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
    });
}

// ===================================
// MODAL FOR EXAMPLES
// ===================================

const modal = document.getElementById('exampleModal');
const modalGallery = document.getElementById('modalGallery');

// Image collections for each example
const exampleImages = [
    // Example 1 - Offre 1
    [
        'Photos%20pages%20exemples/Photos%20pages%20exemples%20offre%201/photo%201.png',
        'Photos%20pages%20exemples/Photos%20pages%20exemples%20offre%201/photo%202.png',
        'Photos%20pages%20exemples/Photos%20pages%20exemples%20offre%201/photo%203.png',
        'Photos%20pages%20exemples/Photos%20pages%20exemples%20offre%201/photo%204.png',
        'Photos%20pages%20exemples/Photos%20pages%20exemples%20offre%201/photo%205.png',
        'Photos%20pages%20exemples/Photos%20pages%20exemples%20offre%201/photo%206.png'
    ],
    // Example 2 - Offre 2
    [
        'Photos%20pages%20exemples/Photos%20pages%20exemples%20offre%202/photo%201.png',
        'Photos%20pages%20exemples/Photos%20pages%20exemples%20offre%202/photo%202.png',
        'Photos%20pages%20exemples/Photos%20pages%20exemples%20offre%202/photo%203.png',
        'Photos%20pages%20exemples/Photos%20pages%20exemples%20offre%202/photo%204.png',
        'Photos%20pages%20exemples/Photos%20pages%20exemples%20offre%202/photo%205.png',
        'Photos%20pages%20exemples/Photos%20pages%20exemples%20offre%202/photo%206.png'
    ],
    // Example 3 - Offre 3
    [
        'Photos%20pages%20exemples/Photos%20pages%20exemples%20offre%203/photo%201.png',
        'Photos%20pages%20exemples/Photos%20pages%20exemples%20offre%203/photo%202.png',
        'Photos%20pages%20exemples/Photos%20pages%20exemples%20offre%203/photo%203.png',
        'Photos%20pages%20exemples/Photos%20pages%20exemples%20offre%203/photo%204.png',
        'Photos%20pages%20exemples/Photos%20pages%20exemples%20offre%203/photo%205.png',
        'Photos%20pages%20exemples/Photos%20pages%20exemples%20offre%203/photo%206.png'
    ]
];

let currentExample = 0;
let currentImageIndex = 0;

function openModal(exampleIndex) {
    if (!modal) return;
    currentExample = exampleIndex;
    currentImageIndex = 0;
    updateModalImage();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function updateModalImage() {
    if (!modalGallery) return;
    const images = exampleImages[currentExample];
    if (images && images[currentImageIndex]) {
        modalGallery.innerHTML = `<img src="${images[currentImageIndex]}" alt="Example ${currentExample + 1} - Image ${currentImageIndex + 1}" />`;
    }
}

function prevImage() {
    const images = exampleImages[currentExample];
    if (!images) return;
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    updateModalImage();
}

function nextImage() {
    const images = exampleImages[currentExample];
    if (!images) return;
    currentImageIndex = (currentImageIndex + 1) % images.length;
    updateModalImage();
}

// Keyboard navigation for modal
document.addEventListener('keydown', (e) => {
    if (modal && modal.classList.contains('active')) {
        if (e.key === 'Escape') {
            closeModal();
        } else if (e.key === 'ArrowLeft') {
            prevImage();
        } else if (e.key === 'ArrowRight') {
            nextImage();
        }
    }
});

// Make functions globally available
window.openModal = openModal;
window.closeModal = closeModal;
window.prevImage = prevImage;
window.nextImage = nextImage;

// ===================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ===================================

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

// Observe elements for fade-in animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll(
        '.service-card, .proof-card, .process-step, .testimonial-card, .pricing-card, .example-card, .feature-card, .faq-item'
    );

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// ===================================
// LAZY LOADING IMAGES
// ===================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===================================
// SERVICE WORKER FOR CACHING
// ===================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(err => console.log('SW registration failed'));
    });
}

// ===================================
// PHONE NUMBER FORMATTING
// ===================================

const phoneInputs = document.querySelectorAll('input[type="tel"]');
phoneInputs.forEach(input => {
    input.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 10) {
            value = value.slice(0, 10);
        }
        // Format as XX XX XX XX XX
        if (value.length > 0) {
            let formatted = '';
            for (let i = 0; i < value.length; i++) {
                if (i > 0 && i % 2 === 0) {
                    formatted += ' ';
                }
                formatted += value[i];
            }
            e.target.value = formatted;
        }
    });
});

// ===================================
// OFFER PRE-SELECTION FROM URL
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const offerParam = urlParams.get('offer');

    if (offerParam) {
        const offerSelect = document.getElementById('offer');
        if (offerSelect) {
            offerSelect.value = offerParam;
        }

        // Scroll to contact form
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            setTimeout(() => {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }, 500);
        }
    }

    const serviceParam = urlParams.get('service');
    if (serviceParam) {
        const serviceSelect = document.getElementById('service');
        if (serviceSelect) {
            // Set the value
            serviceSelect.value = serviceParam;

            // If the option wasn't found, try common variations
            if (serviceSelect.value !== serviceParam) {
                // Map common variations
                const serviceMap = {
                    'landing-page': 'landing',
                    'landingpage': 'landing',
                    'site-web': 'site',
                    'siteweb': 'site',
                    'depannage': 'urgence',
                    'abonnement': 'abonnement-prioritaire',
                    'maintenance': 'abonnement-maintenance',
                    'essentiel': 'abonnement-essentiel',
                    'prioritaire': 'abonnement-prioritaire'
                };

                const mappedService = serviceMap[serviceParam] || serviceParam;
                serviceSelect.value = mappedService;
            }

            // Highlight the select to draw attention
            serviceSelect.style.borderColor = 'var(--color-primary)';
            serviceSelect.style.boxShadow = '0 0 0 3px var(--color-primary-light)';

            // Remove highlight after 2 seconds
            setTimeout(() => {
                serviceSelect.style.borderColor = '';
                serviceSelect.style.boxShadow = '';
            }, 2000);
        }
    }
});

console.log('Site charg avec succs');
