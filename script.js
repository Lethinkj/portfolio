// Ambient canvas + cursor follower + advanced animations
const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
let w = canvas.width = innerWidth;
let h = canvas.height = innerHeight;
let scrollY = 0;

window.addEventListener('resize', ()=>{
  w = canvas.width = innerWidth;
  h = canvas.height = innerHeight;
});

window.addEventListener('scroll', ()=>{
  scrollY = window.scrollY;
  updateProgressIndicator();
});

// particles - more dynamic
const particles = [];
const PT = window.innerWidth < 768 ? 30 : (window.innerWidth < 1024 ? 50 : 90);
for(let i=0;i<PT;i++) particles.push({
  x: Math.random()*w,
  y: Math.random()*h,
  r: 0.5+Math.random()*2.2,
  vx: (Math.random()-0.5)*0.2,
  vy: (Math.random()-0.5)*0.2,
  hue: 160 + Math.random()*80,
  alpha: 0.03+Math.random()*0.12,
  wave: Math.random()*Math.PI*2,
  speed: 0.02 + Math.random()*0.03
});

function draw(){
  ctx.clearRect(0,0,w,h);
  
  // subtle vignette influenced by scroll
  const g = ctx.createLinearGradient(0,0,w,h);
  const vignetteIntensity = 0.25 + (scrollY / (document.body.scrollHeight - h)) * 0.15;
  g.addColorStop(0,`rgba(0,0,0,${vignetteIntensity})`);
  g.addColorStop(1,`rgba(0,0,0,${vignetteIntensity+0.1})`);
  ctx.fillStyle = g; ctx.fillRect(0,0,w,h);

  for(const p of particles){
    p.wave += p.speed;
    p.x += p.vx + Math.sin(p.wave)*0.1;
    p.y += p.vy;
    
    if(p.x< -50) p.x = w+50;
    if(p.x> w+50) p.x = -50;
    if(p.y< -50) p.y = h+50;
    if(p.y> h+50) p.y = -50;

    ctx.beginPath();
    ctx.fillStyle = `hsla(${p.hue},100%,60%,${p.alpha})`;
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fill();
  }

  // subtle grid lines
  ctx.strokeStyle = 'rgba(255,255,255,0.02)';
  ctx.lineWidth = 1;
  for(let gx=0;gx<w;gx+=140){
    ctx.beginPath(); ctx.moveTo(gx,0); ctx.lineTo(gx,h); ctx.stroke();
  }
  for(let gy=0;gy<h;gy+=140){
    ctx.beginPath(); ctx.moveTo(0,gy); ctx.lineTo(w,gy); ctx.stroke();
  }

  requestAnimationFrame(draw);
}

// Enhanced cursor follower with trails and effects
// Disable on mobile devices
const isMobile = window.matchMedia('(max-width: 768px)').matches || 'ontouchstart' in window;

