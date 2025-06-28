import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { formatDistanceToNow } from 'date-fns';

const MoveHistory = ({ moves }) => {
  const movePairs = [];
  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push({
      moveNumber: Math.floor(i / 2) + 1,
      white: moves[i],
      black: moves[i + 1] || null
    });
  }

  return (
    <motion.div
      className="bg-surface/30 backdrop-blur-sm rounded-xl border border-primary/20 p-6 shadow-xl"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <h3 className="text-lg font-display font-semibold mb-4 flex items-center text-white">
        <ApperIcon name="Scroll" className="w-5 h-5 mr-2 text-accent" />
        Battle Chronicle
      </h3>

      <div className="max-h-64 overflow-y-auto custom-scrollbar">
        {movePairs.length === 0 ? (
          <div className="text-center py-8">
            <ApperIcon name="BookOpen" className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-400">The chronicle awaits your first move...</p>
          </div>
        ) : (
          <div className="space-y-2">
            {movePairs.map((pair, index) => (
              <motion.div
                key={index}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-primary/10 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <div className="flex items-center space-x-4 flex-1">
                  <span className="text-accent font-bold w-6 text-center">
                    {pair.moveNumber}.
                  </span>
                  
                  <div className="flex space-x-3 flex-1">
                    <span className="text-white font-mono bg-slate-700/50 px-2 py-1 rounded text-sm min-w-12 text-center">
                      {pair.white?.notation || ''}
                    </span>
                    
                    {pair.black && (
                      <span className="text-slate-300 font-mono bg-slate-800/50 px-2 py-1 rounded text-sm min-w-12 text-center">
                        {pair.black.notation}
                      </span>
                    )}
                  </div>
                </div>

                {pair.white?.captured && (
                  <div className="text-error text-sm">
                    <ApperIcon name="Sword" className="w-3 h-3" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {moves.length > 0 && (
        <div className="mt-4 pt-4 border-t border-primary/20 text-xs text-slate-400">
          Last move: {formatDistanceToNow(moves[moves.length - 1]?.timestamp || Date.now(), { addSuffix: true })}
        </div>
      )}
    </motion.div>
  );
};

export default MoveHistory;