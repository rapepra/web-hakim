/**
 * Reforma Elegant3 – Main JavaScript
 * Handles: mobile menu, cookie banner, sticky header, current year, lightbox, form validation
 */

(function () {
  'use strict';

  /* ---- Current Year ---- */
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Mobile Menu ---- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', String(!isOpen));
      mobileMenu.classList.toggle('is-open', !isOpen);
      mobileMenu.setAttribute('aria-hidden', String(isOpen));
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    // Close on link click
    mobileMenu.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMobileMenu();
    });
  }

  function closeMobileMenu() {
    if (!hamburger || !mobileMenu) return;
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  /* ---- Sticky Header Shadow ---- */
  const header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.style.boxShadow = window.scrollY > 10
        ? '0 2px 20px rgba(0,0,0,.12)'
        : '0 1px 3px rgba(0,0,0,.08)';
    }, { passive: true });
  }

  /* ---- Cookie Banner ---- */
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  const cookieReject = document.getElementById('cookie-reject');

  function isCookieSet() {
    return document.cookie.split(';').some(c => c.trim().startsWith('re3_cookie_consent='));
  }

  function setCookie(value) {
    const d = new Date();
    d.setTime(d.getTime() + 365 * 24 * 60 * 60 * 1000);
    document.cookie = `re3_cookie_consent=${value};expires=${d.toUTCString()};path=/;SameSite=Lax`;
  }

  if (cookieBanner && !isCookieSet()) {
    // Show after short delay
    setTimeout(function () {
      cookieBanner.setAttribute('aria-hidden', 'false');
      cookieBanner.classList.add('is-visible');
    }, 1200);
  }

  if (cookieAccept) {
    cookieAccept.addEventListener('click', function () {
      setCookie('all');
      hideCookieBanner();
    });
  }

  if (cookieReject) {
    cookieReject.addEventListener('click', function () {
      setCookie('essential');
      hideCookieBanner();
    });
  }

  function hideCookieBanner() {
    if (!cookieBanner) return;
    cookieBanner.classList.remove('is-visible');
    cookieBanner.setAttribute('aria-hidden', 'true');
  }

  /* ---- Gallery Lightbox ---- */
  const galleryGrids = document.querySelectorAll('.gallery-grid, .gallery-full-grid');

  if (galleryGrids.length > 0) {
    // Create lightbox DOM
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Imagen ampliada');

    const closeBtn = document.createElement('button');
    closeBtn.className = 'lightbox-close';
    closeBtn.setAttribute('aria-label', 'Cerrar imagen');
    closeBtn.innerHTML = '✕';

    const img = document.createElement('img');
    img.className = 'lightbox-img';
    img.alt = '';

    const caption = document.createElement('p');
    caption.className = 'lightbox-caption';

    overlay.append(closeBtn, img, caption);
    document.body.appendChild(overlay);

    galleryGrids.forEach(grid => {
      grid.querySelectorAll('.gallery-item').forEach(item => {
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');

        const openLightbox = function () {
          const imgEl = item.querySelector('img');
          const cap = item.querySelector('figcaption');
          if (!imgEl) return;

          img.src = imgEl.src;
          img.alt = imgEl.alt;
          caption.textContent = cap ? cap.textContent : '';
          overlay.classList.add('is-open');
          document.body.style.overflow = 'hidden';
          closeBtn.focus();
        };

        item.addEventListener('click', openLightbox);
        item.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openLightbox();
          }
        });
      });
    });

    const closeLightbox = function () {
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';
    };

    closeBtn.addEventListener('click', closeLightbox);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  /* ---- SEM & Analytics Conversion Tracking Helper ---- */
  function trackConversion(action, label) {
    // Google Analytics 4 / Google Ads (gtag)
    if (typeof window.gtag === 'function') {
      window.gtag('event', action, {
        event_category: 'Lead',
        event_label: label || 'Website Interaction'
      });
    }
    // Google Tag Manager dataLayer
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: 'lead_conversion',
        conversion_action: action,
        conversion_label: label
      });
    }
  }

  // Auto-track direct Call & WhatsApp link clicks
  document.querySelectorAll('a[href^="tel:"]').forEach(function (callLink) {
    callLink.addEventListener('click', function () {
      trackConversion('click_call', 'Direct Phone Call 613 601 880');
    });
  });

  document.querySelectorAll('a[href*="wa.me"]').forEach(function (waLink) {
    waLink.addEventListener('click', function () {
      trackConversion('click_whatsapp', 'Direct WhatsApp Click');
    });
  });

  /* ---- Contact Form Validation & Dual Submission (Form / WhatsApp) ---- */
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    // Validate individual group helper
    function validateGroup(field, isValidCondition) {
      const group = field.closest('.form-group');
      if (!isValidCondition) {
        if (group) group.classList.add('has-error');
        return false;
      } else {
        if (group) group.classList.remove('has-error');
        return true;
      }
    }

    function checkFormValidity() {
      let valid = true;

      // Required text/select/checkbox
      contactForm.querySelectorAll('[required]').forEach(function (field) {
        if (field.type === 'checkbox') {
          if (!validateGroup(field, field.checked)) valid = false;
        } else {
          if (!validateGroup(field, field.value.trim().length > 0)) valid = false;
        }
      });

      // Validate phone
      const phoneField = contactForm.querySelector('#contact-phone');
      if (phoneField && phoneField.value.trim()) {
        const phoneVal = phoneField.value.replace(/[\s\-\(\)]/g, '');
        if (!validateGroup(phoneField, /^(\+34|0034)?[6789]\d{8}$/.test(phoneVal))) {
          valid = false;
        }
      }

      return valid;
    }

    // Standard submission
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (checkFormValidity()) {
        trackConversion('submit_lead_form', 'Formulario Presupuesto Baño');

        const successMsg = contactForm.querySelector('.form-success');
        if (successMsg) {
          successMsg.classList.add('is-visible');
          successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        contactForm.reset();
      }
    });

    // Real-time error clearing on input/change
    contactForm.querySelectorAll('.form-control, input[type="checkbox"]').forEach(function (field) {
      field.addEventListener('input', function () {
        const group = field.closest('.form-group');
        if (group && field.value.trim()) group.classList.remove('has-error');
      });
      field.addEventListener('change', function () {
        const group = field.closest('.form-group');
        if (group) group.classList.remove('has-error');
      });
    });

    // Send Form Data directly to WhatsApp button
    const btnSubmitWhatsapp = document.getElementById('btn-submit-whatsapp');
    if (btnSubmitWhatsapp) {
      btnSubmitWhatsapp.addEventListener('click', function () {
        const nameField = contactForm.querySelector('#contact-name');
        const phoneField = contactForm.querySelector('#contact-phone');
        const cityField = contactForm.querySelector('#contact-city');
        const serviceField = contactForm.querySelector('#contact-service');
        const messageField = contactForm.querySelector('#contact-message');

        const nameVal = nameField ? nameField.value.trim() : '';
        const phoneVal = phoneField ? phoneField.value.trim() : '';
        const cityVal = cityField ? cityField.value.trim() : 'Ermua / comarca';
        const serviceVal = serviceField ? serviceField.value.trim() : 'Reforma de Baño';
        const messageVal = messageField ? messageField.value.trim() : '';

        // Minimum requirement: Name and Phone
        let hasError = false;
        if (!nameVal) {
          if (nameField) validateGroup(nameField, false);
          hasError = true;
        }
        if (!phoneVal) {
          if (phoneField) validateGroup(phoneField, false);
          hasError = true;
        }

        if (hasError) {
          const firstErr = contactForm.querySelector('.form-group.has-error');
          if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        }

        trackConversion('submit_whatsapp_data', 'Envio Formulario Directo WhatsApp');

        let waText = `Hola Hakim, me llamo ${nameVal} (Tlf: ${phoneVal}).`;
        if (cityVal) waText += ` Soy de ${cityVal}.`;
        if (serviceVal) waText += ` Me interesa consultar sobre: ${serviceVal}.`;
        if (messageVal) waText += ` Detalles: ${messageVal}`;

        const waUrl = `https://wa.me/34613601880?text=${encodeURIComponent(waText)}`;
        window.open(waUrl, '_blank', 'noopener,noreferrer');
      });
    }
  }

  /* ---- Centralized Gallery Filter ---- */
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item[data-category]');

  if (filterBtns.length > 0 && galleryItems.length > 0) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const filter = this.dataset.filter;

        filterBtns.forEach(b => {
          b.classList.remove('btn-primary', 'active');
          b.classList.add('btn-outline');
          b.setAttribute('aria-selected', 'false');
        });
        this.classList.add('btn-primary', 'active');
        this.classList.remove('btn-outline');
        this.setAttribute('aria-selected', 'true');

        galleryItems.forEach(function (item) {
          item.style.display = (filter === 'all' || item.dataset.category === filter) ? '' : 'none';
        });
      });
    });
  }

  /* ---- Smooth anchor scrolling (same page) ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerOffset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - headerOffset - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---- Intersection Observer for fade-in ---- */
  if ('IntersectionObserver' in window) {
    const style = document.createElement('style');
    style.textContent = `
      .fade-in { opacity: 0; transform: translateY(20px); transition: opacity 0.5s ease, transform 0.5s ease; }
      .fade-in.is-visible { opacity: 1; transform: translateY(0); }
    `;
    document.head.appendChild(style);

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.service-card, .testimonial-card, .zone-card, .gallery-item, .trust-item').forEach(function (el) {
      el.classList.add('fade-in');
      observer.observe(el);
    });
  }

})();
