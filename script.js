/**
 * KROMA Studio — Interactive Experience Script
 * Features: Mobile Navigation, Sticky Header, Scroll Spy,
 * Work Filtering, Scroll Reveal (IntersectionObserver), Form Validation.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* --------------------------------------------------------------------------
     1. Sticky Header & Scroll State
     -------------------------------------------------------------------------- */
  const header = document.getElementById('header');

  const handleHeaderScroll = () => {
    if (window.scrollY > 24) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll(); // Run on initial load

  /* --------------------------------------------------------------------------
     2. Mobile Hamburger Navigation
     -------------------------------------------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const primaryNav = document.getElementById('primaryNav');
  const navLinks = document.querySelectorAll('.nav-link, .nav-cta');

  const toggleMobileNav = (forceState) => {
    const isCurrentlyOpen = primaryNav.classList.contains('is-open');
    const shouldOpen = typeof forceState === 'boolean' ? forceState : !isCurrentlyOpen;

    if (shouldOpen) {
      primaryNav.classList.add('is-open');
      navToggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('menu-open');
    } else {
      primaryNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    }
  };

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => toggleMobileNav());

    // Close when clicking any nav link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (primaryNav.classList.contains('is-open')) {
          toggleMobileNav(false);
        }
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && primaryNav.classList.contains('is-open')) {
        toggleMobileNav(false);
        navToggle.focus();
      }
    });

    // Reset when resizing above tablet breakpoint (768px)
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768 && primaryNav.classList.contains('is-open')) {
        toggleMobileNav(false);
      }
    });
  }

  /* --------------------------------------------------------------------------
     3. Active Nav Link on Scroll (Scroll Spy)
     -------------------------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const menuLinks = document.querySelectorAll('.primary-nav .nav-link');

  const highlightNavOnScroll = () => {
    const scrollPosition = window.scrollY + 120; // Offset for header

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        menuLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNavOnScroll, { passive: true });

  /* --------------------------------------------------------------------------
     4. Scroll Reveal Animations (IntersectionObserver)
     -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target); // Trigger animation once
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach((el) => el.classList.add('is-revealed'));
  }

  /* --------------------------------------------------------------------------
     5. Featured Work Category Filtering
     -------------------------------------------------------------------------- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const workCards = document.querySelectorAll('.work-card');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const selectedFilter = btn.getAttribute('data-filter');

      // Update active state on buttons
      filterButtons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Filter cards with smooth fade
      workCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category');
        const matches = selectedFilter === 'all' || cardCategory === selectedFilter;

        if (matches) {
          card.classList.remove('is-hidden');
          // Re-trigger reveal animation smoothly
          setTimeout(() => {
            card.classList.add('is-revealed');
          }, 30);
        } else {
          card.classList.add('is-hidden');
        }
      });
    });
  });

  /* --------------------------------------------------------------------------
     6. Contact Form Validation & Submission
     -------------------------------------------------------------------------- */
  const form = document.getElementById('contactForm');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const serviceSelect = document.getElementById('service');
  const messageInput = document.getElementById('message');
  const submitBtn = document.getElementById('submitBtn');
  const successAlert = document.getElementById('formSuccessAlert');

  // Email format validator
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailRegex.test(email.trim());
  };

  // Helper to mark field error
  const setFieldError = (inputEl, errorElId, message) => {
    const group = inputEl.closest('.form-group');
    const errorEl = document.getElementById(errorElId);

    if (group && errorEl) {
      group.classList.add('has-error');
      errorEl.textContent = message;
      inputEl.setAttribute('aria-invalid', 'true');
    }
  };

  // Helper to clear field error
  const clearFieldError = (inputEl, errorElId) => {
    const group = inputEl.closest('.form-group');
    const errorEl = document.getElementById(errorElId);

    if (group && errorEl) {
      group.classList.remove('has-error');
      errorEl.textContent = '';
      inputEl.removeAttribute('aria-invalid');
    }
  };

  // Real-time clearance of errors on user input
  nameInput.addEventListener('input', () => clearFieldError(nameInput, 'name-error'));
  emailInput.addEventListener('input', () => clearFieldError(emailInput, 'email-error'));
  serviceSelect.addEventListener('change', () => clearFieldError(serviceSelect, 'service-error'));
  messageInput.addEventListener('input', () => clearFieldError(messageInput, 'message-error'));

  // Form submit handler
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let hasErrors = false;
      let firstInvalidElement = null;

      // 1. Validate Name
      const nameVal = nameInput.value.trim();
      if (!nameVal) {
        setFieldError(nameInput, 'name-error', 'Please provide your full name.');
        hasErrors = true;
        firstInvalidElement = firstInvalidElement || nameInput;
      } else if (nameVal.length < 2) {
        setFieldError(nameInput, 'name-error', 'Name must be at least 2 characters.');
        hasErrors = true;
        firstInvalidElement = firstInvalidElement || nameInput;
      } else {
        clearFieldError(nameInput, 'name-error');
      }

      // 2. Validate Email
      const emailVal = emailInput.value.trim();
      if (!emailVal) {
        setFieldError(emailInput, 'email-error', 'Please enter your email address.');
        hasErrors = true;
        firstInvalidElement = firstInvalidElement || emailInput;
      } else if (!isValidEmail(emailVal)) {
        setFieldError(emailInput, 'email-error', 'Please provide a valid email format (name@company.com).');
        hasErrors = true;
        firstInvalidElement = firstInvalidElement || emailInput;
      } else {
        clearFieldError(emailInput, 'email-error');
      }

      // 3. Validate Service Selection
      const serviceVal = serviceSelect.value;
      if (!serviceVal) {
        setFieldError(serviceSelect, 'service-error', 'Please choose a primary service discipline.');
        hasErrors = true;
        firstInvalidElement = firstInvalidElement || serviceSelect;
      } else {
        clearFieldError(serviceSelect, 'service-error');
      }

      // 4. Validate Message
      const messageVal = messageInput.value.trim();
      if (!messageVal) {
        setFieldError(messageInput, 'message-error', 'Please describe your project scope.');
        hasErrors = true;
        firstInvalidElement = firstInvalidElement || messageInput;
      } else if (messageVal.length < 15) {
        setFieldError(messageInput, 'message-error', 'Please provide at least 15 characters describing your project.');
        hasErrors = true;
        firstInvalidElement = firstInvalidElement || messageInput;
      } else {
        clearFieldError(messageInput, 'message-error');
      }

      // If invalid, focus first error input
      if (hasErrors) {
        firstInvalidElement?.focus();
        return;
      }

      // If valid: Simulate asynchronous submission
      submitBtn.classList.add('is-submitting');
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.classList.remove('is-submitting');
        submitBtn.disabled = false;

        // Reset inputs
        form.reset();

        // Reveal Success Alert
        if (successAlert) {
          successAlert.hidden = false;
          successAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

          // Auto-hide alert after 8 seconds
          setTimeout(() => {
            successAlert.hidden = true;
          }, 8000);
        }
      }, 1000);
    });
  }

  /* --------------------------------------------------------------------------
     7. Back to Top Button
     -------------------------------------------------------------------------- */
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
