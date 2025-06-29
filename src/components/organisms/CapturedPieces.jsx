import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const CapturedPieces = ({ capturedPieces }) => {
  const pieceSymbols = {
    king: { white: '♔', black: '♚' },
    queen: { white: '♕', black: '♛' },
    rook: { white: '♖', black: '♜' },
    bishop: { white: '♗', black: '♝' },
    knight: { white: '♘', black: '♞' },
    pawn: { white: '♙', black: '♟' }
  };

  const pieceValues = {
    queen: 9,
    rook: 5,
    bishop: 3,
    knight: 3,
    pawn: 1
  };

  const calculateMaterialAdvantage = () => {
    const whiteValue = capturedPieces.white.reduce((sum, piece) => sum + (pieceValues[piece.type] || 0), 0);
    const blackValue = capturedPieces.black.reduce((sum, piece) => sum + (pieceValues[piece.type] || 0), 0);
    return whiteValue - blackValue;
  };

  const renderCapturedPieces = (pieces, color) => {
    const groupedPieces = pieces.reduce((acc, piece) => {
      acc[piece.type] = (acc[piece.type] || 0) + 1;
      return acc;
    }, {});

    return (
      <div className="flex flex-wrap gap-1">
        {Object.entries(groupedPieces).map(([type, count]) => (
          <div key={type} className="flex items-center">
            <span className={`text-lg ${color === 'white' ? 'text-white' : 'text-slate-600'}`}>
              {pieceSymbols[type]?.[color] || '?'}
            </span>
            {count > 1 && (
              <span className="text-xs text-accent ml-1 font-bold">×{count}</span>
            )}
          </div>
        ))}
      </div>
    );
  };

  const materialAdvantage = calculateMaterialAdvantage();

return (
    <motion.div
      className="bg-surface/30 backdrop-blur-sm rounded-xl border border-primary/20 p-3 sm:p-4 md:p-5 lg:p-6 shadow-xl"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <h3 className="text-base sm:text-lg md:text-xl lg:text-xl font-display font-semibold mb-3 sm:mb-4 md:mb-4 flex items-center text-white">
        <ApperIcon name="Trophy" className="w-4 sm:w-5 h-4 sm:h-5 mr-2 text-accent" />
        Fallen Warriors
      </h3>

      <div className="space-y-3 sm:space-y-4 md:space-y-4">
        {/* Captured by You (Black pieces) */}
        <div className="space-y-1 sm:space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm md:text-base font-medium text-slate-300">Your Captures:</span>
            <span className="text-xs sm:text-sm text-accent">
              {capturedPieces.black.length}
            </span>
          </div>
<div className="min-h-8 sm:min-h-8 md:min-h-9 p-2 sm:p-2 bg-secondary/30 rounded border border-primary/10">
            {capturedPieces.black.length > 0 ? (
              renderCapturedPieces(capturedPieces.black, 'black')
            ) : (
              <span className="text-sm sm:text-sm text-slate-500 italic">None yet...</span>
            )}
          </div>
        </div>
{/* Captured by Computer (White pieces) */}
        <div className="space-y-1 sm:space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm md:text-base font-medium text-slate-300">Enemy Captures:</span>
            <span className="text-xs sm:text-sm text-error">
              {capturedPieces.white.length}
            </span>
          </div>
<div className="min-h-8 sm:min-h-8 md:min-h-9 p-2 sm:p-2 bg-secondary/30 rounded border border-primary/10">
            {capturedPieces.white.length > 0 ? (
              renderCapturedPieces(capturedPieces.white, 'white')
            ) : (
              <span className="text-sm sm:text-sm text-slate-500 italic">None yet...</span>
            )}
          </div>
        </div>

        {/* Material Advantage */}
        {(capturedPieces.white.length > 0 || capturedPieces.black.length > 0) && (
          <div className="pt-3 sm:pt-4 md:pt-4 border-t border-primary/20">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm md:text-base text-slate-300">Balance:</span>
              <div className="flex items-center space-x-1 sm:space-x-2">
                {materialAdvantage !== 0 && (
                  <ApperIcon 
                    name={materialAdvantage > 0 ? "TrendingUp" : "TrendingDown"} 
                    className={`w-3 sm:w-4 h-3 sm:h-4 ${materialAdvantage > 0 ? 'text-success' : 'text-error'}`} 
                  />
                )}
                <span className={`font-bold text-xs sm:text-sm md:text-base ${
                  materialAdvantage > 0 ? 'text-success' : 
                  materialAdvantage < 0 ? 'text-error' : 'text-slate-400'
                }`}>
                  {materialAdvantage > 0 ? `+${materialAdvantage}` : 
                   materialAdvantage < 0 ? materialAdvantage : 'Even'}
                </span>
              </div>
            </div>
            {materialAdvantage !== 0 && (
              <p className="text-xs sm:text-sm text-slate-400 mt-1 hidden md:block">
                {materialAdvantage > 0 ? 'You have the advantage!' : 'Computer leads in material'}
              </p>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CapturedPieces;