import { Howl, Howler } from 'howler';

export class AudioService {
  static instance = null;
  static sounds = {};
  static ambientMusic = null;
static settings = {
    soundEnabled: true,
    musicEnabled: true,
    soundVolume: 0.7,
    musicVolume: 0.3,
    masterVolume: 1.0
  };

  static getInstance() {
    if (!this.instance) {
      this.instance = new AudioService();
      this.loadSettings();
      this.preloadSounds();
    }
    return this.instance;
  }

  static loadSettings() {
    try {
      const savedSettings = localStorage.getItem('mysticChess_audioSettings');
      if (savedSettings) {
        this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
      }
    } catch (error) {
      console.warn('Failed to load audio settings:', error);
    }
  }

  static saveSettings() {
    try {
      localStorage.setItem('mysticChess_audioSettings', JSON.stringify(this.settings));
    } catch (error) {
      console.warn('Failed to save audio settings:', error);
    }
  }

  static preloadSounds() {
    const soundFiles = {
      move: '/sounds/move.mp3',
      capture: '/sounds/capture.mp3',
      check: '/sounds/check.mp3',
      checkmate: '/sounds/checkmate.mp3'
    };

    Object.entries(soundFiles).forEach(([key, src]) => {
      try {
        this.sounds[key] = new Howl({
          src: [src],
          volume: this.settings.soundVolume * this.settings.masterVolume,
          preload: true,
          onloaderror: (id, error) => {
            console.warn(`Failed to load sound ${key}:`, error);
          }
        });
      } catch (error) {
        console.warn(`Error creating sound ${key}:`, error);
      }
    });

    // Load ambient music
    try {
      this.ambientMusic = new Howl({
        src: ['/sounds/ambient-fantasy.mp3'],
        volume: this.settings.musicVolume * this.settings.masterVolume,
        loop: true,
        preload: true,
        onloaderror: (id, error) => {
          console.warn('Failed to load ambient music:', error);
        }
      });
    } catch (error) {
      console.warn('Error creating ambient music:', error);
    }
  }

  static playSound(soundName, options = {}) {
    if (!this.settings.soundEnabled || !this.settings.masterVolume) return;

    const sound = this.sounds[soundName];
    if (!sound) {
      console.warn(`Sound ${soundName} not found`);
      return;
    }

    try {
      const volume = (options.volume || this.settings.soundVolume) * this.settings.masterVolume;
      sound.volume(Math.max(0, Math.min(1, volume)));
      sound.play();
    } catch (error) {
      console.warn(`Error playing sound ${soundName}:`, error);
    }
  }

  static playMove(moveType = 'normal') {
    if (moveType === 'capture') {
      this.playSound('capture');
    } else {
      this.playSound('move');
    }
  }

  static playCheck() {
    this.playSound('check');
  }

  static playCheckmate() {
    this.playSound('checkmate');
  }

  static startAmbientMusic() {
    if (!this.settings.musicEnabled || !this.settings.masterVolume || !this.ambientMusic) return;

    try {
      if (!this.ambientMusic.playing()) {
        const volume = this.settings.musicVolume * this.settings.masterVolume;
        this.ambientMusic.volume(Math.max(0, Math.min(1, volume)));
        this.ambientMusic.play();
      }
    } catch (error) {
      console.warn('Error starting ambient music:', error);
    }
  }

  static stopAmbientMusic() {
    if (this.ambientMusic) {
      try {
        this.ambientMusic.stop();
      } catch (error) {
        console.warn('Error stopping ambient music:', error);
      }
    }
  }

  static pauseAmbientMusic() {
    if (this.ambientMusic) {
      try {
        this.ambientMusic.pause();
      } catch (error) {
        console.warn('Error pausing ambient music:', error);
      }
    }
  }

  static resumeAmbientMusic() {
    if (this.settings.musicEnabled && this.settings.masterVolume && this.ambientMusic) {
      try {
        this.ambientMusic.play();
      } catch (error) {
        console.warn('Error resuming ambient music:', error);
      }
    }
  }

  static updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();

    // Update all sound volumes
    Object.values(this.sounds).forEach(sound => {
      if (sound) {
        sound.volume(this.settings.soundVolume * this.settings.masterVolume);
      }
    });

    // Update music volume
    if (this.ambientMusic) {
      this.ambientMusic.volume(this.settings.musicVolume * this.settings.masterVolume);
    }

    // Handle music enable/disable
    if (newSettings.hasOwnProperty('musicEnabled')) {
      if (newSettings.musicEnabled) {
        this.startAmbientMusic();
      } else {
        this.pauseAmbientMusic();
      }
    }

    // Handle master volume changes
    if (newSettings.hasOwnProperty('masterVolume')) {
      if (newSettings.masterVolume === 0) {
        this.pauseAmbientMusic();
      } else if (this.settings.musicEnabled) {
        this.resumeAmbientMusic();
      }
    }
  }

  static getSettings() {
    return { ...this.settings };
  }

  static mute() {
    this.updateSettings({ masterVolume: 0 });
  }

  static unmute() {
    this.updateSettings({ masterVolume: 1.0 });
  }

  static isMuted() {
    return this.settings.masterVolume === 0;
  }

  static cleanup() {
    // Stop and unload all sounds
    Object.values(this.sounds).forEach(sound => {
      if (sound) {
        try {
          sound.stop();
          sound.unload();
        } catch (error) {
          console.warn('Error cleaning up sound:', error);
        }
      }
    });

    if (this.ambientMusic) {
      try {
        this.ambientMusic.stop();
        this.ambientMusic.unload();
      } catch (error) {
        console.warn('Error cleaning up ambient music:', error);
      }
    }

    this.sounds = {};
    this.ambientMusic = null;
this.instance = null;
  }
}

// Named exports for individual functions (delegates to static methods)
export const cleanup = () => AudioService.cleanup();
export const getInstance = () => AudioService.getInstance();
export const getSettings = () => AudioService.getSettings();
export const playCheck = () => AudioService.playCheck();
export const playCheckmate = () => AudioService.playCheckmate();
export const playMove = (moveType) => AudioService.playMove(moveType);
export const startAmbientMusic = () => AudioService.startAmbientMusic();
export const updateSettings = (settings) => AudioService.updateSettings(settings);