/**
 * soundEffects.js
 * ═══════════════════════════════════════════════════════════════
 * Procedural Web Audio API sound synthesizer.
 * Generates arcade-quality sound FX on-the-fly without external audio assets.
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

  // ─── Pop / Click UI sound ──────────────────────────────────
  playPop() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  // ─── Drag Tone (Pitch scales with size/volume) ─────────────
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

      this.dragOsc.type = 'triangle';
      this.dragOsc.frequency.setValueAtTime(Math.max(120, Math.min(1200, freq)), this.ctx.currentTime);

      this.dragGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      this.dragGain.gain.linearRampToValueAtTime(0.06, this.ctx.currentTime + 0.04);

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
    const targetFreq = Math.max(120, Math.min(1200, freq));
    this.dragOsc.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.03);
  }

  stopDragTone() {
    if (!this.dragGain || !this.ctx) return;
    try {
      this.dragGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
      const osc = this.dragOsc;
      setTimeout(() => {
        try {
          osc?.stop();
          osc?.disconnect();
        } catch {
          // ignore
        }
      }, 60);
    } catch {
      // ignore
    }
    this.dragOsc = null;
    this.dragGain = null;
  }

  // ─── Snap tick ─────────────────────────────────────────────
  playSnap() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(900, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.03);

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

    const notes = [987.77, 1318.51]; // B5, E6
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.08);

      gain.gain.setValueAtTime(0, this.ctx.currentTime + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + i * 0.08 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.08 + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + i * 0.08);
      osc.stop(this.ctx.currentTime + i * 0.08 + 0.3);
    });
  }

  // ─── Success Chime ─────────────────────────────────────────
  playSuccess() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const chord = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    chord.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.06);

      gain.gain.setValueAtTime(0, this.ctx.currentTime + i * 0.06);
      gain.gain.linearRampToValueAtTime(0.15, this.ctx.currentTime + i * 0.06 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.06 + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + i * 0.06);
      osc.stop(this.ctx.currentTime + i * 0.06 + 0.6);
    });
  }

  // ─── Fanfare / Level Up Arpeggio ───────────────────────────
  playFanfare() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const melody = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
    melody.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.1);

      gain.gain.setValueAtTime(0, this.ctx.currentTime + i * 0.1);
      gain.gain.linearRampToValueAtTime(0.18, this.ctx.currentTime + i * 0.1 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.1 + 0.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + i * 0.1);
      osc.stop(this.ctx.currentTime + i * 0.1 + 0.8);
    });
  }

  // ─── Error Bop ─────────────────────────────────────────────
  playError() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  // ─── Robot Mascot Chirp ────────────────────────────────────
  playRobotChirp() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.linearRampToValueAtTime(1200, now + 0.04);
    osc.frequency.linearRampToValueAtTime(800, now + 0.08);
    osc.frequency.linearRampToValueAtTime(1400, now + 0.14);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(now + 0.15);
  }
}

export const sound = new SoundEngine();
export default sound;
