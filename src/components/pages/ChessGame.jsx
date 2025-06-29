import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ChessBoard from '@/components/organisms/ChessBoard';
import GameControls from '@/components/organisms/GameControls';
import MoveHistory from '@/components/organisms/MoveHistory';
import GameStatus from '@/components/organisms/GameStatus';
import CapturedPieces from '@/components/organisms/CapturedPieces';
import { ChessService } from '@/services/api/chessService';
import { ComputerPlayer } from '@/services/api/computerPlayer';

const ChessGame = () => {
  const [gameState, setGameState] = useState(null);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [difficulty, setDifficulty] = useState('medium');
  const [isComputerThinking, setIsComputerThinking] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (gameState && gameState.currentTurn === 'black' && gameState.gameStatus === 'active') {
      makeComputerMove();
    }
  }, [gameState?.currentTurn, gameState?.gameStatus]);

  const initializeGame = () => {
    const newGame = ChessService.createNewGame();
    setGameState(newGame);
    setSelectedSquare(null);
    setLegalMoves([]);
    toast.success("A new mystical battle begins!");
  };

  const makeComputerMove = async () => {
    if (!gameState || gameState.currentTurn !== 'black' || isComputerThinking) return;

    setIsComputerThinking(true);
    
    // Add thinking delay for realism
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

    try {
      const computerMove = ComputerPlayer.findBestMove(gameState, difficulty);
      
      if (computerMove) {
        const updatedGame = ChessService.makeMove(gameState, computerMove.from, computerMove.to);
        setGameState(updatedGame);
        
        if (updatedGame.gameStatus === 'checkmate') {
          toast.error("The dark forces have triumphed! Checkmate!");
        } else if (updatedGame.gameStatus === 'check') {
          toast.warning("Your king is under attack!");
        }
      }
    } catch (error) {
      console.error('Computer move error:', error);
      toast.error("The dark magic faltered...");
    } finally {
      setIsComputerThinking(false);
    }
  };

  const handleSquareClick = (row, col) => {
    if (!gameState || gameState.currentTurn !== 'white' || isComputerThinking) return;

    const square = ChessService.getSquareNotation(row, col);
    const piece = gameState.board[row][col];

    // If clicking on a legal move destination
    if (selectedSquare && legalMoves.some(move => move.to === square)) {
      try {
        const updatedGame = ChessService.makeMove(gameState, selectedSquare, square);
        setGameState(updatedGame);
        setSelectedSquare(null);
        setLegalMoves([]);

        if (updatedGame.gameStatus === 'checkmate') {
          toast.success("Victory! The light has triumphed!");
        } else if (updatedGame.gameStatus === 'check') {
          toast.warning("Check! The enemy king trembles!");
        }
      } catch (error) {
        toast.error(error.message);
      }
      return;
    }

    // If clicking on own piece
    if (piece && piece.color === 'white') {
      setSelectedSquare(square);
      const moves = ChessService.getLegalMoves(gameState, square);
      setLegalMoves(moves);
    } else {
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  };

  const handleUndo = () => {
    if (!gameState || gameState.moveHistory.length < 2) {
      toast.warning("No moves to undo in this mystical battle!");
      return;
    }

    try {
      // Undo both player and computer moves
      let updatedGame = ChessService.undoLastMove(gameState);
      if (updatedGame.moveHistory.length > 0 && updatedGame.currentTurn === 'black') {
        updatedGame = ChessService.undoLastMove(updatedGame);
      }
      
      setGameState(updatedGame);
      setSelectedSquare(null);
      setLegalMoves([]);
      toast.info("Time flows backward in this realm...");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleNewGame = () => {
    if (gameState && gameState.moveHistory.length > 0) {
      if (window.confirm("Start a new mystical battle? Current progress will be lost.")) {
        initializeGame();
      }
    } else {
      initializeGame();
    }
  };

  if (!gameState) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-slate-300">Preparing the mystical battlefield...</p>
        </div>
      </div>
    );
  }

return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-7xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {/* Game Status - Mobile First, Desktop Left */}
        <div className="lg:col-span-1 order-1 lg:order-1">
          <GameStatus 
            gameState={gameState} 
            isComputerThinking={isComputerThinking}
            difficulty={difficulty}
          />
        </div>

        {/* Main Chess Board - Mobile Second, Desktop Center */}
        <div className="lg:col-span-2 order-2 lg:order-2">
          <div className="bg-surface/30 backdrop-blur-sm rounded-xl border border-primary/20 p-3 lg:p-6 shadow-2xl">
            <ChessBoard
              gameState={gameState}
              selectedSquare={selectedSquare}
              legalMoves={legalMoves}
              onSquareClick={handleSquareClick}
              isComputerThinking={isComputerThinking}
            />
          </div>
        </div>

        {/* Game Controls - Mobile Third, Desktop Right Top */}
        <div className="lg:col-span-1 order-3 lg:order-3">
          <GameControls
            onNewGame={handleNewGame}
            onUndo={handleUndo}
            difficulty={difficulty}
            onDifficultyChange={setDifficulty}
            canUndo={gameState.moveHistory.length >= 2}
            disabled={isComputerThinking}
          />
        </div>

        {/* Captured Pieces - Mobile Fourth, Desktop Left Bottom */}
        <div className="lg:col-span-1 order-4 lg:order-1 lg:row-start-2">
          <CapturedPieces capturedPieces={gameState.capturedPieces} />
        </div>

        {/* Move History - Mobile Fifth, Desktop Right Bottom */}
        <div className="lg:col-span-1 order-5 lg:order-3 lg:row-start-2">
          <MoveHistory moves={gameState.moveHistory} />
        </div>
      </div>
    </motion.div>
  );
};

export default ChessGame;