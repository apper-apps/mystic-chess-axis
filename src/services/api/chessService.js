export class ChessService {
  static createNewGame() {
    const initialBoard = this.createInitialBoard();
    return {
      board: initialBoard,
      currentTurn: 'white',
      moveHistory: [],
      capturedPieces: { white: [], black: [] },
      gameStatus: 'active',
      castlingRights: {
        whiteKingside: true,
        whiteQueenside: true,
        blackKingside: true,
        blackQueenside: true
      },
      enPassantTarget: null
    };
  }

  static createInitialBoard() {
    const board = Array(8).fill(null).map(() => Array(8).fill(null));
    
    // Place pawns
    for (let col = 0; col < 8; col++) {
      board[1][col] = { type: 'pawn', color: 'black', hasMoved: false };
      board[6][col] = { type: 'pawn', color: 'white', hasMoved: false };
    }

    // Place pieces
    const pieceOrder = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
    
    for (let col = 0; col < 8; col++) {
      board[0][col] = { type: pieceOrder[col], color: 'black', hasMoved: false };
      board[7][col] = { type: pieceOrder[col], color: 'white', hasMoved: false };
    }

    return board;
  }

  static getSquareNotation(row, col) {
    const file = String.fromCharCode(97 + col); // a-h
    const rank = 8 - row; // 8-1
    return file + rank;
  }

  static parseSquareNotation(square) {
    const file = square.charCodeAt(0) - 97; // a=0, b=1, etc.
    const rank = 8 - parseInt(square[1]); // 8=0, 7=1, etc.
    return { row: rank, col: file };
  }

  static isValidSquare(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
  }

  static getLegalMoves(gameState, square) {
    const { row, col } = this.parseSquareNotation(square);
    const piece = gameState.board[row][col];
    
    if (!piece || piece.color !== gameState.currentTurn) {
      return [];
    }

    const moves = this.generatePieceMoves(gameState, row, col, piece);
    
    // Filter out moves that would put own king in check
    return moves.filter(move => {
      const testGameState = this.simulateMove(gameState, square, move.to);
      return !this.isKingInCheck(testGameState, piece.color);
    });
  }

  static generatePieceMoves(gameState, row, col, piece) {
    switch (piece.type) {
      case 'pawn':
        return this.getPawnMoves(gameState, row, col, piece);
      case 'rook':
        return this.getRookMoves(gameState, row, col, piece);
      case 'knight':
        return this.getKnightMoves(gameState, row, col, piece);
      case 'bishop':
        return this.getBishopMoves(gameState, row, col, piece);
      case 'queen':
        return this.getQueenMoves(gameState, row, col, piece);
      case 'king':
        return this.getKingMoves(gameState, row, col, piece);
      default:
        return [];
    }
  }

  static getPawnMoves(gameState, row, col, piece) {
    const moves = [];
    const direction = piece.color === 'white' ? -1 : 1;
    const startRow = piece.color === 'white' ? 6 : 1;

    // Forward move
    if (this.isValidSquare(row + direction, col) && !gameState.board[row + direction][col]) {
      moves.push({ to: this.getSquareNotation(row + direction, col), type: 'move' });
      
      // Double move from starting position
      if (row === startRow && !gameState.board[row + 2 * direction][col]) {
        moves.push({ to: this.getSquareNotation(row + 2 * direction, col), type: 'move' });
      }
    }

    // Captures
    for (const captureCol of [col - 1, col + 1]) {
      if (this.isValidSquare(row + direction, captureCol)) {
        const targetPiece = gameState.board[row + direction][captureCol];
        if (targetPiece && targetPiece.color !== piece.color) {
          moves.push({ to: this.getSquareNotation(row + direction, captureCol), type: 'capture' });
        }
      }
    }

    // En passant
    if (gameState.enPassantTarget) {
      const enPassantPos = this.parseSquareNotation(gameState.enPassantTarget);
      if (Math.abs(col - enPassantPos.col) === 1 && row + direction === enPassantPos.row) {
        moves.push({ to: gameState.enPassantTarget, type: 'enpassant' });
      }
    }

    return moves;
  }

  static getRookMoves(gameState, row, col, piece) {
    const moves = [];
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];

    for (const [dRow, dCol] of directions) {
      for (let i = 1; i < 8; i++) {
        const newRow = row + i * dRow;
        const newCol = col + i * dCol;

        if (!this.isValidSquare(newRow, newCol)) break;

        const targetPiece = gameState.board[newRow][newCol];
        if (!targetPiece) {
          moves.push({ to: this.getSquareNotation(newRow, newCol), type: 'move' });
        } else {
          if (targetPiece.color !== piece.color) {
            moves.push({ to: this.getSquareNotation(newRow, newCol), type: 'capture' });
          }
          break;
        }
      }
    }

    return moves;
  }

  static getKnightMoves(gameState, row, col, piece) {
    const moves = [];
    const knightMoves = [
      [-2, -1], [-2, 1], [-1, -2], [-1, 2],
      [1, -2], [1, 2], [2, -1], [2, 1]
    ];

    for (const [dRow, dCol] of knightMoves) {
      const newRow = row + dRow;
      const newCol = col + dCol;

      if (this.isValidSquare(newRow, newCol)) {
        const targetPiece = gameState.board[newRow][newCol];
        if (!targetPiece) {
          moves.push({ to: this.getSquareNotation(newRow, newCol), type: 'move' });
        } else if (targetPiece.color !== piece.color) {
          moves.push({ to: this.getSquareNotation(newRow, newCol), type: 'capture' });
        }
      }
    }

    return moves;
  }

  static getBishopMoves(gameState, row, col, piece) {
    const moves = [];
    const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];

    for (const [dRow, dCol] of directions) {
      for (let i = 1; i < 8; i++) {
        const newRow = row + i * dRow;
        const newCol = col + i * dCol;

        if (!this.isValidSquare(newRow, newCol)) break;

        const targetPiece = gameState.board[newRow][newCol];
        if (!targetPiece) {
          moves.push({ to: this.getSquareNotation(newRow, newCol), type: 'move' });
        } else {
          if (targetPiece.color !== piece.color) {
            moves.push({ to: this.getSquareNotation(newRow, newCol), type: 'capture' });
          }
          break;
        }
      }
    }

    return moves;
  }

  static getQueenMoves(gameState, row, col, piece) {
    return [
      ...this.getRookMoves(gameState, row, col, piece),
      ...this.getBishopMoves(gameState, row, col, piece)
    ];
  }

  static getKingMoves(gameState, row, col, piece) {
    const moves = [];
    const kingMoves = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];

    for (const [dRow, dCol] of kingMoves) {
      const newRow = row + dRow;
      const newCol = col + dCol;

      if (this.isValidSquare(newRow, newCol)) {
        const targetPiece = gameState.board[newRow][newCol];
        if (!targetPiece) {
          moves.push({ to: this.getSquareNotation(newRow, newCol), type: 'move' });
        } else if (targetPiece.color !== piece.color) {
          moves.push({ to: this.getSquareNotation(newRow, newCol), type: 'capture' });
        }
      }
    }

    // Castling
    if (!piece.hasMoved && !this.isKingInCheck(gameState, piece.color)) {
      const castlingMoves = this.getCastlingMoves(gameState, row, col, piece);
      moves.push(...castlingMoves);
    }

    return moves;
  }

  static getCastlingMoves(gameState, row, col, piece) {
    const moves = [];
    const isWhite = piece.color === 'white';
    const rookRow = isWhite ? 7 : 0;

    // Kingside castling
    if (isWhite ? gameState.castlingRights.whiteKingside : gameState.castlingRights.blackKingside) {
      const rook = gameState.board[rookRow][7];
      if (rook && rook.type === 'rook' && !rook.hasMoved) {
        if (!gameState.board[rookRow][5] && !gameState.board[rookRow][6]) {
          // Check that king doesn't pass through check
          const testGameState1 = this.simulateMove(gameState, this.getSquareNotation(row, col), this.getSquareNotation(rookRow, 5));
          const testGameState2 = this.simulateMove(gameState, this.getSquareNotation(row, col), this.getSquareNotation(rookRow, 6));
          
          if (!this.isKingInCheck(testGameState1, piece.color) && !this.isKingInCheck(testGameState2, piece.color)) {
            moves.push({ to: this.getSquareNotation(rookRow, 6), type: 'castle-kingside' });
          }
        }
      }
    }

    // Queenside castling
    if (isWhite ? gameState.castlingRights.whiteQueenside : gameState.castlingRights.blackQueenside) {
      const rook = gameState.board[rookRow][0];
      if (rook && rook.type === 'rook' && !rook.hasMoved) {
        if (!gameState.board[rookRow][1] && !gameState.board[rookRow][2] && !gameState.board[rookRow][3]) {
          // Check that king doesn't pass through check
          const testGameState1 = this.simulateMove(gameState, this.getSquareNotation(row, col), this.getSquareNotation(rookRow, 3));
          const testGameState2 = this.simulateMove(gameState, this.getSquareNotation(row, col), this.getSquareNotation(rookRow, 2));
          
          if (!this.isKingInCheck(testGameState1, piece.color) && !this.isKingInCheck(testGameState2, piece.color)) {
            moves.push({ to: this.getSquareNotation(rookRow, 2), type: 'castle-queenside' });
          }
        }
      }
    }

    return moves;
  }

  static makeMove(gameState, fromSquare, toSquare) {
    const fromPos = this.parseSquareNotation(fromSquare);
    const toPos = this.parseSquareNotation(toSquare);
    const piece = gameState.board[fromPos.row][fromPos.col];
    const capturedPiece = gameState.board[toPos.row][toPos.col];

    if (!piece) {
      throw new Error('No piece at source square');
    }

    if (piece.color !== gameState.currentTurn) {
      throw new Error('Not your turn');
    }

    // Validate move is legal
    const legalMoves = this.getLegalMoves(gameState, fromSquare);
    const move = legalMoves.find(m => m.to === toSquare);
    if (!move) {
      throw new Error('Illegal move');
    }

    // Create new game state
    const newGameState = JSON.parse(JSON.stringify(gameState));
    
    // Make the move
    newGameState.board[toPos.row][toPos.col] = { ...piece, hasMoved: true };
    newGameState.board[fromPos.row][fromPos.col] = null;

    // Handle special moves
    if (move.type === 'enpassant') {
      const captureRow = piece.color === 'white' ? toPos.row + 1 : toPos.row - 1;
      const capturedPawn = newGameState.board[captureRow][toPos.col];
      newGameState.capturedPieces[capturedPawn.color].push(capturedPawn);
      newGameState.board[captureRow][toPos.col] = null;
    } else if (move.type === 'castle-kingside') {
      const rookRow = piece.color === 'white' ? 7 : 0;
      const rook = newGameState.board[rookRow][7];
      newGameState.board[rookRow][5] = { ...rook, hasMoved: true };
      newGameState.board[rookRow][7] = null;
    } else if (move.type === 'castle-queenside') {
      const rookRow = piece.color === 'white' ? 7 : 0;
      const rook = newGameState.board[rookRow][0];
      newGameState.board[rookRow][3] = { ...rook, hasMoved: true };
      newGameState.board[rookRow][0] = null;
    }

    // Handle captures
    if (capturedPiece) {
      newGameState.capturedPieces[capturedPiece.color].push(capturedPiece);
    }

    // Handle pawn promotion
    if (piece.type === 'pawn' && (toPos.row === 0 || toPos.row === 7)) {
      newGameState.board[toPos.row][toPos.col].type = 'queen'; // Auto-promote to queen
    }

    // Update en passant target
    newGameState.enPassantTarget = null;
    if (piece.type === 'pawn' && Math.abs(fromPos.row - toPos.row) === 2) {
      const enPassantRow = (fromPos.row + toPos.row) / 2;
      newGameState.enPassantTarget = this.getSquareNotation(enPassantRow, fromPos.col);
    }

    // Update castling rights
    if (piece.type === 'king') {
      if (piece.color === 'white') {
        newGameState.castlingRights.whiteKingside = false;
        newGameState.castlingRights.whiteQueenside = false;
      } else {
        newGameState.castlingRights.blackKingside = false;
        newGameState.castlingRights.blackQueenside = false;
      }
    } else if (piece.type === 'rook') {
      if (piece.color === 'white') {
        if (fromPos.col === 0) newGameState.castlingRights.whiteQueenside = false;
        if (fromPos.col === 7) newGameState.castlingRights.whiteKingside = false;
      } else {
        if (fromPos.col === 0) newGameState.castlingRights.blackQueenside = false;
        if (fromPos.col === 7) newGameState.castlingRights.blackKingside = false;
      }
    }

// Add move to history
    const moveNotation = this.getMoveNotation(gameState, fromSquare, toSquare, move, capturedPiece);
    newGameState.moveHistory.push({
      from: fromSquare,
      to: toSquare,
      piece: piece,
      captured: capturedPiece,
      notation: moveNotation,
      timestamp: Date.now(),
      audioType: capturedPiece ? 'capture' : 'normal'
    });

    // Switch turns
    newGameState.currentTurn = newGameState.currentTurn === 'white' ? 'black' : 'white';

    // Check game status
    newGameState.gameStatus = this.checkGameStatus(newGameState);

    return newGameState;
  }

  static getMoveNotation(gameState, fromSquare, toSquare, move, capturedPiece) {
    const fromPos = this.parseSquareNotation(fromSquare);
    const piece = gameState.board[fromPos.row][fromPos.col];
    
    if (move.type === 'castle-kingside') return 'O-O';
    if (move.type === 'castle-queenside') return 'O-O-O';

    let notation = '';
    
    if (piece.type !== 'pawn') {
      notation += piece.type.charAt(0).toUpperCase();
    }

    if (capturedPiece || move.type === 'enpassant') {
      if (piece.type === 'pawn') {
        notation += fromSquare.charAt(0);
      }
      notation += 'x';
    }

    notation += toSquare;

    if (piece.type === 'pawn' && (toSquare.charAt(1) === '8' || toSquare.charAt(1) === '1')) {
      notation += '=Q'; // Promotion
    }

    return notation;
  }

  static simulateMove(gameState, fromSquare, toSquare) {
    const testGameState = JSON.parse(JSON.stringify(gameState));
    const fromPos = this.parseSquareNotation(fromSquare);
    const toPos = this.parseSquareNotation(toSquare);
    const piece = testGameState.board[fromPos.row][fromPos.col];

    testGameState.board[toPos.row][toPos.col] = piece;
    testGameState.board[fromPos.row][fromPos.col] = null;

    return testGameState;
  }

  static isKingInCheck(gameState, color) {
    // Find king position
    let kingPos = null;
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = gameState.board[row][col];
        if (piece && piece.type === 'king' && piece.color === color) {
          kingPos = { row, col };
          break;
        }
      }
      if (kingPos) break;
    }

    if (!kingPos) return false;

    // Check if any enemy piece can attack the king
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = gameState.board[row][col];
        if (piece && piece.color !== color) {
          const attacks = this.generatePieceAttacks(gameState, row, col, piece);
          if (attacks.some(attack => attack.row === kingPos.row && attack.col === kingPos.col)) {
            return true;
          }
        }
      }
    }

    return false;
  }

