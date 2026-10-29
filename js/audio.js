/**
 * ========================================================
 * AUDIO ENGINE (Web Audio API Synthesizer)
 * 100% Offline, Zero external dependencies, Mobile-Unblockable
 * ========================================================
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isPlayingMelody = false;
    this.melodyTimer = null;
    this.isMuted = false;
    this.noteIndex = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a gentle music box chime
  playTone(freq, duration = 0.5, type = 'sine', volume = 0.25) {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio play error", e);
    }
  }

  // Magic harp glissando when opening envelopes or flipping cards
  playGlissando() {
    if (this.isMuted || !this.ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]; // C5, E5, G5, C6, E6, G6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 0.4, 'triangle', 0.2);
      }, idx * 60);
    });
  }

  // Candle blow whoosh sound
  playBlowSound() {
    if (this.isMuted || !this.ctx) return;
    try {
      const bufferSize = this.ctx.sampleRate * 0.8;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.8);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
    } catch (e) {
      console.warn("Blow sound error", e);
    }
  }

  // Party popper pop & sparkle
  playPopper() {
    if (this.isMuted || !this.ctx) return;
    try {
      // Punchy sub-bass pop
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.frequency.setValueAtTime(180, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);

      // Chimes after pop
      setTimeout(() => this.playGlissando(), 100);
    } catch (e) {}
  }

  // Celebratory Cheer
  playCheer() {
    if (this.isMuted || !this.ctx) return;
    // Chime chords
    const chord1 = [523.25, 659.25, 783.99, 1046.50]; // C Major
    const chord2 = [587.33, 739.99, 880.00, 1174.66]; // D Major
    const chord3 = [659.25, 830.61, 987.77, 1318.51]; // E Major

    chord1.forEach(f => this.playTone(f, 0.8, 'sine', 0.15));
    setTimeout(() => chord2.forEach(f => this.playTone(f, 0.8, 'sine', 0.18)), 250);
    setTimeout(() => chord3.forEach(f => this.playTone(f, 1.2, 'sine', 0.22)), 500);
  }

  // Gentle Music-Box Happy Birthday Melody
  startBirthdayMelody() {
    if (this.isPlayingMelody) return;
    this.isPlayingMelody = true;

    // Frequencies: C4=261.63, D4=293.66, E4=329.63, F4=349.23, G4=392.00, A4=440.00, B4=493.88, C5=523.25
    // Note, duration (seconds)
    const melody = [
      { f: 261.63, d: 0.3 }, { f: 261.63, d: 0.3 }, { f: 293.66, d: 0.6 }, { f: 261.63, d: 0.6 }, { f: 349.23, d: 0.6 }, { f: 329.63, d: 1.0 }, // Happy Birthday to you
      { f: 261.63, d: 0.3 }, { f: 261.63, d: 0.3 }, { f: 293.66, d: 0.6 }, { f: 261.63, d: 0.6 }, { f: 392.00, d: 0.6 }, { f: 349.23, d: 1.0 }, // Happy Birthday to you
      { f: 261.63, d: 0.3 }, { f: 261.63, d: 0.3 }, { f: 523.25, d: 0.6 }, { f: 440.00, d: 0.6 }, { f: 349.23, d: 0.5 }, { f: 329.63, d: 0.5 }, { f: 293.66, d: 0.8 }, // Happy Birthday dear Tanya
      { f: 466.16, d: 0.3 }, { f: 466.16, d: 0.3 }, { f: 440.00, d: 0.6 }, { f: 349.23, d: 0.6 }, { f: 392.00, d: 0.6 }, { f: 349.23, d: 1.2 }  // Happy Birthday to you
    ];

    let currentStep = 0;
    const playNext = () => {
      if (!this.isPlayingMelody) return;
      const item = melody[currentStep];
      if (item) {
        this.playTone(item.f, item.d * 1.2, 'sine', 0.2);
        // Add harmonic overtone for music box twinkle
        this.playTone(item.f * 2, item.d * 0.8, 'triangle', 0.08);

        this.melodyTimer = setTimeout(() => {
          currentStep = (currentStep + 1) % melody.length;
          playNext();
        }, item.d * 900);
      }
    };

    playNext();
  }

  stopBirthdayMelody() {
    this.isPlayingMelody = false;
    if (this.melodyTimer) {
      clearTimeout(this.melodyTimer);
      this.melodyTimer = null;
    }
  }

  toggleMelody() {
    if (this.isPlayingMelody) {
      this.stopBirthdayMelody();
      return false;
    } else {
      this.init();
      this.startBirthdayMelody();
      return true;
    }
  }
}

window.soundEngine = new SoundEngine();

