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
  initHero3DStage();
  init3DTilt();
  initMagneticButtons();
  initSpatialReveals();
  initGSAPSpatial();
  initMobileCoverflow();
  initTalkFilters();
  initProjectFilters();
  initSpeakerModal();
  initCommandPalette();
  initStatCounters();
  initSmoothScroll();
  initDynamicFeeds();
  initWebMcpSandbox();
});

/* ==========================================================================
   Gen-Z 3D Interactive Stage: Glassmorphic Google Sphere + Orbiting Stack
   ========================================================================== */
function createOrbitBadgeTexture(label, accentHex, isDark) {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 80;
  const ctx = c.getContext('2d');
  if (!ctx) return null;

  const r = 34;
  ctx.clearRect(0, 0, c.width, c.height);

  // Pill background
  ctx.fillStyle = isDark ? 'rgba(30, 31, 32, 0.88)' : 'rgba(255, 255, 255, 0.92)';
  ctx.strokeStyle = accentHex;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(8 + r, 8);
  ctx.lineTo(c.width - 8 - r, 8);
  ctx.quadraticCurveTo(c.width - 8, 8, c.width - 8, 8 + r);
  ctx.lineTo(c.width - 8, c.height - 8 - r);
  ctx.quadraticCurveTo(c.width - 8, c.height - 8, c.width - 8 - r, c.height - 8);
  ctx.lineTo(8 + r, c.height - 8);
  ctx.quadraticCurveTo(8, c.height - 8, 8, c.height - 8 - r);
  ctx.lineTo(8, 8 + r);
  ctx.quadraticCurveTo(8, 8, 8 + r, 8);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Google accent dot
  ctx.fillStyle = accentHex;
  ctx.beginPath();
  ctx.arc(38, c.height / 2, 9, 0, Math.PI * 2);
  ctx.fill();

  // Tech label
  ctx.fillStyle = isDark ? '#e8eaed' : '#202124';
  ctx.font = '700 28px "Plus Jakarta Sans", "Roboto", sans-serif';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, 60, c.height / 2 + 1);

  const tex = new window.THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

