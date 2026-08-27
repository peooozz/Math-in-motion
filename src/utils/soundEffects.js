/**
 * soundEffects.js
 * ═══════════════════════════════════════════════════════════════
 * Child-Friendly Procedural Audio Engine.
 * Generates warm marimba/kalimba notes, bubble pops, water pour effects,
 * laser blade hums, and cheerful star fanfares on-the-fly.
 * ═══════════════════════════════════════════════════════════════
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.dragOsc = null;
    this.dragGain = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setEnabled(val) {
    this.enabled = val;
    if (!val && this.dragGain) {
      this.stopDragTone();
    }
  }

  // ─── Playful Bubble Pop ────────────────────────────────────
  playPop() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1040, this.ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  // ─── Marimba Note on Drag / Step ───────────────────────────
  playMarimba(freq = 440) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.14, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.18);
  }

  // ─── Continuous Drag Pitch Tone ────────────────────────────
  startDragTone(freq = 300) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    if (this.dragOsc) {
      this.updateDragPitch(freq);
      return;
    }

    try {
      this.dragOsc = this.ctx.createOscillator();
      this.dragGain = this.ctx.createGain();

      this.dragOsc.type = 'sine';
      this.dragOsc.frequency.setValueAtTime(Math.max(150, Math.min(1000, freq)), this.ctx.currentTime);

      this.dragGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      this.dragGain.gain.linearRampToValueAtTime(0.05, this.ctx.currentTime + 0.03);

      this.dragOsc.connect(this.dragGain);
      this.dragGain.connect(this.ctx.destination);

      this.dragOsc.start();
    } catch {
      this.dragOsc = null;
      this.dragGain = null;
    }
  }

  updateDragPitch(freq = 300) {
    if (!this.enabled || !this.dragOsc || !this.ctx) return;
    const targetFreq = Math.max(150, Math.min(1000, freq));
    this.dragOsc.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.03);
  }

  stopDragTone() {
    if (!this.dragGain || !this.ctx) return;
    try {
      this.dragGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      const osc = this.dragOsc;
      setTimeout(() => {
        try {
          osc?.stop();
          osc?.disconnect();
        } catch {
          // ignore
        }
      }, 50);
    } catch {
      // ignore
    }
    this.dragOsc = null;
    this.dragGain = null;
  }

  // ─── Water Pouring Effect (Magic Pour Lab) ─────────────────
  playPour() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    for (let i = 0; i < 6; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      const startFreq = 400 + Math.random() * 300;
      const endFreq = 200 + Math.random() * 150;
      const delay = i * 0.05;

      osc.frequency.setValueAtTime(startFreq, this.ctx.currentTime + delay);
      osc.frequency.exponentialRampToValueAtTime(endFreq, this.ctx.currentTime + delay + 0.1);

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + delay + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + delay);
      osc.stop(this.ctx.currentTime + delay + 0.12);
    }
  }

  // ─── Laser Slicer Sound ────────────────────────────────────
  playLaserSlice() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  // ─── Snap Tick ─────────────────────────────────────────────
  playSnap() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(350, this.ctx.currentTime + 0.03);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.03);
  }

  // ─── Coin / Gem Ding ───────────────────────────────────────
  playCoin() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const notes = [987.77, 1318.51];
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.08);

      gain.gain.setValueAtTime(0, this.ctx.currentTime + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + i * 0.08 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.08 + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + i * 0.08);
      osc.stop(this.ctx.currentTime + i * 0.08 + 0.25);
    });
  }

  // ─── Success Chime ─────────────────────────────────────────
  playSuccess() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const chord = [523.25, 659.25, 783.99, 1046.5];
    chord.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.06);

      gain.gain.setValueAtTime(0, this.ctx.currentTime + i * 0.06);
      gain.gain.linearRampToValueAtTime(0.14, this.ctx.currentTime + i * 0.06 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.06 + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + i * 0.06);
      osc.stop(this.ctx.currentTime + i * 0.06 + 0.5);
    });
  }

  // ─── Celebration Fanfare ───────────────────────────────────
  playFanfare() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const melody = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    melody.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.09);

      gain.gain.setValueAtTime(0, this.ctx.currentTime + i * 0.09);
      gain.gain.linearRampToValueAtTime(0.16, this.ctx.currentTime + i * 0.09 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.09 + 0.7);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + i * 0.09);
      osc.stop(this.ctx.currentTime + i * 0.09 + 0.7);
    });
  }

  // ─── Error Boing ───────────────────────────────────────────
  playError() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.18);

    gain.gain.setValueAtTime(0.09, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.18);
  }

  // ─── Cheerful Robot Chirp ──────────────────────────────────
  playRobotChirp() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.linearRampToValueAtTime(1100, now + 0.04);
    osc.frequency.linearRampToValueAtTime(800, now + 0.08);
    osc.frequency.linearRampToValueAtTime(1300, now + 0.13);

    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(now + 0.14);
  }
}

export const sound = new SoundEngine();
export default sound;
