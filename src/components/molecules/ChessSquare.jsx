import React from "react";
import { motion } from "framer-motion";
import ChessPiece from "@/components/atoms/ChessPiece";

const ChessSquare = ({
  row,
  col,
  piece,
  isLight,
  isSelected,
  isLegalMove,
  isCaptureMove,
  isHintFrom,
  isHintTo,
  isInCheck,
  onClick,
  disabled,
  pieceSet
}) => {
  const getSquareClasses = () => {
    let classes = 'chess-square relative flex items-center justify-center cursor-pointer transition-all duration-200 ';
    
    // Base color
    classes += isLight ? 'light ' : 'dark ';
    
    // State classes
    if (isSelected) classes += 'selected ';
    if (isLegalMove) classes += 'legal-move ';
    if (isCaptureMove) classes += 'capture-move ';
    if (isHintFrom) classes += 'bg-blue-400/40 border-2 border-blue-500 ';
    if (isHintTo) classes += 'bg-blue-300/30 border-2 border-blue-400 ';
    if (isInCheck) classes += 'in-check ';
    if (disabled) classes += 'cursor-not-allowed opacity-75 ';
    
    return classes.trim();
  };

  return (
    <motion.div
      className={getSquareClasses()}
      onClick={disabled ? undefined : onClick}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      transition={{ duration: 0.1 }}
    >
      {piece && (
        <ChessPiece
          type={piece.type}
          color={piece.color}
          pieceSet={pieceSet}
          disabled={disabled}
        />
      )}
      
      {/* Hint arrow for move direction */}
      {isHintFrom && isHintTo && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ChessSquare;