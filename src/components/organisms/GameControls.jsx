import React, { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import AudioControls from "@/components/molecules/AudioControls";

const GameControls = ({
  onNewGame,
  onUndo,
  onHint,
  onReset,
  difficulty,
  onDifficultyChange,
  pieceSet,
  onPieceSetChange,
  canUndo,
  canHint,
  disabled,
  audioSettings,
  onAudioSettingsChange
}) => {
  const [showControls, setShowControls] = useState(true);
  const [showAudioControls, setShowAudioControls] = useState(false);
  const difficultyOptions = [
    { value: 'easy', label: 'Apprentice (Easy)' },
    { value: 'medium', label: 'Warrior (Medium)' },
    { value: 'hard', label: 'Master (Hard)' }
  ];

  const pieceSetOptions = [
    { value: 'classic', label: 'Classic Chess' },
    { value: 'dragons', label: 'Ancient Dragons' },
    { value: 'wizards', label: 'Mystic Wizards' },
    { value: 'warriors', label: 'Epic Warriors' }
  ];

return (
    <motion.div
      className="bg-surface/30 backdrop-blur-sm rounded-xl border border-primary/20 p-3 sm:p-4 lg:p-6 shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {/* Collapsible Header */}
      <button
        onClick={() => setShowControls(!showControls)}
        disabled={disabled}
        className="w-full flex items-center justify-between text-sm sm:text-base lg:text-lg font-display font-semibold mb-3 lg:mb-4 text-white hover:text-accent transition-colors disabled:opacity-50"
      >
        <span className="flex items-center">
          <ApperIcon name="Settings" className="w-4 lg:w-5 h-4 lg:h-5 mr-2 text-accent" />
          Battle Controls
        </span>
        <ApperIcon 
          name={showControls ? "ChevronUp" : "ChevronDown"} 
          className="w-4 lg:w-5 h-4 lg:h-5 transition-transform" 
        />
      </button>

      {/* Collapsible Content */}
      {showControls && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-2 sm:space-y-3 lg:space-y-4"
        >
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
              Opponent Difficulty
            </label>
            <Select
              value={difficulty}
              onChange={onDifficultyChange}
              options={difficultyOptions}
              disabled={disabled}
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
              Piece Style
            </label>
            <Select
              value={pieceSet}
              onChange={onPieceSetChange}
              options={pieceSetOptions}
              disabled={disabled}
            />
          </div>


          {/* Audio Controls Section */}
          <div className="pt-2 sm:pt-3 lg:pt-4 border-t border-primary/20">
            <button
              onClick={() => setShowAudioControls(!showAudioControls)}
              disabled={disabled}
              className="w-full flex items-center justify-between text-xs sm:text-sm font-medium text-slate-300 mb-2 hover:text-accent transition-colors disabled:opacity-50"
            >
              <span className="flex items-center">
                <ApperIcon name="Music" className="w-3 sm:w-4 h-3 sm:h-4 mr-2" />
                Audio Settings
              </span>
              <ApperIcon 
                name={showAudioControls ? "ChevronUp" : "ChevronDown"} 
                className="w-3 sm:w-4 h-3 sm:h-4 transition-transform" 
              />
            </button>
            
            {showAudioControls && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-3"
              >
                <AudioControls
                  audioSettings={audioSettings}
                  onAudioSettingsChange={onAudioSettingsChange}
                  disabled={disabled}
                />
              </motion.div>
            )}
          </div>

          <div className="pt-2 sm:pt-3 lg:pt-4 border-t border-primary/20">
            <h4 className="text-xs sm:text-sm font-medium text-slate-300 mb-2">Quick Tips</h4>
            <ul className="text-xs text-slate-400 space-y-1">
              <li>• Tap piece to select</li>
              <li className="hidden sm:list-item">• Tap highlighted squares to move</li>
              <li>• Yellow dots show legal moves</li>
              <li className="hidden sm:list-item">• Red border indicates captures</li>
            </ul>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default GameControls;