function initHero3DStage() {
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
    renderer = new window.THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  } catch (_) {
    canvas.style.display = 'none';
    return;
  }

  const THREE = window.THREE;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
  camera.position.set(0, 0, 12.5);

  const stageGroup = new THREE.Group();
  scene.add(stageGroup);

  // Glassmorphic core + wireframe outer shell in Google Blue
  const coreGeo = new THREE.IcosahedronGeometry(1.55, 2);
  const coreMat = new THREE.MeshBasicMaterial({
    color: 0x4285f4,
    wireframe: true,
    transparent: true,
    opacity: 0.24
  });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  stageGroup.add(coreMesh);

  const shellGeo = new THREE.IcosahedronGeometry(2.35, 1);
  const shellMat = new THREE.MeshBasicMaterial({
    color: 0x34a853,
    wireframe: true,
    transparent: true,
    opacity: 0.14
  });
  const shellMesh = new THREE.Mesh(shellGeo, shellMat);
  stageGroup.add(shellMesh);

  // Dual orbital rings
  const ring1 = new THREE.Mesh(
    new THREE.TorusGeometry(3.4, 0.014, 8, 96),
    new THREE.MeshBasicMaterial({ color: 0x4285f4, transparent: true, opacity: 0.28 })
  );
  ring1.rotation.x = 1.15;
  ring1.rotation.y = 0.28;
  stageGroup.add(ring1);

  const ring2 = new THREE.Mesh(
    new THREE.TorusGeometry(4.15, 0.012, 8, 96),
    new THREE.MeshBasicMaterial({ color: 0xea4335, transparent: true, opacity: 0.2 })
  );
  ring2.rotation.x = 1.95;
  ring2.rotation.y = -0.35;
  stageGroup.add(ring2);

  // Google 4-color floating neural cloud points
  const googleHex = [0x4285f4, 0xea4335, 0xfbbc04, 0x34a853];
  const nodeCount = 88;
  const positions = new Float32Array(nodeCount * 3);
  const colors = new Float32Array(nodeCount * 3);
  for (let i = 0; i < nodeCount; i++) {
    const phi = Math.acos(1 - (2 * (i + 0.5)) / nodeCount);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const radius = 2.6 + (i % 5) * 0.48;
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.cos(phi);
    positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

    const col = new THREE.Color(googleHex[i % googleHex.length]);
    colors[i * 3] = col.r;
    colors[i * 3 + 1] = col.g;
    colors[i * 3 + 2] = col.b;
  }
  const pointsGeo = new THREE.BufferGeometry();
  pointsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  pointsGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const pointsMat = new THREE.PointsMaterial({
    size: 0.14,
    vertexColors: true,
    transparent: true,
    opacity: 0.85
  });
  const nodeCloud = new THREE.Points(pointsGeo, pointsMat);
  stageGroup.add(nodeCloud);

  // Interactive 3D Tech-Stack Orbit Sprites
  const orbitSpecs = [
    { label: 'GCP', hex: '#4285F4', radius: 3.45, incl: 0.22 },
    { label: 'GKE', hex: '#34A853', radius: 3.65, incl: -0.25 },
    { label: 'ADK', hex: '#FBBC04', radius: 3.9, incl: 0.34 },
    { label: 'WebMCP', hex: '#EA4335', radius: 4.15, incl: -0.18 },
    { label: 'LangGraph', hex: '#4285F4', radius: 3.75, incl: 0.28 },
    { label: 'vLLM', hex: '#34A853', radius: 4.05, incl: -0.32 },
    { label: 'Terraform', hex: '#FBBC04', radius: 3.55, incl: 0.15 }
  ];

  const isDarkTheme = () => document.documentElement.getAttribute('data-theme') === 'dark';
  const orbitSprites = orbitSpecs.map((spec, idx) => {
    const tex = createOrbitBadgeTexture(spec.label, spec.hex, isDarkTheme());
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.92, depthTest: false });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(1.52, 0.48, 1);
    stageGroup.add(sprite);
    return { sprite, mat, spec, phase: (idx / orbitSpecs.length) * Math.PI * 2 };
  });

  // Keep sprite ink legible across Google Light & Gemini Dark toggles
  const themeObserver = new MutationObserver(() => {
    const dark = isDarkTheme();
    orbitSprites.forEach((item) => {
      if (item.mat.map) item.mat.map.dispose();
      item.mat.map = createOrbitBadgeTexture(item.spec.label, item.spec.hex, dark);
      item.mat.needsUpdate = true;
    });
  });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  const resize = () => {
    const w = hero.clientWidth || window.innerWidth;
    const h = hero.clientHeight || 680;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    stageGroup.position.x = w >= 992 ? 2.55 : 0;
    stageGroup.position.y = w >= 992 ? -0.15 : 0.65;
    stageGroup.scale.setScalar(w < 576 ? 0.72 : w < 992 ? 0.85 : 1);
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Pointer drag, hover parallax, and scroll-velocity orbit acceleration
  let targetX = 0;
  let targetY = 0;
  let isDragging = false;
  let lastPointerX = 0;
  let spinBoost = 0;
  let orbitAngle = 0;
  let lastScrollY = window.scrollY || 0;

  hero.addEventListener('pointermove', (e) => {
    const rect = hero.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    targetX = ny * 0.25;
    targetY = nx * 0.35;

    if (isDragging) {
      const dx = e.clientX - lastPointerX;
      lastPointerX = e.clientX;
      spinBoost = Math.max(-0.14, Math.min(0.14, spinBoost + dx * 0.0012));
    }
  }, { passive: true });

  hero.addEventListener('pointerdown', (e) => {
    if (e.target.closest('a, button, input, select, textarea, iframe')) return;
    isDragging = true;
    lastPointerX = e.clientX;
  });

  window.addEventListener('pointerup', () => {
    isDragging = false;
  });

  document.addEventListener('scroll', () => {
    const curY = window.scrollY || 0;
    const delta = Math.abs(curY - lastScrollY);
    lastScrollY = curY;
    if (delta > 0) {
      spinBoost = Math.min(0.12, spinBoost + Math.min(delta, 80) * 0.00045);
    }
  }, { passive: true });

  // Pause WebGL cleanly when hero leaves viewport or tab is hidden
  let isHeroVisible = true;
  let rafId = null;

  const tick = () => {
    rafId = null;
    if (!isHeroVisible || document.hidden) return;

    const speed = 0.0045 + Math.abs(spinBoost);
    orbitAngle += spinBoost < 0 ? -speed : speed;
    spinBoost *= 0.94;
    if (Math.abs(spinBoost) < 0.0002) spinBoost = 0;

    stageGroup.rotation.x += (targetX - stageGroup.rotation.x) * 0.06;
    stageGroup.rotation.y += (targetY - stageGroup.rotation.y) * 0.06;

    coreMesh.rotation.y += 0.003 + Math.abs(spinBoost) * 0.25;
    coreMesh.rotation.x += 0.0015;
    shellMesh.rotation.y -= 0.002;
    nodeCloud.rotation.y = orbitAngle * 0.45;
    ring1.rotation.z += 0.002 + Math.abs(spinBoost) * 0.15;
    ring2.rotation.z -= 0.0016 + Math.abs(spinBoost) * 0.12;

    orbitSprites.forEach((item) => {
      const a = item.phase + orbitAngle;
      const x = Math.cos(a) * item.spec.radius;
      const z = Math.sin(a) * item.spec.radius;
      const y = Math.sin(a * 1.5) * item.spec.radius * item.spec.incl;
      item.sprite.position.set(x, y, z);
      const depthScale = 0.85 + ((z + 4.5) / 9) * 0.28;
      item.sprite.scale.set(1.48 * depthScale, 0.46 * depthScale, 1);
      item.mat.opacity = z < -1.5 ? 0.45 : 0.95;
    });

    renderer.render(scene, camera);
    rafId = requestAnimationFrame(tick);
  };

  const ensureLoop = () => {
    if (rafId === null && isHeroVisible && !document.hidden) {
      rafId = requestAnimationFrame(tick);
    }
  };

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      isHeroVisible = Boolean(entries[0]?.isIntersecting);
      if (isHeroVisible) ensureLoop();
    }, { threshold: 0.02 });
    io.observe(hero);
  }

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) ensureLoop();
  });

  ensureLoop();
}