if (!isMobile) {
  // lazy-create DOM nodes for the cursor to avoid any initial 0,0 paint
  let dot = null;
  let ring = null;
  let mouse = { x: null, y: null };
  let ringTarget = { x: null, y: null };
  let trailTimer = 0;
  let firstMove = true;

  function createCursorElements(x = window.innerWidth/2, y = window.innerHeight/2){
    if(dot && ring) return;
    dot = document.createElement('div'); dot.className = 'cursor-dot';
    ring = document.createElement('div'); ring.className = 'cursor-ring';
    // start hidden then place at given pos
    dot.style.opacity = '0'; dot.style.visibility = 'hidden';
    ring.style.opacity = '0'; ring.style.visibility = 'hidden';
    document.body.appendChild(dot); document.body.appendChild(ring);

    // immediate placement
    dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    ring.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    // reveal
    requestAnimationFrame(()=>{
      dot.style.visibility = 'visible'; dot.style.opacity = '1';
      ring.style.visibility = 'visible'; ring.style.opacity = '1';
    });
    ringTarget.x = x; ringTarget.y = y;
  }

  // unify pointermove/mousemove so all devices trigger creation promptly
  function handlePointerMove(e){
    mouse.x = e.clientX; mouse.y = e.clientY;
    if(firstMove){
      firstMove = false;
      createCursorElements(mouse.x, mouse.y);
    } else if(dot){
      // dot follows instantly for native-like feel
      dot.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%)`;
    }

    // trail
    trailTimer++;
    if(trailTimer % 3 === 0){
      const trail = document.createElement('div');
      trail.className = 'cursor-trail';
      trail.style.left = e.clientX + 'px';
      trail.style.top = e.clientY + 'px';
      trail.style.transform = 'translate(-50%, -50%)';
      document.body.appendChild(trail);
      setTimeout(() => trail.remove(), 500);
    }
  }

  window.addEventListener('pointermove', handlePointerMove, {passive:true});
  window.addEventListener('mousemove', handlePointerMove, {passive:true});

  // Restore last cursor position from sessionStorage (so cursor appears at same place across navigation)
  try{
    const last = sessionStorage.getItem('lastCursorPos');
    if(last){
      const {x,y} = JSON.parse(last);
      if(typeof x === 'number' && typeof y === 'number'){
        mouse.x = x; mouse.y = y; firstMove = false;
        createCursorElements(x,y);
      }
    }
  }catch(e){/* ignore storage errors */}

  function ease(a,b,n){ return (1-n)*a + n*b }

  function loop(){
    if(mouse.x === null || mouse.y === null){
      requestAnimationFrame(loop); return;
    }
    if(!ring) { requestAnimationFrame(loop); return; }

    // ring lags for trailing
    ringTarget.x = ease(ringTarget.x ?? mouse.x, mouse.x, 0.16);
    ringTarget.y = ease(ringTarget.y ?? mouse.y, mouse.y, 0.16);
    ring.style.transform = `translate3d(${ringTarget.x}px, ${ringTarget.y}px, 0) translate(-50%, -50%)`;

    requestAnimationFrame(loop);
  }

  // Enhanced click effects (guarded)
  window.addEventListener('mousedown', ()=>{
    if(dot) { dot.style.width = '20px'; dot.style.height = '20px'; }
    if(ring){ ring.style.width = '30px'; ring.style.height = '30px'; }

    // ripple
    const ripple = document.createElement('div');
    ripple.style.cssText = `position:fixed;left:${mouse.x}px;top:${mouse.y}px;width:10px;height:10px;border-radius:50%;border:2px solid var(--neon);pointer-events:none;z-index:9996;transform:translate(-50%,-50%);animation:clickRipple 0.6s ease-out forwards`;
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });

  window.addEventListener('mouseup', ()=>{
    if(dot){ dot.style.width = '12px'; dot.style.height = '12px'; }
    if(ring){ ring.style.width = '40px'; ring.style.height = '40px'; }
  });

  // Hover effects on interactive elements
  const interactiveElements = 'a, button, .nav-link, .cta-primary, .cta-secondary, .link-card, .project-card, .cert-card, .skill-category, input, textarea';
  document.addEventListener('mouseover', (e) => {
    if(!e.target.matches) return;
    if(e.target.matches(interactiveElements) && dot && ring) {
      dot.style.width = '25px'; dot.style.height = '25px';
      ring.style.width = '60px'; ring.style.height = '60px';
      ring.style.borderColor = 'var(--accent)';
    }
  });

  document.addEventListener('mouseout', (e) => {
    if(!e.target.matches) return;
    if(e.target.matches(interactiveElements) && dot && ring) {
      dot.style.width = '12px'; dot.style.height = '12px';
      ring.style.width = '40px'; ring.style.height = '40px';
      ring.style.borderColor = 'var(--neon)';
    }
  });

  // reduced-motion respect
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    // remove heavy animations
    document.querySelectorAll('.cursor-dot, .cursor-ring').forEach(n=>n.remove());
    particles.length = 0;
  } else {
    loop();
  }
  
  // Create a lightweight ambient-follow element that subtly follows the pointer (additive)
  if(!isMobile && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    const ambientFollow = document.createElement('div');
    ambientFollow.className = 'ambient-follow';
    document.body.appendChild(ambientFollow);

    let lastMoveAF = 0;
    window.addEventListener('pointermove', (e)=>{
      const now = Date.now();
      if(now - lastMoveAF < 12) return; // throttle
      lastMoveAF = now;
      ambientFollow.style.transform = `translate3d(${e.clientX - 60}px, ${e.clientY - 60}px, 0)`;
      ambientFollow.style.opacity = '0.14';
    }, {passive:true});

    // small particle burst on click for extra 'animative' feel (adds to existing click ripple/sparkles)
    window.addEventListener('click', (e)=>{
      if(window.innerWidth < 768) return;
      for(let i=0;i<6;i++){
        setTimeout(()=>{
          const p = document.createElement('div');
          p.style.position = 'fixed'; p.style.left = e.clientX + 'px'; p.style.top = e.clientY + 'px';
          p.style.width = p.style.height = (4 + Math.random()*6) + 'px';
          p.style.borderRadius = '50%'; p.style.pointerEvents='none'; p.style.zIndex='998';
          p.style.background = Math.random() > 0.5 ? 'rgba(0,255,225,0.9)' : 'rgba(255,68,204,0.9)';
          p.style.boxShadow = '0 0 8px rgba(255,255,255,0.1)';
          document.body.appendChild(p);
          const angle = Math.random()*Math.PI*2; const v = 1 + Math.random()*2;
          const start = Date.now(); const life = 420 + Math.random()*220;
          (function anim(){
            const t = Date.now() - start; const prog = t/life;
            if(prog >= 1){ p.remove(); return; }
            p.style.left = (e.clientX + Math.cos(angle)*v*t*0.06) + 'px';
            p.style.top = (e.clientY + Math.sin(angle)*v*t*0.06) + 'px';
            p.style.opacity = String(1 - prog);
            requestAnimationFrame(anim);
          })();
        }, i*20);
      }
    }, {passive:true});
  }
} // End of !isMobile check

// Start canvas animations if not on mobile and motion is allowed
if (!isMobile && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  draw();
}

// Update CSS variables for cursor position to drive dynamic radial background
;(function(){
  if(typeof window === 'undefined') return;
  const docEl = document.documentElement;
  let last = 0;
  let idleTimer = null;

  function setCursorVars(x, y){
    // set as percentages to work with CSS radial gradients
    const px = Math.round((x / window.innerWidth) * 10000) / 100 + '%';
    const py = Math.round((y / window.innerHeight) * 10000) / 100 + '%';
    docEl.style.setProperty('--cursor-x', px);
    docEl.style.setProperty('--cursor-y', py);
  }

  // throttle and bind
  function onPointer(e){
    const now = Date.now();
    if(now - last < 12) return; last = now;
    setCursorVars(e.clientX, e.clientY);

    // clear idle auto-oscillate while user moves
    if(idleTimer){ clearTimeout(idleTimer); idleTimer = null; }
    idleTimer = setTimeout(()=>{
      // slowly oscillate when idle
      let t0 = Date.now();
      const amp = 6; // percent offset
      function oscillate(){
        const t = (Date.now() - t0)/1000;
        const x = (50 + Math.sin(t*0.6) * amp);
        const y = (50 + Math.cos(t*0.45) * (amp*0.6));
        docEl.style.setProperty('--cursor-x', x + '%');
        docEl.style.setProperty('--cursor-y', y + '%');
        idleTimer = requestAnimationFrame(oscillate);
      }
      idleTimer = requestAnimationFrame(oscillate);
    }, 900);
  }

  window.addEventListener('pointermove', onPointer, {passive:true});
  window.addEventListener('mousemove', onPointer, {passive:true});

  // Create default ambient orbs if none exist (keeps background rich on pages missing markup)
  if(document.querySelectorAll('.ambient-orb').length === 0){
    const ab = document.querySelector('.ambient-backdrop') || document.body;
    const orb1 = document.createElement('div'); orb1.className='ambient-orb orb-1'; orb1.style.left='6%'; orb1.style.top='8%'; ab.appendChild(orb1);
    const orb2 = document.createElement('div'); orb2.className='ambient-orb orb-2'; orb2.style.right='8%'; orb2.style.top='28%'; ab.appendChild(orb2);
    const orb3 = document.createElement('div'); orb3.className='ambient-orb orb-3'; orb3.style.left='50%'; orb3.style.bottom='6%'; ab.appendChild(orb3);
  }

  // Add dynamic radial container if not present (enable on all pages, including contact)
  if(!document.querySelector('.dynamic-radial')){
    const dyn = document.createElement('div'); dyn.className='dynamic-radial'; document.body.appendChild(dyn);
  }

  // Show radial only while pointer/touch is actively moving; hide shortly after idle
  const dynEl = document.querySelector('.dynamic-radial');
  let dynHideTimer = null;
  function showDynamic(){
    if(!dynEl) return;
    dynEl.classList.add('visible');
    if(dynHideTimer) { clearTimeout(dynHideTimer); dynHideTimer = null; }
    dynHideTimer = setTimeout(()=>{
      dynEl.classList.remove('visible');
    }, 700); // hide 700ms after last movement
  }

  // pointer/mouse
  window.addEventListener('pointermove', (e)=>{ showDynamic(); }, {passive:true});
  window.addEventListener('mousemove', (e)=>{ showDynamic(); }, {passive:true});

  // touch: map touch positions to CSS vars and show radial while swiping
  let lastTouch = 0;
  window.addEventListener('touchmove', (e)=>{
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const now = Date.now(); if(now - lastTouch < 16) return; lastTouch = now;
    const t = e.touches[0]; if(!t) return;
    // set vars directly from touch position
    const px = Math.round((t.clientX / window.innerWidth) * 10000) / 100 + '%';
    const py = Math.round((t.clientY / window.innerHeight) * 10000) / 100 + '%';
    document.documentElement.style.setProperty('--cursor-x', px);
    document.documentElement.style.setProperty('--cursor-y', py);
    showDynamic();
  }, {passive:true});

  // scroll/viewport-based trigger: compute visible center and animate radial towards it
  let lastScroll = 0;
  window.addEventListener('scroll', ()=>{
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const now = Date.now(); if(now - lastScroll < 80) return; lastScroll = now;
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const px = Math.round((cx / window.innerWidth) * 10000) / 100 + '%';
    const py = Math.round((cy / window.innerHeight) * 10000) / 100 + '%';
    document.documentElement.style.setProperty('--cursor-x', px);
    document.documentElement.style.setProperty('--cursor-y', py);
    showDynamic();
  }, {passive:true});
})();

// set year
document.getElementById('year').textContent = new Date().getFullYear();

// Fix/normalize BashXCode external link(s) if protocol is missing (defensive)
(function(){
  const nodes = Array.from(document.querySelectorAll('a[href*="bashxcode.vercel.app"]'));
  nodes.forEach(a => {
    let href = a.getAttribute('href') || '';
    // if href does not start with http(s), prefix https://
    if(href && !href.match(/^https?:\/\//i)){
      // strip leading slashes
      href = href.replace(/^\/+/, '');
      a.setAttribute('href', 'https://' + href);
    }
    // ensure opens in new tab and safe rel
    a.setAttribute('target', '_blank');
    let rel = a.getAttribute('rel') || '';
    if(!/noopener/i.test(rel)) rel = (rel + ' noopener').trim();
    if(!/noreferrer/i.test(rel)) rel = (rel + ' noreferrer').trim();
    a.setAttribute('rel', rel);
  });
})();

// Fallback: if a project-link is not clickable due to stacking/context, add JS handler to open it
document.querySelectorAll('.project-link').forEach(el => {
  el.addEventListener('click', (e) => {
    // if it's an external http(s) link, ensure it opens
    const href = el.getAttribute('href') || '';
    if(href && href.match(/^https?:\/\//i)){
      // allow default behavior but defensively open in a new tab
      window.open(href, '_blank', 'noopener,noreferrer');
      e.preventDefault();
    }
  });
});

// Progress Indicator Navigation
function updateProgressIndicator(){
  const sections = document.querySelectorAll('section[id]');
  let currentSection = 'hero';
  
  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    if(rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2){
      currentSection = section.id;
    }
  });

  document.querySelectorAll('.progress-dot').forEach(dot => {
    dot.classList.remove('active');
    if(dot.dataset.section === currentSection){
      dot.classList.add('active');
    }
  });
}

// Click progress dots to navigate
document.querySelectorAll('.progress-dot').forEach(dot => {
  dot.addEventListener('click', ()=>{
    const sectionId = dot.dataset.section;
    const section = document.getElementById(sectionId);
    if(section){
      section.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
  });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e)=>{
    const href = link.getAttribute('href');
    if(href !== '#'){
      e.preventDefault();
      const target = document.querySelector(href);
      if(target){
        target.scrollIntoView({behavior: 'smooth', block: 'start'});
      }
    }
  });
});

// Save cursor position before navigating away or on internal link clicks
function saveCursor(){
  try{
    // Prefer reading from the rendered cursor if available
    const dotEl = document.querySelector('.cursor-dot');
    if(dotEl){
      const r = dotEl.getBoundingClientRect();
      const cx = Math.round(r.left + r.width/2);
      const cy = Math.round(r.top + r.height/2);
      sessionStorage.setItem('lastCursorPos', JSON.stringify({x: cx, y: cy}));
      return;
    }
    // fallback to in-memory mouse if present
    if(typeof mouse !== 'undefined' && mouse && mouse.x != null){
      sessionStorage.setItem('lastCursorPos', JSON.stringify({x: mouse.x, y: mouse.y}));
    }
  }catch(e){}
}

// attach to internal links
document.querySelectorAll('a[href]').forEach(a => {
  const href = a.getAttribute('href');
  if(href && !href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('#')){
    a.addEventListener('click', saveCursor);
  }
});

window.addEventListener('beforeunload', saveCursor);
window.addEventListener('pagehide', saveCursor);
document.addEventListener('visibilitychange', ()=>{ if(document.visibilityState === 'hidden') saveCursor(); });

// --- Interactive ambient backdrop: cursor enforcement + orb interactivity ---
(function(){
  // Prevent OS cursor from briefly appearing during pointer interactions
  let cursorForced = false;
  function setCursorNone(force){
    if(force){
      document.documentElement.style.cursor = 'none';
      document.body.style.cursor = 'none';
      cursorForced = true;
    } else {
      document.documentElement.style.cursor = '';
      document.body.style.cursor = '';
      cursorForced = false;
    }
  }

  // Force hide during pointerdown/up on desktop
  window.addEventListener('pointerdown', ()=> setCursorNone(true));
  window.addEventListener('pointerup', ()=> setCursorNone(false));

  // Ambient orb interactivity
  const orbs = Array.from(document.querySelectorAll('.ambient-orb'));
  if(orbs.length === 0) return;

  // subtle parallax based on mouse position
  let lastMove = 0;
  window.addEventListener('mousemove', (e)=>{
    const now = Date.now();
    // throttle to ~60fps (no-op if firing faster)
    if(now - lastMove < 8) return;
    lastMove = now;

    const cx = window.innerWidth/2;
    const cy = window.innerHeight/2;
    const nx = (e.clientX - cx) / cx; // -1..1
    const ny = (e.clientY - cy) / cy;

    orbs.forEach((orb, i)=>{
      const depth = 1 + i*0.35; // different sensitivity
      const tx = (nx * 12) / depth;
      const ty = (ny * 12) / depth;
      orb.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    });
  }, {passive:true});

  // click pulse effect on orbs
  function pulse(x, y){
    orbs.forEach((orb, i)=>{
      const el = orb;
      el.animate([
        { transform: el.style.transform || 'translate3d(0,0,0) scale(1)', opacity: el.style.opacity || 0.9 },
        { transform: (el.style.transform || 'translate3d(0,0,0)') + ' scale(1.08)', opacity: 1 },
        { transform: el.style.transform || 'translate3d(0,0,0) scale(1)', opacity: el.style.opacity || 0.9 }
      ], { duration: 420 + i*60, easing: 'cubic-bezier(0.2,0.9,0.2,1)' });
    });
  }

  window.addEventListener('click', (e)=>{
    pulse(e.clientX, e.clientY);
  });
})();

// Scroll animations for cards
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, {threshold: 0.1});

document.querySelectorAll('.card').forEach(card => {
  observer.observe(card);
  card.style.transition = 'all 0.6s cubic-bezier(0.25,0.46,0.45,0.94)';
  card.style.opacity = '0';
  card.style.transform = 'translateY(30px)';
});

// Interactive project cards with unique hover
document.querySelectorAll('.project').forEach((proj, idx) => {
  proj.style.animationDelay = `${idx * 0.1}s`;
  proj.addEventListener('mouseenter', function(){
    this.style.filter = 'brightness(1.15) drop-shadow(0 0 20px rgba(0,255,225,0.3))';
    this.style.transform = 'scale(1.02) rotateY(-2deg)';
  });
  proj.addEventListener('mouseleave', function(){
    this.style.filter = 'brightness(1)';
    this.style.transform = 'scale(1) rotateY(0deg)';
  });
});

// Skill tags interactive
document.querySelectorAll('.tags li').forEach(tag => {
  tag.addEventListener('mouseenter', function(){
    this.style.animation = 'skillTagPulse 0.4s ease';
    this.style.background = 'rgba(0,255,225,0.25)';
  });
  tag.addEventListener('mouseleave', function(){
    this.style.background = 'rgba(0,255,225,0.1)';
  });
});

// Certification items with stagger
document.querySelectorAll('.cert-item').forEach((cert, idx) => {
  cert.style.animation = `cardSlideIn 0.6s cubic-bezier(0.25,0.46,0.45,0.94) ${idx * 0.08}s forwards`;
  cert.style.opacity = '0';
  cert.addEventListener('mouseenter', function(){
    this.style.borderColor = 'rgba(0,255,225,0.5)';
    this.style.background = 'rgba(255,68,204,0.08)';
  });
  cert.addEventListener('mouseleave', function(){
    this.style.borderColor = 'rgba(255,68,204,0.1)';
    this.style.background = 'rgba(255,68,204,0.02)';
  });
});

// Accessibility: focus outlines for keyboard users
(function(){
  function handleFirstTab(e) {
    if (e.key === 'Tab') {
      document.body.classList.add('user-is-tabbing');
      window.removeEventListener('keydown', handleFirstTab);
    }
  }
  window.addEventListener('keydown', handleFirstTab);
})();

// Set active nav link based on current page
(function(){
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if(href === currentPage || (currentPage === '' && href === 'index.html')){
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
})();

// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Ultra-Optimized Sparkle effect with canvas pooling & multiple sparkle types
(function(){
  let lastSparkle = 0;
  const sparkleDelay = 50; // Faster sparkle creation
  const sparklePool = [];
  const maxSparkles = 25; // More sparkles for denser effect
  const sparkleTypes = ['cyan', 'magenta', 'white'];
  
  // Pre-create sparkle elements with variety
  for(let i = 0; i < maxSparkles; i++) {
    const sparkle = document.createElement('div');
    sparkle.style.position = 'fixed';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '999';
    sparkle.style.display = 'none';
    document.body.appendChild(sparkle);
    
    const typeIndex = i % sparkleTypes.length;
    const type = sparkleTypes[typeIndex];
    
    sparklePool.push({
      element: sparkle,
      active: false,
      type: type,
      size: 2 + Math.random() * 4,
      duration: 400 + Math.random() * 200
    });
  }
  
  document.addEventListener('mousemove', (e) => {
    // Disable sparkles on mobile for better performance
    if(window.innerWidth < 768) return;
    
    const now = Date.now();
    if(now - lastSparkle > sparkleDelay && Math.random() > 0.5) {
      lastSparkle = now;
      // Create 1-3 sparkles per move for denser effect
      const sparkleCount = Math.random() > 0.7 ? 3 : (Math.random() > 0.5 ? 2 : 1);
      for(let i = 0; i < sparkleCount; i++) {
        setTimeout(() => createSparkle(e.clientX, e.clientY), i * 15);
      }
    }
  }, {passive: true});
  
  function createSparkle(x, y) {
    // Find inactive sparkle from pool
    let sparkleObj = sparklePool.find(s => !s.active);
    if(!sparkleObj) return;
    
    sparkleObj.active = true;
    const el = sparkleObj.element;
    const type = sparkleObj.type;
    const size = sparkleObj.size;
    const duration = sparkleObj.duration;
    
    // Set styling based on type
    el.style.width = size + 'px';
    el.style.height = size + 'px';
    el.style.borderRadius = '50%';
    
    if(type === 'cyan') {
      el.style.background = 'rgba(0,255,225,0.8)';
      el.style.boxShadow = `0 0 ${size * 2}px rgba(0,255,225,0.8), 0 0 ${size * 4}px rgba(0,255,225,0.4)`;
    } else if(type === 'magenta') {
      el.style.background = 'rgba(255,68,204,0.8)';
      el.style.boxShadow = `0 0 ${size * 2}px rgba(255,68,204,0.8), 0 0 ${size * 4}px rgba(255,68,204,0.4)`;
    } else {
      el.style.background = 'rgba(255,255,255,0.6)';
      el.style.boxShadow = `0 0 ${size}px rgba(255,255,255,0.6)`;
    }
    
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.opacity = '1';
    el.style.display = 'block';
    el.style.transform = 'scale(1) rotate(0deg)';
    
    const vx = (Math.random() - 0.5) * 2.5;
    const vy = (Math.random() - 0.5) * 2.5 - 1;
    const startTime = Date.now();
    const angle = Math.random() * Math.PI * 2;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;
      
      if(progress >= 1) {
        el.style.display = 'none';
        sparkleObj.active = false;
        return;
      }
      
      const x1 = x + vx * elapsed * 0.08;
      const y1 = y + vy * elapsed * 0.08;
      const scale = 1 - progress * 0.3;
      const rotation = progress * 360;
      
      el.style.left = x1 + 'px';
      el.style.top = y1 + 'px';
      el.style.opacity = 1 - progress;
      el.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
      
      requestAnimationFrame(animate);
    };
    
    animate();
  }
})();

// Button click sparkle effect
document.querySelectorAll('.cta-primary, .cta-secondary, .link-card').forEach(element => {
  element.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    for(let i = 0; i < 8; i++) {
      setTimeout(() => {
        createClickSparkle(x, y);
      }, i * 30);
    }
  });
});

function createClickSparkle(x, y) {
  const sparkle = document.createElement('div');
  sparkle.style.position = 'fixed';
  sparkle.style.left = x + 'px';
  sparkle.style.top = y + 'px';
  sparkle.style.width = '8px';
  sparkle.style.height = '8px';
  sparkle.style.background = 'rgba(255,68,204,0.9)';
  sparkle.style.borderRadius = '50%';
  sparkle.style.pointerEvents = 'none';
  sparkle.style.zIndex = '999';
  sparkle.style.boxShadow = '0 0 15px rgba(255,68,204,0.9)';
  
  const angle = Math.random() * Math.PI * 2;
  const velocity = 2 + Math.random() * 2;
  const vx = Math.cos(angle) * velocity;
  const vy = Math.sin(angle) * velocity;
  const life = 800;
  const startTime = Date.now();
  
  document.body.appendChild(sparkle);
  
  const animate = () => {
    const elapsed = Date.now() - startTime;
    const progress = elapsed / life;
    
    if(progress >= 1) {
      sparkle.remove();
      return;
    }
    
    sparkle.style.left = (x + vx * elapsed * 0.08) + 'px';
    sparkle.style.top = (y + vy * elapsed * 0.08) + 'px';
    sparkle.style.opacity = 1 - progress;
    sparkle.style.transform = `scale(${1 - progress})`;
    requestAnimationFrame(animate);
  };
  
  animate();
}

// Page transition animation trigger
window.addEventListener('beforeunload', () => {
  document.body.style.animation = 'pageSlideUp 0.3s ease-out reverse';
});

// ============================================
// UNIQUE CREATIVE ANIMATIONS
// ============================================

// 1. Magnetic 3D Tilt Effect on Cards
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    if(window.innerWidth < 768) return; // Disable on mobile
    
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px) scale(1.02)`;
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// 2. Ripple Click Effect
document.querySelectorAll('.nav-btn, .cta-primary, .cta-secondary, .submit-btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    this.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
  });
});

