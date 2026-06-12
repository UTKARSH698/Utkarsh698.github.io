// shared.js — V6 · editorial + interactive
(function(){

  const isFinePointer = matchMedia('(pointer:fine)').matches;
  const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Active nav (folio index + drawer) ───────────────────
  const pg = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-index a, .nav-drawer a').forEach(a => {
    if ((a.getAttribute('href') || '').split('/').pop() === pg) a.classList.add('active');
  });

  // ── Hamburger / mobile drawer ───────────────────────────
  const ham = document.getElementById('ham');
  const drawer = document.getElementById('nav-drawer');
  if (ham && drawer) {
    const tog = open => {
      ham.classList.toggle('open', open);
      drawer.classList.toggle('open', open);
      drawer.style.display = open ? 'block' : 'none';
      document.body.style.overflow = open ? 'hidden' : '';
    };
    ham.addEventListener('click', e => {
      e.stopPropagation();
      tog(!ham.classList.contains('open'));
    });
    drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => tog(false)));
    document.addEventListener('click', e => {
      if (!ham.contains(e.target) && !drawer.contains(e.target)) tog(false);
    });
  }

  // ── Page transitions ────────────────────────────────────
  document.body.classList.add('page-enter');
  document.addEventListener('click', e => {
    const lnk = e.target.closest('a');
    if (!lnk) return;
    const h = lnk.getAttribute('href') || '';
    if (!h || h.startsWith('#') || h.startsWith('mailto:') || h.startsWith('tel:') ||
        h.startsWith('http') || lnk.target === '_blank') return;
    e.preventDefault();
    document.body.classList.add('page-exit');
    setTimeout(() => location.href = h, 180);
  });

  // ── Scroll fade-in ──────────────────────────────────────
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: .05, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.fade').forEach(el => io.observe(el));

  // ── Scroll-to-top button ────────────────────────────────
  const topBtn = document.getElementById('scroll-top');
  if (topBtn) {
    addEventListener('scroll', () => topBtn.classList.toggle('vis', scrollY > 500), { passive: true });
    topBtn.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ── Theme toggle — paper ↔ ink ──────────────────────────
  const SUN  = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>';
  const MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  const tb = document.getElementById('theme-btn');
  const root = document.documentElement;
  const applyIcon = isInk => { if (tb) tb.innerHTML = isInk ? SUN : MOON; };

  if (localStorage.getItem('theme') === 'ink') {
    root.classList.add('ink');
    applyIcon(true);
  } else {
    applyIcon(false);
  }
  if (tb) {
    tb.addEventListener('click', () => {
      const isInk = root.classList.toggle('ink');
      applyIcon(isInk);
      localStorage.setItem('theme', isInk ? 'ink' : 'paper');
    });
  }

  // ── Copy email helper ───────────────────────────────────
  window.copyEmail = btn => {
    navigator.clipboard.writeText('udaydeepak1928@gmail.com').then(() => {
      const o = btn.textContent;
      btn.textContent = 'Copied';
      btn.classList.add('ok');
      setTimeout(() => { btn.textContent = o; btn.classList.remove('ok'); }, 2000);
    });
  };

  /* ════════════════════════════════════════════════════════
     V6 INTERACTIVE LAYER
     ════════════════════════════════════════════════════════ */

  // ── Reading progress bar (top sliver) ───────────────────
  const prog = document.createElement('div');
  prog.className = 'read-prog';
  prog.innerHTML = '<span></span>';
  document.body.appendChild(prog);
  const progBar = prog.firstElementChild;
  const updateProg = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const p = max > 0 ? (scrollY / max) * 100 : 0;
    progBar.style.width = p + '%';
  };
  addEventListener('scroll', updateProg, { passive: true });
  addEventListener('resize', updateProg);
  updateProg();

  // ── Always-visible "Available" pill in masthead ─────────
  const mastheadRight = document.querySelector('.masthead-r');
  if (mastheadRight && !document.querySelector('.avail-pill')) {
    const pill = document.createElement('a');
    pill.className = 'avail-pill';
    pill.href = 'contact.html#hire';
    pill.innerHTML = '<span class="ap-dot"></span><span class="ap-txt"><strong>Available</strong> · for hire</span>';
    pill.title = 'Open for remote internships, contracts, and research roles · July 2026';
    mastheadRight.insertBefore(pill, mastheadRight.firstChild);
  }

  // ── Tickertape — rolling headlines below masthead ───────
  const masthead = document.querySelector('.masthead');
  if (masthead) {
    const headlines = [
      'Latest dispatch · The AWS_ENDPOINT_URL seam, debugged',
      'Merged upstream · grafana/alloy-scenarios PR #147',
      'Currently reading · Designing Data-Intensive Applications',
      'Wrapping up · Cloud Computing Intern, TEJASKP AI Software',
      'Open to roles · Remote · Global · July 2026',
      'Field stack · AWS · Terraform · Kubernetes · Python',
      'Reply window · within 24 hours, always',
      'Applying · M.Sc. Computer Science · Fall 2027',
      'Vol. 2026 · Issue 06 · Folio 01 → 05'
    ];
    const tt = document.createElement('div');
    tt.className = 'tickertape';
    const inner = document.createElement('div');
    inner.className = 'tt-track';
    const block = headlines.map(h => `<span class="tt-item"><span class="tt-dot"></span>${h}</span>`).join('');
    inner.innerHTML = block + block; // duplicate for seamless loop
    tt.appendChild(inner);
    masthead.insertAdjacentElement('afterend', tt);
  }

  // ── Live clock in cover-strip (IST) ─────────────────────
  const strip = document.querySelector('.cover-strip');
  if (strip) {
    const live = document.createElement('span');
    live.className = 'live-clock';
    strip.appendChild(live);
    const tick = () => {
      const now = new Date();
      const ist = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + (5.5 * 3600000));
      const hh = String(ist.getUTCHours()).padStart(2, '0');
      const mm = String(ist.getUTCMinutes()).padStart(2, '0');
      const ss = String(ist.getUTCSeconds()).padStart(2, '0');
      live.innerHTML = `<span class="lc-pulse"></span>${hh}:${mm}<span class="lc-sec">:${ss}</span> IST`;
    };
    tick();
    setInterval(tick, 1000);
  }

  // ── Scroll-spy rail (desktop only) ──────────────────────
  if (isFinePointer && innerWidth > 1100) {
    const sections = document.querySelectorAll('main > section, main > header');
    if (sections.length > 1) {
      const rail = document.createElement('aside');
      rail.className = 'spy-rail';
      sections.forEach((s, i) => {
        const dot = document.createElement('a');
        dot.className = 'spy-dot';
        dot.dataset.idx = i;
        const label = s.querySelector('h1,h2,.eyebrow,.fm-l,.ds-num');
        dot.dataset.label = label ? (label.textContent.trim().slice(0, 36)) : `§ ${String(i+1).padStart(2,'0')}`;
        dot.addEventListener('click', e => {
          e.preventDefault();
          s.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        rail.appendChild(dot);
      });
      document.body.appendChild(rail);

      const dots = rail.querySelectorAll('.spy-dot');
      const spyIo = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const idx = [...sections].indexOf(e.target);
            dots.forEach(d => d.classList.toggle('active', +d.dataset.idx === idx));
          }
        });
      }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
      sections.forEach(s => spyIo.observe(s));
    }
  }

  // Custom cursor blot removed — system cursor only for less visual noise.

  // ── Magnetic CTA buttons ────────────────────────────────
  if (isFinePointer && !prefersReduced) {
    document.querySelectorAll('.btn-ink, .btn-accent, .icon-btn, [data-magnet]').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.18}px, ${y * 0.25}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  // ── Animated counters ───────────────────────────────────
  const ease = t => 1 - Math.pow(1 - t, 3);
  const animate = (el, to, dur = 1400, suffix = '') => {
    const start = performance.now();
    const step = now => {
      const p = Math.min(1, (now - start) / dur);
      const v = to * ease(p);
      el.textContent = (to % 1 === 0 ? Math.round(v) : v.toFixed(2)) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const countIo = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const to = parseFloat(e.target.dataset.count);
        const suf = e.target.dataset.suffix || '';
        animate(e.target, to, 1400, suf);
        countIo.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('[data-count]').forEach(el => countIo.observe(el));

  // ── Tilt cards (TOC rows, dept cards, dispatches) ───────
  if (isFinePointer && !prefersReduced) {
    document.querySelectorAll('.toc-row, .dept, .dispatch').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${x * 3}deg) rotateX(${-y * 2}deg) translateZ(0)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  // ── Scramble headline (cover h1 only) ───────────────────
  if (!prefersReduced) {
    const h1 = document.querySelector('.cover h1');
    if (h1) {
      const original = h1.innerHTML;
      const chars = '!<>-_\\/[]{}—=+*^?#________';
      const walk = (node, fn) => {
        if (node.nodeType === 3) fn(node);
        else node.childNodes.forEach(c => walk(c, fn));
      };
      const texts = [];
      walk(h1, n => texts.push({ node: n, text: n.nodeValue }));
      const totalDur = 900;
      const start = performance.now();
      const step = now => {
        const t = Math.min(1, (now - start) / totalDur);
        texts.forEach(({ node, text }) => {
          let out = '';
          for (let i = 0; i < text.length; i++) {
            const charRevealAt = (i / Math.max(1, text.length)) * 0.6;
            if (t > charRevealAt + 0.2) out += text[i];
            else if (text[i] === ' ' || text[i] === '\n') out += text[i];
            else out += chars[Math.floor(Math.random() * chars.length)];
          }
          node.nodeValue = out;
        });
        if (t < 1) requestAnimationFrame(step);
        else h1.innerHTML = original;
      };
      requestAnimationFrame(step);
    }
  }

  // ── Stagger reveal on filter pills + tags ───────────────
  document.querySelectorAll('.filters .filter-pill, .dispatch-tags .tag, .feature-tags .tag').forEach((el, i) => {
    el.style.animationDelay = (i * 40) + 'ms';
    el.classList.add('pop-in');
  });

  // ── Wordmark click counter — Press Proof mode ───────────
  const wmMark = document.querySelector('.wm-mark');
  if (wmMark) {
    let clicks = 0;
    let timer;
    wmMark.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      clicks++;
      clearTimeout(timer);
      timer = setTimeout(() => clicks = 0, 2000);
      if (clicks >= 5) {
        document.body.classList.toggle('press-proof');
        clicks = 0;
        flash(document.body.classList.contains('press-proof') ? 'Press proof — ON' : 'Press proof — OFF');
      }
    });
  }

  // ── Konami → Draft mode (shows editor's marks) ──────────
  const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let kIdx = 0;
  addEventListener('keydown', e => {
    const k = e.key;
    if (k === konami[kIdx]) {
      kIdx++;
      if (kIdx === konami.length) {
        document.body.classList.toggle('draft-mode');
        flash(document.body.classList.contains('draft-mode') ? 'Draft mode — ON' : 'Draft mode — OFF');
        kIdx = 0;
      }
    } else {
      kIdx = (k === konami[0]) ? 1 : 0;
    }
  });

  // ── Toast / flash helper ────────────────────────────────
  function flash(msg) {
    let f = document.querySelector('.edi-flash');
    if (!f) {
      f = document.createElement('div');
      f.className = 'edi-flash';
      document.body.appendChild(f);
    }
    f.textContent = msg;
    f.classList.add('show');
    clearTimeout(f._t);
    f._t = setTimeout(() => f.classList.remove('show'), 1800);
  }
  window._flash = flash;

  // ── Dept card radial-glow follow ────────────────────────
  if (isFinePointer) {
    document.querySelectorAll('.dept').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
        card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
      });
    });
  }

  // ── Section anchor smooth-scroll w/ offset ──────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const t = document.getElementById(id);
      if (!t) return;
      e.preventDefault();
      const y = t.getBoundingClientRect().top + scrollY - 80;
      scrollTo({ top: y, behavior: 'smooth' });
    });
  });

})();
