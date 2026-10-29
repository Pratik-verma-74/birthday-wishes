/**
 * ========================================================
 * MAIN APPLICATION LOGIC
 * Interactive 3D Cake, 4-Year Journey, Carousel & Letters
 * ========================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const lockScreen = document.getElementById('lock-screen');
  const unlockBtn = document.getElementById('unlock-btn');
  const audioController = document.getElementById('audio-controller');
  const audioText = document.getElementById('audio-text');

  // Cake Elements
  const candleFlames = document.querySelectorAll('.flame');
  const cakeBtn = document.getElementById('cake-btn');
  const cakeStatus = document.getElementById('cake-status');

  // Envelope & Letter Elements
  const envelope = document.getElementById('envelope');
  const letterModal = document.getElementById('letter-modal');
  const letterCloseBtn = document.getElementById('letter-close-btn');

  // Gift Box Elements
  const giftBox = document.getElementById('gift-box');
  const giftStatus = document.getElementById('gift-status');

  // Carousel Elements
  const carouselCylinder = document.getElementById('carousel-cylinder');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');

  // State
  let isCandleLit = true;
  let isBlowing = false;
  let isGiftOpened = false;

  // Photo Lightbox Elements
  const photoModal = document.getElementById('photo-modal');
  const photoModalImg = document.getElementById('photo-modal-img');
  const photoModalCaption = document.getElementById('photo-modal-caption');
  const photoCloseBtn = document.getElementById('photo-close-btn');
  const photoHeartBtn = document.getElementById('photo-heart-btn');

  // 1. UNLOCK SURPRISE SCREEN
  if (unlockBtn) {
    unlockBtn.addEventListener('click', () => {
      window.soundEngine.init();
      window.soundEngine.playPopper();
      window.soundEngine.startBirthdayMelody();

      lockScreen.classList.add('unlocked');
      audioController.classList.remove('paused');
      audioText.textContent = 'Music: Playing 🎵';

      // Confetti burst
      window.triggerConfettiShower();

      setTimeout(() => {
        window.triggerHeartBlast();
      }, 500);
    });
  }

  // 2. AUDIO CONTROLLER TOGGLE
  if (audioController) {
    audioController.addEventListener('click', () => {
      const isPlaying = window.soundEngine.toggleMelody();
      if (isPlaying) {
        audioController.classList.remove('paused');
        audioText.textContent = 'Music: Playing 🎵';
      } else {
        audioController.classList.add('paused');
        audioText.textContent = 'Music: Muted 🔇';
      }
    });
  }

  // 3. 3D CAKE & CANDLE BLOW INTERACTION
  function blowCandles() {
    if (isBlowing) return;

    if (!isCandleLit) {
      // Relight candles
      candleFlames.forEach(f => f.classList.remove('extinguished'));
      isCandleLit = true;
      cakeStatus.textContent = 'Make a wish & blow the candles! 🎂';
      cakeBtn.innerHTML = '<span>🌬️</span> Blow the Candles';
      window.soundEngine.playTone(880, 0.2, 'triangle');
      return;
    }

    isBlowing = true;
    // Extinguish
    window.soundEngine.playBlowSound();
    setTimeout(() => {
      candleFlames.forEach(f => f.classList.add('extinguished'));
      window.soundEngine.playPopper();
      window.soundEngine.playCheer();
      window.triggerConfettiShower();
      window.triggerHeartBlast();

      isCandleLit = false;
      isBlowing = false;
      cakeStatus.innerHTML = '<span style="color: #ffd700; font-weight:700;">✨ Wish Granted! Happy Birthday Tanya! 🎉</span>';
      cakeBtn.innerHTML = '<span>🕯️</span> Relight Candles';
    }, 250);
  }

  if (cakeBtn) {
    cakeBtn.addEventListener('click', blowCandles);
  }
  candleFlames.forEach(flame => {
    flame.addEventListener('click', blowCandles);
  });

  // 4. 4-YEAR JOURNEY 3D FLIP CARDS
  const journeyCards = document.querySelectorAll('.journey-card-3d');
  journeyCards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
      window.soundEngine.playGlissando();
    });
  });

  // 5. 3D ROTATING PHOTO CAROUSEL (Snap-to-Card Engine)
  const cards = document.querySelectorAll('.polaroid-card');
  const dots = document.querySelectorAll('.carousel-dot');
  const totalCards = cards.length;
  const radius = 230; // 3D cylinder depth radius
  let activeIndex = 0;
  let autoTimer = null;

  function updateCardDepths() {
    cards.forEach((card, i) => {
      // Circular distance from activeIndex
      const diff = Math.abs(i - activeIndex);
      const dist = Math.min(diff, totalCards - diff);

      card.classList.remove('active-card', 'side-card', 'back-card');
      if (dist === 0) {
        card.classList.add('active-card');
      } else if (dist === 1) {
        card.classList.add('side-card');
      } else {
        card.classList.add('back-card');
      }
    });

    // Update Dots
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === activeIndex);
    });
  }

  function goToCard(index, playSound = true) {
    activeIndex = (index + totalCards) % totalCards;
    const targetAngle = -activeIndex * (360 / totalCards);
    if (carouselCylinder) {
      carouselCylinder.style.transform = `rotateY(${targetAngle}deg)`;
    }
    updateCardDepths();

    if (playSound && window.soundEngine) {
      window.soundEngine.playTone(523.25 + (activeIndex * 45), 0.15, 'triangle', 0.18);
    }
  }

  // Position cards initially in 3D space
  cards.forEach((card, i) => {
    const angle = (360 / totalCards) * i;
    card.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;

    card.addEventListener('click', () => {
      if (i === activeIndex) {
        // Open High-Res Lightbox
        window.soundEngine.playTone(659.25, 0.3, 'sine');
        window.triggerHeartBlast();

        const fullSrc = card.getAttribute('data-full') || card.querySelector('img').src;
        const captionEl = card.querySelector('.polaroid-caption');
        if (photoModal && fullSrc && captionEl) {
          photoModalImg.src = fullSrc;
          photoModalCaption.textContent = captionEl.textContent;
          photoModal.classList.add('show');
        }
      } else {
        // Snap to this card
        goToCard(i);
      }
    });
  });

  // Dots click
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => goToCard(i));
  });

  if (nextBtn) {
    nextBtn.addEventListener('click', () => goToCard(activeIndex + 1));
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => goToCard(activeIndex - 1));
  }

  // Smooth Auto-Play (Advances every 4 seconds)
  function startAutoPlay() {
    stopAutoPlay();
    autoTimer = setInterval(() => {
      goToCard(activeIndex + 1, false);
    }, 4000);
  }

  function stopAutoPlay() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  // Touch Swipe for Carousel
  let startX = 0;
  let startY = 0;
  let isSwiping = false;
  const carouselViewport = document.getElementById('carousel-viewport');

  if (carouselViewport) {
    carouselViewport.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isSwiping = true;
        stopAutoPlay();
      }
    }, { passive: true });

    carouselViewport.addEventListener('touchmove', (e) => {
      if (!isSwiping || e.touches.length !== 1) return;
      const diffX = e.touches[0].clientX - startX;
      const diffY = e.touches[0].clientY - startY;

      // Only trigger if horizontal swipe is greater than vertical scroll
      if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) {
          goToCard(activeIndex - 1);
        } else {
          goToCard(activeIndex + 1);
        }
        isSwiping = false;
      }
    }, { passive: true });

    carouselViewport.addEventListener('touchend', () => {
      isSwiping = false;
      startAutoPlay();
    });

    carouselViewport.addEventListener('mouseenter', stopAutoPlay);
    carouselViewport.addEventListener('mouseleave', startAutoPlay);
  }

  // Initialize first state
  goToCard(0, false);
  startAutoPlay();

  // 6. 3D WAX SEALED ENVELOPE & LETTER MODAL
  if (envelope) {
    envelope.addEventListener('click', () => {
      envelope.classList.add('open');
      window.soundEngine.playGlissando();
      window.soundEngine.playTone(880, 0.4, 'sine');

      setTimeout(() => {
        letterModal.classList.add('show');
        window.triggerHeartBlast();
      }, 600);
    });
  }

  if (letterCloseBtn) {
    letterCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      letterModal.classList.remove('show');
      setTimeout(() => {
        envelope.classList.remove('open');
      }, 300);
    });
  }

  // Close letter if clicked outside paper
  if (letterModal) {
    letterModal.addEventListener('click', (e) => {
      if (e.target === letterModal) {
        letterModal.classList.remove('show');
        setTimeout(() => {
          envelope.classList.remove('open');
        }, 300);
      }
    });
  }

  // 7. SURPRISE GIFT BOX
  if (giftBox) {
    giftBox.addEventListener('click', () => {
      giftBox.classList.add('opened');
      window.soundEngine.playPopper();
      window.soundEngine.playCheer();
      window.triggerConfettiShower();
      window.triggerHeartBlast();

      if (giftStatus) {
        giftStatus.innerHTML = '<span style="color: #ffd700; font-weight:700;">🎁 Surprise Unlocked: You are Truly the Best Friend! 💖</span>';
      }
    });
  }

  // 8. PHOTO LIGHTBOX MODAL HANDLERS
  if (photoCloseBtn) {
    photoCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      photoModal.classList.remove('show');
    });
  }

  if (photoModal) {
    photoModal.addEventListener('click', (e) => {
      if (e.target === photoModal) {
        photoModal.classList.remove('show');
      }
    });
  }

  if (photoHeartBtn) {
    photoHeartBtn.addEventListener('click', () => {
      window.soundEngine.playTone(783.99, 0.25, 'triangle');
      window.triggerHeartBlast();
      window.triggerConfettiShower();
      photoHeartBtn.innerHTML = '<span>💖</span> Sent With Love! ✨';
      setTimeout(() => {
        photoHeartBtn.innerHTML = '<span>💖</span> Tap to Send Love';
      }, 1500);
    });
  }

  // 9. INTERACTIVE COMPLIMENT PILLS
  const pills = document.querySelectorAll('.compliment-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      window.soundEngine.playTone(783.99, 0.2, 'triangle');
      window.triggerHeartBlast();
    });
  });
});