// 3. Parallax Scroll Effect
let ticking = false;
window.addEventListener('scroll', () => {
  if(!ticking && window.innerWidth >= 768) {
    window.requestAnimationFrame(() => {
      const scrolled = window.scrollY;
      
      // Parallax on hero section
      const heroSection = document.querySelector('.hero-section');
      if(heroSection) {
        heroSection.style.transform = `translateY(${scrolled * 0.3}px)`;
      }
      
      // Parallax on cards
      document.querySelectorAll('.card').forEach((card, index) => {
        const speed = 0.1 + (index * 0.05);
        card.style.transform = `translateY(${scrolled * speed}px)`;
      });
      
      ticking = false;
    });
    ticking = true;
  }
});

// 4. Flying Letters Animation for Hero Title
window.addEventListener('DOMContentLoaded', () => {
  const heroTitle = document.querySelector('.hero-title');
  if(heroTitle) {
    const text = heroTitle.innerHTML;
    heroTitle.innerHTML = '';
    
    // Split text into individual letters
    const directions = ['fly-top', 'fly-bottom', 'fly-left', 'fly-right', 'fly-tl', 'fly-tr', 'fly-bl', 'fly-br'];
    let letterIndex = 0;
    
    // Parse HTML to handle span tags for name highlight
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = text;
    
    function processNode(node) {
      if(node.nodeType === Node.TEXT_NODE) {
        const chars = node.textContent.split('');
        chars.forEach((char, i) => {
          const span = document.createElement('span');
          span.className = 'letter ' + directions[letterIndex % directions.length];
          span.textContent = char;
          span.style.animationDelay = `${letterIndex * 0.05}s`;
          heroTitle.appendChild(span);
          letterIndex++;
        });
      } else if(node.nodeType === Node.ELEMENT_NODE) {
        const wrapper = document.createElement(node.tagName);
        wrapper.className = node.className;
        
        Array.from(node.childNodes).forEach(child => {
          if(child.nodeType === Node.TEXT_NODE) {
            const chars = child.textContent.split('');
            chars.forEach((char) => {
              const span = document.createElement('span');
              span.className = 'letter ' + directions[letterIndex % directions.length];
              span.textContent = char;
              span.style.animationDelay = `${letterIndex * 0.05}s`;
              wrapper.appendChild(span);
              letterIndex++;
            });
          }
        });
        
        heroTitle.appendChild(wrapper);
      }
    }
    
    Array.from(tempDiv.childNodes).forEach(node => processNode(node));
  }
});

