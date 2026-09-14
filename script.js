/* =========================================================
   NEVORYN — script.js
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- LOADER ---------- */
  const loader = document.getElementById('loader');
  const loaderWord = document.getElementById('loaderWord');
  const loaderProgress = document.getElementById('loaderProgress');
  const loaderPct = document.getElementById('loaderPct');
  const loaderRing = document.getElementById('loaderRing');

  // split loader word into animated letters
  const word = loaderWord.textContent;
  loaderWord.innerHTML = '';
  [...word].forEach((ch, i) => {
    const span = document.createElement('span');
    span.textContent = ch;
    span.style.animationDelay = `${i * 0.06 + 0.1}s`;
    loaderWord.appendChild(span);
  });

  let progress = 0;
  const loadInterval = setInterval(() => {
    progress += Math.random() * 14;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadInterval);
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
        startSiteAnimations();
      }, 350);
    }
    loaderProgress.style.width = progress + '%';
    loaderPct.textContent = Math.round(progress) + '%';
    loaderRing.style.strokeDashoffset = 314 - (314 * progress / 100);
  }, 140);

  document.body.style.overflow = 'hidden';

  /* ---------- CUSTOM CURSOR ---------- */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  let mouseX = innerWidth / 2, mouseY = innerHeight / 2;
  let ringX = mouseX, ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  const hoverTargets = 'a, button, .magnetic, .acc-trigger, .build-card, .price-card';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hovered'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovered'));
  });

  /* ---------- MAGNETIC BUTTONS ---------- */
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${relX * 0.25}px, ${relY * 0.4}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0,0)'; });

    // ripple click
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  /* ---------- NAVBAR ---------- */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  const burger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');
  burger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
  document.querySelectorAll('[data-nav]').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });

  /* ---------- TEXT SPLITTING FOR REVEALS ---------- */
  document.querySelectorAll('.hero-title .reveal-line').forEach(line => {
    const text = line.textContent;
    line.innerHTML = `<span>${text}</span>`;
  });

  document.querySelectorAll('.reveal-words').forEach(el => {
    const text = el.textContent.trim();
    el.innerHTML = text.split(' ').map(w => `<span class="word">${w}</span>`).join(' ');
  });

  /* ---------- INTERSECTION OBSERVER REVEALS ---------- */
  const revealSelectors = '.reveal-up, .reveal-line, .reveal-words, .reveal-card';
  const revealEls = document.querySelectorAll(revealSelectors);
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => io.observe(el));

  // staggered delay for groups of cards
  document.querySelectorAll('.card-grid, .adv-grid, .test-grid, .price-grid, .timeline').forEach(group => {
    [...group.children].forEach((child, i) => {
      child.style.transitionDelay = `${(i % 8) * 0.06}s`;
    });
  });

  /* ---------- COUNTERS ---------- */
  const counters = document.querySelectorAll('.counter');
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      let cur = 0;
      const step = Math.max(1, target / 60);
      const tick = () => {
        cur += step;
        if (cur >= target) { el.textContent = target; return; }
        el.textContent = Math.floor(cur);
        requestAnimationFrame(tick);
      };
      tick();
      counterIO.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterIO.observe(c));

  /* ---------- PARALLAX IMAGES ---------- */
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    parallaxEls.forEach(el => {
      const speed = parseFloat(el.dataset.parallax);
      el.style.transform = `translateY(${scrollY * speed * 0.3}px) scale(1.15)`;
    });
  }, { passive: true });

  /* ---------- TIMELINE PROGRESS FILL ---------- */
  const timeline = document.querySelector('.timeline');
  const timelineFill = document.getElementById('timelineFill');
  if (timeline && timelineFill) {
    window.addEventListener('scroll', () => {
      const rect = timeline.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.min(1, Math.max(0, (vh - rect.top) / (rect.height + vh * 0.4)));
      timelineFill.style.width = (progress * 100) + '%';
    }, { passive: true });
  }

  /* ---------- ACCORDION ---------- */
  document.querySelectorAll('.acc-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.parentElement;
      const panel = item.querySelector('.acc-panel');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.acc-item.open').forEach(other => {
        other.classList.remove('open');
        other.querySelector('.acc-panel').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  /* ---------- SERVER NODE DIAGRAM (SVG) ---------- */
  const svgNS = 'http://www.w3.org/2000/svg';
  const nodesGroup = document.getElementById('serverNodes');
  const linesGroup = document.getElementById('serverLines');
  if (nodesGroup && linesGroup) {
    const points = [
      [250, 40], [110, 130], [390, 130], [60, 240], [250, 220], [440, 240],
      [130, 340], [250, 380], [370, 340]
    ];
    const links = [[0,1],[0,2],[1,3],[1,4],[2,4],[2,5],[3,6],[4,6],[4,7],[4,8],[5,8],[6,7],[7,8]];

    links.forEach(([a,b]) => {
      const line = document.createElementNS(svgNS, 'line');
      line.setAttribute('x1', points[a][0]); line.setAttribute('y1', points[a][1]);
      line.setAttribute('x2', points[b][0]); line.setAttribute('y2', points[b][1]);
      line.setAttribute('class', 'link');
      linesGroup.appendChild(line);
    });

    points.forEach((p, i) => {
      const c = document.createElementNS(svgNS, 'circle');
      c.setAttribute('cx', p[0]); c.setAttribute('cy', p[1]);
      c.setAttribute('r', i === 4 ? 10 : 6);
      c.setAttribute('class', 'node');
      nodesGroup.appendChild(c);
    });

    // pulsing nodes cycle
    let pulseIndex = 0;
    setInterval(() => {
      nodesGroup.querySelectorAll('circle').forEach(c => c.classList.remove('pulse'));
      const idx = pulseIndex % points.length;
      nodesGroup.children[idx].classList.add('pulse');
      pulseIndex++;
    }, 500);
  }

  /* ---------- AMBIENT NODE CANVAS BACKGROUND ---------- */
  const canvas = document.getElementById('nodeCanvas');
  const ctx = canvas.getContext('2d');
  let w, h, particles = [];

  function resizeCanvas() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = document.body.scrollHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const PARTICLE_COUNT = Math.min(70, Math.floor(window.innerWidth / 18));
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.4 + 0.4
    });
  }

  let mx = -9999, my = -9999;
  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY + window.scrollY;
  });

  function drawCanvas() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(245,245,240,0.55)';
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // connect nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.strokeStyle = `rgba(245,245,240,${0.07 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
      // connect to cursor
      const dxm = particles[i].x - mx;
      const dym = particles[i].y - my;
      const distm = Math.sqrt(dxm * dxm + dym * dym);
      if (distm < 160) {
        ctx.strokeStyle = `rgba(217,217,255,${0.25 * (1 - distm / 160)})`;
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mx, my);
        ctx.stroke();
      }
    }
    requestAnimationFrame(drawCanvas);
  }

  function startSiteAnimations() {
    drawCanvas();
    setTimeout(resizeCanvas, 600);
  }

  /* ---------- SMOOTH ANCHOR SCROLL OFFSET ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
    });
  });

});