/* ==========================================================================
   Magnetic Pill Buttons (Desktop Fine Pointer Only)
   ========================================================================== */
function initMagneticButtons() {
  if (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    !window.matchMedia('(hover: hover) and (pointer: fine)').matches
  ) {
    return;
  }

  document.querySelectorAll('.btn-magnetic').forEach((btn) => {
    if (btn.dataset.magBound) return;
    btn.dataset.magBound = '1';

    btn.addEventListener('pointermove', (e) => {
      const rect = btn.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      btn.style.setProperty('--mag-x', `${(dx * 7).toFixed(1)}px`);
      btn.style.setProperty('--mag-y', `${(dy * 5).toFixed(1)}px`);
    });

    btn.addEventListener('pointerleave', () => {
      btn.style.setProperty('--mag-x', '0px');
      btn.style.setProperty('--mag-y', '0px');
    });
  });
}

/* ==========================================================================
   GSAP + ScrollTrigger Scrubbed Spatial Depth (Progressive Enhancement)
   ========================================================================== */
function initGSAPSpatial() {
  if (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    typeof window.gsap === 'undefined' ||
    typeof window.ScrollTrigger === 'undefined'
  ) {
    return;
  }

  try {
    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);

    // Subtle scrubbed depth parallax on hero spotlight card & featured video without hiding elements
    const heroCard = document.querySelector('.hero-feature-card');
    if (heroCard) {
      gsap.to(heroCard, {
        y: -18,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }

    document.querySelectorAll('.bento-featured, .video-container-glow').forEach((el) => {
      gsap.fromTo(
        el,
        { scale: 0.985 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            end: 'top 45%',
            scrub: true
          }
        }
      );
    });
  } catch (_) {
    // Graceful no-op; CSS IntersectionObserver reveals handle visibility
  }
}

/* ==========================================================================
   3D Coverflow Scroll-Snap Carousel (Mobile & Small Tablet)
   ========================================================================== */
