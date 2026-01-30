import { useState, useEffect, useRef } from 'react'
import './BuildStory.css'

// Animated typing effect hook
function useTypewriter(text, speed = 30, start = false) {
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    if (!start) {
      setDisplayed('')
      return
    }

    let i = 0
    setDisplayed('')
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1))
        i++
      } else {
        clearInterval(timer)
      }
    }, speed)

    return () => clearInterval(timer)
  }, [text, speed, start])

  return displayed
}

// Animated counter
function AnimatedNumber({ value, duration = 1000 }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    let start = 0
    const increment = value / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= value) {
        setDisplay(value)
        clearInterval(timer)
      } else {
        setDisplay(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [value, duration])

  return <span>{display}</span>
}

// File tree animation component
function FileTree({ files, animate }) {
  return (
    <div className={`file-tree ${animate ? 'animate' : ''}`}>
      {files.map((file, i) => (
        <div
          key={file}
          className="file-item"
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          <span className="file-icon">{file.includes('/') ? '📁' : '📄'}</span>
          <span className="file-name">{file}</span>
        </div>
      ))}
    </div>
  )
}

// Animated architecture diagram
function ArchitectureDiagram({ animate }) {
  return (
    <div className={`architecture-diagram ${animate ? 'animate' : ''}`}>
      <div className="arch-layer layer-1">
        <div className="arch-box user">
          <span className="arch-icon">👤</span>
          <span>User</span>
        </div>
      </div>

      <div className="arch-arrow arrow-1">
        <div className="arrow-line" />
        <div className="arrow-head">▼</div>
      </div>

      <div className="arch-layer layer-2">
        <div className="arch-box netlify">
          <span className="arch-icon">◈</span>
          <span>Netlify</span>
        </div>
      </div>

      <div className="arch-arrow arrow-2">
        <div className="arrow-line" />
        <div className="arrow-head">▼</div>
      </div>

      <div className="arch-layer layer-3">
        <div className="arch-box react">
          <span className="arch-icon">⚛</span>
          <span>React App</span>
        </div>
      </div>

      <div className="arch-arrow arrow-3">
        <div className="arrow-line" />
        <div className="arrow-head">▼</div>
      </div>

      <div className="arch-layer layer-4">
        <div className="arch-box demo">
          <span className="arch-icon">🎮</span>
          <span>Demo 1</span>
        </div>
        <div className="arch-box demo">
          <span className="arch-icon">📱</span>
          <span>Demo 2</span>
        </div>
        <div className="arch-box demo">
          <span className="arch-icon">📖</span>
          <span>Demo 3</span>
        </div>
      </div>
    </div>
  )
}

// Game mechanics visual
function GameMechanicsVisual({ animate }) {
  const mechanics = [
    { name: 'Basic', icon: '▢', color: '#6366f1', transform: 'none' },
    { name: 'Reverse', icon: '◀', color: '#f59e0b', transform: 'reverse' },
    { name: 'Mirror', icon: '⟷', color: '#ec4899', transform: 'mirror' },
    { name: 'Rotate', icon: '↻', color: '#22c55e', transform: 'rotate' },
    { name: 'Colors', icon: '◉', color: '#06b6d4', transform: 'colors' },
    { name: 'Speed', icon: '⚡', color: '#ef4444', transform: 'speed' },
  ]

  return (
    <div className={`mechanics-visual ${animate ? 'animate' : ''}`}>
      {mechanics.map((m, i) => (
        <div
          key={m.name}
          className={`mechanic-card ${m.transform}`}
          style={{
            '--color': m.color,
            animationDelay: `${i * 0.15}s`
          }}
        >
          <div className="mechanic-demo">
            <div className="mini-grid">
              {[0,1,2,3,4,5,6,7,8].map(j => (
                <div
                  key={j}
                  className={`mini-tile ${[1,4,7].includes(j) ? 'active' : ''}`}
                />
              ))}
            </div>
            <div className="transform-arrow">→</div>
            <div className={`mini-grid transformed ${m.transform}`}>
              {[0,1,2,3,4,5,6,7,8].map(j => (
                <div
                  key={j}
                  className={`mini-tile ${[1,4,7].includes(j) ? 'active' : ''}`}
                />
              ))}
            </div>
          </div>
          <span className="mechanic-icon" style={{ color: m.color }}>{m.icon}</span>
          <span className="mechanic-name">{m.name}</span>
        </div>
      ))}
    </div>
  )
}

