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
      className="bg-surface/30 backdrop-blur-sm rounded-xl border border-primary/20 p-4 lg:p-6 shadow-xl"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-base lg:text-lg font-display font-semibold mb-3 lg:mb-4 flex items-center text-white">
        <ApperIcon name="Shield" className="w-4 lg:w-5 h-4 lg:h-5 mr-2 text-accent" />
        Battle Status
      </h3>

      <div className="space-y-3 lg:space-y-4">
        {/* Current Status */}
        <div className="flex items-center space-x-2 lg:space-x-3 p-2 lg:p-3 bg-secondary/50 rounded-lg">
          <ApperIcon 
            name={getStatusIcon()} 
            className={`w-5 lg:w-6 h-5 lg:h-6 ${getStatusColor()} flex-shrink-0`} 
          />
          <div className="flex-1 min-w-0">
            <p className={`text-sm lg:text-base font-medium ${getStatusColor()} truncate`}>
              {getStatusText()}
            </p>
            {isComputerThinking && (
              <div className="flex items-center mt-1">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse mr-2 flex-shrink-0"></div>
                <span className="text-xs text-slate-400 truncate">Calculating...</span>
              </div>
            )}
          </div>
        </div>

        {/* Current Turn Indicator */}
        <div className="flex items-center justify-between p-2 lg:p-3 bg-primary/20 rounded-lg">
          <span className="text-xs lg:text-sm text-slate-300">Active:</span>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${gameState.currentTurn === 'white' ? 'bg-white' : 'bg-slate-800'}`}></div>
            <span className="text-xs lg:text-sm font-medium text-white">
              {gameState.currentTurn === 'white' ? 'You' : 'Computer'}
            </span>
          </div>
        </div>

        {/* Opponent Difficulty */}
        <div className="space-y-1 lg:space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs lg:text-sm text-slate-300">Opponent:</span>
            <span className={`text-xs lg:text-sm font-medium ${difficultyInfo.color}`}>
              {difficultyInfo.name}
            </span>
          </div>
          <p className="text-xs text-slate-400 hidden lg:block">{difficultyInfo.description}</p>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-2 gap-2 lg:gap-3 pt-2 lg:pt-3 border-t border-primary/20">
          <div className="text-center">
            <p className="text-lg lg:text-2xl font-bold text-accent">{gameState.moveHistory.length}</p>
            <p className="text-xs text-slate-400">Moves</p>
          </div>
          <div className="text-center">
            <p className="text-lg lg:text-2xl font-bold text-purple-400">
              {Math.floor(gameState.moveHistory.length / 2) + 1}
            </p>
            <p className="text-xs text-slate-400">Turn</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GameStatus;