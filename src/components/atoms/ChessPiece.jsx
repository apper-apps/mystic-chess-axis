import React from 'react';
import { motion } from 'framer-motion';

const ChessPiece = ({ type, color, isSelected, disabled }) => {
  const pieceSymbols = {
    king: { white: '♔', black: '♚' },
    queen: { white: '♕', black: '♛' },
    rook: { white: '♖', black: '♜' },
    bishop: { white: '♗', black: '♝' },
    knight: { white: '♘', black: '♞' },
    pawn: { white: '♙', black: '♟' }
  };

  const symbol = pieceSymbols[type]?.[color] || '?';

  const pieceClasses = [
    'chess-piece',
    color,
    isSelected && 'selected',
    disabled && 'opacity-50'
  ].filter(Boolean).join(' ');

  return (
    <motion.div
      className={pieceClasses}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      whileHover={!disabled ? { scale: 1.1 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {symbol}
    </motion.div>
  );
};

export default ChessPiece;