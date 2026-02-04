import { useState, useCallback, useMemo } from 'react'
import './Chess.css'

// Piece definitions
const PIECES = {
  K: { name: 'King', symbol: '♔', value: 0 },
  Q: { name: 'Queen', symbol: '♕', value: 9 },
  R: { name: 'Rook', symbol: '♖', value: 5 },
  B: { name: 'Bishop', symbol: '♗', value: 3 },
  N: { name: 'Knight', symbol: '♘', value: 3 },
  P: { name: 'Pawn', symbol: '♙', value: 1 },
}

// Initial board setup
const INITIAL_BOARD = [
  ['bR', 'bN', 'bB', 'bQ', 'bK', 'bB', 'bN', 'bR'],
  ['bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP'],
  ['wR', 'wN', 'wB', 'wQ', 'wK', 'wB', 'wN', 'wR'],
]

// Helper functions
function copyBoard(board) {
  return board.map(row => [...row])
}

function getPieceColor(piece) {
  return piece ? piece[0] : null
}

function getPieceType(piece) {
  return piece ? piece[1] : null
}

function isInBounds(row, col) {
  return row >= 0 && row < 8 && col >= 0 && col < 8
}

function findKing(board, color) {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c] === `${color}K`) {
        return { row: r, col: c }
      }
    }
  }
  return null
}

// Check if a square is attacked by the opponent
function isSquareAttacked(board, row, col, byColor) {
  // Check knight attacks
  const knightMoves = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]
  for (const [dr, dc] of knightMoves) {
    const r = row + dr, c = col + dc
    if (isInBounds(r, c) && board[r][c] === `${byColor}N`) return true
  }

  // Check pawn attacks
  const pawnDir = byColor === 'w' ? 1 : -1
  for (const dc of [-1, 1]) {
    const r = row + pawnDir, c = col + dc
    if (isInBounds(r, c) && board[r][c] === `${byColor}P`) return true
  }

  // Check king attacks
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue
      const r = row + dr, c = col + dc
      if (isInBounds(r, c) && board[r][c] === `${byColor}K`) return true
    }
  }

  // Check sliding pieces (rook, queen on straight lines)
  const straightDirs = [[0,1],[0,-1],[1,0],[-1,0]]
  for (const [dr, dc] of straightDirs) {
    let r = row + dr, c = col + dc
    while (isInBounds(r, c)) {
      const piece = board[r][c]
      if (piece) {
        if (getPieceColor(piece) === byColor) {
          const type = getPieceType(piece)
          if (type === 'R' || type === 'Q') return true
        }
        break
      }
      r += dr
      c += dc
    }
  }

  // Check sliding pieces (bishop, queen on diagonals)
  const diagDirs = [[1,1],[1,-1],[-1,1],[-1,-1]]
  for (const [dr, dc] of diagDirs) {
    let r = row + dr, c = col + dc
    while (isInBounds(r, c)) {
      const piece = board[r][c]
      if (piece) {
        if (getPieceColor(piece) === byColor) {
          const type = getPieceType(piece)
          if (type === 'B' || type === 'Q') return true
        }
        break
      }
      r += dr
      c += dc
    }
  }

  return false
}

function isInCheck(board, color) {
  const king = findKing(board, color)
  if (!king) return false
  const opponent = color === 'w' ? 'b' : 'w'
  return isSquareAttacked(board, king.row, king.col, opponent)
}

