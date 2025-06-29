import React from "react";
import { motion } from "framer-motion";
import ChessSquare from "@/components/molecules/ChessSquare";
import { ChessService } from "@/services/api/chessService";

const ChessBoard = ({ 
  gameState, 
  selectedSquare, 
  legalMoves, 
  onSquareClick, 
  isComputerThinking 
}) => {
  const renderSquare = (row, col) => {
    const square = ChessService.getSquareNotation(row, col);
    const piece = gameState.board[row][col];
    const isSelected = selectedSquare === square;
    const isLegalMove = legalMoves.some(move => move.to === square);
    const isCaptureMove = isLegalMove && piece;
    const isInCheck = piece?.type === 'king' && 
                     piece.color === gameState.currentTurn && 
                     gameState.gameStatus === 'check';

    return (
      <ChessSquare
        key={`${row}-${col}`}
        row={row}
        col={col}
        piece={piece}
        isLight={(row + col) % 2 === 0}
        isSelected={isSelected}
        isLegalMove={isLegalMove}
        isCaptureMove={isCaptureMove}
        isInCheck={isInCheck}
        onClick={() => onSquareClick(row, col)}
        disabled={isComputerThinking}
      />
    );
  };

return (
    <div className="relative">
    {/* Board coordinates - Top */}
    <div className="flex justify-center mb-1 lg:mb-2">
        <div className="grid grid-cols-8 gap-0 w-fit">
            {["a", "b", "c", "d", "e", "f", "g", "h"].map((file, index) => <div
                key={file}
                className="w-9 sm:w-12 lg:w-16 text-center text-xs text-slate-400 font-medium">
                {file}
            </div>)}
        </div>
    </div>
    <div className="flex items-center justify-center">
        {/* Rank numbers (left) - Hidden on mobile */}
        <div className="hidden sm:flex flex-col-reverse mr-1 lg:mr-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(rank => <div
                key={rank}
                className="h-9 sm:h-12 lg:h-16 flex items-center text-xs text-slate-400 font-medium">
                {rank}
            </div>)}
        </div>
        {/* Chess board */}
        <motion.div
            className="grid grid-cols-8 border-2 lg:border-4 border-primary/30 rounded-lg overflow-hidden shadow-2xl w-72 h-72 sm:w-96 sm:h-96 lg:w-[512px] lg:h-[512px]"
            initial={{
                scale: 0.9,
                opacity: 0
            }}
            animate={{
                scale: 1,
                opacity: 1
            }}
            transition={{
                duration: 0.5
            }}>
            {Array.from({
                length: 8
            }, (_, row) => Array.from({
                length: 8
            }, (_, col) => renderSquare(row, col)))}
        </motion.div>
        {/* Rank numbers (right) - Hidden on mobile */}
        <div className="hidden sm:flex flex-col-reverse ml-1 lg:ml-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(rank => <div
                key={rank}
                className="h-9 sm:h-12 lg:h-16 flex items-center text-xs text-slate-400 font-medium">
                {rank}
            </div>)}
        </div>
    </div>
    {/* Bottom coordinates */}
    {/* Bottom coordinates */}
    <div className="flex justify-center mt-1 lg:mt-2">
        <div className="grid grid-cols-8 gap-0 w-fit">
            {["a", "b", "c", "d", "e", "f", "g", "h"].map((file, index) => <div
                key={file}
                className="w-9 sm:w-12 lg:w-16 text-center text-xs text-slate-400 font-medium">
                {file}
            </div>)}
        </div>
        {/* Computer thinking overlay */}
        {isComputerThinking && <motion.div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-lg flex items-center justify-center"
            initial={{
                opacity: 0
            }}
            animate={{
                opacity: 1
            }}
            exit={{
                opacity: 0
            }}>
            <div className="bg-secondary/90 rounded-lg p-4 text-center">
                <div
                    className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-accent font-medium">Dark forces are plotting...</p>
            </div>
        </motion.div>}
    </div></div>
  );
};

export default ChessBoard;