import React from 'react';
import { motion } from 'framer-motion';
import ChessPiece from '@/components/atoms/ChessPiece';

const ChessSquare = ({
  row,
  col,
  piece,
  isLight,
  isSelected,
  isLegalMove,
  isCaptureMove,
  isInCheck,
  onClick,
  disabled,
  pieceSet = 'classic'
}) => {
  const squareClasses = [
    'chess-square',
    isLight ? 'light' : 'dark',
    isSelected && 'selected',
    isLegalMove && 'legal-move',
    isCaptureMove && 'capture-move',
    isInCheck && 'in-check',
    disabled && 'opacity-50 cursor-not-allowed'
  ].filter(Boolean).join(' ');

  return (
    <motion.div
      className={squareClasses}
      onClick={!disabled ? onClick : undefined}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {piece && (
        <ChessPiece
          type={piece.type}
          color={piece.color}
          isSelected={isSelected}
          disabled={disabled}
          pieceSet={pieceSet}
        />
      )}
    </motion.div>
  );
};

export default ChessSquare;