// ============================================================
// main.js — Shared JS across all pages
// ============================================================

// ── NAV TOGGLE (mobile) ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
    });
    // Close on link click
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => links.classList.remove('open'));
    });
  }

  // ── ACTIVE NAV LINK ────────────────────────────────────────
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // ── SCROLL ANIMATIONS ──────────────────────────────────────
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach(el => observer.observe(el));

  // ── NAV SHADOW ON SCROLL ────────────────────────────────────
  const navEl = document.querySelector('nav');
  if (navEl) {
    window.addEventListener('scroll', () => {
      navEl.style.boxShadow = window.scrollY > 10
        ? '0 2px 24px rgba(28,43,30,0.1)'
        : 'none';
    }, { passive: true });
  }
});

// ── RENDER SHARED NAV ────────────────────────────────────────
function renderNav(activePage) {
  return `
  <nav>
    <div class="nav-inner">
      <a href="index.html" class="nav-logo">Kyla <span>Fallis</span></a>
      <ul class="nav-links">
        <li><a href="index.html" ${activePage==='home'?'class="active"':''}>Home</a></li>
        <li><a href="research.html" ${activePage==='research'?'class="active"':''}>Research</a></li>
        <li><a href="work.html" ${activePage==='work'?'class="active"':''}>Work</a></li>
        <li><a href="speaking.html" ${activePage==='speaking'?'class="active"':''}>Speaking</a></li>
        <li><a href="about.html" ${activePage==='about'?'class="active"':''}>About</a></li>
        <li><a href="contact.html" class="nav-cta" ${activePage==='contact'?'style="background:var(--green-mid)"':''}>Contact</a></li>
      </ul>
      <button class="nav-toggle" aria-label="Toggle menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>`;
}

// ── RENDER SHARED FOOTER ─────────────────────────────────────
function renderFooter() {
  return `
  <footer>
    <div class="container">
      <div class="footer-inner">
        <span class="footer-logo">Kyla Fallis</span>
        <nav class="footer-links">
          <a href="index.html">Home</a>
          <a href="research.html">Research</a>
          <a href="work.html">Work</a>
          <a href="speaking.html">Speaking</a>
          <a href="about.html">About</a>
          <a href="contact.html">Contact</a>
          <a href="https://linkedin.com/in/kylafallis07" target="_blank" rel="noopener">LinkedIn</a>
          <a href="https://github.com/kylafallis" target="_blank" rel="noopener">GitHub</a>
          <a href="https://fairgameinitiative.org" target="_blank" rel="noopener">FairGame</a>
        </nav>
        <p class="footer-copy">© ${new Date().getFullYear()} Kyla Fallis · Environmental Engineer · Researcher · Builder</p>
      </div>
    </div>
  </footer>`;
}
