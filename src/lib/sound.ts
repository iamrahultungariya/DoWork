/**
 * Studio Audio Engine powered by Howler.js
 * Crisp, soothing, real audio assets with zero weird synthetic beeps.
 */
import { Howl } from 'howler'

class SoundEngine {
  private enabled: boolean = true
  private volume: number = 0.4
  private sounds: Map<string, Howl> = new Map()

  constructor() {
    // Lazy initialized on first user interaction
  }

  private getHowl(name: string, srcPath: string): Howl | null {
    if (typeof window === 'undefined') return null
    let howl = this.sounds.get(name)
    if (!howl) {
      howl = new Howl({
        src: [srcPath],
        volume: this.volume,
        preload: true,
        html5: false,
      })
      this.sounds.set(name, howl)
    }
    return howl
  }

  public setEnabled(val: boolean) {
    this.enabled = val
  }

  public isEnabled(): boolean {
    return this.enabled
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol))
    this.sounds.forEach((howl) => {
      howl.volume(this.volume)
    })
  }

  private play(name: string, path: string) {
    if (!this.enabled) return
    try {
      const howl = this.getHowl(name, path)
      if (howl) {
        howl.volume(this.volume)
        howl.play()
      }
    } catch {
      // Autoplay policy fallback
    }
  }

  /**
   * Crisp tactile wooden click for button presses and navigation items
   */
  public playClick() {
    this.play('click', '/sounds/click.wav')
  }

  /**
   * Rewarding warm harmonic chord chime for task completion
   */
  public playComplete() {
    this.play('complete', '/sounds/complete.wav')
  }

  /**
   * Subtle soft tap for unchecking a task
   */
  public playUncheck() {
    this.play('uncheck', '/sounds/uncheck.wav')
  }

  /**
   * Crisp airy pop for opening modals and Command Palette (Ctrl+K)
   */
  public playOpen() {
    this.play('open', '/sounds/open.wav')
  }

  /**
   * Soft dismiss sound for closing modals
   */
  public playClose() {
    this.play('close', '/sounds/close.wav')
  }

  /**
   * Inspiring chime for quick actions and notifications
   */
  public playAction() {
    this.play('action', '/sounds/action.wav')
  }

  /**
   * Harmonic ambient chime notification tone
   */
  public playChime() {
    this.play('chime', '/sounds/chime.wav')
  }

  /**
   * Resonant crystal bell notification tone
   */
  public playBell() {
    this.play('bell', '/sounds/bell.wav')
  }

  /**
   * Airy bubble pop notification tone
   */
  public playPop() {
    this.play('pop', '/sounds/pop.wav')
  }

  /**
   * Dispatch notification sound according to user preferences
   */
  public playNotification(soundType: 'chime' | 'bell' | 'pop' | 'mute' = 'chime') {
    if (soundType === 'mute') {
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
