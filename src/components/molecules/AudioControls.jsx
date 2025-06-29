import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const AudioControls = ({ audioSettings, onAudioSettingsChange, disabled = false }) => {
  const handleToggleSounds = () => {
    onAudioSettingsChange({ soundEnabled: !audioSettings.soundEnabled });
  };

  const handleToggleMusic = () => {
    onAudioSettingsChange({ musicEnabled: !audioSettings.musicEnabled });
  };

  const handleToggleMute = () => {
    const newVolume = audioSettings.masterVolume === 0 ? 1.0 : 0;
    onAudioSettingsChange({ masterVolume: newVolume });
  };

  const handleVolumeChange = (type, value) => {
    const volumeValue = parseFloat(value);
    onAudioSettingsChange({ [type]: volumeValue });
  };

  const isMuted = audioSettings.masterVolume === 0;

  return (
<motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface/20 backdrop-blur-sm rounded-lg border border-primary/10 p-3 space-y-3"
    >
<div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-200 flex items-center gap-2">
          <ApperIcon name="Volume2" size={16} className="text-accent" />
          Audio Controls
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggleMute}
          disabled={disabled}
          className="text-slate-300 hover:text-accent"
        >
          <ApperIcon 
            name={isMuted ? "VolumeX" : "Volume2"} 
            size={16} 
            className={isMuted ? "text-error" : "text-accent"}
          />
        </Button>
      </div>

      {/* Master Volume */}
<div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs text-slate-300 flex items-center gap-2">
            <ApperIcon name="Volume2" size={12} />
            Master Volume
          </label>
          <span className="text-xs text-slate-400">
            {Math.round(audioSettings.masterVolume * 100)}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={audioSettings.masterVolume}
          onChange={(e) => handleVolumeChange('masterVolume', e.target.value)}
          disabled={disabled}
          className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer slider"
        />
      </div>

      {/* Sound Effects */}
<div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs text-slate-300 flex items-center gap-2">
            <ApperIcon name="Zap" size={12} />
            Sound Effects
          </label>
          <button
            onClick={handleToggleSounds}
            disabled={disabled || isMuted}
            className={`w-10 h-6 rounded-full relative transition-colors duration-200 ${
              audioSettings.soundEnabled && !isMuted
                ? 'bg-accent' 
                : 'bg-surface border border-primary/20'
            } ${disabled || isMuted ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-200 ${
                audioSettings.soundEnabled && !isMuted ? 'translate-x-5' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        {audioSettings.soundEnabled && !isMuted && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Volume</span>
              <span className="text-xs text-slate-400">
                {Math.round(audioSettings.soundVolume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={audioSettings.soundVolume}
              onChange={(e) => handleVolumeChange('soundVolume', e.target.value)}
              disabled={disabled}
              className="w-full h-1 bg-surface rounded-lg appearance-none cursor-pointer slider slider-sm"
            />
          </motion.div>
        )}
      </div>

      {/* Ambient Music */}
<div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs text-slate-300 flex items-center gap-2">
            <ApperIcon name="Music" size={12} />
            Ambient Music
          </label>
          <button
            onClick={handleToggleMusic}
            disabled={disabled || isMuted}
            className={`w-10 h-6 rounded-full relative transition-colors duration-200 ${
              audioSettings.musicEnabled && !isMuted
                ? 'bg-accent' 
                : 'bg-surface border border-primary/20'
            } ${disabled || isMuted ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-200 ${
                audioSettings.musicEnabled && !isMuted ? 'translate-x-5' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        {audioSettings.musicEnabled && !isMuted && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Volume</span>
              <span className="text-xs text-slate-400">
                {Math.round(audioSettings.musicVolume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={audioSettings.musicVolume}
              onChange={(e) => handleVolumeChange('musicVolume', e.target.value)}
              disabled={disabled}
              className="w-full h-1 bg-surface rounded-lg appearance-none cursor-pointer slider slider-sm"
            />
          </motion.div>
        )}
      </div>

<div className="text-xs text-slate-500 text-center pt-2 border-t border-primary/10">
        Fantasy audio experience
      </div>
    </motion.div>
  );
};

export default AudioControls;