import React from "react";
import { motion } from "framer-motion";

const ChessPiece = ({ type, color, isSelected, disabled, pieceSet = 'classic' }) => {
  const pieceSymbols = {
    classic: {
      king: { white: '♔', black: '♚' },
      queen: { white: '♕', black: '♛' },
      rook: { white: '♖', black: '♜' },
      bishop: { white: '♗', black: '♝' },
      knight: { white: '♘', black: '♞' },
      pawn: { white: '♙', black: '♟' }
    },
    dragons: {
      king: { white: '🐲', black: '🐉' },
      queen: { white: '🔥', black: '⚡' },
      rook: { white: '🏰', black: '🗼' },
      bishop: { white: '🌟', black: '💫' },
      knight: { white: '🦄', black: '🐺' },
      pawn: { white: '🥚', black: '🔮' }
    },
    wizards: {
      king: { white: '🧙‍♂️', black: '🧙‍♀️' },
      queen: { white: '👸', black: '🧚‍♀️' },
      rook: { white: '🏛️', black: '🕌' },
      bishop: { white: '📿', black: '🔯' },
      knight: { white: '🦉', black: '🐈‍⬛' },
      pawn: { white: '✨', black: '🌙' }
    },
    warriors: {
      king: { white: '👑', black: '⚔️' },
      queen: { white: '🛡️', black: '🗡️' },
      rook: { white: '🏹', black: '🪓' },
      bishop: { white: '🏺', black: '⚱️' },
      knight: { white: '🐎', black: '🦅' },
      pawn: { white: '🛡', black: '⚔' }
    }
  };

  const currentSet = pieceSymbols[pieceSet] || pieceSymbols.classic;
  const symbol = currentSet[type]?.[color] || '?';

const pieceClasses = [
    'chess-piece',
    color,
    pieceSet !== 'classic' && 'fantasy-piece',
    isSelected && 'selected',
    disabled && 'opacity-50'
  ].filter(Boolean).join(' ');

  const isFantasySet = pieceSet !== 'classic';

  return (
    <motion.div
      className={pieceClasses}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      whileHover={!disabled ? { scale: 1.1 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
style={{
        filter: isFantasySet 
          ? `drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5)) drop-shadow(0 0 10px rgba(107, 70, 193, 0.3))`
          : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5))'
      }}
    >
      {symbol}
    </motion.div>
  );
};

export default ChessPiece;