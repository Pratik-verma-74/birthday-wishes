/**
 * ========================================================
 * DIWALI FIREWORKS & ROCKET SIMULATION ENGINE
 * Authentic Rocket Soar Trails, Willow Sparks, Heart Bursts
 * High-performance Canvas Engine with 60fps Physics & Motion Blur
 * ========================================================
 */

(function () {
  const canvas = document.getElementById('sparkle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // State
  const rockets = [];
  const particles = [];
  const MAX_PARTICLES = 450;

  // Festive Diwali Palette
  const colorPalettes = [
    ['#ffd700', '#ffa500', '#ff4500', '#ffffff'], // Golden Sparkle / Anar
    ['#ff2a85', '#ff758c', '#ffd1dc', '#ffffff'], // Rose Ruby (Tanya Special)
    ['#00f5d4', '#7b2cbf', '#9d4edd', '#ffffff'], // Cosmic Cyan & Purple
    ['#f9d423', '#ff4e50', '#f7a8b8', '#ffeaa7'], // Sunset Flame
    ['#52b788', '#74c69d', '#ffd700', '#ffffff']  // Emerald Green & Gold
  ];

  // 1. ROCKET CLASS (Shoots from bottom with glowing trail)
  class Rocket {
    constructor(startX, startY, targetX, targetY, palette) {
      this.x = startX;
      this.y = startY;
      this.targetX = targetX;
      this.targetY = targetY;
      this.palette = palette || colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
      this.primaryColor = this.palette[0];

      // Calculate velocity vector
      const dx = targetX - startX;
      const dy = targetY - startY;
      const distance = Math.hypot(dx, dy);
      const speed = 12 + Math.random() * 5;

      this.vx = (dx / distance) * speed;
      this.vy = (dy / distance) * speed;
      this.trail = [];
      this.exploded = false;
      this.type = Math.random() > 0.4 ? 'willow' : (Math.random() > 0.5 ? 'heart' : 'peony');
    }

    update() {
      // Record trail
      this.trail.push({ x: this.x, y: this.y, alpha: 1 });
      if (this.trail.length > 8) this.trail.shift();

      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.08; // subtle deceleration

      // Check apex or target reached
      if (this.vy >= -1.5 || this.y <= this.targetY) {
        this.explode();
      }
    }

    draw(ctx) {
      ctx.save();
      // Draw glowing trail
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.strokeStyle = this.primaryColor;
      ctx.shadowColor = this.primaryColor;
      ctx.shadowBlur = 10;

      for (let i = 0; i < this.trail.length - 1; i++) {
        const p1 = this.trail[i];
        const p2 = this.trail[i + 1];
        ctx.globalAlpha = (i + 1) / this.trail.length;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }

      // Rocket tip
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    explode() {
      this.exploded = true;
      createExplosion(this.x, this.y, this.palette, this.type);

      // Play subtle soft pop/chime
      if (window.soundEngine && Math.random() > 0.5) {
        window.soundEngine.playTone(400 + Math.random() * 600, 0.12, 'triangle', 0.05);
      }
    }
  }

  // 2. EXPLOSION PARTICLE CLASS
  class Particle {
    constructor(x, y, vx, vy, color, isWillow = false) {
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      this.color = color;
      this.alpha = 1;
      this.isWillow = isWillow;
      this.decay = isWillow ? (0.012 + Math.random() * 0.015) : (0.02 + Math.random() * 0.025);
      this.gravity = isWillow ? 0.06 : 0.04;
      this.friction = isWillow ? 0.97 : 0.95;
      this.size = 2 + Math.random() * 2.5;
      this.flicker = Math.random() > 0.3;
    }

    update() {
      this.vx *= this.friction;
      this.vy *= this.friction;
      this.vy += this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.decay;
    }

    draw(ctx) {
      if (this.alpha <= 0) return;
      ctx.save();
      const currentAlpha = this.flicker && Math.random() > 0.4 ? this.alpha * 0.5 : this.alpha;
      ctx.globalAlpha = Math.max(0, currentAlpha);
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 8;

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Create different Diwali burst patterns
  function createExplosion(x, y, palette, type) {
    const count = type === 'willow' ? 65 : 50;

    if (particles.length + count > MAX_PARTICLES) {
      particles.splice(0, count);
    }

    if (type === 'heart') {
      // Heart shaped blast for Tanya
      for (let i = 0; i < count; i++) {
        const t = (Math.PI * 2 * i) / count;
        // Parametric heart: x = 16 sin^3(t), y = 13 cos(t) - 5 cos(2t) - 2 cos(3t) - cos(4t)
        const hx = 16 * Math.pow(Math.sin(t), 3);
        const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        const speed = 0.22 + Math.random() * 0.08;
        const color = palette[Math.floor(Math.random() * palette.length)];
        particles.push(new Particle(x, y, hx * speed, hy * speed, color, false));
      }
    } else {
      // Radial Peony / Golden Willow blast
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = (type === 'willow' ? 2 : 4) + Math.random() * (type === 'willow' ? 5 : 6);
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        const color = palette[Math.floor(Math.random() * palette.length)];
        particles.push(new Particle(x, y, vx, vy, color, type === 'willow'));
      }
    }
  }

  // 3. LAUNCH ROCKET HELPER
  function launchRocket(targetX, targetY) {
    const startX = targetX !== undefined 
      ? (targetX + (Math.random() - 0.5) * 60) 
      : (Math.random() * width);
    const startY = height + 10;
    const destX = targetX !== undefined 
      ? targetX 
      : (width * 0.15 + Math.random() * width * 0.7);
    const destY = targetY !== undefined 
      ? targetY 
      : (height * 0.12 + Math.random() * height * 0.45);

    rockets.push(new Rocket(startX, startY, destX, destY));
  }

  // 4. PERIODIC AUTO LAUNCH (Continuous Diwali Festival)
  let autoRocketTimer = null;
  function startAutoRockets() {
    function scheduleNext() {
      const delay = 1400 + Math.random() * 1600; // Launch every 1.5 - 3 seconds
      autoRocketTimer = setTimeout(() => {
        // Launch single or double rockets
        launchRocket();
        if (Math.random() > 0.6) {
          setTimeout(() => launchRocket(), 300);
        }
        scheduleNext();
      }, delay);
    }
    scheduleNext();
  }

  startAutoRockets();

  // 5. TOUCH & CLICK INTERACTIVE ROCKETS
  window.addEventListener('pointerdown', (e) => {
    // Only launch interactive rocket if not clicking a button/card action directly
    const target = e.target;
    const isInteractive = target.closest('button') || target.closest('.journey-card-3d') || target.closest('.envelope') || target.closest('.polaroid-card');
    
    // Launch celebratory rocket towards touch point
    launchRocket(e.clientX, e.clientY);

    // Also emit small sparkle burst at finger
    for (let i = 0; i < 10; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3;
      particles.push(new Particle(
        e.clientX, 
        e.clientY, 
        Math.cos(angle) * speed, 
        Math.sin(angle) * speed, 
        '#ffd700', 
        false
      ));
    }
  }, { passive: true });

  // 6. MAIN ANIMATION LOOP
  let isTabActive = true;
  document.addEventListener('visibilitychange', () => {
    isTabActive = !document.hidden;
  });

  function render() {
    if (isTabActive) {
      // Clear with slight alpha for realistic luminous motion trails
      ctx.clearRect(0, 0, width, height);

      // Update & Draw Rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.update();
        r.draw(ctx);
        if (r.exploded) {
          rockets.splice(i, 1);
        }
      }

      // Update & Draw Explosion Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);
        if (p.alpha <= 0) {
          particles.splice(i, 1);
        }
      }
    }

    requestAnimationFrame(render);
  }

  render();

  // Global triggers
  window.launchFestiveRocket = launchRocket;

  window.triggerGrandDiwaliShow = function () {
    // Launch sequence of 6 rockets
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        launchRocket(width * (0.15 + i * 0.14), height * (0.15 + Math.random() * 0.25));
      }, i * 260);
    }
  };

  window.triggerConfettiShower = function () {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.65 },
        colors: ['#ff2a85', '#f9d423', '#9b51e0', '#f7a8b8', '#ffffff']
      });

      // Side fireworks cannons
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 60,
          origin: { x: 0, y: 0.7 }
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 60,
          origin: { x: 1, y: 0.7 }
        });
      }, 300);
    }
    // Also launch real rockets alongside confetti
    window.triggerGrandDiwaliShow();
  };

  window.triggerHeartBlast = function () {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 60,
        spread: 100,
        shapes: ['circle'],
        scalar: 1.2,
        colors: ['#ff2a85', '#ffd1dc', '#ff5e62']
      });
    }
    // Launch a special heart rocket
    launchRocket(width * 0.5, height * 0.3);
  };
})();