static generatePieceAttacks(gameState, row, col, piece) {
    // Generate raw attack patterns without legal move validation to prevent circular dependency
    const attacks = [];
    
    switch (piece.type.toLowerCase()) {
      case 'pawn':
        attacks.push(...this.generatePawnAttacks(gameState, row, col, piece));
        break;
      case 'rook':
        attacks.push(...this.generateRookAttacks(gameState, row, col, piece));
        break;
      case 'bishop':
        attacks.push(...this.generateBishopAttacks(gameState, row, col, piece));
        break;
      case 'queen':
        attacks.push(...this.generateQueenAttacks(gameState, row, col, piece));
        break;
      case 'king':
        attacks.push(...this.generateKingAttacks(gameState, row, col, piece));
        break;
      case 'knight':
        attacks.push(...this.generateKnightAttacks(gameState, row, col, piece));
        break;
    }
    
    return attacks.filter(attack => this.isValidSquare(attack.row, attack.col));
  }

  static generatePawnAttacks(gameState, row, col, piece) {
    const attacks = [];
    const direction = piece.color === 'white' ? -1 : 1;
    
    // Pawn attacks diagonally
    const attackPositions = [
      { row: row + direction, col: col - 1 },
      { row: row + direction, col: col + 1 }
    ];
    
    for (const pos of attackPositions) {
      if (this.isValidSquare(pos.row, pos.col)) {
        attacks.push(pos);
      }
    }
    
    return attacks;
  }

  static generateRookAttacks(gameState, row, col, piece) {
    const attacks = [];
    const directions = [
      { row: -1, col: 0 }, // Up
      { row: 1, col: 0 },  // Down
      { row: 0, col: -1 }, // Left
      { row: 0, col: 1 }   // Right
    ];
    
    for (const dir of directions) {
      for (let i = 1; i < 8; i++) {
        const newRow = row + (dir.row * i);
        const newCol = col + (dir.col * i);
        
        if (!this.isValidSquare(newRow, newCol)) break;
        
        attacks.push({ row: newRow, col: newCol });
        
        // Stop if we hit a piece
        if (gameState.board[newRow][newCol]) break;
      }
    }
    
    return attacks;
  }

  static generateBishopAttacks(gameState, row, col, piece) {
    const attacks = [];
    const directions = [
      { row: -1, col: -1 }, // Up-Left
      { row: -1, col: 1 },  // Up-Right
      { row: 1, col: -1 },  // Down-Left
      { row: 1, col: 1 }    // Down-Right
    ];
    
    for (const dir of directions) {
      for (let i = 1; i < 8; i++) {
        const newRow = row + (dir.row * i);
        const newCol = col + (dir.col * i);
        
        if (!this.isValidSquare(newRow, newCol)) break;
        
        attacks.push({ row: newRow, col: newCol });
        
        // Stop if we hit a piece
        if (gameState.board[newRow][newCol]) break;
      }
    }
    
    return attacks;
  }

  static generateQueenAttacks(gameState, row, col, piece) {
    return [
      ...this.generateRookAttacks(gameState, row, col, piece),
      ...this.generateBishopAttacks(gameState, row, col, piece)
    ];
  }

  static generateKingAttacks(gameState, row, col, piece) {
    const attacks = [];
    const directions = [
      { row: -1, col: -1 }, { row: -1, col: 0 }, { row: -1, col: 1 },
      { row: 0, col: -1 },                       { row: 0, col: 1 },
      { row: 1, col: -1 },  { row: 1, col: 0 },  { row: 1, col: 1 }
    ];
    
    for (const dir of directions) {
      const newRow = row + dir.row;
      const newCol = col + dir.col;
      
      if (this.isValidSquare(newRow, newCol)) {
        attacks.push({ row: newRow, col: newCol });
      }
    }
    
    return attacks;
  }

  static generateKnightAttacks(gameState, row, col, piece) {
    const attacks = [];
    const knightMoves = [
      { row: -2, col: -1 }, { row: -2, col: 1 },
      { row: -1, col: -2 }, { row: -1, col: 2 },
      { row: 1, col: -2 },  { row: 1, col: 2 },
      { row: 2, col: -1 },  { row: 2, col: 1 }
    ];
    
    for (const move of knightMoves) {
      const newRow = row + move.row;
      const newCol = col + move.col;
      
      if (this.isValidSquare(newRow, newCol)) {
        attacks.push({ row: newRow, col: newCol });
      }
    }
    
    return attacks;
  }

  static checkGameStatus(gameState) {
    const currentColor = gameState.currentTurn;
    const isInCheck = this.isKingInCheck(gameState, currentColor);
    
    // Check if current player has any legal moves
    let hasLegalMoves = false;
    for (let row = 0; row < 8 && !hasLegalMoves; row++) {
      for (let col = 0; col < 8 && !hasLegalMoves; col++) {
        const piece = gameState.board[row][col];
        if (piece && piece.color === currentColor) {
          const square = this.getSquareNotation(row, col);
          const moves = this.getLegalMoves(gameState, square);
          if (moves.length > 0) {
            hasLegalMoves = true;
          }
        }
      }
    }

    if (!hasLegalMoves) {
      return isInCheck ? 'checkmate' : 'stalemate';
    }

    return isInCheck ? 'check' : 'active';
  }

  static undoLastMove(gameState) {
    if (gameState.moveHistory.length === 0) {
      throw new Error('No moves to undo');
    }

    // For now, we'll create a new game and replay all moves except the last one
    // This is simpler than trying to reverse all the complex move logic
    const newGame = this.createNewGame();
    
    for (let i = 0; i < gameState.moveHistory.length - 1; i++) {
      const move = gameState.moveHistory[i];
      try {
        const updatedGame = this.makeMove(newGame, move.from, move.to);
        Object.assign(newGame, updatedGame);
      } catch (error) {
        console.error('Error replaying move:', error);
        break;
      }
    }

    return newGame;
  }

  static getAllPiecesWithMoves(gameState, color) {
    const pieces = [];
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = gameState.board[row][col];
        if (piece && piece.color === color) {
          const square = this.getSquareNotation(row, col);
          const moves = this.getLegalMoves(gameState, square);
          if (moves.length > 0) {
            pieces.push({
              square,
              piece,
              moves,
              row,
              col
            });
          }
        }
      }
    }

return pieces;
  }

static async getHint(gameState, difficulty = 'medium') {
    if (!gameState || gameState.currentTurn !== 'white' || gameState.gameStatus !== 'active') {
      return null;
    }

    try {
      // Import ComputerPlayer dynamically to avoid circular dependency
      const { ComputerPlayer } = await import('./computerPlayer');
      
      const bestMove = ComputerPlayer.findBestMove(gameState, difficulty);
      if (bestMove) {
        const fromPos = this.parseSquareNotation(bestMove.from);
        const piece = gameState.board[fromPos.row][fromPos.col];
        
        return {
          from: bestMove.from,
          to: bestMove.to,
          piece: piece?.type || 'piece',
          confidence: bestMove.score || 0
        };
      }
    } catch (error) {
      console.error('Error getting hint:', error);
    }

    return null;
  }
}