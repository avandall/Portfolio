/**
 * AI-Powered Systems Developer Portfolio - Interactive Script (`app.js`)
 * Formspree Integration & Response Validation Edition
 */

document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    initContactModal();
    initLightboxModal();
    initTouchSliders();
});

/* ==========================================================================
   0.1 Fluid Touch & Drag Inertia Velocity Controller for Sliders
   ========================================================================== */
function initTouchSliders() {
    const sliders = document.querySelectorAll('.skills-grid, .metrics-grid, .captures-proof-grid, .under-the-hood-grid, .philosophy-grid');

    sliders.forEach(slider => {
        let isDown = false;
        let startX;
        let scrollLeft;
        let velX = 0;
        let momentumID;

        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.classList.add('is-dragging');
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
            cancelAnimationFrame(momentumID);
        });

        slider.addEventListener('mouseleave', () => {
            if (!isDown) return;
            isDown = false;
            slider.classList.remove('is-dragging');
            beginMomentum();
        });

        slider.addEventListener('mouseup', () => {
            if (!isDown) return;
            isDown = false;
            slider.classList.remove('is-dragging');
            beginMomentum();
        });

        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 1.5;
            const prevScrollLeft = slider.scrollLeft;
            slider.scrollLeft = scrollLeft - walk;
            velX = slider.scrollLeft - prevScrollLeft;
        });

        function beginMomentum() {
            cancelAnimationFrame(momentumID);
            function step() {
                if (Math.abs(velX) > 0.5) {
                    slider.scrollLeft += velX;
                    velX *= 0.92;
                    momentumID = requestAnimationFrame(step);
                }
            }
            step();
        }
    });
}

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

    const emailInput = document.getElementById('contact-email');
    if (emailInput) {
        emailInput.addEventListener('input', () => {
            if (emailInput.classList.contains('input-error')) {
                emailInput.classList.remove('input-error');
            }
        });
    }
}

let isFormSubmitting = false;

async function handleFormSubmit(event) {
    event.preventDefault();
    if (isFormSubmitting) return;
    
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('contact-submit-btn');
    const emailInput = document.getElementById('contact-email');
    const subjectInput = document.getElementById('contact-subject');
    const messageInput = document.getElementById('contact-message');
    const targetEmail = "avannguyen.nina@gmail.com";

    const email = emailInput ? emailInput.value.trim() : "";
    const subject = subjectInput ? subjectInput.value.trim() : "";
    const message = messageInput ? messageInput.value.trim() : "";

    // Client-side strict email format verification (prevents invalid patterns like "user@domain" without TLD)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        if (emailInput) {
            emailInput.classList.remove('input-error');
            void emailInput.offsetWidth; // Trigger reflow for re-animation
            emailInput.classList.add('input-error');
            emailInput.focus();
        }
        showFeedbackBanner("error", "⚠️ Please enter a valid email address (e.g. name@company.com)");
        return;
    }

    if (emailInput) {
        emailInput.classList.remove('input-error');
    }

    isFormSubmitting = true;
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `⏳ Sending message...`;
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

        const data = await response.json().catch(() => ({}));

        if (response.ok) {
            showFeedbackBanner("success", `✅ Message delivered successfully via Formspree! Sent to ${targetEmail}.`);
            if (form) form.reset();
        } else if (response.status === 422) {
            // Formspree validation error (e.g. email rejected by server)
            console.warn("Formspree validation error:", data);
            let errMsg = "Please check your inputs and try again.";
            if (data.errors && data.errors.length) {
                errMsg = data.errors.map(e => e.message ? `${e.field}: ${e.message}` : e.message).join(", ");
            } else if (data.error) {
                errMsg = data.error;
            }
            showFeedbackBanner("error", `⚠️ Validation error: ${errMsg}`);
            if (emailInput) {
                emailInput.classList.add('input-error');
                emailInput.focus();
            }
        } else if (response.status === 429) {
            // Rate limit reached
            console.warn("Formspree rate limited:", response.status, data);
            showFeedbackBanner("warning", `⚠️ Form submission limit reached. Opening default email client to send to ${targetEmail}...`);
            setTimeout(() => {
                const mailtoUrl = `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("From: " + email + "\n\n" + message)}`;
                window.location.href = mailtoUrl;
            }, 1000);
        } else {
            // Formspree server error or inactive endpoint
            console.warn("Formspree response error:", response.status, data);
            showFeedbackBanner("warning", `⚠️ Unable to deliver via form service. Opening email client to send to ${targetEmail}...`);
            setTimeout(() => {
                const mailtoUrl = `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("From: " + email + "\n\n" + message)}`;
                window.location.href = mailtoUrl;
            }, 1000);
        }
    } catch (err) {
        // Network blocked (e.g. AdBlocker or offline)
        console.warn("Network dispatch note, triggering mailto fallback:", err);
        showFeedbackBanner("warning", `⚠️ Connection blocked (e.g. by AdBlocker/network). Opening email client to send to ${targetEmail}...`);
        
        setTimeout(() => {
            const mailtoUrl = `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("From: " + email + "\n\n" + message)}`;
            window.location.href = mailtoUrl;
        }, 1000);
    } finally {
        isFormSubmitting = false;
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
    banner.className = `form-feedback-banner form-${type}-banner`;

    banner.innerHTML = `
        <span class="banner-text">${messageText}</span>
        <button type="button" class="banner-close" aria-label="Dismiss notification">&times;</button>
    `;

    const closeBtn = banner.querySelector('.banner-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => banner.remove());
    }

    const form = document.getElementById('contact-form');
    modalCard.insertBefore(banner, form);

    setTimeout(() => {
        if (banner && banner.parentNode) banner.remove();
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
        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 900 480'%3E%3C/svg%3E" alt="Proof Capture HD View" class="lightbox-content" id="lightbox-img" width="900" height="480">
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