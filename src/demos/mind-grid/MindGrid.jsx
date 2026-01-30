import { useState, useEffect, useCallback, useRef } from 'react'
import './MindGrid.css'

// Level configurations with different mechanics
const LEVEL_CONFIGS = [
  // Levels 1-5: Basic pattern memory (increasing length)
  { level: 1, gridSize: 3, patternLength: 3, showTime: 1000, mechanic: 'basic', name: 'Warm Up' },
  { level: 2, gridSize: 3, patternLength: 4, showTime: 1000, mechanic: 'basic', name: 'Getting Started' },
  { level: 3, gridSize: 3, patternLength: 5, showTime: 900, mechanic: 'basic', name: 'Building Memory' },
  { level: 4, gridSize: 4, patternLength: 5, showTime: 900, mechanic: 'basic', name: 'Expanding Grid' },
  { level: 5, gridSize: 4, patternLength: 6, showTime: 800, mechanic: 'basic', name: 'Memory Lane' },

  // Levels 6-10: Reverse the pattern
  { level: 6, gridSize: 3, patternLength: 4, showTime: 1000, mechanic: 'reverse', name: 'Reverse Thinking' },
  { level: 7, gridSize: 3, patternLength: 5, showTime: 900, mechanic: 'reverse', name: 'Backwards' },
  { level: 8, gridSize: 4, patternLength: 5, showTime: 900, mechanic: 'reverse', name: 'Mirror Mind' },
  { level: 9, gridSize: 4, patternLength: 6, showTime: 800, mechanic: 'reverse', name: 'Rewind' },
  { level: 10, gridSize: 4, patternLength: 7, showTime: 800, mechanic: 'reverse', name: 'Time Warp' },

  // Levels 11-15: Mirror pattern (horizontal flip)
  { level: 11, gridSize: 3, patternLength: 4, showTime: 1000, mechanic: 'mirror', name: 'Mirror World' },
  { level: 12, gridSize: 3, patternLength: 5, showTime: 900, mechanic: 'mirror', name: 'Reflection' },
  { level: 13, gridSize: 4, patternLength: 5, showTime: 900, mechanic: 'mirror', name: 'Flip Side' },
  { level: 14, gridSize: 4, patternLength: 6, showTime: 800, mechanic: 'mirror', name: 'Symmetry' },
  { level: 15, gridSize: 4, patternLength: 7, showTime: 800, mechanic: 'mirror', name: 'Looking Glass' },

  // Levels 16-20: Rotate 90° clockwise
  { level: 16, gridSize: 3, patternLength: 4, showTime: 1100, mechanic: 'rotate', name: 'Spin Zone' },
  { level: 17, gridSize: 3, patternLength: 5, showTime: 1000, mechanic: 'rotate', name: 'Quarter Turn' },
  { level: 18, gridSize: 4, patternLength: 5, showTime: 1000, mechanic: 'rotate', name: 'Rotation' },
  { level: 19, gridSize: 4, patternLength: 6, showTime: 900, mechanic: 'rotate', name: 'Spiral' },
  { level: 20, gridSize: 4, patternLength: 7, showTime: 900, mechanic: 'rotate', name: 'Vortex' },

  // Levels 21-25: Color patterns (remember colors too)
  { level: 21, gridSize: 3, patternLength: 4, showTime: 1200, mechanic: 'colors', name: 'Color Burst' },
  { level: 22, gridSize: 3, patternLength: 5, showTime: 1100, mechanic: 'colors', name: 'Rainbow' },
  { level: 23, gridSize: 4, patternLength: 5, showTime: 1100, mechanic: 'colors', name: 'Chromatic' },
  { level: 24, gridSize: 4, patternLength: 6, showTime: 1000, mechanic: 'colors', name: 'Spectrum' },
  { level: 25, gridSize: 4, patternLength: 7, showTime: 1000, mechanic: 'colors', name: 'Prismatic' },

  // Levels 26-30: Speed mode (very fast display)
  { level: 26, gridSize: 3, patternLength: 5, showTime: 500, mechanic: 'speed', name: 'Quick Flash' },
  { level: 27, gridSize: 3, patternLength: 6, showTime: 450, mechanic: 'speed', name: 'Lightning' },
  { level: 28, gridSize: 4, patternLength: 6, showTime: 400, mechanic: 'speed', name: 'Blink' },
  { level: 29, gridSize: 4, patternLength: 7, showTime: 350, mechanic: 'speed', name: 'Flash Point' },
  { level: 30, gridSize: 4, patternLength: 8, showTime: 300, mechanic: 'speed', name: 'Instant' },

  // Levels 31+: Combined mechanics (generated dynamically)
]

