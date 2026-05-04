// shared.js — V3
(function(){

  // Active nav
  const pg = location.pathname.split('/').pop()||'index.html';
  document.querySelectorAll('.nav-links a,.nav-drawer a').forEach(a=>{
    if((a.getAttribute('href')||'').split('/').pop()===pg) a.classList.add('active');
  });

  // Hamburger
  const ham=document.getElementById('ham');
  const drawer=document.getElementById('nav-drawer');
  if(ham&&drawer){
    const tog=open=>{
      ham.classList.toggle('open',open);
      drawer.classList.toggle('open',open);
      drawer.style.display=open?'block':'none';
      document.body.style.overflow=open?'hidden':'';
    };
    ham.addEventListener('click',()=>tog(!ham.classList.contains('open')));
    drawer.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>tog(false)));
    document.addEventListener('click',e=>{
      if(!ham.contains(e.target)&&!drawer.contains(e.target)) tog(false);
    });
  }

  // Page transitions
  document.body.classList.add('page-enter');
  document.addEventListener('click',e=>{
    const lnk=e.target.closest('a');
    if(!lnk) return;
    const h=lnk.getAttribute('href')||'';
    if(!h||h.startsWith('#')||h.startsWith('mailto:')||h.startsWith('tel:')||h.startsWith('http')||lnk.target==='_blank') return;
    e.preventDefault();
    document.body.classList.add('page-exit');
    setTimeout(()=>location.href=h,200);
  });

  // Scroll fade-in
  const io=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});
  },{threshold:.05});
  document.querySelectorAll('.fade').forEach(el=>io.observe(el));

  // Scroll top
  const top=document.getElementById('scroll-top');
  if(top){
    addEventListener('scroll',()=>top.classList.toggle('vis',scrollY>500),{passive:true});
    top.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));
  }

  // Theme
  const tb=document.getElementById('theme-btn');
  const root=document.documentElement;
  if(localStorage.getItem('theme')==='light'){root.classList.add('light');if(tb)tb.textContent='☀';}
  if(tb){
    tb.addEventListener('click',()=>{
      const l=root.classList.toggle('light');
      tb.textContent=l?'☀':'◑';
      localStorage.setItem('theme',l?'light':'dark');
    });
  }

  // Copy email
  window.copyEmail=btn=>{
    navigator.clipboard.writeText('udaydeepak1928@gmail.com').then(()=>{
      const o=btn.textContent;
      btn.textContent='Copied!';btn.classList.add('ok');
      setTimeout(()=>{btn.textContent=o;btn.classList.remove('ok');},2000);
    });
  };

  // Number counter animation
  window.animateCount=(el,target,duration=1400)=>{
    const start=performance.now();
    const update=now=>{
      const p=Math.min((now-start)/duration,1);
      const ease=1-Math.pow(1-p,3);
      el.textContent=Math.round(ease*target).toLocaleString();
      if(p<1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  };

  // Trigger counters when visible
  document.querySelectorAll('[data-count]').forEach(el=>{
    const target=parseInt(el.dataset.count);
    const cio=new IntersectionObserver(entries=>{
      if(entries[0].isIntersecting){animateCount(el,target);cio.disconnect();}
    },{threshold:.3});
    cio.observe(el);
  });

})();