function initMobileCoverflow() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const containers = document.querySelectorAll('#articles-grid, #instagram-grid, #linkedin-grid');

  const updateContainer = (container) => {
    const mobile = window.innerWidth <= 768 && !prefersReduced;
    const items = container.children;
    if (!mobile) {
      for (const item of items) {
        item.style.removeProperty('--cf-scale');
        item.style.removeProperty('--cf-ry');
      }
      return;
    }

    const cRect = container.getBoundingClientRect();
    const center = cRect.left + cRect.width / 2;
    for (const item of items) {
      const r = item.getBoundingClientRect();
      const itemCenter = r.left + r.width / 2;
      const norm = Math.max(-1, Math.min(1, (itemCenter - center) / (cRect.width * 0.72)));
      const scale = 1 - Math.abs(norm) * 0.085;
      const ry = -norm * 10;
      item.style.setProperty('--cf-scale', scale.toFixed(3));
      item.style.setProperty('--cf-ry', `${ry.toFixed(2)}deg`);
    }
  };

  containers.forEach((container) => {
    if (!container.dataset.coverflowBound) {
      container.dataset.coverflowBound = '1';
      let raf = null;
      container.addEventListener('scroll', () => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = null;
          updateContainer(container);
        });
      }, { passive: true });
    }
    updateContainer(container);
  });

  if (!window.__coverflowResizeBound) {
    window.__coverflowResizeBound = true;
    window.addEventListener('resize', () => {
      document.querySelectorAll('#articles-grid, #instagram-grid, #linkedin-grid').forEach(updateContainer);
    }, { passive: true });
  }
}

/* ==========================================================================
   Dynamic Feed Hydration (Medium, LinkedIn, Instagram, GitHub via feeds.json)
   ========================================================================== */
function safeHttpsUrl(url, fallback = '#') {
  return typeof url === 'string' && /^https?:\/\//i.test(url.trim()) ? url.trim() : fallback;
}

