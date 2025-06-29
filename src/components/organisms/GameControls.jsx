import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import ApperIcon from '@/components/ApperIcon';

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
  disabled
}) => {
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
      className="bg-surface/30 backdrop-blur-sm rounded-xl border border-primary/20 p-3 sm:p-4 md:p-5 lg:p-6 shadow-xl"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h3 className="text-base sm:text-lg md:text-xl lg:text-xl font-display font-semibold mb-3 sm:mb-4 md:mb-4 flex items-center text-white">
        <ApperIcon name="Settings" className="w-4 sm:w-5 h-4 sm:h-5 mr-2 text-accent" />
        Battle Controls
      </h3>

      <div className="space-y-3 sm:space-y-4 md:space-y-4">
        <div>
          <label className="block text-xs sm:text-sm md:text-base font-medium text-slate-300 mb-1 sm:mb-2">
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
          <label className="block text-xs sm:text-sm md:text-base font-medium text-slate-300 mb-1 sm:mb-2">
            Piece Style
          </label>
          <Select
            value={pieceSet}
            onChange={onPieceSetChange}
            options={pieceSetOptions}
            disabled={disabled}
          />
        </div>
        
<div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-1 gap-2 sm:gap-3 md:gap-3">
          <Button
            variant="primary"
            onClick={onNewGame}
            disabled={disabled}
            size="sm"
            className="btn-magical text-sm sm:text-sm md:text-base min-h-[44px] sm:min-h-[40px]"
          >
            <ApperIcon name="Swords" className="w-4 sm:w-4 h-4 sm:h-4 mr-2 md:mr-2" />
            <span className="hidden sm:inline">New Battle</span>
            <span className="sm:hidden">New</span>
          </Button>
<Button
            variant="secondary"
            onClick={onUndo}
            disabled={!canUndo || disabled}
            size="sm"
            className="hover:bg-warning/20 hover:text-warning text-sm sm:text-sm md:text-base min-h-[44px] sm:min-h-[40px]"
          >
            <ApperIcon name="Undo" className="w-4 sm:w-4 h-4 sm:h-4 mr-2 md:mr-2" />
            <span className="hidden sm:inline">Undo Move</span>
            <span className="sm:hidden">Undo</span>
          </Button>
<Button
            variant="accent"
            onClick={onHint}
            disabled={!canHint || disabled}
            size="sm"
            className="hover:bg-info/20 hover:text-info text-sm sm:text-sm md:text-base min-h-[44px] sm:min-h-[40px]"
            title={!canHint ? "Hint on cooldown or not your turn" : "Get a mystical hint"}
          >
            <ApperIcon name="Lightbulb" className="w-4 sm:w-4 h-4 sm:h-4 mr-2 md:mr-2" />
            <span className="hidden sm:inline">Get Hint</span>
            <span className="sm:hidden">Hint</span>
          </Button>
<Button
            variant="destructive"
            onClick={onReset}
            disabled={disabled}
            size="sm"
            className="hover:bg-error/20 hover:text-error text-sm sm:text-sm md:text-base min-h-[44px] sm:min-h-[40px]"
          >
            <ApperIcon name="RotateCcw" className="w-4 sm:w-4 h-4 sm:h-4 mr-2 md:mr-2" />
            <span className="hidden sm:inline">Reset</span>
            <span className="sm:hidden">Reset</span>
          </Button>
        </div>
<div className="pt-3 sm:pt-4 md:pt-4 border-t border-primary/20">
          <h4 className="text-xs sm:text-sm md:text-base font-medium text-slate-300 mb-2">Quick Tips</h4>
          <ul className="text-xs sm:text-sm text-slate-400 space-y-1">
            <li>• Tap piece to select</li>
            <li className="hidden sm:list-item">• Tap highlighted squares to move</li>
            <li>• Yellow dots show legal moves</li>
            <li className="hidden md:list-item">• Red border indicates captures</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default GameControls;