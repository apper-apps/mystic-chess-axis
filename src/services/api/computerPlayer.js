import { ChessService } from './chessService';

export class ComputerPlayer {
  static findBestMove(gameState, difficulty) {
    const pieces = ChessService.getAllPiecesWithMoves(gameState, 'black');
    
    if (pieces.length === 0) {
      return null;
    }

    switch (difficulty) {
      case 'easy':
        return this.getRandomMove(pieces);
      case 'medium':
        return this.getCaptureOrRandomMove(pieces, gameState);
      case 'hard':
        return this.getPositionalMove(pieces, gameState);
      default:
        return this.getRandomMove(pieces);
    }
  }

  static getRandomMove(pieces) {
    const allMoves = [];
    
    pieces.forEach(pieceData => {
      pieceData.moves.forEach(move => {
        allMoves.push({
          from: pieceData.square,
          to: move.to,
          piece: pieceData.piece
        });
      });
    });

    if (allMoves.length === 0) return null;
    
    return allMoves[Math.floor(Math.random() * allMoves.length)];
  }

  static getCaptureOrRandomMove(pieces, gameState) {
    const captureMoves = [];
    const regularMoves = [];

    pieces.forEach(pieceData => {
      pieceData.moves.forEach(move => {
        const toPos = ChessService.parseSquareNotation(move.to);
        const targetPiece = gameState.board[toPos.row][toPos.col];
        
        const moveData = {
          from: pieceData.square,
          to: move.to,
          piece: pieceData.piece,
          targetPiece
        };

        if (targetPiece) {
          captureMoves.push(moveData);
        } else {
          regularMoves.push(moveData);
        }
      });
    });

    // Prefer captures, especially higher value pieces
    if (captureMoves.length > 0) {
      const pieceValues = { queen: 9, rook: 5, bishop: 3, knight: 3, pawn: 1 };
      
      captureMoves.sort((a, b) => {
        const valueA = pieceValues[a.targetPiece?.type] || 0;
        const valueB = pieceValues[b.targetPiece?.type] || 0;
        return valueB - valueA;
      });

      // Take the highest value capture or random from top captures
      const topCaptures = captureMoves.filter(move => {
        const topValue = pieceValues[captureMoves[0].targetPiece?.type] || 0;
        const moveValue = pieceValues[move.targetPiece?.type] || 0;
        return moveValue === topValue;
      });

      return topCaptures[Math.floor(Math.random() * topCaptures.length)];
    }

    // No captures available, make random move
    if (regularMoves.length === 0) return null;
    return regularMoves[Math.floor(Math.random() * regularMoves.length)];
  }

  static getPositionalMove(pieces, gameState) {
    const allMoves = [];
    const pieceValues = { queen: 900, rook: 500, bishop: 300, knight: 300, pawn: 100, king: 0 };

    // Piece-square tables for positional evaluation (simplified)
    const pawnTable = [
      [ 0,  0,  0,  0,  0,  0,  0,  0],
      [50, 50, 50, 50, 50, 50, 50, 50],
      [10, 10, 20, 30, 30, 20, 10, 10],
      [ 5,  5, 10, 25, 25, 10,  5,  5],
      [ 0,  0,  0, 20, 20,  0,  0,  0],
      [ 5, -5,-10,  0,  0,-10, -5,  5],
      [ 5, 10, 10,-20,-20, 10, 10,  5],
      [ 0,  0,  0,  0,  0,  0,  0,  0]
    ];

    const knightTable = [
      [-50,-40,-30,-30,-30,-30,-40,-50],
      [-40,-20,  0,  0,  0,  0,-20,-40],
      [-30,  0, 10, 15, 15, 10,  0,-30],
      [-30,  5, 15, 20, 20, 15,  5,-30],
      [-30,  0, 15, 20, 20, 15,  0,-30],
      [-30,  5, 10, 15, 15, 10,  5,-30],
      [-40,-20,  0,  5,  5,  0,-20,-40],
      [-50,-40,-30,-30,-30,-30,-40,-50]
    ];

    pieces.forEach(pieceData => {
      pieceData.moves.forEach(move => {
        const toPos = ChessService.parseSquareNotation(move.to);
        const targetPiece = gameState.board[toPos.row][toPos.col];
        
        let score = 0;

        // Capture value
        if (targetPiece) {
          score += pieceValues[targetPiece.type] || 0;
        }

        // Positional value
        if (pieceData.piece.type === 'pawn') {
          score += pawnTable[toPos.row][toPos.col];
        } else if (pieceData.piece.type === 'knight') {
          score += knightTable[toPos.row][toPos.col];
        }

        // Center control bonus
        if ((toPos.row >= 3 && toPos.row <= 4) && (toPos.col >= 3 && toPos.col <= 4)) {
          score += 10;
        }

        // King safety - avoid moving pieces away from king in opening
        if (gameState.moveHistory.length < 10) {
          if (pieceData.piece.type !== 'pawn' && pieceData.piece.type !== 'knight' && pieceData.piece.type !== 'bishop') {
            score -= 5;
          }
        }

        allMoves.push({
          from: pieceData.square,
          to: move.to,
          piece: pieceData.piece,
          score
        });
      });
    });

    if (allMoves.length === 0) return null;

    // Sort by score and pick from top moves with some randomness
    allMoves.sort((a, b) => b.score - a.score);
    
    const topScore = allMoves[0].score;
    const topMoves = allMoves.filter(move => move.score >= topScore - 20);
    
return topMoves[Math.floor(Math.random() * topMoves.length)];
  }
}

// Export standalone function for direct import usage
export const findBestMove = (gameState, difficulty) => {
  return ComputerPlayer.findBestMove(gameState, difficulty);
};