// Generate all pseudo-legal moves for a piece (doesn't check for leaving king in check)
function getPseudoLegalMoves(board, row, col, enPassantSquare, castlingRights) {
  const piece = board[row][col]
  if (!piece) return []

  const color = getPieceColor(piece)
  const type = getPieceType(piece)
  const opponent = color === 'w' ? 'b' : 'w'
  const moves = []

  const addMove = (toRow, toCol, special = null) => {
    moves.push({ from: { row, col }, to: { row: toRow, col: toCol }, special })
  }

  const canCapture = (r, c) => {
    return isInBounds(r, c) && getPieceColor(board[r][c]) === opponent
  }

  const isEmpty = (r, c) => {
    return isInBounds(r, c) && !board[r][c]
  }

  switch (type) {
    case 'P': {
      const dir = color === 'w' ? -1 : 1
      const startRow = color === 'w' ? 6 : 1
      const promoRow = color === 'w' ? 0 : 7

      // Single push
      if (isEmpty(row + dir, col)) {
        if (row + dir === promoRow) {
          addMove(row + dir, col, 'promoteQ')
          addMove(row + dir, col, 'promoteR')
          addMove(row + dir, col, 'promoteB')
          addMove(row + dir, col, 'promoteN')
        } else {
          addMove(row + dir, col)
        }

        // Double push from start
        if (row === startRow && isEmpty(row + 2 * dir, col)) {
          addMove(row + 2 * dir, col, 'doublePush')
        }
      }

      // Captures
      for (const dc of [-1, 1]) {
        const toRow = row + dir, toCol = col + dc
        if (canCapture(toRow, toCol)) {
          if (toRow === promoRow) {
            addMove(toRow, toCol, 'promoteQ')
            addMove(toRow, toCol, 'promoteR')
            addMove(toRow, toCol, 'promoteB')
            addMove(toRow, toCol, 'promoteN')
          } else {
            addMove(toRow, toCol)
          }
        }
        // En passant
        if (enPassantSquare && toRow === enPassantSquare.row && toCol === enPassantSquare.col) {
          addMove(toRow, toCol, 'enPassant')
        }
      }
      break
    }

    case 'N': {
      const knightMoves = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]
      for (const [dr, dc] of knightMoves) {
        const r = row + dr, c = col + dc
        if (isInBounds(r, c) && getPieceColor(board[r][c]) !== color) {
          addMove(r, c)
        }
      }
      break
    }

    case 'B': {
      const dirs = [[1,1],[1,-1],[-1,1],[-1,-1]]
      for (const [dr, dc] of dirs) {
        let r = row + dr, c = col + dc
        while (isInBounds(r, c)) {
          if (!board[r][c]) {
            addMove(r, c)
          } else {
            if (getPieceColor(board[r][c]) === opponent) addMove(r, c)
            break
          }
          r += dr
          c += dc
        }
      }
      break
    }

    case 'R': {
      const dirs = [[0,1],[0,-1],[1,0],[-1,0]]
      for (const [dr, dc] of dirs) {
        let r = row + dr, c = col + dc
        while (isInBounds(r, c)) {
          if (!board[r][c]) {
            addMove(r, c)
          } else {
            if (getPieceColor(board[r][c]) === opponent) addMove(r, c)
            break
          }
          r += dr
          c += dc
        }
      }
      break
    }

    case 'Q': {
      const dirs = [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]]
      for (const [dr, dc] of dirs) {
        let r = row + dr, c = col + dc
        while (isInBounds(r, c)) {
          if (!board[r][c]) {
            addMove(r, c)
          } else {
            if (getPieceColor(board[r][c]) === opponent) addMove(r, c)
            break
          }
          r += dr
          c += dc
        }
      }
      break
    }

    case 'K': {
      // Regular king moves
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue
          const r = row + dr, c = col + dc
          if (isInBounds(r, c) && getPieceColor(board[r][c]) !== color) {
            addMove(r, c)
          }
        }
      }

      // Castling
      if (castlingRights) {
        const backRank = color === 'w' ? 7 : 0
        if (row === backRank && col === 4) {
          // Kingside
          if (castlingRights[`${color}K`] &&
              !board[backRank][5] && !board[backRank][6] &&
              board[backRank][7] === `${color}R` &&
              !isSquareAttacked(board, backRank, 4, opponent) &&
              !isSquareAttacked(board, backRank, 5, opponent) &&
              !isSquareAttacked(board, backRank, 6, opponent)) {
            addMove(backRank, 6, 'castleK')
          }
          // Queenside
          if (castlingRights[`${color}Q`] &&
              !board[backRank][1] && !board[backRank][2] && !board[backRank][3] &&
              board[backRank][0] === `${color}R` &&
              !isSquareAttacked(board, backRank, 4, opponent) &&
              !isSquareAttacked(board, backRank, 3, opponent) &&
              !isSquareAttacked(board, backRank, 2, opponent)) {
            addMove(backRank, 2, 'castleQ')
          }
        }
      }
      break
    }
  }

  return moves
}

