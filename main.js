// ============================================================
// main.js: Shared JS across all pages
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

  // ── COUNTER ANIMATION ──────────────────────────────────────
  function animateCounter(el) {
    const target   = parseFloat(el.dataset.countTo);
    const suffix   = el.dataset.countSuffix || '';
    const duration = 1400;
    const start    = performance.now();
    const isInt    = Number.isInteger(target);

    function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const current  = target * easeOutQuart(progress);
      el.textContent = (isInt ? Math.round(current) : current.toFixed(1)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }

    el.textContent = '0' + suffix;
    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('[data-count-to]').forEach(el => counterObserver.observe(el));

  // ── FOOTER YEAR ────────────────────────────────────────────
  const yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = `© ${new Date().getFullYear()} Kyla Fallis · Environmental Engineer · Researcher · Builder`;
  }


  // ── GOAL TRACKING ──────────────────────────────────────────
  // Fires the two conversions worth watching: resume/CV downloads and
  // Cal.com bookings. Provider-agnostic: it calls whichever analytics
  // library is on the page and stays silent if none is. Nothing here
  // sends data on its own, so it is safe to ship before you pick a tool.
  //
  // Mark any link with data-analytics="some-event-name" to track it.

  function track(event, props) {
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', event, props || {});
      } else if (typeof window.plausible === 'function') {
        window.plausible(event, { props: props || {} });
      } else if (window.umami && typeof window.umami.track === 'function') {
        window.umami.track(event, props || {});
      } else if (typeof window.goatcounter === 'object' && window.goatcounter.count) {
        window.goatcounter.count({ path: event, title: event, event: true });
      }
    } catch (e) { /* analytics must never break the page */ }
  }

  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-analytics]');
    if (!el) return;
    track(el.getAttribute('data-analytics'), {
      href: el.getAttribute('href') || '',
      page: location.pathname
    });
  });

  // Cal.com opens in an iframe/popup, so a click on any booking entry point
  // is the closest thing to a booking intent we can see from this side.
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-cal-link], a[href*="cal.com"]');
    if (!el) return;
    track('booking-opened', {
      meeting: el.getAttribute('data-cal-link') || el.getAttribute('href') || '',
      page: location.pathname
    });
  });

});