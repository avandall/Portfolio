/**
 * AI-Powered Systems Developer Portfolio - Interactive Script (`app.js`)
 * Formspree Integration & Response Validation Edition
 */

document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    initContactModal();
    initLightboxModal();
});

/* ==========================================================================
   0. Mobile Navigation & Drawer Controller
   ========================================================================== */
function initMobileNav() {
    const toggleBtn = document.getElementById('mobile-nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
    const mobileCtaBtn = document.getElementById('open-contact-btn-mobile-nav');

    if (!toggleBtn || !navMenu) return;

    function toggleMenu() {
        const isOpen = navMenu.classList.toggle('is-open');
        toggleBtn.classList.toggle('is-active', isOpen);
        document.body.classList.toggle('no-scroll', isOpen);
    }

    function closeMenu() {
        navMenu.classList.remove('is-open');
        toggleBtn.classList.remove('is-active');
        document.body.classList.remove('no-scroll');
    }

    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    mobileNavItems.forEach(item => {
        item.addEventListener('click', () => {
            closeMenu();
        });
    });

    if (mobileCtaBtn) {
        mobileCtaBtn.addEventListener('click', (e) => {
            e.preventDefault();
            closeMenu();
            const modal = document.getElementById('contact-modal');
            if (modal) modal.classList.add('active');
        });
    }

    // Close mobile menu if clicked outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('is-open') && !navMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
            closeMenu();
        }
    });

    // Close menu on resize above 900px
    window.addEventListener('resize', () => {
        if (window.innerWidth > 900 && navMenu.classList.contains('is-open')) {
            closeMenu();
        }
    });
}

/* ==========================================================================
   1. Contact Modal & Formspree Email Delivery (avannguyen.nina@gmail.com)
   ========================================================================== */
function initContactModal() {
    const modal = document.getElementById('contact-modal');
    const openBtns = [
        document.getElementById('open-contact-btn-nav'),
        document.getElementById('open-contact-btn-hero'),
        document.getElementById('open-contact-btn-footer'),
        document.getElementById('open-contact-btn-mobile-nav')
    ];
    const closeBtn = document.getElementById('close-modal-btn');

    openBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                modal.classList.add('active');
            });
        }
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });
    }
}

async function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('contact-submit-btn');
    const emailInput = document.getElementById('contact-email');
    const subjectInput = document.getElementById('contact-subject');
    const messageInput = document.getElementById('contact-message');
    const targetEmail = "avannguyen.nina@gmail.com";

    const email = emailInput ? emailInput.value : "";
    const subject = subjectInput ? subjectInput.value : "";
    const message = messageInput ? messageInput.value : "";

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `⏳ Connecting to Formspree...`;
    }

    try {
        const formData = new FormData(form);

        // Submit via Formspree API endpoint
        const response = await fetch(form.action, {
            method: "POST",
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            // ONLY show success banner when Formspree HTTP status is 200 OK!
            showFeedbackBanner("success", `✅ Email Dispatched Successfully via Formspree! Message delivered to ${targetEmail}.`);
            if (form) form.reset();
        } else {
            // Formspree returned an error (e.g. 404 Endpoint Not Activated Yet)
            const data = await response.json().catch(() => ({}));
            console.warn("Formspree response not OK:", response.status, data);
            
            showFeedbackBanner("warning", `⚠️ Formspree Endpoint Pending Activation! Opening default email client to send to ${targetEmail}...`);
            
            // Trigger mailto fallback so email client opens directly
            setTimeout(() => {
                const mailtoUrl = `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("From: " + email + "\n\n" + message)}`;
                window.location.href = mailtoUrl;
            }, 800);
        }
    } catch (err) {
        console.warn("Network dispatch note, triggering mailto fallback:", err);
        showFeedbackBanner("warning", `⚠️ Formspree Endpoint Pending Activation! Opening mail client to send to ${targetEmail}...`);
        
        setTimeout(() => {
            const mailtoUrl = `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("From: " + email + "\n\n" + message)}`;
            window.location.href = mailtoUrl;
        }, 800);
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `✉️ Send Email to ${targetEmail}`;
        }
    }
}

function showFeedbackBanner(type, messageText) {
    const modalCard = document.querySelector('#contact-modal .modal-card');
    if (!modalCard) return;

    let existingBanner = document.getElementById('form-feedback-banner');
    if (existingBanner) existingBanner.remove();

    const banner = document.createElement('div');
    banner.id = 'form-feedback-banner';
    
    if (type === "success") {
        banner.className = 'form-success-banner';
    } else {
        banner.className = 'form-warning-banner';
    }

    banner.innerHTML = `<span>${messageText}</span>`;

    const form = document.getElementById('contact-form');
    modalCard.insertBefore(banner, form);

    setTimeout(() => {
        if (banner) banner.remove();
    }, 7000);
}

/* ==========================================================================
   2. High-Definition Image Lightbox Zoom Controller
   ========================================================================== */
function initLightboxModal() {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox-modal';
    lightbox.id = 'lightbox-modal';
    lightbox.innerHTML = `
        <button class="lightbox-close" id="lightbox-close">&times;</button>
        <img src="" alt="Proof Capture HD View" class="lightbox-content" id="lightbox-img">
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');

    const captureCards = document.querySelectorAll('.proof-capture-card');
    captureCards.forEach(card => {
        card.addEventListener('click', () => {
            const img = card.querySelector('.capture-img');
            if (img && lightboxImg) {
                lightboxImg.src = img.src;
                lightbox.classList.add('active');
            }
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', () => {
            lightbox.classList.remove('active');
        });
    }

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
        }
    });
}