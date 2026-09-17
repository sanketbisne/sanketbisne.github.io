/**
 * Sanket Bisne Portfolio - Main JavaScript
 * Interactive Filtering, Modal Controls, Form Handling & Micro-interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initTalkFilters();
  initProjectFilters();
  initSpeakerModal();
  initStatCounters();
  initSmoothScroll();
});

/* --------------------------------------------------------------------------
   Navigation & Mobile Menu
   -------------------------------------------------------------------------- */
function initNavigation() {
  const nav = document.querySelector('.navbar');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  // Sticky navbar shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.6)';
      nav.style.borderBottomColor = 'rgba(255, 255, 255, 0.12)';
    } else {
      nav.style.boxShadow = 'none';
      nav.style.borderBottomColor = 'var(--border-subtle)';
    }
  });

  // Mobile menu toggle
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = navLinks.style.display === 'flex';
      navLinks.style.display = isOpen ? 'none' : 'flex';
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '72px';
      navLinks.style.left = '0';
      navLinks.style.width = '100%';
      navLinks.style.background = 'var(--bg-secondary)';
      navLinks.style.padding = '24px';
      navLinks.style.borderBottom = '1px solid var(--border-light)';
    });

    // Close mobile nav when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          navLinks.style.display = 'none';
        }
      });
    });
  }

  // Scrollspy for active nav link
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const targetNav = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (targetNav) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          targetNav.classList.add('active');
        } else {
          targetNav.classList.remove('active');
        }
      }
    });
  });
}

/* --------------------------------------------------------------------------
   Speaking Session Filtering
   -------------------------------------------------------------------------- */
function initTalkFilters() {
  const filterButtons = document.querySelectorAll('.talk-filter-btn');
  const talkCards = document.querySelectorAll('.talk-card');

  if (!filterButtons.length || !talkCards.length) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      talkCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   Project Filtering
   -------------------------------------------------------------------------- */
function initProjectFilters() {
  const filterButtons = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterButtons.length || !projectCards.length) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   Speaker Request Modal & Form
   -------------------------------------------------------------------------- */
function initSpeakerModal() {
  const modal = document.getElementById('speaker-modal');
  const openButtons = document.querySelectorAll('.open-speaker-modal');
  const closeButton = document.querySelector('.modal-close-btn');
  const form = document.getElementById('speaker-form');

  if (!modal) return;

  const openModal = (talkTitle = '') => {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (talkTitle && form) {
      const topicSelect = form.querySelector('#talk-topic');
      if (topicSelect) {
        topicSelect.value = talkTitle;
      }
    }
  };

  const closeModal = () => {
    modal.classList.remove('open');
    document.body.style.overflow = 'auto';
  };

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const topic = btn.getAttribute('data-topic') || '';
      openModal(topic);
    });
  });

  if (closeButton) {
    closeButton.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Handle Form Submission -> mailto prefill
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('#sender-name')?.value || '';
      const email = form.querySelector('#sender-email')?.value || '';
      const eventName = form.querySelector('#event-name')?.value || '';
      const eventDate = form.querySelector('#event-date')?.value || '';
      const eventType = form.querySelector('#event-type')?.value || '';
      const topic = form.querySelector('#talk-topic')?.value || 'Tech Talk / Keynote';
      const notes = form.querySelector('#event-notes')?.value || '';

      const subject = encodeURIComponent(`[Speaker Request] ${eventName} - ${name}`);
      const body = encodeURIComponent(
        `Hi Sanket,\n\n` +
        `I would love to invite you to speak at our event!\n\n` +
        `Event: ${eventName}\n` +
        `Date: ${eventDate || 'TBD'}\n` +
        `Format: ${eventType}\n` +
        `Desired Topic: ${topic}\n` +
        `Organizer: ${name} (${email})\n\n` +
        `Additional Details:\n${notes}\n\n` +
        `Best regards,\n${name}`
      );

      window.location.href = `mailto:sanketbisne@gmail.com?subject=${subject}&body=${body}`;
      closeModal();
    });
  }
}

/* --------------------------------------------------------------------------
   Animated Number Counters
   -------------------------------------------------------------------------- */
function initStatCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statNumbers.forEach(stat => {
          const target = parseInt(stat.getAttribute('data-count'), 10) || 0;
          let current = 0;
          const duration = 1500;
          const step = Math.ceil(target / (duration / 25));

          const counter = setInterval(() => {
            current += step;
            if (current >= target) {
              stat.textContent = target + '+';
              clearInterval(counter);
            } else {
              stat.textContent = current + '+';
            }
          }, 25);
        });
      }
    });
  }, { threshold: 0.5 });

  const visualCard = document.querySelector('.visual-card');
  if (visualCard) {
    observer.observe(visualCard);
  }
}

/* --------------------------------------------------------------------------
   Smooth Anchor Scrolling
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}