function bindCardTiltHandlers(root) {
  if (!root || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  root.querySelectorAll('[data-tilt]').forEach((card) => {
    if (card.dataset.tiltBound) return;
    card.dataset.tiltBound = '1';
    const maxTilt = parseFloat(card.getAttribute('data-tilt-max') || '5');
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      card.style.setProperty('--rx', `${((0.5 - py) * 2 * maxTilt).toFixed(2)}deg`);
      card.style.setProperty('--ry', `${((px - 0.5) * 2 * maxTilt).toFixed(2)}deg`);
      card.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
      card.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });
}

async function initDynamicFeeds() {
  let feeds;
  try {
    const res = await fetch('data/feeds.json', { cache: 'no-cache' });
    if (!res.ok) return;
    feeds = await res.json();
  } catch (_) {
    return; // Static fallback cards already rendered in HTML
  }

  if (feeds && feeds.updated_at) {
    const statusEl = document.getElementById('feeds-sync-status');
    const parsedDate = new Date(feeds.updated_at);
    if (statusEl && !Number.isNaN(parsedDate.getTime())) {
      const label = parsedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      statusEl.textContent = `Synced ${label}`;
    }
  }

  // 1. Hero Shipping Ticker
  const tickerTrack = document.getElementById('hero-ticker-track');
  if (tickerTrack && Array.isArray(feeds.shipping_ticker) && feeds.shipping_ticker.length > 0) {
    const renderItems = (dup) => feeds.shipping_ticker.map((item) => `
      <a href="${escapeHtml(safeHttpsUrl(item.href))}" target="_blank" rel="noopener noreferrer" class="ticker-item"${dup ? ' aria-hidden="true"' : ''}>
        <span class="ticker-dot ${escapeHtml(item.color || 'blue')}"></span>${escapeHtml(item.text || '')}
      </a>
    `).join('');
    tickerTrack.innerHTML = renderItems(false) + renderItems(true);
  }

  // 2. Medium Articles
  const articlesGrid = document.getElementById('articles-grid');
  if (articlesGrid && Array.isArray(feeds.medium) && feeds.medium.length > 0) {
    articlesGrid.innerHTML = feeds.medium.slice(0, 6).map((post) => {
      const latestCls = post.badge_type === 'latest' ? ' latest' : '';
      const imgHtml = post.image
        ? `<img src="${escapeHtml(safeHttpsUrl(post.image))}" alt="${escapeHtml(post.title)}" class="article-thumb-img" loading="lazy">`
        : '';
      return `
        <a href="${escapeHtml(safeHttpsUrl(post.url))}" target="_blank" rel="noopener noreferrer" class="article-card revealed" data-tilt data-reveal>
          <div class="article-thumb-container">
            <span class="article-thumb-badge${latestCls}">${escapeHtml(post.badge || 'Engineering Guide')}</span>
            ${imgHtml}
          </div>
          <div class="article-meta">
            <span class="article-platform">${escapeHtml(post.platform || 'Medium')}</span>
            <span>${escapeHtml(post.date || '')}</span>
          </div>
          <h3 class="article-title">${escapeHtml(post.title)}</h3>
          <p class="article-desc">${escapeHtml(post.summary || '')}</p>
          <div class="article-footer">Read on Medium →</div>
        </a>
      `;
    }).join('');
    bindCardTiltHandlers(articlesGrid);
  }

  // 3. LinkedIn Highlights
  const linkedinGrid = document.getElementById('linkedin-grid');
  if (linkedinGrid && Array.isArray(feeds.linkedin) && feeds.linkedin.length > 0) {
    linkedinGrid.innerHTML = feeds.linkedin.slice(0, 6).map((post) => `
      <a href="${escapeHtml(safeHttpsUrl(post.url, 'https://www.linkedin.com/in/sanketbisne'))}" target="_blank" rel="noopener noreferrer" class="linkedin-card bento-card" data-tilt>
        <div class="linkedin-card-meta">
          <span class="linkedin-card-tag">${escapeHtml(post.tag || 'LinkedIn Highlight')}</span>
          <span>${escapeHtml(post.date || '')}</span>
        </div>
        <h3 class="linkedin-card-title">${escapeHtml(post.title)}</h3>
        <p class="linkedin-card-desc">${escapeHtml(post.summary || '')}</p>
        <span class="linkedin-card-cta">${escapeHtml(post.cta || 'Read on LinkedIn')} →</span>
      </a>
    `).join('');
    bindCardTiltHandlers(linkedinGrid);
  }

  // 4. Instagram Gallery (local committed thumbnails or curated assets)
  const igGrid = document.getElementById('instagram-grid');
  if (igGrid && Array.isArray(feeds.instagram) && feeds.instagram.length > 0) {
    igGrid.innerHTML = feeds.instagram.slice(0, 8).map((post) => `
      <a href="${escapeHtml(safeHttpsUrl(post.url, 'https://instagram.com/sanket_bisne'))}" target="_blank" rel="noopener noreferrer" class="photo-item">
        <span class="photo-item-badge">${escapeHtml(post.badge || '📸 Instagram')}</span>
        <img src="${escapeHtml(post.image)}" alt="${escapeHtml(post.alt || post.caption || 'Sanket Bisne highlight')}" class="photo-item-img" loading="lazy">
        <div class="photo-item-caption">${escapeHtml(post.caption || '')}</div>
      </a>
    `).join('');
  }

  // 5. GitHub Repositories
  const projectsGrid = document.getElementById('projects-grid');
  if (projectsGrid && Array.isArray(feeds.github) && feeds.github.length > 0) {
    const githubIconSvg = '<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>';
    projectsGrid.innerHTML = feeds.github.map((repo) => {
      const featCls = repo.featured ? ' bento-featured' : '';
      const starText = repo.stars > 0 ? `${repo.badge_label || '★ Repo'} • ${repo.stars}★` : (repo.badge_label || '★ Open Source');
      const tagsHtml = (repo.tags || []).slice(0, 4).map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join('');
      const url = safeHttpsUrl(repo.url, `https://github.com/sanketbisne/${encodeURIComponent(repo.name)}`);
      return `
        <div data-tilt data-reveal class="project-card bento-card revealed${featCls}" data-category="${escapeHtml(repo.category || 'ai-adk')}">
          <div class="project-top">
            <div class="repo-icon">${escapeHtml(repo.icon || '🚀')}</div>
            <div class="project-meta"><span class="project-stars">${escapeHtml(starText)}</span></div>
          </div>
          <h3 class="project-title"><a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(repo.name)}</a></h3>
          <p class="project-desc">${escapeHtml(repo.description || '')}</p>
          <div class="project-tags">${tagsHtml}</div>
          <div class="project-links">
            <a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" class="project-link-btn">${githubIconSvg} GitHub Code</a>
          </div>
        </div>
      `;
    }).join('');
    bindCardTiltHandlers(projectsGrid);

    const activeFilter = document.querySelector('.project-filter-btn.active');
    if (activeFilter) activeFilter.click();
  }

  initMobileCoverflow();
}

/* ==========================================================================
   WebMCP Live Sandbox (navigator.modelContext Discovery & Execution)
   ========================================================================== */
function initWebMcpSandbox() {
  const fab = document.getElementById('webmcp-fab');
  const drawer = document.getElementById('webmcp-drawer');
  const backdrop = document.getElementById('webmcp-drawer-backdrop');
  const closeBtn = document.getElementById('webmcp-close-btn');
  const statusEl = document.getElementById('webmcp-context-status');
  const outputEl = document.getElementById('webmcp-output');
  const queryInput = document.getElementById('webmcp-query-input');
  const runBtn = document.getElementById('webmcp-run-btn');
  const toolBtns = document.querySelectorAll('.webmcp-tool-btn');
  if (!fab || !drawer || !outputEl) return;

  const toolHandlers = {
    get_speaker_profile: () => ({
      name: 'Sanket Bisne',
      title: 'Sr. Enterprise AI Engineer at Motive • Google Developer Expert (GCP)',
      location: 'San Francisco Bay Area / Global Speaker',
      sessions_delivered: '100+',
      open_source_repos: '60+',
      featured_video: 'https://www.youtube.com/watch?v=jNU_7WSidB4',
      booking_channel: 'On-page Speaker Request Form (FormSubmit AJAX)',
      links: {
        sessionize: 'https://sessionize.com/sanketbisne',
        github: 'https://github.com/sanketbisne',
        medium: 'https://medium.com/@sanketbisne',
        linkedin: 'https://www.linkedin.com/in/sanketbisne'
      }
    }),
    search_projects: (args = {}) => {
      const q = String(args.query || '').trim().toLowerCase();
      const cards = Array.from(document.querySelectorAll('#projects-grid .project-card'));
      const matches = cards.map((card) => ({
        name: card.querySelector('.project-title a')?.textContent?.trim() || '',
        url: card.querySelector('.project-title a')?.getAttribute('href') || '',
        description: card.querySelector('.project-desc')?.textContent?.trim() || '',
        tags: Array.from(card.querySelectorAll('.tag')).map((t) => t.textContent.trim())
      })).filter((p) => !q || `${p.name} ${p.description} ${p.tags.join(' ')}`.toLowerCase().includes(q));
      return { query: q || '*', count: matches.length, projects: matches.slice(0, 5) };
    },
    search_talks: (args = {}) => {
      const q = String(args.query || '').trim().toLowerCase();
      const cards = Array.from(document.querySelectorAll('#speaking .talk-card'));
      const matches = cards.map((card) => ({
        title: card.querySelector('h3, .talk-title')?.textContent?.trim() || '',
        event: card.querySelector('.talk-event, .talk-badge')?.textContent?.trim() || '',
        summary: card.querySelector('.talk-desc, p')?.textContent?.trim() || ''
      })).filter((t) => t.title && (!q || `${t.title} ${t.event} ${t.summary}`.toLowerCase().includes(q)));
      return { query: q || '*', count: matches.length, talks: matches.slice(0, 6) };
    },
    open_speaker_invite: (args = {}) => {
      const topic = String(args.topic || 'WebMCP & Google ADK Keynote').trim();
      setDrawerOpen(false);
      const trigger = document.querySelector('.open-speaker-modal');
      if (trigger) {
        trigger.setAttribute('data-topic', topic);
        trigger.click();
      } else {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      }
      return { status: 'opened', prefilled_topic: topic };
    }
  };

  const toolDefinitions = [
    {
      name: 'get_speaker_profile',
      description: 'Get Sanket Bisne GDE speaker credentials, stats, and public links.',
      inputSchema: { type: 'object', properties: {} },
      execute: async () => ({ content: [{ type: 'text', text: JSON.stringify(toolHandlers.get_speaker_profile(), null, 2) }] })
    },
    {
      name: 'search_projects',
      description: 'Search Sanket open-source GitHub repositories across WebMCP, ADK, LangGraph, vLLM, and GKE.',
      inputSchema: { type: 'object', properties: { query: { type: 'string' } } },
      execute: async (args) => ({ content: [{ type: 'text', text: JSON.stringify(toolHandlers.search_projects(args), null, 2) }] })
    },
    {
      name: 'search_talks',
      description: 'Search technical keynote and workshop sessions delivered globally.',
      inputSchema: { type: 'object', properties: { query: { type: 'string' } } },
      execute: async (args) => ({ content: [{ type: 'text', text: JSON.stringify(toolHandlers.search_talks(args), null, 2) }] })
    },
    {
      name: 'open_speaker_invite',
      description: 'Open the speaker invitation drawer/form pre-populated with a session topic.',
      inputSchema: { type: 'object', properties: { topic: { type: 'string' } } },
      execute: async (args) => ({ content: [{ type: 'text', text: JSON.stringify(toolHandlers.open_speaker_invite(args), null, 2) }] })
    }
  ];

  // Register on native Chrome WebMCP (navigator.modelContext) when available, else clean polyfill
  let nativeWebMcp = false;
  try {
    if (window.navigator.modelContext && typeof window.navigator.modelContext.registerTool === 'function') {
      nativeWebMcp = true;
      toolDefinitions.forEach((tool) => {
        try { window.navigator.modelContext.registerTool(tool); } catch (_) {}
      });
    } else if (window.navigator.modelContext && typeof window.navigator.modelContext.provideContext === 'function') {
      nativeWebMcp = true;
      window.navigator.modelContext.provideContext({ tools: toolDefinitions });
    } else if (!window.navigator.modelContext) {
      const registry = new Map(toolDefinitions.map((t) => [t.name, t]));
      Object.defineProperty(window.navigator, 'modelContext', {
        configurable: true,
        value: {
          listTools: () => Array.from(registry.values()).map(({ name, description, inputSchema }) => ({ name, description, inputSchema })),
          registerTool: (def) => registry.set(def.name, def),
          callTool: async (name, args) => {
            const tool = registry.get(name);
            if (!tool) throw new Error(`Unknown WebMCP tool: ${name}`);
            return tool.execute(args || {});
          }
        }
      });
    }
  } catch (_) {}

  if (statusEl) {
    statusEl.textContent = nativeWebMcp
      ? 'navigator.modelContext • Native Chrome WebMCP Active'
      : 'navigator.modelContext • Interactive Polyfill Ready';
  }

  let activeTool = 'get_speaker_profile';

  const runSelectedTool = async () => {
    const queryVal = queryInput ? queryInput.value : '';
    const argObj = activeTool === 'open_speaker_invite' ? { topic: queryVal } : { query: queryVal };
    try {
      let result;
      if (window.navigator.modelContext && typeof window.navigator.modelContext.callTool === 'function') {
        const res = await window.navigator.modelContext.callTool(activeTool, argObj);
        result = res?.content?.[0]?.text ? JSON.parse(res.content[0].text) : res;
      } else {
        result = toolHandlers[activeTool](argObj);
      }
      outputEl.textContent = JSON.stringify({ tool: activeTool, args: argObj, result }, null, 2);
    } catch (err) {
      outputEl.textContent = JSON.stringify({ tool: activeTool, error: String(err) }, null, 2);
    }
  };

  const setDrawerOpen = (open) => {
    drawer.classList.toggle('open', open);
    backdrop?.classList.toggle('open', open);
    fab.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) runSelectedTool();
  };

  fab.addEventListener('click', () => setDrawerOpen(!drawer.classList.contains('open')));
  closeBtn?.addEventListener('click', () => setDrawerOpen(false));
  backdrop?.addEventListener('click', () => setDrawerOpen(false));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      setDrawerOpen(false);
    }
  });

  toolBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      toolBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeTool = btn.getAttribute('data-tool') || 'get_speaker_profile';
      runSelectedTool();
    });
  });

  runBtn?.addEventListener('click', runSelectedTool);
  queryInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      runSelectedTool();
    }
  });
}

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
