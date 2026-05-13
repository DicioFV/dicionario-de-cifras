// ═══════════════════════════════════════════════════════════
//  WEB AUDIO ENGINE — Realistic Piano Synthesis with ADSR
// ═══════════════════════════════════════════════════════════

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private reverbGain: GainNode | null = null;
  private volume: number = 0.5;
  private activeNotes: Map<number, { oscillators: OscillatorNode[]; gainNode: GainNode; stopTimer: ReturnType<typeof setTimeout> | null }> = new Map();

  private ensureContext(): AudioContext {
    if (!this.ctx || this.ctx.state === 'closed') {
      this.ctx = new AudioContext();

      // Compressor for dynamics
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.value = -20;
      this.compressor.knee.value = 30;
      this.compressor.ratio.value = 8;
      this.compressor.attack.value = 0.003;
      this.compressor.release.value = 0.15;

      // Master volume
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.volume;

      // Simple reverb via delay feedback
      const reverbDelay = this.ctx.createDelay(0.5);
      reverbDelay.delayTime.value = 0.08;
      const reverbFeedback = this.ctx.createGain();
      reverbFeedback.gain.value = 0.2;
      this.reverbGain = this.ctx.createGain();
      this.reverbGain.gain.value = 0.12;

      // Main signal path
      this.compressor.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      // Reverb path
      this.compressor.connect(reverbDelay);
      reverbDelay.connect(reverbFeedback);
      reverbFeedback.connect(reverbDelay);
      reverbDelay.connect(this.reverbGain);
      this.reverbGain.connect(this.masterGain);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain) {
      this.masterGain.gain.value = this.volume;
    }
  }

  getVolume(): number {
    return this.volume;
  }

  private midiToFreq(midi: number): number {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  playNote(midi: number, velocity: number = 0.7, duration: number = 1.8) {
    const ctx = this.ensureContext();
    const freq = this.midiToFreq(midi);
    const now = ctx.currentTime;

    // Stop if already playing
    this.stopNote(midi);

    // Note envelope gain
    const noteGain = ctx.createGain();
    noteGain.gain.value = 0;
    noteGain.connect(this.compressor!);

    const oscillators: OscillatorNode[] = [];

    // Piano-like harmonics structure
    const harmonics = [
      { ratio: 1, amp: 0.45, type: 'sine' as OscillatorType, detune: 0 },
      { ratio: 1, amp: 0.15, type: 'triangle' as OscillatorType, detune: 2 },
      { ratio: 2, amp: 0.2, type: 'sine' as OscillatorType, detune: -1 },
      { ratio: 3, amp: 0.08, type: 'sine' as OscillatorType, detune: 1 },
      { ratio: 4, amp: 0.04, type: 'sine' as OscillatorType, detune: -2 },
      { ratio: 5, amp: 0.02, type: 'sine' as OscillatorType, detune: 0.5 },
      { ratio: 6, amp: 0.01, type: 'sine' as OscillatorType, detune: -0.3 },
    ];

    // Brightness adjustment based on register
    const brightFactor = midi > 72 ? 0.7 : midi > 60 ? 1.0 : 1.3;

    harmonics.forEach(h => {
      const osc = ctx.createOscillator();
      const hGain = ctx.createGain();
      osc.type = h.type;
      osc.frequency.value = freq * h.ratio;
      osc.detune.value = h.detune + (Math.random() - 0.5) * 3;

      // Higher harmonics decay faster in higher register
      const harmAmp = h.amp * brightFactor * (h.ratio > 3 ? 0.5 : 1);
      hGain.gain.value = harmAmp;

      osc.connect(hGain);
      hGain.connect(noteGain);
      osc.start(now);
      osc.stop(now + duration + 1.5);
      oscillators.push(osc);
    });

    // ADSR Envelope
    const attack = 0.004;
    const decay = midi > 72 ? 0.15 : 0.35;
    const sustainLevel = Math.max(0.001, velocity * 0.25);
    const release = midi > 72 ? 0.5 : 0.9;

    noteGain.gain.setValueAtTime(0, now);
    noteGain.gain.linearRampToValueAtTime(velocity * 0.55, now + attack);
    noteGain.gain.exponentialRampToValueAtTime(sustainLevel, now + attack + decay);
    noteGain.gain.setValueAtTime(sustainLevel, now + duration);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration + release);

    const stopTimer = setTimeout(() => {
      this.activeNotes.delete(midi);
    }, (duration + release + 0.2) * 1000);

    this.activeNotes.set(midi, { oscillators, gainNode: noteGain, stopTimer });
  }

  stopNote(midi: number) {
    const note = this.activeNotes.get(midi);
    if (note) {
      if (note.stopTimer) clearTimeout(note.stopTimer);
      const ctx = this.ensureContext();
      const now = ctx.currentTime;
      try {
        note.gainNode.gain.cancelScheduledValues(now);
        note.gainNode.gain.setValueAtTime(Math.max(note.gainNode.gain.value, 0.0001), now);
        note.gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
      } catch { /* ignore */ }
      setTimeout(() => {
        note.oscillators.forEach(o => { try { o.stop(); } catch { /* */ } });
      }, 120);
      this.activeNotes.delete(midi);
    }
  }

  playChord(midiNotes: number[], velocity: number = 0.55) {
    // Slight stagger for realism
    midiNotes.forEach((midi, i) => {
      setTimeout(() => this.playNote(midi, velocity, 2.2), i * 12);
    });
  }

  async playArpeggio(midiNotes: number[], speed: number = 200, velocity: number = 0.65) {
    for (let i = 0; i < midiNotes.length; i++) {
      this.playNote(midiNotes[i], velocity, 1.5);
      await new Promise(r => setTimeout(r, speed));
    }
  }

  async playScale(midiNotes: number[], speed: number = 250) {
    // Ascending
    for (let i = 0; i < midiNotes.length; i++) {
      this.playNote(midiNotes[i], 0.55, 0.7);
      await new Promise(r => setTimeout(r, speed));
    }
    // Descending
    for (let i = midiNotes.length - 2; i >= 0; i--) {
      this.playNote(midiNotes[i], 0.55, 0.7);
      await new Promise(r => setTimeout(r, speed));
    }
  }

  stopAll() {
    this.activeNotes.forEach((_, midi) => this.stopNote(midi));
  }
}

export const audioEngine = new AudioEngine();
