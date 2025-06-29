import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import ChessBoard from "@/components/organisms/ChessBoard";
import GameControls from "@/components/organisms/GameControls";
import GameStatus from "@/components/organisms/GameStatus";
import CapturedPieces from "@/components/organisms/CapturedPieces";
import MoveHistory from "@/components/organisms/MoveHistory";
import Button from "@/components/atoms/Button";
import { ComputerPlayer, findBestMove } from "@/services/api/computerPlayer";
import { ChessService, createNewGame, getHint, getLegalMoves, getSquareNotation, makeMove, undoLastMove } from "@/services/api/chessService";
import { AudioService, getSettings, playCheck, playCheckmate, playMove, startAmbientMusic, updateSettings } from "@/services/api/audioService";
const ChessGame = () => {
  const [gameState, setGameState] = useState(null);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [difficulty, setDifficulty] = useState('medium');
  const [pieceSet, setPieceSet] = useState('classic');
  const [isComputerThinking, setIsComputerThinking] = useState(false);
  const [hintMove, setHintMove] = useState(null);
  const [hintCooldown, setHintCooldown] = useState(false);
const [audioSettings, setAudioSettings] = useState(AudioService.getSettings());

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (gameState && gameState.currentTurn === 'black' && gameState.gameStatus === 'active') {
      makeComputerMove();
    }
  }, [gameState]);

  const initializeGame = () => {
    const savedPieceSet = localStorage.getItem('chessPieceSet') || 'classic';
    setPieceSet(savedPieceSet);
    
    const newGame = ChessService.createNewGame();
    setGameState(newGame);
    setSelectedSquare(null);
    setLegalMoves([]);
    toast.success("A new mystical battle begins!");
    
    // Restart ambient music for new game
    AudioService.startAmbientMusic();
  };

  const makeComputerMove = async () => {
    if (!gameState || gameState.currentTurn !== 'black' || gameState.gameStatus !== 'active') return;

    try {
      setIsComputerThinking(true);
      
      // Add thinking delay for realism
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
      
      const computerMove = await findBestMove(gameState, 'black', difficulty);
      
      const updatedGame = ChessService.makeMove(gameState, computerMove.from, computerMove.to);
      setGameState(updatedGame);
      
      // Play appropriate sound for computer move
      const lastMove = updatedGame.moveHistory[updatedGame.moveHistory.length - 1];
      if (lastMove?.captured) {
        AudioService.playMove('capture');
      } else {
        AudioService.playMove('normal');
      }
      
      if (updatedGame.gameStatus === 'checkmate') {
        AudioService.playCheckmate();
        toast.error("The dark forces have triumphed! Checkmate!");
      } else if (updatedGame.gameStatus === 'check') {
        AudioService.playCheck();
        toast.warning("Your king is under attack!");
      }
    } catch (error) {
      console.error('Computer move error:', error);
      toast.error("The computer's mystical powers have failed!");
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
        
        // Play appropriate sound for player move
        const lastMove = updatedGame.moveHistory[updatedGame.moveHistory.length - 1];
        if (lastMove?.captured) {
          AudioService.playMove('capture');
        } else {
          AudioService.playMove('normal');
        }

        if (updatedGame.gameStatus === 'checkmate') {
          AudioService.playCheckmate();
          toast.success("Victory! The light has triumphed!");
        } else if (updatedGame.gameStatus === 'check') {
          AudioService.playCheck();
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

  const handleAudioSettingsChange = (newSettings) => {
    AudioService.updateSettings(newSettings);
    setAudioSettings(AudioService.getSettings());
    
    const settingNames = {
      soundEnabled: 'Sound Effects',
      musicEnabled: 'Ambient Music',
      masterVolume: 'Master Volume'
    };
    
    const changedSetting = Object.keys(newSettings)[0];
    if (settingNames[changedSetting]) {
      toast.info(`${settingNames[changedSetting]} updated!`);
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
      className="w-full mx-auto"
    >
<div className="flex flex-col space-y-4 lg:space-y-6">
        {/* Top Section: Horizontal Battle Status */}
        <div className="w-full">
          <GameStatus 
            gameState={gameState} 
            isComputerThinking={isComputerThinking}
            difficulty={difficulty}
          />
        </div>

        {/* Quick Action Bar */}
        <div className="w-full flex justify-center">
          <div className="bg-surface/30 backdrop-blur-sm rounded-xl border border-primary/20 p-3 shadow-xl">
            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
              <Button
                variant="primary"
                onClick={handleNewGame}
                disabled={isComputerThinking}
                size="sm"
                className="btn-magical text-xs sm:text-sm lg:text-base"
              >
                <ApperIcon name="Swords" className="w-3 sm:w-4 h-3 sm:h-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">New Battle</span>
                <span className="sm:hidden">New</span>
              </Button>

              <Button
                variant="secondary"
                onClick={handleUndo}
                disabled={!gameState || gameState.moveHistory.length < 2 || isComputerThinking}
                size="sm"
                className="hover:bg-warning/20 hover:text-warning text-xs sm:text-sm lg:text-base"
              >
                <ApperIcon name="Undo" className="w-3 sm:w-4 h-3 sm:h-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Undo Move</span>
                <span className="sm:hidden">Undo</span>
              </Button>

              <Button
                variant="accent"
                onClick={handleHint}
                disabled={!gameState || gameState.currentTurn !== 'white' || hintCooldown || isComputerThinking}
                size="sm"
                className="hover:bg-info/20 hover:text-info text-xs sm:text-sm lg:text-base"
                title={(!gameState || gameState.currentTurn !== 'white' || hintCooldown) ? "Hint on cooldown or not your turn" : "Get a mystical hint"}
              >
                <ApperIcon name="Lightbulb" className="w-3 sm:w-4 h-3 sm:h-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Get Hint</span>
                <span className="sm:hidden">Hint</span>
              </Button>

              <Button
                variant="destructive"
                onClick={handleReset}
                disabled={isComputerThinking}
                size="sm"
                className="hover:bg-error/20 hover:text-error text-xs sm:text-sm lg:text-base"
              >
                <ApperIcon name="RotateCcw" className="w-3 sm:w-4 h-3 sm:h-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Reset</span>
                <span className="sm:hidden">Reset</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Center Section: Chess Board with Side Panels */}
        <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 items-start">
          {/* Left: Fallen Warriors (Captured Pieces) */}
          <div className="w-full lg:w-96 lg:flex-shrink-0 order-2 lg:order-1">
            <CapturedPieces capturedPieces={gameState.capturedPieces} />
          </div>
          
          {/* Center: Chess Board */}
          <div className="flex-1 flex justify-center order-1 lg:order-2 min-w-0">
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
          
          {/* Right: Battle Chronicle (Move History) */}
          <div className="w-full lg:w-96 lg:flex-shrink-0 order-3">
            <MoveHistory moves={gameState.moveHistory} />
          </div>
        </div>

        {/* Bottom Section: Battle Controls (Collapsible Menu) */}
        <div className="w-full">
          <GameControls
            onNewGame={handleNewGame}
            onUndo={handleUndo}
            onHint={handleHint}
            onReset={handleReset}
            difficulty={difficulty}
            onDifficultyChange={setDifficulty}
            pieceSet={pieceSet}
            onPieceSetChange={handlePieceSetChange}
            audioSettings={audioSettings}
            onAudioSettingsChange={handleAudioSettingsChange}
            canUndo={gameState.moveHistory.length >= 2}
            canHint={gameState && gameState.currentTurn === 'white' && !hintCooldown}
            disabled={isComputerThinking}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default ChessGame;