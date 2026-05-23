/**
 * ELITE PHYSICAL THERAPY & WELLNESS CENTER - INTERACTIVE ENGINE
 * High-fidelity, smooth animations & modal interaction logic.
 */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initHeaderScroll();
  initMobileMenu();
  initScrollReveal();
  initBookingModal();
  initStatsCounter();
});

/**
 * 1. Header Scrolled Styling
 */
function initHeaderScroll() {
  const header = document.getElementById('main-header');
  if (!header) return;

  const checkScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', checkScroll);
  checkScroll(); // Run once at load
}

/**
 * 2. Mobile Menu Toggle & ARIA Accessibility
 */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (!toggleBtn || !navMenu) return;

  const toggleMenu = () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', !isExpanded);
    toggleBtn.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Prevent body scrolling when mobile menu is open
    if (!isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  toggleBtn.addEventListener('click', toggleMenu);

  // Close menu when a link is clicked
  const navLinks = navMenu.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        toggleMenu();
      }
    });
  });
}

/**
 * 3. Scroll Reveal System using IntersectionObserver
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.animate-reveal-scroll');
  
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      threshold: 0.12, // Trigger when 12% of the element is visible
      rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // Stop tracking after it animates
        }
      });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback: instantly reveal everything if browser does not support IntersectionObserver
    revealElements.forEach(el => el.classList.add('revealed'));
  }
}

/**
 * 4. Premium Booking Appointment Modal Logic
 */
function initBookingModal() {
  const modalOverlay = document.getElementById('booking-modal-overlay');
  const closeBtn = document.getElementById('booking-modal-close');
  const openButtons = document.querySelectorAll('.open-booking-modal');
  const bookingForm = document.getElementById('booking-form');
  const formWrapper = document.getElementById('modal-form-wrapper');
  const successWrapper = document.getElementById('modal-success-wrapper');
  const successCloseBtn = document.getElementById('success-close-btn');
  
  if (!modalOverlay || !closeBtn) return;

  // Open Modal
  const openModal = (e) => {
    e.preventDefault();
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden'; // Lock background scrolling
    
    // Set default preferred date to tomorrow
    const dateInput = document.getElementById('booking-date');
    if (dateInput) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const yyyy = tomorrow.getFullYear();
      const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
      const dd = String(tomorrow.getDate()).padStart(2, '0');
      dateInput.min = `${yyyy}-${mm}-${dd}`;
      dateInput.value = `${yyyy}-${mm}-${dd}`;
    }
  };

  // Close Modal
  const closeModal = () => {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = ''; // Unlock background scrolling
    
    // Reset modal state with delay to let transition finish
    setTimeout(() => {
      if (formWrapper && successWrapper) {
        formWrapper.style.display = 'block';
        successWrapper.style.display = 'none';
        if (bookingForm) bookingForm.reset();
      }
    }, 400);
  };

  // Event Listeners for Opening
  openButtons.forEach(btn => btn.addEventListener('click', openModal));

  // Event Listeners for Closing
  closeBtn.addEventListener('click', closeModal);
  if (successCloseBtn) successCloseBtn.addEventListener('click', closeModal);

  // Click outside to close
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  // Escape key to close
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
      closeModal();
    }
  });

  // Intercept Form Submission
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = document.getElementById('submit-booking-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'SUBMITTING REQUEST...';
      }

      // Collect data for personalized success feedback
      const userName = document.getElementById('booking-name').value;
      const userConditionSelect = document.getElementById('booking-condition');
      const userCondition = userConditionSelect.options[userConditionSelect.selectedIndex].text;
      
      const userDate = document.getElementById('booking-date').value;
      const userTimeSelect = document.getElementById('booking-time');
      const userTime = userTimeSelect.selectedIndex > 0 
        ? userTimeSelect.options[userTimeSelect.selectedIndex].text 
        : 'Coordinator choice';

      // Simulate API submit delay
      setTimeout(() => {
        if (formWrapper && successWrapper) {
          // Fill success data
          const successNameEl = document.getElementById('success-user-name');
          const summaryConditionEl = document.getElementById('summary-condition');
          const summaryDateTimeEl = document.getElementById('summary-date-time');

          if (successNameEl) successNameEl.textContent = userName;
          if (summaryConditionEl) summaryConditionEl.textContent = userCondition !== 'Select a condition type' ? userCondition : 'General PT Request';
          if (summaryDateTimeEl) {
            const formattedDate = new Date(userDate).toLocaleDateString('en-US', {
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric'
            });
            summaryDateTimeEl.textContent = `${formattedDate} (${userTime})`;
          }

          // Toggle views
          formWrapper.style.display = 'none';
          successWrapper.style.display = 'flex';
        }
        
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'SUBMIT REQUEST';
        }
      }, 1000);
    });
  }
}

/**
 * 5. Stats Counters Count-Up Animation
 */
function initStatsCounter() {
  const statsSection = document.getElementById('testimonials');
  if (!statsSection) return;

  let animated = false;

  const countUp = (element, targetValue, duration) => {
    let start = 0;
    const isFloating = targetValue % 1 !== 0;
    const isPlus = element.textContent.includes('+');
    const stepTime = Math.abs(Math.floor(duration / (isFloating ? targetValue * 10 : targetValue)));
    
    const timer = setInterval(() => {
      if (isFloating) {
        start += 0.1;
        element.textContent = start.toFixed(1);
      } else {
        start += Math.ceil(targetValue / 30); // Dynamic step
        if (start > targetValue) start = targetValue;
        element.textContent = isPlus ? `${start}+` : start;
      }
      
      if (start >= targetValue) {
        clearInterval(timer);
        element.textContent = isPlus ? `${targetValue}+` : targetValue;
      }
    }, stepTime);
  };

  const checkScroll = () => {
    if (animated) return;
    
    const rect = statsSection.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight - 100;
    
    if (isVisible) {
      animated = true;
      
      const yearsEl = document.getElementById('stat-years');
      const patientsEl = document.getElementById('stat-patients');
      const ratingEl = document.getElementById('stat-rating');
      
      if (yearsEl) {
        yearsEl.textContent = '0+';
        countUp(yearsEl, 20, 1500);
      }
      
      if (patientsEl) {
        patientsEl.textContent = '0+';
        countUp(patientsEl, 10, 1500); // We simulate "10K+" by doing 10 then restoring K+
        setTimeout(() => {
          patientsEl.textContent = '10K+';
        }, 1600);
      }
      
      if (ratingEl) {
        ratingEl.textContent = '0.0';
        countUp(ratingEl, 4.9, 1500);
      }
    }
  };

  window.addEventListener('scroll', checkScroll);
  checkScroll(); // Run once in case it's in viewport on load
}

/**
 * 6. Premium Preloader Loading Buffer
 */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  const fadeOutPreloader = () => {
    preloader.classList.add('fade-out');
    document.body.classList.remove('preloader-active');
    
    // Completely remove preloader node from DOM after transition completes
    setTimeout(() => {
      preloader.remove();
    }, 600);
  };

  // Wait for the window's full load event
  window.addEventListener('load', () => {
    // Ensure the animation has at least 2.2s to display elegantly
    setTimeout(fadeOutPreloader, 2200);
  });

  // Fallback: hide preloader in case load event takes too long
  setTimeout(() => {
    if (preloader.parentNode) {
      fadeOutPreloader();
    }
  }, 4000);
}