// Make a move and return the new board
function makeMove(board, move) {
  const newBoard = copyBoard(board)
  const piece = newBoard[move.from.row][move.from.col]
  const color = getPieceColor(piece)

  newBoard[move.from.row][move.from.col] = null
  newBoard[move.to.row][move.to.col] = piece

  // Handle special moves
  if (move.special === 'enPassant') {
    const capturedRow = color === 'w' ? move.to.row + 1 : move.to.row - 1
    newBoard[capturedRow][move.to.col] = null
  } else if (move.special === 'castleK') {
    const backRank = move.to.row
    newBoard[backRank][5] = newBoard[backRank][7]
    newBoard[backRank][7] = null
  } else if (move.special === 'castleQ') {
    const backRank = move.to.row
    newBoard[backRank][3] = newBoard[backRank][0]
    newBoard[backRank][0] = null
  } else if (move.special?.startsWith('promote')) {
    const promoPiece = move.special.slice(-1)
    newBoard[move.to.row][move.to.col] = `${color}${promoPiece}`
  }

  return newBoard
}

// Get all legal moves for a color
function getAllLegalMoves(board, color, enPassantSquare, castlingRights) {
  const allMoves = []

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (getPieceColor(board[r][c]) === color) {
        const moves = getPseudoLegalMoves(board, r, c, enPassantSquare, castlingRights)
        for (const move of moves) {
          const newBoard = makeMove(board, move)
          if (!isInCheck(newBoard, color)) {
            allMoves.push(move)
          }
        }
      }
    }
  }

  return allMoves
}

// Chess component
function Piece({ piece, isSelected }) {
  if (!piece) return null

  const color = getPieceColor(piece)
  const type = getPieceType(piece)
  const pieceInfo = PIECES[type]

  return (
    <span className={`piece ${color === 'w' ? 'white' : 'black'} ${isSelected ? 'selected' : ''}`}>
      {pieceInfo.symbol}
    </span>
  )
}

