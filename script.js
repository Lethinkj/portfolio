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

// cursor follower
const dot = document.createElement('div'); dot.className='cursor-dot';
const ring = document.createElement('div'); ring.className='cursor-ring';
document.body.appendChild(dot); document.body.appendChild(ring);
let mouse = {x: w/2, y: h/2};
let pos = {x:mouse.x, y:mouse.y};
let ringTarget = {x:mouse.x, y:mouse.y};

window.addEventListener('mousemove',(e)=>{
  mouse.x = e.clientX; mouse.y = e.clientY;
});

function ease(a,b,n){return (1-n)*a + n*b}

function loop(){
  pos.x = ease(pos.x, mouse.x, 0.22);
  pos.y = ease(pos.y, mouse.y, 0.22);
  ringTarget.x = ease(ringTarget.x, mouse.x, 0.08);
  ringTarget.y = ease(ringTarget.y, mouse.y, 0.08);

  dot.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%,-50%)`;
  ring.style.transform = `translate(${ringTarget.x}px, ${ringTarget.y}px) translate(-50%,-50%)`;

  requestAnimationFrame(loop);
}

// subtle clicks
window.addEventListener('mousedown', ()=>{ dot.style.transform += ' scale(0.7)'; setTimeout(()=>{dot.style.transform = dot.style.transform.replace(' scale(0.7)','');},120); });

// reduced-motion respect
if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  // remove heavy animations
  document.querySelectorAll('.cursor-dot, .cursor-ring').forEach(n=>n.remove());
  particles.length = 0;
} else {
  draw(); loop();
}

// set year
document.getElementById('year').textContent = new Date().getFullYear();

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

// 4. Text Scramble Effect on Page Load
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

// 8. Stagger Fade for Skill Lists
document.querySelectorAll('.skill-list li').forEach(li => {
  li.classList.add('stagger-fade');
});

// 9. Rainbow Text on Headings
document.querySelectorAll('h2, h3').forEach(heading => {
  heading.classList.add('rainbow-text');
});

// 10. Add Quick Link Class
document.querySelectorAll('.link-card').forEach(card => {
  card.classList.add('quick-link');
});