// Skills radar chart visual
function SkillsRadar({ animate }) {
  const skills = [
    { name: 'Fundamentals', angle: 0 },
    { name: 'AI Literacy', angle: 72 },
    { name: 'Practical', angle: 144 },
    { name: 'Human Skills', angle: 216 },
    { name: 'Career', angle: 288 },
  ]

  return (
    <div className={`skills-radar ${animate ? 'animate' : ''}`}>
      <svg viewBox="0 0 200 200">
        {/* Background circles */}
        {[20, 40, 60, 80].map(r => (
          <circle
            key={r}
            cx="100"
            cy="100"
            r={r}
            fill="none"
            stroke="var(--border)"
            strokeWidth="1"
            opacity="0.3"
          />
        ))}

        {/* Skill lines */}
        {skills.map((skill, i) => {
          const rad = (skill.angle - 90) * Math.PI / 180
          const x2 = 100 + Math.cos(rad) * 85
          const y2 = 100 + Math.sin(rad) * 85
          return (
            <line
              key={i}
              x1="100"
              y1="100"
              x2={x2}
              y2={y2}
              stroke="var(--border)"
              strokeWidth="1"
              opacity="0.3"
            />
          )
        })}

        {/* Filled area */}
        <polygon
          className="radar-fill"
          points={skills.map((skill, i) => {
            const rad = (skill.angle - 90) * Math.PI / 180
            const r = 50 + Math.random() * 25
            const x = 100 + Math.cos(rad) * r
            const y = 100 + Math.sin(rad) * r
            return `${x},${y}`
          }).join(' ')}
        />

        {/* Labels */}
        {skills.map((skill, i) => {
          const rad = (skill.angle - 90) * Math.PI / 180
          const x = 100 + Math.cos(rad) * 95
          const y = 100 + Math.sin(rad) * 95
          return (
            <text
              key={i}
              x={x}
              y={y}
              className="radar-label"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {skill.name}
            </text>
          )
        })}
      </svg>
    </div>
  )
}

