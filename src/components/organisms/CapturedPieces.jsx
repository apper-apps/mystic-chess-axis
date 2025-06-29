import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const CapturedPieces = ({ capturedPieces, isCollapsed = false, onToggle }) => {
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
      className="bg-surface/30 backdrop-blur-sm rounded-xl border border-primary/20 shadow-xl w-full h-full flex flex-col"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="flex items-center justify-between p-4 lg:p-5 border-b border-primary/20">
        <h3 className="text-base lg:text-lg font-display font-semibold flex items-center text-white">
          <ApperIcon name="Trophy" className="w-5 h-5 mr-2 text-accent" />
          Fallen Warriors
        </h3>
        {onToggle && (
          <motion.button
            onClick={onToggle}
            className="p-1 rounded-lg hover:bg-primary/20 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title="Hide Fallen Warriors"
          >
            <ApperIcon name="ChevronLeft" className="w-4 h-4 text-slate-400" />
          </motion.button>
        )}
      </div>

      <div className="flex-1 p-4 lg:p-5 overflow-y-auto">
        <div className="space-y-4">
          {/* Captured by You (Black pieces) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-300">Your Captures:</span>
              <span className="text-sm text-accent font-semibold">
                {capturedPieces.black.length}
              </span>
            </div>
            <div className="min-h-8 p-2 bg-secondary/30 rounded border border-primary/10">
              {capturedPieces.black.length > 0 ? (
                renderCapturedPieces(capturedPieces.black, 'black')
              ) : (
                <span className="text-sm text-slate-500 italic">None yet...</span>
              )}
            </div>
          </div>

          {/* Captured by Computer (White pieces) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-300">Enemy Captures:</span>
              <span className="text-sm text-error font-semibold">
                {capturedPieces.white.length}
              </span>
            </div>
            <div className="min-h-8 p-2 bg-secondary/30 rounded border border-primary/10">
              {capturedPieces.white.length > 0 ? (
                renderCapturedPieces(capturedPieces.white, 'white')
              ) : (
                <span className="text-sm text-slate-500 italic">None yet...</span>
              )}
            </div>
          </div>

          {/* Material Advantage */}
          {(capturedPieces.white.length > 0 || capturedPieces.black.length > 0) && (
            <div className="pt-3 border-t border-primary/20">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Balance:</span>
                <div className="flex items-center space-x-2">
                  {materialAdvantage !== 0 && (
                    <ApperIcon 
                      name={materialAdvantage > 0 ? "TrendingUp" : "TrendingDown"} 
                      className={`w-4 h-4 ${materialAdvantage > 0 ? 'text-success' : 'text-error'}`} 
                    />
                  )}
                  <span className={`font-bold text-sm ${
                    materialAdvantage > 0 ? 'text-success' : 
                    materialAdvantage < 0 ? 'text-error' : 'text-slate-400'
                  }`}>
                    {materialAdvantage > 0 ? `+${materialAdvantage}` : 
                     materialAdvantage < 0 ? materialAdvantage : 'Even'}
                  </span>
                </div>
              </div>
              {materialAdvantage !== 0 && (
                <p className="text-sm text-slate-400 mt-2">
                  {materialAdvantage > 0 ? 'You have the advantage!' : 'Computer leads in material'}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CapturedPieces;