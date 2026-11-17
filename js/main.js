/**
 * Sanket Bisne Portfolio - Spatial 3D & Interactive JavaScript
 * Three.js Google-Color Constellation, 3D Tilt, Command Palette (⌘K),
 * Spatial Reveals, Theme Toggle & FormSubmit Delivery
 */

const FORMSUBMIT_ENDPOINT = 'https://formsubmit.co/ajax/sanketbisne@gmail.com';

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initScrollProgress();
  initNavigation();
  initHero3D();
  init3DTilt();
  initSpatialReveals();
  initTalkFilters();
  initProjectFilters();
  initSpeakerModal();
  initCommandPalette();
  initStatCounters();
  initSmoothScroll();
});

/* --------------------------------------------------------------------------
   Google Light / Gemini Dark Theme Toggle
   -------------------------------------------------------------------------- */
function setPortfolioTheme(theme) {
  const toggleBtn = document.getElementById('theme-toggle');
  const root = document.documentElement;

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
}

function togglePortfolioTheme() {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  localStorage.setItem('sanket-theme', next);
  setPortfolioTheme(next);
  window.dispatchEvent(new CustomEvent('portfolio-theme-change', { detail: { theme: next } }));
}

function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('sanket-theme');
  setPortfolioTheme(savedTheme === 'dark' ? 'dark' : 'light');

  if (toggleBtn) {
    toggleBtn.addEventListener('click', togglePortfolioTheme);
  }
}

/* --------------------------------------------------------------------------
   Top Navbar Scroll-Progress Indicator
   -------------------------------------------------------------------------- */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  let ticking = false;
  const update = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
    bar.style.width = `${pct.toFixed(2)}%`;
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );
  update();
}

/* --------------------------------------------------------------------------
   Navigation & Mobile Menu
   -------------------------------------------------------------------------- */
