import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const GameStatus = ({ gameState, isComputerThinking, difficulty }) => {
  const getStatusIcon = () => {
    switch (gameState.gameStatus) {
      case 'check':
        return 'AlertTriangle';
      case 'checkmate':
        return 'Crown';
      case 'stalemate':
        return 'Equal';
      case 'draw':
        return 'Handshake';
      default:
        return 'Sword';
    }
  };

  const getStatusText = () => {
    switch (gameState.gameStatus) {
      case 'check':
        return `${gameState.currentTurn === 'white' ? 'White' : 'Black'} King in Check!`;
      case 'checkmate':
        return `Checkmate! ${gameState.currentTurn === 'white' ? 'Black' : 'White'} Wins!`;
      case 'stalemate':
        return 'Stalemate - Draw!';
      case 'draw':
        return 'Draw!';
      default:
        return isComputerThinking 
          ? 'Dark Forces Plotting...' 
          : `${gameState.currentTurn === 'white' ? 'Your' : "Opponent's"} Turn`;
    }
  };

  const getStatusColor = () => {
    switch (gameState.gameStatus) {
      case 'check':
        return 'text-warning';
      case 'checkmate':
        return gameState.currentTurn === 'black' ? 'text-success' : 'text-error';
      case 'stalemate':
      case 'draw':
        return 'text-info';
      default:
        return 'text-white';
    }
  };

  const getDifficultyInfo = () => {
    const info = {
      easy: { name: 'Apprentice', description: 'Random moves with basic rules', color: 'text-success' },
      medium: { name: 'Warrior', description: 'Captures pieces when possible', color: 'text-warning' },
      hard: { name: 'Master', description: 'Advanced positional play', color: 'text-error' }
    };
    return info[difficulty] || info.medium;
  };

  const difficultyInfo = getDifficultyInfo();

  return (
    <motion.div
      className="bg-surface/30 backdrop-blur-sm rounded-xl border border-primary/20 p-6 shadow-xl"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-display font-semibold mb-4 flex items-center text-white">
        <ApperIcon name="Shield" className="w-5 h-5 mr-2 text-accent" />
        Battle Status
      </h3>

      <div className="space-y-4">
        {/* Current Status */}
        <div className="flex items-center space-x-3 p-3 bg-secondary/50 rounded-lg">
          <ApperIcon 
            name={getStatusIcon()} 
            className={`w-6 h-6 ${getStatusColor()}`} 
          />
          <div className="flex-1">
            <p className={`font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </p>
            {isComputerThinking && (
              <div className="flex items-center mt-1">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse mr-2"></div>
                <span className="text-xs text-slate-400">Calculating best move...</span>
              </div>
            )}
          </div>
        </div>

        {/* Current Turn Indicator */}
        <div className="flex items-center justify-between p-3 bg-primary/20 rounded-lg">
          <span className="text-sm text-slate-300">Active Player:</span>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${gameState.currentTurn === 'white' ? 'bg-white' : 'bg-slate-800'}`}></div>
            <span className="font-medium text-white capitalize">
              {gameState.currentTurn === 'white' ? 'You (White)' : 'Computer (Black)'}
            </span>
          </div>
        </div>

        {/* Opponent Difficulty */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300">Opponent:</span>
            <span className={`font-medium ${difficultyInfo.color}`}>
              {difficultyInfo.name}
            </span>
          </div>
          <p className="text-xs text-slate-400">{difficultyInfo.description}</p>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-primary/20">
          <div className="text-center">
            <p className="text-2xl font-bold text-accent">{gameState.moveHistory.length}</p>
            <p className="text-xs text-slate-400">Total Moves</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-400">
              {Math.floor(gameState.moveHistory.length / 2) + 1}
            </p>
            <p className="text-xs text-slate-400">Turn Number</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GameStatus;