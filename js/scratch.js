/**
 * ========================================================
 * GOLDEN SCRATCH CARDS ENGINE
 * Authentic scratch-off lottery interaction with golden foil
 * ========================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const scratchBoxes = document.querySelectorAll('.scratch-card-box');
  if (!scratchBoxes.length) return;

  scratchBoxes.forEach((box) => {
    const canvas = box.querySelector('.scratch-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const label = canvas.getAttribute('data-label') || '🪙 Scratch to Reveal ✨';

    let isDrawing = false;
    let isRevealed = false;
    let width, height;

    function initFoil() {
      const rect = box.getBoundingClientRect();
      width = rect.width || 320;
      height = rect.height || 180;

      // Handle High DPI displays
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.scale(dpr, dpr);

      // 1. Draw Luxurious Metallic Gold Gradient
      const goldGrad = ctx.createLinearGradient(0, 0, width, height);
      goldGrad.addColorStop(0, '#f9d423');
      goldGrad.addColorStop(0.25, '#ff4e50');
      goldGrad.addColorStop(0.5, '#f9d423');
      goldGrad.addColorStop(0.75, '#ffeaa7');
      goldGrad.addColorStop(1, '#d49a17');

      ctx.fillStyle = goldGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Add Shimmering Foil Pattern Dots
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      for (let i = 0; i < 40; i++) {
        ctx.beginPath();
        ctx.arc(
          Math.random() * width,
          Math.random() * height,
          1 + Math.random() * 2,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }

      // 3. Draw Golden Border Inset
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 3;
      ctx.strokeRect(8, 8, width - 16, height - 16);

      // 4. Centered Scratch Text
      ctx.fillStyle = '#3a1f04';
      ctx.font = 'bold 16px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
      ctx.shadowBlur = 4;
      ctx.fillText(label, width / 2, height / 2);
      ctx.shadowBlur = 0;

      // Subtitle
      ctx.font = '500 12px "Outfit", sans-serif';
      ctx.fillStyle = '#553006';
      ctx.fillText('Scratch with your finger to unlock!', width / 2, height / 2 + 25);
    }

    // Initialize on layout ready
    setTimeout(initFoil, 100);
    window.addEventListener('resize', () => {
      if (!isRevealed) initFoil();
    });

    function getCoords(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    }

    let lastX = null, lastY = null;
    let totalScratchDistance = 0;

    function scratch(x, y) {
      if (isRevealed) return;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 24, 0, Math.PI * 2);
      ctx.fill();

      if (lastX !== null && lastY !== null) {
        const dist = Math.hypot(x - lastX, y - lastY);
        totalScratchDistance += dist;
      }
      lastX = x;
      lastY = y;

      // Ultra-fast zero-lag threshold (No expensive getImageData)
      if (totalScratchDistance > 550 && !isRevealed) {
        revealCard();
      }
    }

    function revealCard() {
      isRevealed = true;
      canvas.style.transition = 'opacity 0.5s ease';
      canvas.style.opacity = '0';
      setTimeout(() => {
        canvas.style.pointerEvents = 'none';
      }, 500);

      // Celebrate
      if (window.soundEngine) {
        window.soundEngine.playPopper();
        window.soundEngine.playGlissando();
      }
      if (window.triggerHeartBlast) {
        window.triggerHeartBlast();
      }
    }

    // Touch & Pointer events
    canvas.addEventListener('pointerdown', (e) => {
      isDrawing = true;
      const { x, y } = getCoords(e);
      lastX = x;
      lastY = y;
      scratch(x, y);
      if (window.soundEngine) {
        window.soundEngine.playTone(600 + Math.random() * 200, 0.05, 'triangle', 0.05);
      }
    });

    canvas.addEventListener('pointermove', (e) => {
      if (!isDrawing) return;
      const { x, y } = getCoords(e);
      scratch(x, y);
    });

    window.addEventListener('pointerup', () => {
      isDrawing = false;
      lastX = null;
      lastY = null;
    });

    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      isDrawing = true;
      const { x, y } = getCoords(e);
      lastX = x;
      lastY = y;
      scratch(x, y);
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (!isDrawing) return;
      const { x, y } = getCoords(e);
      scratch(x, y);
    }, { passive: false });

    canvas.addEventListener('touchend', () => {
      isDrawing = false;
      lastX = null;
      lastY = null;
    });
  });
});

