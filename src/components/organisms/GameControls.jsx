import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import ApperIcon from '@/components/ApperIcon';

const GameControls = ({
  onNewGame,
  onUndo,
  difficulty,
  onDifficultyChange,
  canUndo,
  disabled
}) => {
  const difficultyOptions = [
    { value: 'easy', label: 'Apprentice (Easy)' },
    { value: 'medium', label: 'Warrior (Medium)' },
    { value: 'hard', label: 'Master (Hard)' }
  ];

  return (
    <motion.div
      className="bg-surface/30 backdrop-blur-sm rounded-xl border border-primary/20 p-6 shadow-xl"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h3 className="text-lg font-display font-semibold mb-4 flex items-center text-white">
        <ApperIcon name="Settings" className="w-5 h-5 mr-2 text-accent" />
        Battle Controls
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Opponent Difficulty
          </label>
          <Select
            value={difficulty}
            onChange={onDifficultyChange}
            options={difficultyOptions}
            disabled={disabled}
          />
        </div>

        <div className="grid grid-cols-1 gap-3">
          <Button
            variant="primary"
            onClick={onNewGame}
            disabled={disabled}
            className="btn-magical"
          >
            <ApperIcon name="Swords" className="w-4 h-4 mr-2" />
            New Battle
          </Button>

          <Button
            variant="secondary"
            onClick={onUndo}
            disabled={!canUndo || disabled}
            className="hover:bg-warning/20 hover:text-warning"
          >
            <ApperIcon name="Undo" className="w-4 h-4 mr-2" />
            Undo Move
          </Button>
        </div>

        <div className="pt-4 border-t border-primary/20">
          <h4 className="text-sm font-medium text-slate-300 mb-2">Quick Tips</h4>
          <ul className="text-xs text-slate-400 space-y-1">
            <li>• Click a piece to select it</li>
            <li>• Click highlighted squares to move</li>
            <li>• Yellow dots show legal moves</li>
            <li>• Red border indicates captures</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default GameControls;