// Old scramble text - disabled
/*
function scrambleText(element, finalText) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let iteration = 0;
  
  const interval = setInterval(() => {
    element.textContent = finalText.split('').map((char, index) => {
      if(index < iteration) {
        return finalText[index];
      }
      return characters[Math.floor(Math.random() * characters.length)];
    }).join('');
    
    if(iteration >= finalText.length) {
      clearInterval(interval);
    }
    iteration += 1 / 3;
  }, 30);
}

// Apply scramble to hero title on load
window.addEventListener('load', () => {
  const heroTitle = document.querySelector('.hero-title');
  if(heroTitle) {
    const originalText = heroTitle.textContent;
    setTimeout(() => scrambleText(heroTitle, originalText), 500);
  }
});
*/

// 5. Add shimmer text class to subtitles
document.querySelectorAll('.hero-subtitle').forEach(subtitle => {
  subtitle.classList.add('shimmer-text');
});

// 6. Typing Cursor Effect
document.querySelectorAll('.hero-description').forEach(desc => {
  desc.classList.add('typing-cursor');
});

// 7. Floating Animation for Social Icons
document.querySelectorAll('.social-btn').forEach((btn, index) => {
  btn.classList.add('floating-element');
  btn.style.animationDelay = `${index * 0.2}s`;
});

