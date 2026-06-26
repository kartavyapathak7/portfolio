(function () {
  'use strict';

  window.addEventListener('load', () => {
    setTimeout(() => {
      document.getElementById('preloader').classList.add('hidden');
    }, 2000);
  });

  document.getElementById('year').textContent = new Date().getFullYear();

  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    document.getElementById('scrollProgress').style.width = progress + '%';
  });

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

  const cursorGlow = document.getElementById('cursorGlow');
  const orbs = document.querySelector('.float-orbs');
  let glowRAF;

  document.addEventListener('mousemove', (e) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    cancelAnimationFrame(glowRAF);
    glowRAF = requestAnimationFrame(() => {
      if (cursorGlow) {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
      }
      if (orbs) {
        const x = (e.clientX / window.innerWidth - 0.5) * 24;
        const y = (e.clientY / window.innerHeight - 0.5) * 24;
        orbs.style.transform = `translate(${x}px, ${y}px)`;
      }
    });
  });

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

  function animateCounter(el, target, duration = 2000) {
    if (target === '∞' || target === 'AI') {
      el.textContent = target;
      return;
    }
    const numTarget = parseInt(target, 10);
    if (isNaN(numTarget)) {
      el.textContent = target;
      return;
    }
    const start = performance.now();
    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * numTarget);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = numTarget;
    }
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          animateCounter(el, el.dataset.count || el.textContent);
          counterObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('[data-count]').forEach((el) => {
    counterObserver.observe(el);
  });

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

  const heroGrid = document.querySelector('.hero-grid');
  if (heroGrid) {
    window.addEventListener('scroll', () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      heroGrid.style.transform = `translateY(${window.scrollY * 0.15}px)`;
    });
  }
})();