function initNavigation() {
  const nav = document.querySelector('.navbar');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  window.addEventListener(
    'scroll',
    () => {
      if (!nav) return;
      if (window.scrollY > 36) {
        nav.style.boxShadow = 'var(--shadow-md)';
      } else {
        nav.style.boxShadow = 'none';
      }
    },
    { passive: true }
  );

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
      if (window.innerWidth > 992 && navLinks.classList.contains('mobile-open')) {
        navLinks.classList.remove('mobile-open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  const sections = document.querySelectorAll('section[id]');
  window.addEventListener(
    'scroll',
    () => {
      const scrollY = window.scrollY;
      sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 130;
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
    },
    { passive: true }
  );
}

/* --------------------------------------------------------------------------
   Real-Time 3D Hero WebGL Constellation (Three.js + Performance Guardrails)
   -------------------------------------------------------------------------- */
function initHero3D() {
  const canvas = document.getElementById('hero-3d-canvas');
  const hero = document.getElementById('hero');
  if (!canvas || !hero) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced || typeof window.THREE === 'undefined') {
    canvas.style.display = 'none';
    return;
  }

  let renderer;
  try {
    renderer = new window.THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
  } catch (_err) {
    canvas.style.display = 'none';
    return;
  }

  const THREE = window.THREE;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 1000);
  camera.position.z = 260;

  const isSmallScreen = window.innerWidth < 768;
  const nodeCount = isSmallScreen ? 46 : 82;
  const spreadX = isSmallScreen ? 220 : 380;
  const spreadY = isSmallScreen ? 200 : 230;
  const spreadZ = 180;
  const maxLinkDist = isSmallScreen ? 92 : 108;

  // Official Google 4-Color Palette
  const googleHex = [0x4285f4, 0xea4335, 0xfbbc04, 0x34a853];
  const positions = new Float32Array(nodeCount * 3);
  const colors = new Float32Array(nodeCount * 3);
  const velocities = [];

  for (let i = 0; i < nodeCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * spreadX;
    positions[i * 3 + 1] = (Math.random() - 0.5) * spreadY;
    positions[i * 3 + 2] = (Math.random() - 0.5) * spreadZ;

    velocities.push({
      x: (Math.random() - 0.5) * 0.24,
      y: (Math.random() - 0.5) * 0.22,
      z: (Math.random() - 0.5) * 0.18
    });

    const col = new THREE.Color(googleHex[i % googleHex.length]);
    colors[i * 3] = col.r;
    colors[i * 3 + 1] = col.g;
    colors[i * 3 + 2] = col.b;
  }

  const group = new THREE.Group();
  scene.add(group);

  const pointGeo = new THREE.BufferGeometry();
  pointGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  pointGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const pointMat = new THREE.PointsMaterial({
    size: isSmallScreen ? 4.2 : 4.8,
    vertexColors: true,
    transparent: true,
    opacity: 0.85
  });

  const points = new THREE.Points(pointGeo, pointMat);
  group.add(points);

  // Pre-allocate line buffer for connecting edges
  const maxLines = (nodeCount * (nodeCount - 1)) / 2;
  const linePositions = new Float32Array(maxLines * 6);
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  lineGeo.setDrawRange(0, 0);

  const lineMat = new THREE.LineBasicMaterial({
    color: document.documentElement.getAttribute('data-theme') === 'dark' ? 0x8ab4f8 : 0x4285f4,
    transparent: true,
    opacity: document.documentElement.getAttribute('data-theme') === 'dark' ? 0.22 : 0.18
  });

  const lines = new THREE.LineSegments(lineGeo, lineMat);
  group.add(lines);

  window.addEventListener('portfolio-theme-change', e => {
    const isDark = e.detail?.theme === 'dark';
    lineMat.color.setHex(isDark ? 0x8ab4f8 : 0x4285f4);
    lineMat.opacity = isDark ? 0.24 : 0.18;
    pointMat.opacity = isDark ? 0.9 : 0.82;
  });

  const resize = () => {
    const w = hero.clientWidth || window.innerWidth;
    const h = hero.clientHeight || 640;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  window.addEventListener('resize', resize);

  let targetRotX = 0;
  let targetRotY = 0;

  window.addEventListener(
    'pointermove',
    e => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      targetRotY = nx * 0.22;
      targetRotX = ny * 0.14;
    },
    { passive: true }
  );

  window.addEventListener(
    'scroll',
    () => {
      const scrollRatio = Math.min(1, window.scrollY / 600);
      group.position.y = scrollRatio * 24;
    },
    { passive: true }
  );

  let isHeroVisible = true;
  let rafId = null;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        isHeroVisible = entry.isIntersecting;
        if (isHeroVisible && !document.hidden && rafId === null) {
          animate();
        }
      });
    },
    { threshold: 0.02 }
  );
  observer.observe(hero);

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && isHeroVisible && rafId === null) {
      animate();
    }
  });

  function animate() {
    if (!isHeroVisible || document.hidden) {
      rafId = null;
      return;
    }
    rafId = window.requestAnimationFrame(animate);

    const posAttr = pointGeo.getAttribute('position');
    const arr = posAttr.array;

    for (let i = 0; i < nodeCount; i++) {
      const idx = i * 3;
      arr[idx] += velocities[i].x;
      arr[idx + 1] += velocities[i].y;
      arr[idx + 2] += velocities[i].z;

      if (Math.abs(arr[idx]) > spreadX * 0.52) velocities[i].x *= -1;
      if (Math.abs(arr[idx + 1]) > spreadY * 0.52) velocities[i].y *= -1;
      if (Math.abs(arr[idx + 2]) > spreadZ * 0.52) velocities[i].z *= -1;
    }
    posAttr.needsUpdate = true;

    let vertexCursor = 0;
    const lineArr = lineGeo.getAttribute('position').array;
    const maxDistSq = maxLinkDist * maxLinkDist;

    for (let i = 0; i < nodeCount; i++) {
      const ix = i * 3;
      for (let j = i + 1; j < nodeCount; j++) {
        const jx = j * 3;
        const dx = arr[ix] - arr[jx];
        const dy = arr[ix + 1] - arr[jx + 1];
        const dz = arr[ix + 2] - arr[jx + 2];
        const d2 = dx * dx + dy * dy + dz * dz;
        if (d2 < maxDistSq) {
          lineArr[vertexCursor++] = arr[ix];
          lineArr[vertexCursor++] = arr[ix + 1];
          lineArr[vertexCursor++] = arr[ix + 2];
          lineArr[vertexCursor++] = arr[jx];
          lineArr[vertexCursor++] = arr[jx + 1];
          lineArr[vertexCursor++] = arr[jx + 2];
        }
      }
    }
    lineGeo.setDrawRange(0, vertexCursor / 3);
    lineGeo.getAttribute('position').needsUpdate = true;

    group.rotation.y += (targetRotY - group.rotation.y) * 0.035 + 0.0009;
    group.rotation.x += (targetRotX - group.rotation.x) * 0.035;

    renderer.render(scene, camera);
  }

  animate();
}

