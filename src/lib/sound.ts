/**
 * Procedural Audio Synthesizer (ZzFX architecture)
 * Pure Web Audio API math - 0KB audio assets, zero network latency.
 */

class SoundEngine {
  private ctx: AudioContext | null = null
  private enabled: boolean = true
  private volume: number = 0.35

  constructor() {
    // Lazy AudioContext initialization on first user interaction
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
    return this.ctx
  }

  public setEnabled(val: boolean) {
    this.enabled = val
  }

  public isEnabled(): boolean {
    return this.enabled
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol))
  }

  /**
   * Generates a procedural sound with frequency curve and ADSR envelope
   */
  private synthesize(
    startFreq: number,
    endFreq: number,
    duration: number,
    type: OscillatorType = 'sine',
    gainMultiplier = 1
  ) {
    if (!this.enabled) return
    const ctx = this.getContext()
    if (!ctx) return

    try {
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = type
      osc.frequency.setValueAtTime(startFreq, now)
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), now + duration)

      const masterGain = this.volume * gainMultiplier
      gain.gain.setValueAtTime(0.001, now)
      gain.gain.linearRampToValueAtTime(masterGain, now + 0.015)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + duration)
    } catch {
      // Audio autoplay policy fallback
    }
  }

  /**
   * Crisp tactile click for button presses and navigation items
   */
  public playClick() {
    this.synthesize(480, 240, 0.04, 'triangle', 0.4)
  }

  /**
   * Rewarding ascending harmonic chime for task completion
   */
  public playComplete() {
    if (!this.enabled) return
    const ctx = this.getContext()
    if (!ctx) return

    const notes = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6 major chord
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.synthesize(freq, freq * 1.02, 0.14, 'sine', 0.5)
      }, idx * 45)
    })
  }

  /**
   * Subtle descending tap for unchecking a task
   */
  public playUncheck() {
    this.synthesize(420, 280, 0.05, 'sine', 0.35)
  }

  /**
   * Crisp airy pop for opening modals and Command Palette (Ctrl+K)
   */
  public playOpen() {
    this.synthesize(320, 580, 0.08, 'sine', 0.45)
  }

  /**
   * Soft dismiss sound for closing modals
   */
  public playClose() {
    this.synthesize(540, 310, 0.06, 'sine', 0.35)
  }

  /**
   * Inspiring chime for quick actions and notifications
   */
  public playAction() {
    this.synthesize(640, 880, 0.12, 'triangle', 0.5)
  }

  /**
   * Harmonic chime notification tone
   */
  public playChime() {
    if (!this.enabled) return
    const notes = [587.33, 880, 1174.66] // D5, A5, D6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.synthesize(freq, freq * 1.01, 0.18, 'sine', 0.45)
      }, idx * 70)
    })
  }

  /**
   * Resonant crystal bell notification tone
   */
  public playBell() {
    if (!this.enabled) return
    this.synthesize(1318.51, 659.25, 0.35, 'triangle', 0.5) // E6 down with resonant ring
    setTimeout(() => {
      this.synthesize(1760, 880, 0.25, 'sine', 0.25)
    }, 30)
  }

  /**
   * Airy bubble pop notification tone
   */
  public playPop() {
    if (!this.enabled) return
    this.synthesize(300, 950, 0.07, 'sine', 0.5)
  }

  /**
   * Dispatch notification sound according to user preferences
   */
  public playNotification(soundType: 'chime' | 'bell' | 'pop' | 'mute' = 'chime') {
    if (soundType === 'mute') {
      // Mute option suppresses audio but does not block notification
      return
    }
    if (soundType === 'bell') {
      this.playBell()
    } else if (soundType === 'pop') {
      this.playPop()
    } else {
      this.playChime()
    }
  }
}

export const sound = new SoundEngine()
