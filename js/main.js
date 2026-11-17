/**
 * Sanket Bisne Portfolio - Main JavaScript
 * Interactive Filtering, Modal Controls, FormSubmit Email Delivery & Micro-interactions
 */

const FORMSUBMIT_ENDPOINT = 'https://formsubmit.co/ajax/sanketbisne@gmail.com';

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initNavigation();
  initTalkFilters();
  initProjectFilters();
  initSpeakerModal();
  initStatCounters();
  initSmoothScroll();
});

/* --------------------------------------------------------------------------
   Google Light / Gemini Dark Theme Toggle
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('sanket-theme');

  const applyTheme = theme => {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      if (toggleBtn) {
        toggleBtn.setAttribute('aria-label', 'Switch to Google Light theme');
        toggleBtn.setAttribute('title', 'Switch to Google Light theme');
        toggleBtn.innerHTML =
          '<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>';
      }
    } else {
      root.removeAttribute('data-theme');
      if (toggleBtn) {
        toggleBtn.setAttribute('aria-label', 'Switch to Gemini Dark theme');
        toggleBtn.setAttribute('title', 'Switch to Gemini Dark theme');
        toggleBtn.innerHTML =
          '<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>';
      }
    }
  };

  applyTheme(savedTheme === 'dark' ? 'dark' : 'light');

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      localStorage.setItem('sanket-theme', next);
      applyTheme(next);
    });
  }
}

/* --------------------------------------------------------------------------
   Navigation & Mobile Menu
   -------------------------------------------------------------------------- */
function initNavigation() {
  const nav = document.querySelector('.navbar');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    if (!nav) return;
    if (window.scrollY > 40) {
      nav.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.6)';
      nav.style.borderBottomColor = 'rgba(255, 255, 255, 0.12)';
    } else {
      nav.style.boxShadow = 'none';
      nav.style.borderBottomColor = 'var(--border-subtle)';
    }
  });

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('mobile-open');
      mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && navLinks.classList.contains('mobile-open')) {
        navLinks.classList.remove('mobile-open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      }
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
      const targetNav = document.querySelector(`.nav-link[href="#${sectionId}"]`);

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
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   Speaker Booking / Contact Modal & Direct Email Delivery
   -------------------------------------------------------------------------- */
function initSpeakerModal() {
  const modal = document.getElementById('speaker-modal');
  const openButtons = document.querySelectorAll('.open-speaker-modal');
  const closeButton = modal ? modal.querySelector('.modal-close-btn') : null;
  const modalForm = document.getElementById('speaker-form');
  const inlineForm = document.getElementById('inline-speaker-form');

  const openModal = (talkTitle = '') => {
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (talkTitle && modalForm) {
      const topicInput = modalForm.querySelector('[name="topic"]');
      if (topicInput) {
        topicInput.value = talkTitle;
      }
    }
    const statusEl = modalForm?.querySelector('.form-status');
    if (statusEl) {
      statusEl.className = 'form-status';
      statusEl.innerHTML = '';
    }
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = 'auto';
  };

  openButtons.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const topic = btn.getAttribute('data-topic') || '';
      openModal(topic);
    });
  });

  if (closeButton) {
    closeButton.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', e => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
      closeModal();
    }
  });

  if (modalForm) {
    attachInquiryFormHandler(modalForm);
  }
  if (inlineForm) {
    attachInquiryFormHandler(inlineForm);
  }
}

function attachInquiryFormHandler(form) {
  const statusEl = form.querySelector('.form-status');
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnHtml = submitBtn ? submitBtn.innerHTML : 'Send Inquiry';

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const honeypot = form.querySelector('[name="_honey"]')?.value || '';
    if (honeypot) return;

    const name = (form.querySelector('[name="name"]')?.value || '').trim();
    const email = (form.querySelector('[name="email"]')?.value || '').trim();
    const eventName = (form.querySelector('[name="event_name"]')?.value || '').trim();
    const eventDate = (form.querySelector('[name="event_date"]')?.value || '').trim();
    const eventType = (form.querySelector('[name="format"]')?.value || '').trim();
    const topic = (form.querySelector('[name="topic"]')?.value || 'Tech Talk / Keynote').trim();
    const notes = (form.querySelector('[name="notes"]')?.value || '').trim();

    const subjectText = `[Speaker Request] ${eventName || 'Session Inquiry'} - ${name}`;
    const plainBody =
      `Hi Sanket,\n\n` +
      `I would love to invite you to speak at our event!\n\n` +
      `Event: ${eventName}\n` +
      `Date: ${eventDate || 'TBD'}\n` +
      `Format: ${eventType}\n` +
      `Desired Topic: ${topic}\n` +
      `Organizer: ${name} (${email})\n\n` +
      `Additional Details:\n${notes || 'N/A'}\n\n` +
      `Best regards,\n${name}`;

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending Inquiry...';
    }
    if (statusEl) {
      statusEl.className = 'form-status visible info';
      statusEl.textContent = 'Sending your session invitation...';
    }

    try {
      const response = await fetch(FORMSUBMIT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          _replyto: email,
          _subject: subjectText,
          _template: 'table',
          event_name: eventName,
          event_date: eventDate || 'TBD',
          format: eventType,
          topic,
          notes: notes || 'N/A'
        })
      });

      const data = await response.json().catch(() => ({}));
      const isSuccess = response.ok && (data.success === 'true' || data.success === true);

      if (isSuccess) {
        form.reset();
        showFormStatus(
          statusEl,
          'success',
          `Thank you, ${escapeHtml(name)}! Your invitation has been delivered directly to Sanket's inbox.`,
          plainBody,
          false
        );
      } else {
        showFormStatus(
          statusEl,
          'warning',
          `Direct delivery could not be confirmed (${escapeHtml(data.message || 'activation or network required')}). You can copy your inquiry or reach out directly via Sessionize or LinkedIn:`,
          plainBody,
          true
        );
      }
    } catch (_err) {
      showFormStatus(
        statusEl,
        'warning',
        'Could not reach the form relay from your browser. You can copy your inquiry or reach out directly via Sessionize or LinkedIn:',
        plainBody,
        true
      );
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
    }
  });
}

function showFormStatus(statusEl, variant, message, plainBody, showSocialFallbacks) {
  if (!statusEl) return;

  const socialHtml = showSocialFallbacks
    ? `<a href="https://sessionize.com/sanketbisne" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="padding: 6px 12px; font-size: 0.78rem;">Invite via Sessionize ↗</a>
       <a href="https://www.linkedin.com/in/sanketbisne" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="padding: 6px 12px; font-size: 0.78rem;">Message on LinkedIn ↗</a>`
    : '';

  statusEl.className = `form-status visible ${variant}`;
  statusEl.innerHTML = `
    <div>${message}</div>
    <div class="form-fallback-actions">
      ${socialHtml}
      <button type="button" class="btn btn-secondary copy-inquiry-btn" style="padding: 6px 12px; font-size: 0.78rem;">Copy Message</button>
    </div>
  `;

  const copyBtn = statusEl.querySelector('.copy-inquiry-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(plainBody);
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
          copyBtn.textContent = 'Copy Message';
        }, 2500);
      } catch (_err) {
        copyBtn.textContent = 'Copy Failed';
      }
    });
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* --------------------------------------------------------------------------
   Animated Number Counters
   -------------------------------------------------------------------------- */
function initStatCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'), 10) || 0;
            let current = 0;
            const duration = 1500;
            const step = Math.max(1, Math.ceil(target / (duration / 25)));

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
    },
    { threshold: 0.3 }
  );

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
