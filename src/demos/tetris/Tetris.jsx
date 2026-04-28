import { useState, useEffect, useCallback, useRef } from 'react'
import './Tetris.css'

const BOARD_WIDTH = 10
const BOARD_HEIGHT = 20

const TETROMINOES = {
  I: { shape: [[1, 1, 1, 1]], color: '#00f5ff' },
  O: { shape: [[1, 1], [1, 1]], color: '#ffff00' },
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: '#a855f7' },
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: '#22c55e' },
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: '#ef4444' },
  J: { shape: [[1, 0, 0], [1, 1, 1]], color: '#3b82f6' },
  L: { shape: [[0, 0, 1], [1, 1, 1]], color: '#f97316' },
}

const PIECE_TYPES = Object.keys(TETROMINOES)

const createEmptyBoard = () =>
  Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(null))

const randomPiece = () => PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)]

const rotate = (matrix) => {
  const rows = matrix.length
  const cols = matrix[0].length
  const rotated = Array.from({ length: cols }, () => Array(rows).fill(0))
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      rotated[c][rows - 1 - r] = matrix[r][c]
    }
  }
  return rotated
}

const LEVEL_SPEEDS = [800, 720, 630, 550, 470, 380, 300, 220, 130, 100, 80, 60, 50, 40, 30]