const COLORS = ['#6366f1', '#ec4899', '#22c55e', '#f59e0b', '#06b6d4']
const MECHANIC_DESCRIPTIONS = {
  basic: 'Repeat the pattern in order',
  reverse: 'Repeat the pattern BACKWARDS',
  mirror: 'Mirror the pattern horizontally',
  rotate: 'Rotate the pattern 90° clockwise',
  colors: 'Match both position AND color',
  speed: 'Lightning fast! Stay focused',
  combined: 'Multiple rules apply!'
}

function generatePattern(gridSize, length, useColors = false) {
  const pattern = []
  const totalTiles = gridSize * gridSize
  const usedPositions = new Set()

  for (let i = 0; i < length; i++) {
    let pos
    do {
      pos = Math.floor(Math.random() * totalTiles)
    } while (usedPositions.has(pos) && usedPositions.size < totalTiles)

    usedPositions.add(pos)
    pattern.push({
      position: pos,
      color: useColors ? COLORS[Math.floor(Math.random() * COLORS.length)] : COLORS[0]
    })
  }

  return pattern
}

function transformPattern(pattern, mechanic, gridSize) {
  switch (mechanic) {
    case 'reverse':
      return [...pattern].reverse()

    case 'mirror': {
      return pattern.map(item => {
        const row = Math.floor(item.position / gridSize)
        const col = item.position % gridSize
        const mirroredCol = gridSize - 1 - col
        return { ...item, position: row * gridSize + mirroredCol }
      })
    }

    case 'rotate': {
      return pattern.map(item => {
        const row = Math.floor(item.position / gridSize)
        const col = item.position % gridSize
        const newRow = col
        const newCol = gridSize - 1 - row
        return { ...item, position: newRow * gridSize + newCol }
      })
    }

    default:
      return pattern
  }
}

function getLevelConfig(level) {
  if (level <= LEVEL_CONFIGS.length) {
    return LEVEL_CONFIGS[level - 1]
  }

  // Generate dynamic levels for 31+
  const mechanics = ['basic', 'reverse', 'mirror', 'rotate', 'colors', 'speed']
  const baseLevel = ((level - 31) % 10) + 1
  const difficulty = Math.floor((level - 31) / 10) + 1

  return {
    level,
    gridSize: Math.min(4 + Math.floor(difficulty / 2), 6),
    patternLength: 6 + baseLevel + difficulty,
    showTime: Math.max(250, 800 - (difficulty * 50)),
    mechanic: mechanics[(level - 31) % mechanics.length],
    name: `Expert ${level - 30}`
  }
}