/* --------------------------------------------------------------------------
   3D Perspective Card Tilt + Specular Light Sheen (Desktop Fine Pointer Only)
   -------------------------------------------------------------------------- */
function init3DTilt() {
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!canHover || reducedMotion) return;

  document.querySelectorAll('[data-tilt]').forEach(card => {
    const maxTilt = parseFloat(card.getAttribute('data-tilt-max') || '5');

    card.addEventListener('pointermove', e => {
      const rect = card.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;

      const rx = (0.5 - py) * maxTilt * 2;
      const ry = (px - 0.5) * maxTilt * 2;

      card.style.setProperty('--rx', `${rx.toFixed(2)}deg`);
      card.style.setProperty('--ry', `${ry.toFixed(2)}deg`);
      card.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
      card.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
    });

    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });
}

/* --------------------------------------------------------------------------
   Scroll-Driven Spatial Reveal Animations
   -------------------------------------------------------------------------- */
function initSpatialReveals() {
  const items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
  );

  items.forEach((el, idx) => {
    el.style.setProperty('--reveal-delay', `${(idx % 4) * 55}ms`);
    observer.observe(el);
  });
}

/* --------------------------------------------------------------------------
   Speaking & Project Filters (with Smooth Transition)
   -------------------------------------------------------------------------- */
function applyCardFilter(cards, filter) {
  cards.forEach(card => {
    const categories = card.getAttribute('data-category') || '';
    const matches = filter === 'all' || categories.includes(filter);
    if (matches) {
      card.style.display = 'flex';
      window.requestAnimationFrame(() => {
        card.classList.remove('is-filtering-out');
      });
    } else {
      card.classList.add('is-filtering-out');
      card.style.display = 'none';
    }
  });
}

function initTalkFilters() {
  const filterButtons = document.querySelectorAll('.talk-filter-btn');
  const talkCards = document.querySelectorAll('.talk-card');
  if (!filterButtons.length || !talkCards.length) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyCardFilter(talkCards, btn.getAttribute('data-filter'));
    });
  });
}

function initProjectFilters() {
  const filterButtons = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  if (!filterButtons.length || !projectCards.length) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyCardFilter(projectCards, btn.getAttribute('data-filter'));
    });
  });
}

/* --------------------------------------------------------------------------
   Command Palette (⌘K / Ctrl+K)
   -------------------------------------------------------------------------- */