// Conversation bubble
function ConversationBubble({ role, children, animate, delay = 0 }) {
  return (
    <div
      className={`conversation-bubble ${role} ${animate ? 'animate' : ''}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="bubble-avatar">
        {role === 'human' ? '👨‍🏫' : '🤖'}
      </div>
      <div className="bubble-content">
        {children}
      </div>
    </div>
  )
}

// Main component
const SLIDES = [
  { id: 'title', type: 'title' },
  { id: 'idea', type: 'idea' },
  { id: 'architecture', type: 'architecture' },
  { id: 'deploy', type: 'deploy' },
  { id: 'game-request', type: 'game-request' },
  { id: 'game-mechanics', type: 'game-mechanics' },
  { id: 'game-result', type: 'game-result' },
  { id: 'productivity-request', type: 'productivity-request' },
  { id: 'productivity-visual', type: 'productivity-visual' },
  { id: 'security-request', type: 'security-request' },
  { id: 'security-visual', type: 'security-visual' },
  { id: 'stats', type: 'stats' },
  { id: 'takeaway', type: 'takeaway' },
]

export default function BuildStory() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const slideRef = useRef(null)

  const navigate = (direction) => {
    if (isAnimating) return
    const newIndex = direction === 'next'
      ? Math.min(currentSlide + 1, SLIDES.length - 1)
      : Math.max(currentSlide - 1, 0)

    if (newIndex !== currentSlide) {
      setIsAnimating(true)
      setCurrentSlide(newIndex)
      setTimeout(() => setIsAnimating(false), 800)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        navigate('next')
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        navigate('prev')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentSlide, isAnimating])

  // Touch handling
  const touchStart = useRef(null)
  const handleTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX
  }
  const handleTouchEnd = (e) => {
    if (!touchStart.current) return
    const diff = touchStart.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      navigate(diff > 0 ? 'next' : 'prev')
    }
    touchStart.current = null
  }

  const progress = ((currentSlide + 1) / SLIDES.length) * 100
  const slide = SLIDES[currentSlide]

  const renderSlide = () => {
    const animate = !isAnimating

    switch (slide.type) {
      case 'title':
        return (
          <div className="slide-title-screen">
            <div className="title-visual">
              <div className="collab-icons">
                <span className="icon-human">👨‍🏫</span>
                <span className="icon-plus">+</span>
                <span className="icon-ai">🤖</span>
              </div>
              <div className="title-equals">=</div>
              <div className="title-result">
                <span>✨</span>
              </div>
            </div>
            <h1>Human + AI Collaboration</h1>
            <p className="subtitle">The story of how this was built</p>
            <div className="start-hint">
              <span className="arrow-bounce">→</span>
              Press arrow keys or swipe to begin
            </div>
          </div>
        )

      case 'idea':
        return (
          <div className="slide-idea">
            <div className="idea-visual">
              <div className="thought-bubble">
                <span className="thought-icon">💭</span>
                <div className="thought-content">
                  <span>📱</span>
                  <span>🎮</span>
                  <span>🚀</span>
                </div>
              </div>
              <div className="person-icon">👨‍🏫</div>
            </div>
            <ConversationBubble role="human" animate={animate}>
              <p className="quote">"I want to demonstrate AI capabilities to my students..."</p>
            </ConversationBubble>
            <div className="idea-tags">
              <span className="tag">Interactive demos</span>
              <span className="tag">Mobile-friendly</span>
              <span className="tag">Deploy on Netlify</span>
            </div>
          </div>
        )

      case 'architecture':
        return (
          <div className="slide-architecture">
            <h2>Building the Foundation</h2>
            <ArchitectureDiagram animate={animate} />
            <div className="tech-badges">
              <span className="tech-badge">React</span>
              <span className="tech-badge">Vite</span>
              <span className="tech-badge">Router</span>
              <span className="tech-badge">Netlify</span>
            </div>
          </div>
        )

      case 'deploy':
        return (
          <div className="slide-deploy">
            <h2>Deploy First, Build Later</h2>
            <div className="deploy-visual">
              <div className="deploy-step step-1">
                <div className="step-icon">📁</div>
                <div className="step-label">Empty Shell</div>
              </div>
              <div className="deploy-arrow">→</div>
              <div className="deploy-step step-2">
                <div className="step-icon">☁️</div>
                <div className="step-label">Deploy</div>
              </div>
              <div className="deploy-arrow">→</div>
              <div className="deploy-step step-3">
                <div className="step-icon">✅</div>
                <div className="step-label">Verified!</div>
              </div>
            </div>
            <p className="deploy-insight">Validate the pipeline before building features</p>
          </div>
        )

      case 'game-request':
        return (
          <div className="slide-game-request">
            <ConversationBubble role="human" animate={animate}>
              <p className="quote">"Build an impressive game that will WOW my students!"</p>
            </ConversationBubble>
            <div className="requirements-visual">
              <div className="req-item"><span>🧠</span>Intellectual</div>
              <div className="req-item"><span>📱</span>Mobile</div>
              <div className="req-item"><span>🎮</span>Multiple Levels</div>
              <div className="req-item"><span>🤩</span>Wow Factor</div>
              <div className="req-item"><span>😄</span>Pure Fun</div>
            </div>
          </div>
        )

      case 'game-mechanics':
        return (
          <div className="slide-game-mechanics">
            <h2>Mind Grid: 6 Evolving Mechanics</h2>
            <GameMechanicsVisual animate={animate} />
            <p className="mechanics-insight">Same game, new rules every 5 levels</p>
          </div>
        )

      case 'game-result':
        return (
          <div className="slide-game-result">
            <div className="time-badge">
              <span className="time-icon">⏱️</span>
              <span>~10 min to build</span>
            </div>
            <div className="result-showcase">
              <div className="mock-game">
                <div className="mock-header">
                  <span>Level 12</span>
                  <span>Score: 2,450</span>
                </div>
                <div className="mock-grid">
                  {[...Array(16)].map((_, i) => (
                    <div
                      key={i}
                      className={`mock-tile ${[2,5,9,14].includes(i) ? 'lit' : ''}`}
                    />
                  ))}
                </div>
                <div className="mock-hint">Mirror the pattern!</div>
              </div>
            </div>
            <div className="result-stats">
              <div className="stat-item">
                <span className="stat-num"><AnimatedNumber value={30} /></span>
                <span className="stat-label">Levels</span>
              </div>
              <div className="stat-item">
                <span className="stat-num"><AnimatedNumber value={6} /></span>
                <span className="stat-label">Mechanics</span>
              </div>
              <div className="stat-item">
                <span className="stat-num"><AnimatedNumber value={450} /></span>
                <span className="stat-label">Lines</span>
              </div>
            </div>
          </div>
        )

      case 'productivity-request':
        return (
          <div className="slide-productivity-request">
            <ConversationBubble role="human" animate={animate}>
              <p className="quote">"Build a productivity app for CS students preparing for the AI-era job market"</p>
            </ConversationBubble>
            <div className="context-visual">
              <div className="context-item old">
                <span>📚</span>
                <span>Old Way</span>
              </div>
              <div className="context-arrow">→</div>
              <div className="context-item new">
                <span>🤖</span>
                <span>AI Era</span>
              </div>
            </div>
            <p className="context-question">How do students stay competitive?</p>
          </div>
        )

      case 'productivity-visual':
        return (
          <div className="slide-productivity-visual">
            <div className="time-badge">
              <span className="time-icon">⏱️</span>
              <span>~8 min to build</span>
            </div>
            <h2>DevPath: Career-Ready Habits</h2>
            <div className="devpath-showcase">
              <div className="showcase-section">
                <h3>Daily Habits</h3>
                <div className="habit-list">
                  {['💻 Code', '📚 Learn', '🧩 Solve', '🔨 Build', '🤝 Connect', '🤖 AI Tools'].map((h, i) => (
                    <div key={i} className="habit-item" style={{ animationDelay: `${i * 0.1}s` }}>
                      {h}
                    </div>
                  ))}
                </div>
              </div>
              <div className="showcase-section">
                <h3>Skill Roadmap</h3>
                <SkillsRadar animate={animate} />
              </div>
            </div>
          </div>
        )

      case 'security-request':
        return (
          <div className="slide-security-request">
            <ConversationBubble role="human" animate={animate}>
              <p className="quote">"Build an app that scans websites for security vulnerabilities and shows a dashboard"</p>
            </ConversationBubble>
            <div className="security-goals">
              <div className="goal-item"><span>🔒</span>HTTPS Check</div>
              <div className="goal-item"><span>📋</span>Security Headers</div>
              <div className="goal-item"><span>📊</span>Score Dashboard</div>
              <div className="goal-item"><span>💡</span>Recommendations</div>
            </div>
            <p className="security-note">Passive analysis only - no attacks</p>
          </div>
        )

      case 'security-visual':
        return (
          <div className="slide-security-visual">
            <div className="time-badge">
              <span className="time-icon">⏱️</span>
              <span>~7 min to build</span>
            </div>
            <h2>SecureScan Dashboard</h2>
            <div className="security-demo">
              <div className="mock-scanner">
                <div className="mock-score">
                  <span className="grade">B</span>
                  <span className="score-num">78</span>
                </div>
                <div className="mock-checks">
                  <div className="mock-check pass">✓ HTTPS</div>
                  <div className="mock-check pass">✓ HSTS</div>
                  <div className="mock-check fail">✗ CSP</div>
                  <div className="mock-check pass">✓ X-Frame</div>
                </div>
              </div>
            </div>
            <div className="security-features">
              <span>10 Security Checks</span>
              <span>•</span>
              <span>Letter Grade</span>
              <span>•</span>
              <span>Fix Recommendations</span>
            </div>
          </div>
        )

      case 'stats':
        return (
          <div className="slide-stats">
            <h2>What We Built Together</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📁</div>
                <div className="stat-value"><AnimatedNumber value={25} /></div>
                <div className="stat-desc">Files Created</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💻</div>
                <div className="stat-value"><AnimatedNumber value={3200} /></div>
                <div className="stat-desc">Lines of Code</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🎯</div>
                <div className="stat-value"><AnimatedNumber value={4} /></div>
                <div className="stat-desc">Complete Apps</div>
              </div>
              <div className="stat-card highlight">
                <div className="stat-icon">⏱️</div>
                <div className="stat-value">~35</div>
                <div className="stat-desc">Minutes Total</div>
              </div>
            </div>
            <div className="time-breakdown">
              <div className="time-item">
                <span className="time-label">🏗️ Infrastructure</span>
                <div className="time-bar" style={{ '--width': '14%' }}></div>
                <span className="time-min">5m</span>
              </div>
              <div className="time-item">
                <span className="time-label">🎮 Mind Grid</span>
                <div className="time-bar" style={{ '--width': '29%' }}></div>
                <span className="time-min">10m</span>
              </div>
              <div className="time-item">
                <span className="time-label">📱 DevPath</span>
                <div className="time-bar" style={{ '--width': '23%' }}></div>
                <span className="time-min">8m</span>
              </div>
              <div className="time-item">
                <span className="time-label">🛡️ SecureScan</span>
                <div className="time-bar" style={{ '--width': '20%' }}></div>
                <span className="time-min">7m</span>
              </div>
              <div className="time-item">
                <span className="time-label">📖 This Story</span>
                <div className="time-bar" style={{ '--width': '14%' }}></div>
                <span className="time-min">5m</span>
              </div>
            </div>
          </div>
        )

      case 'takeaway':
        return (
          <div className="slide-takeaway">
            <div className="takeaway-visual">
              <div className="takeaway-equation">
                <div className="eq-part">
                  <span className="eq-icon">💡</span>
                  <span>Your Ideas</span>
                </div>
                <span className="eq-plus">+</span>
                <div className="eq-part">
                  <span className="eq-icon">🤖</span>
                  <span>AI Execution</span>
                </div>
                <span className="eq-equals">=</span>
                <div className="eq-part result">
                  <span className="eq-icon">🚀</span>
                  <span>10x Output</span>
                </div>
              </div>
            </div>
            <div className="key-lessons">
              <div className="lesson">
                <span className="lesson-num">1</span>
                <span>Clear requirements → Better results</span>
              </div>
              <div className="lesson">
                <span className="lesson-num">2</span>
                <span>Iterate fast, deploy often</span>
              </div>
              <div className="lesson">
                <span className="lesson-num">3</span>
                <span>Human creativity + AI capability</span>
              </div>
            </div>
            <p className="final-message">This is how you work with AI.</p>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div
      className="build-story"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Progress bar */}
      <div className="story-progress">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Slide counter */}
      <div className="slide-counter">
        {currentSlide + 1} / {SLIDES.length}
      </div>

      {/* Main slide */}
      <div
        ref={slideRef}
        className={`slide-container ${isAnimating ? 'animating' : ''}`}
        key={currentSlide}
      >
        {renderSlide()}
      </div>

      {/* Navigation */}
      <div className="story-nav">
        <button
          className="nav-btn"
          onClick={() => navigate('prev')}
          disabled={currentSlide === 0}
        >
          ←
        </button>
        <div className="nav-dots">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              className={`nav-dot ${i === currentSlide ? 'active' : ''}`}
              onClick={() => {
                if (!isAnimating && i !== currentSlide) {
                  setIsAnimating(true)
                  setCurrentSlide(i)
                  setTimeout(() => setIsAnimating(false), 800)
                }
              }}
            />
          ))}
        </div>
        <button
          className="nav-btn"
          onClick={() => navigate('next')}
          disabled={currentSlide === SLIDES.length - 1}
        >
          →
        </button>
      </div>
    </div>
  )
}