// 8. Stagger Fade for Skill Lists (removed - handled by CSS now)
// Skills already have animations via CSS

// 9. Rainbow Text on Headings
document.querySelectorAll('h2, h3').forEach(heading => {
  heading.classList.add('rainbow-text');
});

// 10. Add Quick Link Class
document.querySelectorAll('.link-card').forEach(card => {
  card.classList.add('quick-link');
});

// ============================================
// ADDITIONAL INTERACTIVE ANIMATIONS
// ============================================

// 11. Rotate Elements on Scroll
let lastScrollY = 0;
window.addEventListener('scroll', () => {
  if(window.innerWidth >= 768) {
    const scrollY = window.scrollY;
    const delta = scrollY - lastScrollY;
    
    // Rotate cert icons based on scroll
    document.querySelectorAll('.cert-icon').forEach((icon, index) => {
      const rotation = (scrollY * 0.2) + (index * 20);
      icon.style.transform = `rotate(${rotation}deg)`;
    });
    
    // Skill bullets rotate
    document.querySelectorAll('.skill-list li::before').forEach((bullet, index) => {
      const rotation = scrollY * 0.5;
      if(bullet.style) bullet.style.transform = `rotate(${rotation}deg)`;
    });
    
    lastScrollY = scrollY;
  }
});