export default function MindGrid() {
  const [gameState, setGameState] = useState('menu') // menu, showing, playing, success, failure
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('mindgrid-highscore')
    return saved ? parseInt(saved, 10) : 0
  })
  const [pattern, setPattern] = useState([])
  const [expectedPattern, setExpectedPattern] = useState([])
  const [playerInput, setPlayerInput] = useState([])
  const [currentShowIndex, setCurrentShowIndex] = useState(-1)
  const [config, setConfig] = useState(getLevelConfig(1))
  const [selectedColor, setSelectedColor] = useState(COLORS[0])
  const [streak, setStreak] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [particles, setParticles] = useState([])
  const timeoutRef = useRef(null)

  const addParticles = useCallback((x, y, color, count = 10) => {
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      x,
      y,
      color,
      angle: (Math.PI * 2 * i) / count + Math.random() * 0.5,
      speed: 2 + Math.random() * 3,
      life: 1
    }))
    setParticles(prev => [...prev, ...newParticles])
  }, [])

  useEffect(() => {
    if (particles.length === 0) return

    const interval = setInterval(() => {
      setParticles(prev =>
        prev
          .map(p => ({ ...p, life: p.life - 0.05 }))
          .filter(p => p.life > 0)
      )
    }, 30)

    return () => clearInterval(interval)
  }, [particles.length])

  const startLevel = useCallback(() => {
    const cfg = getLevelConfig(level)
    setConfig(cfg)

    const useColors = cfg.mechanic === 'colors'
    const newPattern = generatePattern(cfg.gridSize, cfg.patternLength, useColors)
    setPattern(newPattern)

    const expected = transformPattern(newPattern, cfg.mechanic, cfg.gridSize)
    setExpectedPattern(expected)

    setPlayerInput([])
    setCurrentShowIndex(-1)
    setGameState('showing')
    setShowHint(true)

    // Hide hint after a moment
    setTimeout(() => setShowHint(false), 1500)

    // Start showing pattern
    let index = 0
    const showNext = () => {
      if (index < newPattern.length) {
        setCurrentShowIndex(index)
        index++
        timeoutRef.current = setTimeout(showNext, cfg.showTime)
      } else {
        setCurrentShowIndex(-1)
        setTimeout(() => setGameState('playing'), 300)
      }
    }

    timeoutRef.current = setTimeout(showNext, 500)
  }, [level])

  const handleTileClick = useCallback((position, event) => {
    if (gameState !== 'playing') return

    const rect = event.target.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2

    const newInput = [...playerInput, {
      position,
      color: config.mechanic === 'colors' ? selectedColor : COLORS[0]
    }]
    setPlayerInput(newInput)

    const currentIndex = newInput.length - 1
    const expected = expectedPattern[currentIndex]

    const isCorrect = config.mechanic === 'colors'
      ? expected.position === position && expected.color === selectedColor
      : expected.position === position

    if (!isCorrect) {
      // Wrong!
      addParticles(x, y, '#ef4444', 15)
      setGameState('failure')
      setStreak(0)
      return
    }

    addParticles(x, y, expected.color, 8)

    if (newInput.length === expectedPattern.length) {
      // Level complete!
      const timeBonus = Math.max(0, 100 - (newInput.length * 5))
      const streakBonus = streak * 50
      const levelScore = (level * 100) + timeBonus + streakBonus

      const newScore = score + levelScore
      setScore(newScore)
      setStreak(s => s + 1)

      if (newScore > highScore) {
        setHighScore(newScore)
        localStorage.setItem('mindgrid-highscore', newScore.toString())
      }

      setGameState('success')
    }
  }, [gameState, playerInput, expectedPattern, config, selectedColor, level, score, highScore, streak, addParticles])

  const nextLevel = useCallback(() => {
    setLevel(l => l + 1)
    setTimeout(startLevel, 100)
  }, [startLevel])

  const restartGame = useCallback(() => {
    setLevel(1)
    setScore(0)
    setStreak(0)
    setGameState('menu')
  }, [])

  const retryLevel = useCallback(() => {
    startLevel()
  }, [startLevel])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  // Update config when level changes
  useEffect(() => {
    setConfig(getLevelConfig(level))
  }, [level])

  const renderGrid = () => {
    const tiles = []
    const totalTiles = config.gridSize * config.gridSize

    for (let i = 0; i < totalTiles; i++) {
      const isShowing = gameState === 'showing' && pattern[currentShowIndex]?.position === i
      const showColor = isShowing ? pattern[currentShowIndex]?.color : null

      const playerTile = playerInput.find(p => p.position === i)
      const isPlayerSelected = !!playerTile

      tiles.push(
        <button
          key={i}
          className={`grid-tile ${isShowing ? 'showing' : ''} ${isPlayerSelected ? 'selected' : ''}`}
          style={{
            '--tile-color': showColor || playerTile?.color || COLORS[0],
            backgroundColor: isShowing ? showColor : (isPlayerSelected ? playerTile.color : undefined)
          }}
          onClick={(e) => handleTileClick(i, e)}
          disabled={gameState !== 'playing'}
        />
      )
    }

    return tiles
  }

  return (
    <div className="mind-grid">
      {/* Particles */}
      <div className="particles-container">
        {particles.map(p => (
          <div
            key={p.id}
            className="particle"
            style={{
              left: p.x + Math.cos(p.angle) * (1 - p.life) * 50,
              top: p.y + Math.sin(p.angle) * (1 - p.life) * 50,
              backgroundColor: p.color,
              opacity: p.life,
              transform: `scale(${p.life})`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="game-header">
        <div className="stat">
          <span className="stat-label">Level</span>
          <span className="stat-value">{level}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Score</span>
          <span className="stat-value">{score.toLocaleString()}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Best</span>
          <span className="stat-value">{highScore.toLocaleString()}</span>
        </div>
      </div>

      {/* Streak indicator */}
      {streak > 1 && gameState !== 'menu' && (
        <div className="streak-badge">
          {streak}x Streak!
        </div>
      )}

      {/* Main game area */}
      <div className="game-area">
        {gameState === 'menu' && (
          <div className="menu-screen">
            <h1 className="game-title">Mind Grid</h1>
            <p className="game-subtitle">Pattern Memory Challenge</p>

            <div className="level-select">
              <label>Start Level</label>
              <div className="level-buttons">
                {[1, 6, 11, 16, 21, 26].map(l => (
                  <button
                    key={l}
                    className={`level-btn ${level === l ? 'active' : ''}`}
                    onClick={() => setLevel(l)}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <button className="start-btn" onClick={startLevel}>
              Start Game
            </button>

            <div className="mechanics-preview">
              <h3>Game Mechanics</h3>
              <ul>
                <li><span>1-5:</span> Basic pattern memory</li>
                <li><span>6-10:</span> Reverse the pattern</li>
                <li><span>11-15:</span> Mirror horizontally</li>
                <li><span>16-20:</span> Rotate 90°</li>
                <li><span>21-25:</span> Match colors too</li>
                <li><span>26-30:</span> Speed mode</li>
                <li><span>31+:</span> Expert challenges</li>
              </ul>
            </div>
          </div>
        )}

        {(gameState === 'showing' || gameState === 'playing') && (
          <div className="play-screen">
            <div className="level-info">
              <h2>{config.name}</h2>
              <p className={`mechanic-hint ${showHint ? 'visible' : ''}`}>
                {MECHANIC_DESCRIPTIONS[config.mechanic]}
              </p>
            </div>

            <div
              className={`grid grid-${config.gridSize}`}
              style={{ '--grid-size': config.gridSize }}
            >
              {renderGrid()}
            </div>

            {config.mechanic === 'colors' && gameState === 'playing' && (
              <div className="color-picker">
                {COLORS.map(color => (
                  <button
                    key={color}
                    className={`color-btn ${selectedColor === color ? 'active' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
            )}

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${(playerInput.length / expectedPattern.length) * 100}%`
                }}
              />
            </div>

            <p className="input-count">
              {playerInput.length} / {expectedPattern.length}
            </p>
          </div>
        )}

        {gameState === 'success' && (
          <div className="result-screen success">
            <div className="result-icon">✓</div>
            <h2>Level Complete!</h2>
            <p className="result-score">+{(level * 100) + Math.max(0, 100 - (playerInput.length * 5)) + ((streak - 1) * 50)} points</p>
            {streak > 1 && <p className="streak-bonus">Streak Bonus: +{(streak - 1) * 50}</p>}
            <button className="next-btn" onClick={nextLevel}>
              Next Level →
            </button>
          </div>
        )}

        {gameState === 'failure' && (
          <div className="result-screen failure">
            <div className="result-icon">✗</div>
            <h2>Not Quite!</h2>
            <p>You reached level {level}</p>
            <p className="final-score">Final Score: {score.toLocaleString()}</p>
            <div className="failure-buttons">
              <button className="retry-btn" onClick={retryLevel}>
                Retry Level
              </button>
              <button className="menu-btn" onClick={restartGame}>
                Main Menu
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
