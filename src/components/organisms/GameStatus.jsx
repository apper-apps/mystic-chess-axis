import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

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
      className="bg-surface/30 backdrop-blur-sm rounded-xl border border-primary/20 p-3 sm:p-4 lg:p-6 shadow-xl"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center mb-3 lg:mb-4">
        <ApperIcon name="Shield" className="w-4 lg:w-5 h-4 lg:h-5 mr-2 text-accent" />
        <h3 className="text-sm sm:text-base lg:text-lg font-display font-semibold text-white">
          Battle Status
        </h3>
      </div>

      {/* Horizontal Status Layout */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-6">
        {/* Main Status with Thinking Indicator */}
        <div className="flex-1 flex items-center space-x-3 p-3 bg-secondary/50 rounded-lg">
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
                <span className="text-xs text-slate-400">Calculating...</span>
              </div>
            )}
          </div>
        </div>

        {/* Current Turn, Difficulty, and Stats in Horizontal Grid */}
        <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
          {/* Current Turn */}
          <div className="flex items-center space-x-2 p-2 bg-primary/20 rounded-lg min-w-0">
            <span className="text-xs text-slate-300 whitespace-nowrap">Active:</span>
            <div className="flex items-center space-x-1">
              <div className={`w-3 h-3 rounded-full ${gameState.currentTurn === "white" ? "bg-white" : "bg-slate-800"}`}></div>
              <span className="text-xs font-medium text-white">
                {gameState.currentTurn === "white" ? "You" : "AI"}
              </span>
            </div>
          </div>

          {/* Difficulty */}
          <div className="flex items-center space-x-2 p-2 bg-primary/20 rounded-lg min-w-0">
            <span className="text-xs text-slate-300 whitespace-nowrap">vs</span>
            <span className={`text-xs font-medium ${difficultyInfo.color} truncate`}>
              {difficultyInfo.name}
            </span>
          </div>

          {/* Game Stats */}
          <div className="flex space-x-3 p-2 bg-primary/20 rounded-lg">
            <div className="text-center">
              <p className="text-sm lg:text-base font-bold text-accent">{gameState.moveHistory.length}</p>
              <p className="text-xs text-slate-400">Moves</p>
            </div>
            <div className="text-center">
              <p className="text-sm lg:text-base font-bold text-purple-400">
                {Math.floor(gameState.moveHistory.length / 2) + 1}
              </p>
              <p className="text-xs text-slate-400">Turn</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GameStatus;