// 12. Glitch Effect on Logo Hover
const logo = document.querySelector('.logo');
if(logo) {
  let glitchInterval;
  logo.addEventListener('mouseenter', () => {
    let count = 0;
    glitchInterval = setInterval(() => {
      logo.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
      count++;
      if(count > 10) {
        clearInterval(glitchInterval);
        logo.style.transform = '';
      }
    }, 50);
  });
}

// 13. Particle Burst on Button Click
document.querySelectorAll('.cta-primary, .cta-secondary').forEach(btn => {
  btn.addEventListener('click', (e) => {
    if(window.innerWidth < 768) return;
    
    for(let i = 0; i < 15; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.cssText = `
        position: fixed;
        width: 6px;
        height: 6px;
        background: ${i % 2 === 0 ? 'var(--neon)' : 'var(--accent)'};
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
      `;
      
      document.body.appendChild(particle);
      
      const angle = (Math.PI * 2 * i) / 15;
      const velocity = 2 + Math.random() * 3;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity;
      
      let x = e.clientX;
      let y = e.clientY;
      let opacity = 1;
      
      const animate = () => {
        x += vx;
        y += vy;
        opacity -= 0.02;
        
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.opacity = opacity;
        particle.style.transform = `scale(${opacity})`;
        
        if(opacity > 0) {
          requestAnimationFrame(animate);
        } else {
          particle.remove();
        }
      };
      
      animate();
    }
  });
});

