import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { formatDistanceToNow } from 'date-fns';

const MoveHistory = ({ moves, isCollapsed = false, onToggle }) => {
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
      className="bg-surface/30 backdrop-blur-sm rounded-xl border border-primary/20 shadow-xl w-full h-full flex flex-col"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="flex items-center justify-between p-4 lg:p-5 border-b border-primary/20">
        <h3 className="text-base lg:text-lg font-display font-semibold flex items-center text-white">
          <ApperIcon name="Scroll" className="w-5 h-5 mr-2 text-accent" />
          Battle Chronicle
        </h3>
        {onToggle && (
          <motion.button
            onClick={onToggle}
            className="p-1 rounded-lg hover:bg-primary/20 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title="Hide Battle Chronicle"
          >
            <ApperIcon name="ChevronRight" className="w-4 h-4 text-slate-400" />
          </motion.button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 lg:p-5">
        <div className="space-y-2">
          {movePairs.length === 0 ? (
            <div className="text-center py-8">
              <ApperIcon name="BookOpen" className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <p className="text-sm text-slate-400">Chronicle awaits your first move...</p>
            </div>
          ) : (
            movePairs.map((pair, index) => (
              <motion.div
                key={index}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-primary/10 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <div className="flex items-center space-x-3 flex-1">
                  <span className="text-accent font-bold w-6 text-sm text-center">
                    {pair.moveNumber}.
                  </span>
                  
                  <div className="flex space-x-2 flex-1">
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
                    <ApperIcon name="Sword" className="w-4 h-4" />
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>

      {moves.length > 0 && (
        <div className="p-4 lg:p-5 border-t border-primary/20 text-sm text-slate-400">
          Last move: {formatDistanceToNow(moves[moves.length - 1]?.timestamp || Date.now(), { addSuffix: true })}
        </div>
      )}
    </motion.div>
  );
};

export default MoveHistory;