function initCommandPalette() {
  const overlay = document.getElementById('cmdk-modal');
  const input = document.getElementById('cmdk-input');
  const list = document.getElementById('cmdk-list');
  const triggers = document.querySelectorAll('[data-open-cmdk]');
  if (!overlay || !input || !list) return;

  const actions = [
    { label: 'Technical Writing & Medium Guides', tag: '#articles', run: () => jumpTo('#articles') },
    { label: 'About & Speaker Presence (Instagram)', tag: '#about', run: () => jumpTo('#about') },
    { label: 'Featured Google Video: Extend FastMCP', tag: '#featured-video', run: () => jumpTo('#featured-video') },
    { label: 'Speaking & 100+ Keynotes', tag: '#speaking', run: () => jumpTo('#speaking') },
    { label: 'Featured Projects & Open Source', tag: '#projects', run: () => jumpTo('#projects') },
    { label: 'Skills & Technology Matrix', tag: '#skills', run: () => jumpTo('#skills') },
    { label: 'Contact & Session Inquiry Form', tag: '#contact', run: () => jumpTo('#contact') },
    {
      label: 'Invite Sanket to Speak (Open Modal)',
      tag: 'Action',
      run: () => {
        const modalBtn = document.querySelector('.open-speaker-modal');
        if (modalBtn) modalBtn.click();
      }
    },
    { label: 'Toggle Google Light / Gemini Dark Theme', tag: 'Theme', run: () => togglePortfolioTheme() },
    {
      label: 'Open Sessionize Speaker Profile',
      tag: 'External',
      run: () => window.open('https://sessionize.com/sanketbisne', '_blank', 'noopener')
    },
    {
      label: 'Open GitHub Profile (@sanketbisne)',
      tag: 'External',
      run: () => window.open('https://github.com/sanketbisne', '_blank', 'noopener')
    },
    {
      label: 'Open LinkedIn Profile',
      tag: 'External',
      run: () => window.open('https://www.linkedin.com/in/sanketbisne', '_blank', 'noopener')
    }
  ];

  let activeIdx = 0;
  let filtered = [...actions];

  function jumpTo(selector) {
    const el = document.querySelector(selector);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function render() {
    list.innerHTML = '';
    if (!filtered.length) {
      const li = document.createElement('li');
      li.className = 'cmdk-item';
      li.textContent = 'No matching commands found.';
      list.appendChild(li);
      return;
    }

    filtered.forEach((item, idx) => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `cmdk-item${idx === activeIdx ? ' active' : ''}`;
      btn.innerHTML = `<span>${escapeHtml(item.label)}</span><span class="cmdk-item-tag">${escapeHtml(item.tag)}</span>`;
      btn.addEventListener('click', () => {
        closeCmdk();
        item.run();
      });
      li.appendChild(btn);
      list.appendChild(li);
    });
  }

  function openCmdk() {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    input.value = '';
    filtered = [...actions];
    activeIdx = 0;
    render();
    window.setTimeout(() => input.focus(), 40);
  }

  function closeCmdk() {
    overlay.classList.remove('open');
    document.body.style.overflow = 'auto';
  }

  triggers.forEach(btn => btn.addEventListener('click', openCmdk));

  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeCmdk();
  });

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    filtered = actions.filter(a => a.label.toLowerCase().includes(q) || a.tag.toLowerCase().includes(q));
    activeIdx = 0;
    render();
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (filtered.length) {
        activeIdx = (activeIdx + 1) % filtered.length;
        render();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (filtered.length) {
        activeIdx = (activeIdx - 1 + filtered.length) % filtered.length;
        render();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[activeIdx]) {
        const chosen = filtered[activeIdx];
        closeCmdk();
        chosen.run();
      }
    }
  });

  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (overlay.classList.contains('open')) closeCmdk();
      else openCmdk();
    } else if (e.key === 'Escape' && overlay.classList.contains('open')) {
      closeCmdk();
    }
  });
}

/* --------------------------------------------------------------------------
   Speaker Booking / Contact Modal & FormSubmit Delivery (Zero Email Shown)
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
      if (topicInput) topicInput.value = talkTitle;
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
      openModal(btn.getAttribute('data-topic') || '');
    });
  });

  if (closeButton) closeButton.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', e => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
      closeModal();
    }
  });

  if (modalForm) attachInquiryFormHandler(modalForm);
  if (inlineForm) attachInquiryFormHandler(inlineForm);
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
            const duration = 1400;
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
  if (visualCard) observer.observe(visualCard);
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
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}
