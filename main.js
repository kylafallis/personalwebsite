// ============================================================
// main.js — Shared JS across all pages
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ── NAV: TRANSPARENT ON HOME, SOLID EVERYWHERE ELSE ────────
  const navEl = document.querySelector('nav');
  const isHome = document.body.classList.contains('page-home');

  if (navEl) {
    if (isHome) {
      // Start transparent on homepage
      navEl.classList.add('nav-transparent');

      window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
          navEl.classList.remove('nav-transparent');
          navEl.classList.add('nav-scrolled');
        } else {
          navEl.classList.remove('nav-scrolled');
          navEl.classList.add('nav-transparent');
        }
      }, { passive: true });
    } else {
      // All other pages: always dark solid
      navEl.classList.add('nav-solid');
    }
  }

  // ── MOBILE NAV OVERLAY ──────────────────────────────────────
  const toggle  = document.querySelector('.nav-toggle');
  const overlay = document.querySelector('.nav-overlay');

  if (toggle && overlay) {
    toggle.addEventListener('click', () => {
      const isOpen = overlay.classList.toggle('open');
      document.body.style.overflow = isOpen ? 'hidden' : '';

      // Animate hamburger → X
      const spans = toggle.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
      }
    });

    // Close on link click
    overlay.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
        const spans = toggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
      });
    });
  }

  // ── ACTIVE NAV LINK ────────────────────────────────────────
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-overlay a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // ── SCROLL REVEAL ──────────────────────────────────────────
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

  reveals.forEach(el => observer.observe(el));

  // ── FOOTER YEAR ────────────────────────────────────────────
  const yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = `© ${new Date().getFullYear()} Kyla Fallis · Environmental Engineer · Researcher · Builder`;
  }

});