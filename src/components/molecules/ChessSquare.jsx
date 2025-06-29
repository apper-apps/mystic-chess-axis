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
  disabled
}) => {
const squareClasses = [
    'chess-square',
    'w-9 h-9 sm:w-12 sm:h-12 lg:w-16 lg:h-16',
    isLight ? 'light' : 'dark',
    isSelected && 'selected',
    isLegalMove && !isCaptureMove && 'legal-move',
    isCaptureMove && 'capture-move',
    isInCheck && 'in-check',
    !disabled && 'cursor-pointer'
  ].filter(Boolean).join(' ');

  return (
    <motion.div
      className={squareClasses}
      onClick={!disabled ? onClick : undefined}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
    >
      {piece && (
        <ChessPiece
          type={piece.type}
          color={piece.color}
          isSelected={isSelected}
          disabled={disabled}
        />
      )}
      
{isLegalMove && !piece && (
        <motion.div
          className="w-2 h-2 sm:w-3 sm:h-3 bg-accent rounded-full opacity-70"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.div>
  );
};

export default ChessSquare;