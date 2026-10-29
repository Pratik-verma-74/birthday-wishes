/**
 * ========================================================
 * TOUCH SPARKLES & CELEBRATION FIREWORKS
 * High-performance 2D Canvas touch particle emitter
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

  const particles = [];
  const colors = ['#f7a8b8', '#f9d423', '#ff2a85', '#ffd1dc', '#ffffff', '#e0b0ff'];

  class Sparkle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 4;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.size = 2 + Math.random() * 4;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.life = 1;
      this.decay = 0.02 + Math.random() * 0.03;
      this.isHeart = Math.random() > 0.65;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.05; // gentle gravity
      this.life -= this.decay;
    }

    draw(ctx) {
      if (this.life <= 0) return;
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.life);
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 8;

      if (this.isHeart) {
        // Draw miniature heart
        ctx.translate(this.x, this.y);
        ctx.scale(this.size * 0.25, this.size * 0.25);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-3, -3, -6, 1, 0, 6);
        ctx.bezierCurveTo(6, 1, 3, -3, 0, 0);
        ctx.fill();
      } else {
        // Draw star sparkle
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  function emitSparkles(x, y, count = 12) {
    if (particles.length > 120) {
      particles.splice(0, count);
    }
    for (let i = 0; i < count; i++) {
      particles.push(new Sparkle(x, y));
    }
  }

  // Pointer events
  window.addEventListener('pointerdown', (e) => {
    emitSparkles(e.clientX, e.clientY, 15);
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0 && Math.random() > 0.4) {
      emitSparkles(e.touches[0].clientX, e.touches[0].clientY, 3);
    }
  }, { passive: true });

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw(ctx);
      if (p.life <= 0) {
        particles.splice(i, 1);
      }
    }

    requestAnimationFrame(render);
  }

  render();

  // Expose celebration triggers
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
  };
})();
