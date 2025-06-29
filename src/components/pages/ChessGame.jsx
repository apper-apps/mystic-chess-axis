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
  const [pieceSet, setPieceSet] = useState('classic');
  const [isComputerThinking, setIsComputerThinking] = useState(false);
  const [hintMove, setHintMove] = useState(null);
  const [hintCooldown, setHintCooldown] = useState(false);

useEffect(() => {
    initializeGame();
    // Load saved piece set preference
    const savedPieceSet = localStorage.getItem('mysticChess_pieceSet');
    if (savedPieceSet && ['classic', 'dragons', 'wizards', 'warriors'].includes(savedPieceSet)) {
      setPieceSet(savedPieceSet);
    }
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

  const handlePieceSetChange = (newPieceSet) => {
    setPieceSet(newPieceSet);
    localStorage.setItem('mysticChess_pieceSet', newPieceSet);
    
    const pieceSetNames = {
      classic: 'Classic Chess pieces',
      dragons: 'Ancient Dragon pieces',
      wizards: 'Mystic Wizard pieces',
      warriors: 'Epic Warrior pieces'
    };
    
    toast.success(`Piece style changed to ${pieceSetNames[newPieceSet]}!`);
toast.success(`Piece style changed to ${pieceSetNames[newPieceSet]}!`);
  };

  const handleHint = async () => {
    if (!gameState || gameState.currentTurn !== 'white' || isComputerThinking || hintCooldown) return;

    setHintCooldown(true);
    
    try {
      const hint = ChessService.getHint(gameState, difficulty);
      if (hint) {
        setHintMove(hint);
        toast.info(`Hint: Consider moving ${hint.piece} from ${hint.from} to ${hint.to}!`);
        
        // Clear hint after 5 seconds
        setTimeout(() => {
          setHintMove(null);
        }, 5000);
      } else {
        toast.warning("The mystical forces offer no guidance...");
      }
    } catch (error) {
      console.error('Hint error:', error);
      toast.error("The oracle is silent...");
    } finally {
      // 10 second cooldown
      setTimeout(() => {
        setHintCooldown(false);
      }, 10000);
    }
  };

  const handleReset = () => {
    if (window.confirm("Reset the mystical battlefield? All progress will be lost immediately.")) {
      const newGame = ChessService.createNewGame();
      setGameState(newGame);
      setSelectedSquare(null);
      setLegalMoves([]);
      setHintMove(null);
      setHintCooldown(false);
      toast.success("The battlefield has been reset by ancient magic!");
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
              hintMove={hintMove}
              onSquareClick={handleSquareClick}
              isComputerThinking={isComputerThinking}
              pieceSet={pieceSet}
            />
          </div>
        </div>

        {/* Game Controls - Mobile Third, Desktop Right Top */}
<div className="lg:col-span-1 order-3 lg:order-3">
          <GameControls
            onNewGame={handleNewGame}
            onUndo={handleUndo}
            onHint={handleHint}
            onReset={handleReset}
            difficulty={difficulty}
            onDifficultyChange={setDifficulty}
            pieceSet={pieceSet}
            onPieceSetChange={handlePieceSetChange}
            canUndo={gameState.moveHistory.length >= 2}
            canHint={gameState && gameState.currentTurn === 'white' && !hintCooldown}
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