export default function Tetris() {
  const [board, setBoard] = useState(createEmptyBoard)
  const [currentPiece, setCurrentPiece] = useState(null)
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 })
  const [nextPieces, setNextPieces] = useState([])
  const [heldPiece, setHeldPiece] = useState(null)
  const [canHold, setCanHold] = useState(true)
  const [score, setScore] = useState(0)
  const [lines, setLines] = useState(0)
  const [level, setLevel] = useState(1)
  const [gameOver, setGameOver] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showAbout, setShowAbout] = useState(false)

  const gameLoopRef = useRef(null)
  const touchStartRef = useRef(null)

  const getSpeed = useCallback(() => {
    return LEVEL_SPEEDS[Math.min(level - 1, LEVEL_SPEEDS.length - 1)]
  }, [level])

  const checkCollision = useCallback((piece, pos, boardState) => {
    const shape = TETROMINOES[piece].shape
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c]) {
          const newX = pos.x + c
          const newY = pos.y + r
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) return true
          if (newY >= 0 && boardState[newY][newX]) return true
        }
      }
    }
    return false
  }, [])

  const spawnPiece = useCallback(() => {
    let queue = [...nextPieces]
    if (queue.length < 4) {
      queue = [...queue, randomPiece(), randomPiece(), randomPiece(), randomPiece()]
    }

    const piece = queue.shift()
    setNextPieces(queue)

    const shape = TETROMINOES[piece].shape
    const startX = Math.floor((BOARD_WIDTH - shape[0].length) / 2)
    const startY = 0

    if (checkCollision(piece, { x: startX, y: startY }, board)) {
      setGameOver(true)
      setIsPlaying(false)
      return
    }

    setCurrentPiece(piece)
    setCurrentPos({ x: startX, y: startY })
    setCanHold(true)
  }, [nextPieces, board, checkCollision])

  const lockPiece = useCallback(() => {
    const shape = TETROMINOES[currentPiece].shape
    const color = TETROMINOES[currentPiece].color
    const newBoard = board.map(row => [...row])

    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c]) {
          const y = currentPos.y + r
          const x = currentPos.x + c
          if (y >= 0) {
            newBoard[y][x] = color
          }
        }
      }
    }

    let clearedLines = 0
    const filteredBoard = newBoard.filter(row => {
      if (row.every(cell => cell !== null)) {
        clearedLines++
        return false
      }
      return true
    })

    while (filteredBoard.length < BOARD_HEIGHT) {
      filteredBoard.unshift(Array(BOARD_WIDTH).fill(null))
    }

    if (clearedLines > 0) {
      const points = [0, 100, 300, 500, 800][clearedLines] * level
      setScore(s => s + points)
      setLines(l => {
        const newLines = l + clearedLines
        const newLevel = Math.floor(newLines / 10) + 1
        if (newLevel > level) setLevel(newLevel)
        return newLines
      })
    }

    setBoard(filteredBoard)
    setCurrentPiece(null)
  }, [board, currentPiece, currentPos, level])

  const moveDown = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return

    const newPos = { x: currentPos.x, y: currentPos.y + 1 }
    if (checkCollision(currentPiece, newPos, board)) {
      lockPiece()
    } else {
      setCurrentPos(newPos)
    }
  }, [currentPiece, currentPos, board, checkCollision, lockPiece, gameOver, isPaused])

  const moveHorizontal = useCallback((dir) => {
    if (!currentPiece || gameOver || isPaused) return

    const newPos = { x: currentPos.x + dir, y: currentPos.y }
    if (!checkCollision(currentPiece, newPos, board)) {
      setCurrentPos(newPos)
    }
  }, [currentPiece, currentPos, board, checkCollision, gameOver, isPaused])

  const rotatePiece = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return

    const currentShape = TETROMINOES[currentPiece].shape
    const rotatedShape = rotate(currentShape)

    const tempPiece = currentPiece + '_rotated'
    TETROMINOES[tempPiece] = { shape: rotatedShape, color: TETROMINOES[currentPiece].color }

    const kicks = [0, -1, 1, -2, 2]
    for (const kick of kicks) {
      const newPos = { x: currentPos.x + kick, y: currentPos.y }
      if (!checkCollision(tempPiece, newPos, board)) {
        TETROMINOES[currentPiece] = { shape: rotatedShape, color: TETROMINOES[currentPiece].color }
        setCurrentPos(newPos)
        delete TETROMINOES[tempPiece]
        return
      }
    }
    delete TETROMINOES[tempPiece]
  }, [currentPiece, currentPos, board, checkCollision, gameOver, isPaused])

  const hardDrop = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return

    let newY = currentPos.y
    while (!checkCollision(currentPiece, { x: currentPos.x, y: newY + 1 }, board)) {
      newY++
    }
    setScore(s => s + (newY - currentPos.y) * 2)
    setCurrentPos({ x: currentPos.x, y: newY })
    setTimeout(() => lockPiece(), 0)
  }, [currentPiece, currentPos, board, checkCollision, lockPiece, gameOver, isPaused])

  const holdPiece = useCallback(() => {
    if (!currentPiece || !canHold || gameOver || isPaused) return

    const pieceToHold = currentPiece

    TETROMINOES[currentPiece] = TETROMINOES[PIECE_TYPES.find(p => p === currentPiece.replace('_rotated', ''))] || TETROMINOES[currentPiece]

    if (heldPiece) {
      const shape = TETROMINOES[heldPiece].shape
      const startX = Math.floor((BOARD_WIDTH - shape[0].length) / 2)
      setCurrentPiece(heldPiece)
      setCurrentPos({ x: startX, y: 0 })
    } else {
      setCurrentPiece(null)
    }

    setHeldPiece(pieceToHold.replace('_rotated', ''))
    setCanHold(false)
  }, [currentPiece, heldPiece, canHold, gameOver, isPaused])

  const getGhostPosition = useCallback(() => {
    if (!currentPiece) return null
    let ghostY = currentPos.y
    while (!checkCollision(currentPiece, { x: currentPos.x, y: ghostY + 1 }, board)) {
      ghostY++
    }
    return ghostY
  }, [currentPiece, currentPos, board, checkCollision])

  useEffect(() => {
    if (!currentPiece && isPlaying && !gameOver) {
      spawnPiece()
    }
  }, [currentPiece, isPlaying, gameOver, spawnPiece])

  useEffect(() => {
    if (!isPlaying || gameOver || isPaused) {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current)
      return
    }

    gameLoopRef.current = setInterval(moveDown, getSpeed())
    return () => clearInterval(gameLoopRef.current)
  }, [isPlaying, gameOver, isPaused, moveDown, getSpeed])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isPlaying || gameOver) return

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          moveHorizontal(-1)
          break
        case 'ArrowRight':
          e.preventDefault()
          moveHorizontal(1)
          break
        case 'ArrowDown':
          e.preventDefault()
          moveDown()
          setScore(s => s + 1)
          break
        case 'ArrowUp':
          e.preventDefault()
          rotatePiece()
          break
        case ' ':
          e.preventDefault()
          hardDrop()
          break
        case 'c':
        case 'C':
          e.preventDefault()
          holdPiece()
          break
        case 'p':
        case 'P':
        case 'Escape':
          e.preventDefault()
          setIsPaused(p => !p)
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isPlaying, gameOver, moveHorizontal, moveDown, rotatePiece, hardDrop, holdPiece])

  const startGame = () => {
    setBoard(createEmptyBoard())
    setCurrentPiece(null)
    setNextPieces([randomPiece(), randomPiece(), randomPiece(), randomPiece()])
    setHeldPiece(null)
    setCanHold(true)
    setScore(0)
    setLines(0)
    setLevel(1)
    setGameOver(false)
    setIsPaused(false)
    setIsPlaying(true)
  }

  const handleTouchStart = (e) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now()
    }
  }

  const handleTouchEnd = (e) => {
    if (!touchStartRef.current || !isPlaying || gameOver || isPaused) return

    const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x
    const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y
    const deltaTime = Date.now() - touchStartRef.current.time

    const minSwipe = 30

    if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10 && deltaTime < 200) {
      rotatePiece()
    } else if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > minSwipe) moveHorizontal(1)
      else if (deltaX < -minSwipe) moveHorizontal(-1)
    } else {
      if (deltaY > minSwipe * 2) hardDrop()
      else if (deltaY > minSwipe) moveDown()
    }

    touchStartRef.current = null
  }

  const renderBoard = () => {
    const ghostY = getGhostPosition()
    const displayBoard = board.map(row => [...row])

    if (currentPiece && ghostY !== null && ghostY !== currentPos.y) {
      const shape = TETROMINOES[currentPiece].shape
      for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
          if (shape[r][c]) {
            const y = ghostY + r
            const x = currentPos.x + c
            if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH && !displayBoard[y][x]) {
              displayBoard[y][x] = 'ghost'
            }
          }
        }
      }
    }

    if (currentPiece) {
      const shape = TETROMINOES[currentPiece].shape
      const color = TETROMINOES[currentPiece].color
      for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
          if (shape[r][c]) {
            const y = currentPos.y + r
            const x = currentPos.x + c
            if (y >= 0 && y < BOARD_HEIGHT) {
              displayBoard[y][x] = color
            }
          }
        }
      }
    }

    return displayBoard
  }

  const renderPreview = (piece) => {
    if (!piece) return null
    const shape = TETROMINOES[piece]?.shape || TETROMINOES[piece.replace('_rotated', '')]?.shape
    const color = TETROMINOES[piece]?.color || TETROMINOES[piece.replace('_rotated', '')]?.color
    if (!shape) return null

    return (
      <div className="preview-grid">
        {shape.map((row, r) => (
          <div key={r} className="preview-row">
            {row.map((cell, c) => (
              <div
                key={c}
                className={`preview-cell ${cell ? 'filled' : ''}`}
                style={cell ? { backgroundColor: color } : {}}
              />
            ))}
          </div>
        ))}
      </div>
    )
  }

  if (showAbout) {
    return (
      <div className="tetris">
        <div className="tetris-header">
          <button className="back-btn" onClick={() => setShowAbout(false)}>← Back</button>
          <h1>About Tetris</h1>
        </div>
        <div className="about-content">
          <div className="about-section">
            <h2>Controls</h2>
            <ul>
              <li><strong>← →</strong> Move left/right</li>
              <li><strong>↓</strong> Soft drop</li>
              <li><strong>↑</strong> Rotate</li>
              <li><strong>Space</strong> Hard drop</li>
              <li><strong>C</strong> Hold piece</li>
              <li><strong>P / Esc</strong> Pause</li>
            </ul>
          </div>
          <div className="about-section">
            <h2>Mobile Controls</h2>
            <ul>
              <li><strong>Tap</strong> Rotate</li>
              <li><strong>Swipe Left/Right</strong> Move</li>
              <li><strong>Swipe Down</strong> Soft drop</li>
              <li><strong>Long Swipe Down</strong> Hard drop</li>
              <li><strong>Buttons</strong> All actions</li>
            </ul>
          </div>
          <div className="about-section">
            <h2>Scoring</h2>
            <ul>
              <li><strong>1 Line:</strong> 100 × level</li>
              <li><strong>2 Lines:</strong> 300 × level</li>
              <li><strong>3 Lines:</strong> 500 × level</li>
              <li><strong>4 Lines (Tetris):</strong> 800 × level</li>
              <li><strong>Soft Drop:</strong> 1 per row</li>
              <li><strong>Hard Drop:</strong> 2 per row</li>
            </ul>
          </div>
          <div className="about-section">
            <h2>Features</h2>
            <ul>
              <li>Ghost piece preview</li>
              <li>Hold piece system</li>
              <li>Next piece queue</li>
              <li>15 speed levels</li>
              <li>Wall kick rotation</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="tetris">
      <div className="tetris-header">
        <h1>Tetris</h1>
        <button className="about-btn" onClick={() => setShowAbout(true)}>ℹ️</button>
      </div>

      <div className="game-container">
        <div className="side-panel left">
          <div className="panel-box">
            <div className="panel-label">HOLD</div>
            <div className="preview-container">
              {renderPreview(heldPiece)}
            </div>
          </div>
          <div className="panel-box stats">
            <div className="stat">
              <span className="stat-label">SCORE</span>
              <span className="stat-value">{score.toLocaleString()}</span>
            </div>
            <div className="stat">
              <span className="stat-label">LINES</span>
              <span className="stat-value">{lines}</span>
            </div>
            <div className="stat">
              <span className="stat-label">LEVEL</span>
              <span className="stat-value">{level}</span>
            </div>
          </div>
        </div>

        <div
          className="board-wrapper"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="board">
            {renderBoard().map((row, r) => (
              <div key={r} className="board-row">
                {row.map((cell, c) => (
                  <div
                    key={c}
                    className={`cell ${cell === 'ghost' ? 'ghost' : cell ? 'filled' : ''}`}
                    style={cell && cell !== 'ghost' ? { backgroundColor: cell } : {}}
                  />
                ))}
              </div>
            ))}
          </div>

          {!isPlaying && !gameOver && (
            <div className="overlay">
              <div className="overlay-content">
                <h2>TETRIS</h2>
                <button className="play-btn" onClick={startGame}>PLAY</button>
              </div>
            </div>
          )}

          {gameOver && (
            <div className="overlay">
              <div className="overlay-content">
                <h2>GAME OVER</h2>
                <p className="final-score">Score: {score.toLocaleString()}</p>
                <p className="final-lines">Lines: {lines}</p>
                <button className="play-btn" onClick={startGame}>PLAY AGAIN</button>
              </div>
            </div>
          )}

          {isPaused && (
            <div className="overlay">
              <div className="overlay-content">
                <h2>PAUSED</h2>
                <button className="play-btn" onClick={() => setIsPaused(false)}>RESUME</button>
              </div>
            </div>
          )}
        </div>

        <div className="side-panel right">
          <div className="panel-box">
            <div className="panel-label">NEXT</div>
            <div className="next-queue">
              {nextPieces.slice(0, 3).map((piece, i) => (
                <div key={i} className="preview-container small">
                  {renderPreview(piece)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isPlaying && !gameOver && (
        <div className="mobile-controls">
          <div className="control-row">
            <button className="ctrl-btn" onClick={holdPiece}>HOLD</button>
            <button className="ctrl-btn" onClick={rotatePiece}>↻</button>
            <button className="ctrl-btn" onClick={() => setIsPaused(p => !p)}>
              {isPaused ? '▶' : '⏸'}
            </button>
          </div>
          <div className="control-row">
            <button className="ctrl-btn large" onClick={() => moveHorizontal(-1)}>←</button>
            <button className="ctrl-btn large" onClick={hardDrop}>⤓</button>
            <button className="ctrl-btn large" onClick={() => moveHorizontal(1)}>→</button>
          </div>
          <div className="control-row">
            <button className="ctrl-btn wide" onClick={() => { moveDown(); setScore(s => s + 1) }}>↓ DROP</button>
          </div>
        </div>
      )}
    </div>
  )
}