function PromotionModal({ color, onSelect }) {
  const pieces = ['Q', 'R', 'B', 'N']

  return (
    <div className="promotion-overlay">
      <div className="promotion-modal">
        <h3>Promote pawn to:</h3>
        <div className="promotion-options">
          {pieces.map(p => (
            <button key={p} className="promotion-btn" onClick={() => onSelect(p)}>
              <span className={`piece ${color === 'w' ? 'white' : 'black'}`}>
                {PIECES[p].symbol}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Chess() {
  const [board, setBoard] = useState(INITIAL_BOARD)
  const [turn, setTurn] = useState('w')
  const [selected, setSelected] = useState(null)
  const [enPassantSquare, setEnPassantSquare] = useState(null)
  const [castlingRights, setCastlingRights] = useState({
    wK: true, wQ: true, bK: true, bQ: true
  })
  const [moveHistory, setMoveHistory] = useState([])
  const [capturedPieces, setCapturedPieces] = useState({ w: [], b: [] })
  const [pendingPromotion, setPendingPromotion] = useState(null)
  const [gameStatus, setGameStatus] = useState('playing') // playing, check, checkmate, stalemate

  // Calculate legal moves for selected piece
  const legalMoves = useMemo(() => {
    if (!selected) return []
    const moves = getPseudoLegalMoves(board, selected.row, selected.col, enPassantSquare, castlingRights)
    return moves.filter(move => {
      const newBoard = makeMove(board, move)
      return !isInCheck(newBoard, turn)
    })
  }, [board, selected, enPassantSquare, castlingRights, turn])

  const isLegalMove = useCallback((row, col) => {
    return legalMoves.some(m => m.to.row === row && m.to.col === col)
  }, [legalMoves])

  const getMoveToSquare = useCallback((row, col) => {
    return legalMoves.find(m => m.to.row === row && m.to.col === col)
  }, [legalMoves])

  const executeMove = useCallback((move) => {
    const piece = board[move.from.row][move.from.col]
    const capturedPiece = board[move.to.row][move.to.col]
    const color = getPieceColor(piece)
    const type = getPieceType(piece)

    // Handle en passant capture
    let actualCapture = capturedPiece
    if (move.special === 'enPassant') {
      const capturedRow = color === 'w' ? move.to.row + 1 : move.to.row - 1
      actualCapture = board[capturedRow][move.to.col]
    }

    // Update captured pieces
    if (actualCapture) {
      const capturedColor = getPieceColor(actualCapture)
      setCapturedPieces(prev => ({
        ...prev,
        [capturedColor]: [...prev[capturedColor], actualCapture]
      }))
    }

    // Update board
    const newBoard = makeMove(board, move)
    setBoard(newBoard)

    // Update en passant square
    if (move.special === 'doublePush') {
      const epRow = color === 'w' ? move.to.row + 1 : move.to.row - 1
      setEnPassantSquare({ row: epRow, col: move.to.col })
    } else {
      setEnPassantSquare(null)
    }

    // Update castling rights
    const newCastling = { ...castlingRights }
    if (type === 'K') {
      newCastling[`${color}K`] = false
      newCastling[`${color}Q`] = false
    }
    if (type === 'R') {
      if (move.from.col === 0) newCastling[`${color}Q`] = false
      if (move.from.col === 7) newCastling[`${color}K`] = false
    }
    // If rook is captured
    if (move.to.row === 0 && move.to.col === 0) newCastling.bQ = false
    if (move.to.row === 0 && move.to.col === 7) newCastling.bK = false
    if (move.to.row === 7 && move.to.col === 0) newCastling.wQ = false
    if (move.to.row === 7 && move.to.col === 7) newCastling.wK = false
    setCastlingRights(newCastling)

    // Record move
    const notation = getMoveNotation(board, move)
    setMoveHistory(prev => [...prev, notation])

    // Switch turn
    const nextTurn = color === 'w' ? 'b' : 'w'
    setTurn(nextTurn)
    setSelected(null)

    // Check game status
    const newEnPassant = move.special === 'doublePush'
      ? { row: color === 'w' ? move.to.row + 1 : move.to.row - 1, col: move.to.col }
      : null

    const opponentMoves = getAllLegalMoves(newBoard, nextTurn, newEnPassant, newCastling)
    const inCheck = isInCheck(newBoard, nextTurn)

    if (opponentMoves.length === 0) {
      if (inCheck) {
        setGameStatus('checkmate')
      } else {
        setGameStatus('stalemate')
      }
    } else if (inCheck) {
      setGameStatus('check')
    } else {
      setGameStatus('playing')
    }
  }, [board, castlingRights])

  const handleSquareClick = useCallback((row, col) => {
    if (gameStatus === 'checkmate' || gameStatus === 'stalemate') return
    if (pendingPromotion) return

    const piece = board[row][col]
    const pieceColor = getPieceColor(piece)

    // If clicking on own piece, select it
    if (pieceColor === turn) {
      setSelected({ row, col })
      return
    }

    // If a piece is selected and clicking on a legal move
    if (selected && isLegalMove(row, col)) {
      const move = getMoveToSquare(row, col)

      // Check for promotion
      if (move.special?.startsWith('promote')) {
        setPendingPromotion({ move, row, col })
        return
      }

      executeMove(move)
    } else {
      setSelected(null)
    }
  }, [board, turn, selected, isLegalMove, getMoveToSquare, executeMove, gameStatus, pendingPromotion])

  const handlePromotion = useCallback((pieceType) => {
    if (!pendingPromotion) return

    const move = {
      ...pendingPromotion.move,
      special: `promote${pieceType}`
    }
    executeMove(move)
    setPendingPromotion(null)
  }, [pendingPromotion, executeMove])

  const getMoveNotation = (board, move) => {
    const piece = board[move.from.row][move.from.col]
    const type = getPieceType(piece)
    const capture = board[move.to.row][move.to.col] || move.special === 'enPassant'
    const files = 'abcdefgh'
    const toFile = files[move.to.col]
    const toRank = 8 - move.to.row

    if (move.special === 'castleK') return 'O-O'
    if (move.special === 'castleQ') return 'O-O-O'

    let notation = ''
    if (type !== 'P') {
      notation += type
    } else if (capture) {
      notation += files[move.from.col]
    }

    if (capture) notation += 'x'
    notation += `${toFile}${toRank}`

    if (move.special?.startsWith('promote')) {
      notation += `=${move.special.slice(-1)}`
    }

    return notation
  }

  const resetGame = () => {
    setBoard(INITIAL_BOARD)
    setTurn('w')
    setSelected(null)
    setEnPassantSquare(null)
    setCastlingRights({ wK: true, wQ: true, bK: true, bQ: true })
    setMoveHistory([])
    setCapturedPieces({ w: [], b: [] })
    setPendingPromotion(null)
    setGameStatus('playing')
  }

  const renderCapturedPieces = (color) => {
    const pieces = capturedPieces[color]
    return (
      <div className={`captured-pieces ${color}`}>
        {pieces.map((p, i) => (
          <span key={i} className={`captured-piece ${color === 'w' ? 'white' : 'black'}`}>
            {PIECES[getPieceType(p)].symbol}
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className="chess">
      <div className="chess-header">
        <h1>Chess</h1>
        <div className="game-info">
          <div className={`turn-indicator ${turn}`}>
            {gameStatus === 'checkmate' ? (
              <span className="status checkmate">Checkmate! {turn === 'w' ? 'Black' : 'White'} wins!</span>
            ) : gameStatus === 'stalemate' ? (
              <span className="status stalemate">Stalemate! Draw.</span>
            ) : gameStatus === 'check' ? (
              <span className="status check">{turn === 'w' ? 'White' : 'Black'} is in check!</span>
            ) : (
              <span>{turn === 'w' ? 'White' : 'Black'} to move</span>
            )}
          </div>
          <button className="reset-btn" onClick={resetGame}>New Game</button>
        </div>
      </div>

      <div className="chess-layout">
        <div className="board-container">
          {renderCapturedPieces('b')}

          <div className="board">
            {board.map((row, rowIndex) => (
              <div key={rowIndex} className="board-row">
                <span className="rank-label">{8 - rowIndex}</span>
                {row.map((piece, colIndex) => {
                  const isLight = (rowIndex + colIndex) % 2 === 0
                  const isSelected = selected?.row === rowIndex && selected?.col === colIndex
                  const isLegal = isLegalMove(rowIndex, colIndex)
                  const hasEnemy = piece && getPieceColor(piece) !== turn && isLegal
                  const inCheck = gameStatus === 'check' &&
                    piece === `${turn}K` &&
                    isInCheck(board, turn)

                  return (
                    <div
                      key={colIndex}
                      className={`square ${isLight ? 'light' : 'dark'}
                        ${isSelected ? 'selected' : ''}
                        ${isLegal ? 'legal' : ''}
                        ${hasEnemy ? 'capture' : ''}
                        ${inCheck ? 'in-check' : ''}`}
                      onClick={() => handleSquareClick(rowIndex, colIndex)}
                    >
                      <Piece piece={piece} isSelected={isSelected} />
                      {isLegal && !piece && <div className="move-dot" />}
                    </div>
                  )
                })}
              </div>
            ))}
            <div className="file-labels">
              <span></span>
              {['a','b','c','d','e','f','g','h'].map(f => (
                <span key={f} className="file-label">{f}</span>
              ))}
            </div>
          </div>

          {renderCapturedPieces('w')}
        </div>

        <div className="move-history">
          <h3>Moves</h3>
          <div className="moves-list">
            {moveHistory.length === 0 ? (
              <p className="no-moves">No moves yet</p>
            ) : (
              <div className="moves-grid">
                {Array.from({ length: Math.ceil(moveHistory.length / 2) }).map((_, i) => (
                  <div key={i} className="move-pair">
                    <span className="move-num">{i + 1}.</span>
                    <span className="move white-move">{moveHistory[i * 2]}</span>
                    <span className="move black-move">{moveHistory[i * 2 + 1] || ''}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {pendingPromotion && (
        <PromotionModal color={turn} onSelect={handlePromotion} />
      )}
    </div>
  )
}
