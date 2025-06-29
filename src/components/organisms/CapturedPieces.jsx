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
      className="bg-surface/30 backdrop-blur-sm rounded-xl border border-primary/20 p-3 sm:p-4 lg:p-6 shadow-xl"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
<h3 className="text-sm sm:text-base lg:text-lg font-display font-semibold mb-3 lg:mb-4 flex items-center text-white">
        <ApperIcon name="Trophy" className="w-4 lg:w-5 h-4 lg:h-5 mr-2 text-accent" />
        Fallen Warriors
      </h3>

      <div className="space-y-3 lg:space-y-4">
        {/* Captured by You (Black pieces) */}
        <div className="space-y-1 lg:space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs lg:text-sm font-medium text-slate-300">Your Captures:</span>
            <span className="text-xs text-accent">
              {capturedPieces.black.length}
            </span>
          </div>
          <div className="min-h-6 lg:min-h-8 p-1 lg:p-2 bg-secondary/30 rounded border border-primary/10">
            {capturedPieces.black.length > 0 ? (
              renderCapturedPieces(capturedPieces.black, 'black')
            ) : (
              <span className="text-xs text-slate-500 italic">None yet...</span>
            )}
          </div>
        </div>

        {/* Captured by Computer (White pieces) */}
        <div className="space-y-1 lg:space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs lg:text-sm font-medium text-slate-300">Enemy Captures:</span>
            <span className="text-xs text-error">
              {capturedPieces.white.length}
            </span>
          </div>
          <div className="min-h-6 lg:min-h-8 p-1 lg:p-2 bg-secondary/30 rounded border border-primary/10">
            {capturedPieces.white.length > 0 ? (
              renderCapturedPieces(capturedPieces.white, 'white')
            ) : (
              <span className="text-xs text-slate-500 italic">None yet...</span>
            )}
          </div>
        </div>

        {/* Material Advantage */}
        {(capturedPieces.white.length > 0 || capturedPieces.black.length > 0) && (
          <div className="pt-2 lg:pt-3 border-t border-primary/20">
            <div className="flex items-center justify-between">
              <span className="text-xs lg:text-sm text-slate-300">Balance:</span>
              <div className="flex items-center space-x-1 lg:space-x-2">
                {materialAdvantage !== 0 && (
                  <ApperIcon 
                    name={materialAdvantage > 0 ? "TrendingUp" : "TrendingDown"} 
                    className={`w-3 lg:w-4 h-3 lg:h-4 ${materialAdvantage > 0 ? 'text-success' : 'text-error'}`} 
                  />
                )}
                <span className={`font-bold text-xs lg:text-sm ${
                  materialAdvantage > 0 ? 'text-success' : 
                  materialAdvantage < 0 ? 'text-error' : 'text-slate-400'
                }`}>
                  {materialAdvantage > 0 ? `+${materialAdvantage}` : 
                   materialAdvantage < 0 ? materialAdvantage : 'Even'}
                </span>
              </div>
            </div>
            {materialAdvantage !== 0 && (
              <p className="text-xs text-slate-400 mt-1 hidden lg:block">
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