(function () {
  'use strict';

  // Preloader
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.getElementById('preloader').classList.add('hidden');
    }, 2000);
  });

  // Year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Nav scroll
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);

    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    document.getElementById('scrollProgress').style.width = progress + '%';
  });

  // Mobile nav
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', open);
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Cursor glow
  const cursorGlow = document.getElementById('cursorGlow');
  let glowRAF;

  document.addEventListener('mousemove', (e) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    cancelAnimationFrame(glowRAF);
    glowRAF = requestAnimationFrame(() => {
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top = e.clientY + 'px';
    });
  });

  // Reveal on scroll
  const revealEls = document.querySelectorAll('.reveal, .pr-item');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  // Counter animation
  function animateCounter(el, target, duration = 2000) {
    const start = performance.now();
    const isInfinity = target === '∞' || target === 'AI';

    if (isInfinity) {
      el.textContent = target;
      return;
    }

    const numTarget = parseInt(target, 10);
    if (isNaN(numTarget)) {
      el.textContent = target;
      return;
    }

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * numTarget);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = numTarget;
      }
    }

    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = el.dataset.count || el.textContent;
          animateCounter(el, target);
          counterObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('[data-count]').forEach((el) => {
    counterObserver.observe(el);
  });

  // Keyboard key animation
  const keys = document.querySelectorAll('.key.active');
  let keyIndex = 0;

  function cycleKeys() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    keys.forEach((k) => k.classList.remove('active'));
    keys[keyIndex % keys.length].classList.add('active');
    keyIndex++;
  }

  if (keys.length) {
    setInterval(cycleKeys, 400);
  }

  // Live WPM flicker
  const liveWpm = document.getElementById('liveWpm');
  if (liveWpm) {
    setInterval(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const variance = Math.floor(Math.random() * 7) - 3;
      liveWpm.textContent = 120 + variance;
    }, 1500);
  }

  // Smooth anchor offset for fixed nav
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
})();
