// shared.js v3

(function () {

  // ── Active nav link ──────────────────────────────────────────
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-drawer a').forEach(a => {
    const href = (a.getAttribute('href') || '').split('/').pop();
    if (href === page) a.classList.add('active');
  });

  // ── Mobile hamburger ─────────────────────────────────────────
  const toggle = document.getElementById('nav-toggle');
  const drawer = document.getElementById('nav-drawer');
  if (toggle && drawer) {
    toggle.addEventListener('click', () => {
      const open = toggle.classList.toggle('open');
      drawer.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    drawer.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.classList.remove('open');
        drawer.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
    document.addEventListener('click', e => {
      if (!toggle.contains(e.target) && !drawer.contains(e.target)) {
        toggle.classList.remove('open');
        drawer.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // ── Page transitions ─────────────────────────────────────────
  document.body.classList.add('page-enter');
  document.addEventListener('click', e => {
    const link = e.target.closest('a');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') ||
        href.startsWith('tel:') || href.startsWith('http') ||
        link.target === '_blank') return;
    e.preventDefault();
    document.body.classList.add('page-exit');
    setTimeout(() => { window.location.href = href; }, 180);
  });

  // ── Scroll-triggered fade-in ─────────────────────────────────
  const fadeObserver = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.07 });
  document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

  // ── Skill bar animations ──────────────────────────────────────
  const barObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const fill = e.target.querySelector('.skill-bar-fill');
        if (fill) fill.style.width = fill.dataset.pct + '%';
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.skill-bar-wrap').forEach(el => barObserver.observe(el));

  // ── Scroll to top button ──────────────────────────────────────
  const scrollBtn = document.getElementById('scroll-top');
  if (scrollBtn) {
    window.addEventListener('scroll', () => {
      scrollBtn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── Dark / Light theme toggle ─────────────────────────────────
  const themeBtn = document.getElementById('theme-toggle');
  const root = document.documentElement;
  const saved = localStorage.getItem('theme');
  if (saved === 'light') {
    root.classList.add('light');
    if (themeBtn) themeBtn.textContent = '☀';
  }
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const isLight = root.classList.toggle('light');
      themeBtn.textContent = isLight ? '☀' : '◑';
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
  }

  // ── Copy email button ─────────────────────────────────────────
  window.copyEmail = function(btn) {
    navigator.clipboard.writeText('udaydeepak1928@gmail.com').then(() => {
      btn.textContent = 'Copied!';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = 'Copy';
        btn.classList.remove('copied');
      }, 2000);
    });
  };

  // ── Print resume ──────────────────────────────────────────────
  window.printResume = function () { window.print(); };

})();