// 14. Typewriter Effect on Hero Description (Disabled - CSS animation takes priority)
// const heroDesc = document.querySelector('.hero-description');
// if(heroDesc && window.innerWidth >= 768) {
//   const text = heroDesc.textContent;
//   heroDesc.textContent = '';
//   heroDesc.style.opacity = '1';
//   
//   let index = 0;
//   const typeSpeed = 30;
//   
//   setTimeout(() => {
//     const typeWriter = () => {
//       if(index < text.length) {
//         heroDesc.textContent += text.charAt(index);
//         index++;
//         setTimeout(typeWriter, typeSpeed);
//       }
//     };
//     typeWriter();
//   }, 1500);
// }

// 15. Color Shift on Scroll
window.addEventListener('scroll', () => {
  if(window.innerWidth >= 768) {
    const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    const hueRotate = scrollPercent * 3.6; // 0-360 degrees
    
    document.documentElement.style.setProperty('--scroll-hue', hueRotate + 'deg');
  }
});

// 16. Shake Animation on Form Error
const form = document.querySelector('.contact-form');
if(form) {
  form.addEventListener('submit', (e) => {
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      if(!input.validity.valid) {
        input.style.animation = 'jello 0.5s ease';
        setTimeout(() => {
          input.style.animation = '';
        }, 500);
      }
    });
  });
}

// 17. Infinite Bounce for Skills
document.querySelectorAll('.skill-list li').forEach((li, index) => {
  li.style.animation = `infiniteBounce 2s ease-in-out infinite`;
  li.style.animationDelay = `${index * 0.1}s`;
});

// 18. Magnetic Cursor Effect
if(window.innerWidth >= 768) {
  const magneticElements = document.querySelectorAll('.nav-btn, .cta-primary, .social-btn');
  
  magneticElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}

// 19. Scale Project Cards on Visibility
const cardObserverOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting) {
      entry.target.style.animation = 'bounceIn 0.6s ease backwards';
      cardObserver.unobserve(entry.target);
    }
  });
}, cardObserverOptions);

document.querySelectorAll('.project-card, .cert-card').forEach(card => {
  cardObserver.observe(card);
});

