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

  /* ---- Contact Form Validation ---- */
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      let isValid = true;

      // Clear previous errors
      contactForm.querySelectorAll('.form-group').forEach(g => g.classList.remove('has-error'));

      // Validate required fields
      contactForm.querySelectorAll('[required]').forEach(function (field) {
        const group = field.closest('.form-group');
        if (!field.value.trim()) {
          if (group) group.classList.add('has-error');
          isValid = false;
        }
      });

      // Validate phone
      const phoneField = contactForm.querySelector('#contact-phone');
      if (phoneField && phoneField.value.trim()) {
        const phoneVal = phoneField.value.replace(/\s/g, '');
        if (!/^[\d+\-()]{9,15}$/.test(phoneVal)) {
          const group = phoneField.closest('.form-group');
          if (group) group.classList.add('has-error');
          isValid = false;
        }
      }

      // Validate email if present
      const emailField = contactForm.querySelector('#contact-email');
      if (emailField && emailField.value.trim()) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
          const group = emailField.closest('.form-group');
          if (group) group.classList.add('has-error');
          isValid = false;
        }
      }

      if (isValid) {
        // Show success message (in production, replace with actual form submission)
        const successMsg = contactForm.querySelector('.form-success');
        if (successMsg) successMsg.classList.add('is-visible');
        contactForm.reset();

        // Scroll to success
        if (successMsg) successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });

    // Real-time error clearing
    contactForm.querySelectorAll('.form-control').forEach(function (field) {
      field.addEventListener('input', function () {
        const group = field.closest('.form-group');
        if (group && field.value.trim()) group.classList.remove('has-error');
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