// 20. Add Shadow Pulse to Active Nav
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.topbar nav a').forEach(link => {
  if(link.getAttribute('href') === currentPage) {
    link.style.animation = 'shadowExpand 2s ease-in-out infinite';
  }
});

// ============================================
// FLYING LETTERS ANIMATION FOR HERO TITLE
// ============================================
window.addEventListener('load', () => {
  const heroTitle = document.querySelector('.hero-title');
  if(!heroTitle) return;
  
  // Store the original HTML including the br tag
  const originalHTML = heroTitle.innerHTML;
  heroTitle.innerHTML = '';
  heroTitle.style.minHeight = '120px'; // Prevent layout shift for 2 lines
  
  // Create a temporary div to parse HTML
  const temp = document.createElement('div');
  temp.innerHTML = originalHTML;
  
  let charIndex = 0;
  
  // Process each child node (text and br)
  temp.childNodes.forEach(node => {
    if(node.nodeType === Node.TEXT_NODE) {
      // Process text
      const text = node.textContent;
      for(let i = 0; i < text.length; i++) {
        const char = text[i];
        const span = document.createElement('span');
        
        if(char === ' ') {
          span.innerHTML = '&nbsp;';
        } else {
          span.textContent = char;
        }
        
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        span.style.whiteSpace = 'pre';
        span.style.verticalAlign = 'baseline';
        
        const directions = [
          { x: 0, y: -200 },
          { x: 200, y: 0 },
          { x: 0, y: 200 },
          { x: -200, y: 0 },
          { x: 150, y: -150 },
          { x: -150, y: -150 },
          { x: 150, y: 150 },
          { x: -150, y: 150 }
        ];
        
        const direction = directions[charIndex % directions.length];
        span.style.transform = `translate(${direction.x}px, ${direction.y}px) rotate(${Math.random() * 360}deg) scale(0)`;
        
        const delay = charIndex * 50;
        setTimeout(() => {
          span.style.transition = `all ${0.8 + Math.random() * 0.4}s cubic-bezier(0.34, 1.56, 0.64, 1)`;
          span.style.opacity = '1';
          span.style.transform = 'translate(0, 0) rotate(0deg) scale(1)';
        }, delay);
        
        heroTitle.appendChild(span);
        charIndex++;
      }
    } else if(node.nodeName === 'BR') {
      // Add line break
      heroTitle.appendChild(document.createElement('br'));
    } else if(node.nodeName === 'SPAN') {
      // Process span (name-highlight)
      const spanWrapper = document.createElement('span');
      spanWrapper.className = node.className;
      
      const text = node.textContent;
      for(let i = 0; i < text.length; i++) {
        const char = text[i];
        const span = document.createElement('span');
        
        if(char === ' ') {
          span.innerHTML = '&nbsp;';
        } else {
          span.textContent = char;
        }
        
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        span.style.whiteSpace = 'pre';
        span.style.verticalAlign = 'baseline';
        span.style.background = 'linear-gradient(90deg, var(--neon), var(--accent))';
        span.style.webkitBackgroundClip = 'text';
        span.style.webkitTextFillColor = 'transparent';
        span.style.backgroundClip = 'text';
        
        const directions = [
          { x: 0, y: -200 },
          { x: 200, y: 0 },
          { x: 0, y: 200 },
          { x: -200, y: 0 },
          { x: 150, y: -150 },
          { x: -150, y: -150 },
          { x: 150, y: 150 },
          { x: -150, y: 150 }
        ];
        
        const direction = directions[charIndex % directions.length];
        span.style.transform = `translate(${direction.x}px, ${direction.y}px) rotate(${Math.random() * 360}deg) scale(0)`;
        
        const delay = charIndex * 50;
        setTimeout(() => {
          span.style.transition = `all ${0.8 + Math.random() * 0.4}s cubic-bezier(0.34, 1.56, 0.64, 1)`;
          span.style.opacity = '1';
          span.style.transform = 'translate(0, 0) rotate(0deg) scale(1)';
        }, delay);
        
        spanWrapper.appendChild(span);
        charIndex++;
      }
      heroTitle.appendChild(spanWrapper);
    }
  });

  // 21. Social CTA text adjustments for touch vs non-touch
  (function(){
    const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
    const ctaText = isTouch ? 'Tap to connect' : 'Click to explore';

    document.querySelectorAll('.social-btn-large').forEach(btn => {
      const cta = btn.querySelector('.social-cta');
      const label = btn.querySelector('.social-label');
      if(cta) cta.textContent = ctaText;
      if(label && !btn.getAttribute('aria-label')) {
        btn.setAttribute('aria-label', label.textContent.trim());
      }
      // keep hrefs intact; clicking will still navigate
    });
  })();
  
  // Show subtitle and description after title animation
  setTimeout(() => {
    const subtitle = document.querySelector('.hero-subtitle');
    const description = document.querySelector('.hero-description');
    const cta = document.querySelector('.hero-cta');
    
    if(subtitle) {
      subtitle.style.opacity = '1';
      subtitle.style.transform = 'translateY(0)';
    }
    
    if(description) {
      description.style.opacity = '1';
      description.style.transform = 'translateY(0)';
    }
    
    if(cta) {
      cta.style.opacity = '1';
      cta.style.transform = 'translateY(0)';
    }
  }, charIndex * 50 + 500);
});



