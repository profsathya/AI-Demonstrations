import { useState, useEffect, useCallback } from 'react'
import './AbstractionExplorer.css'

// Journey stages for the programming domain
const PROGRAMMING_JOURNEY = [
  {
    level: 0,
    name: 'Transistors',
    complexity: [
      '10110000 01100001',
      'Voltage: 3.3V → 0V',
      'Clock: 0.3 nanoseconds',
    ],
    question: 'Want to write "Hello World" by controlling billions of tiny switches?',
    noResponse: "Yeah... that sounds impossible.",
    insight: "Let's hide all that and give you something simpler...",
    emoji: '🔌',
    // Challenge when they say "I'll try"
    challenge: {
      task: 'Set these transistor voltages to store the letter "H"',
      display: ['Gate A7: ___ V', 'Gate B3: ___ V', 'Gate C1: ___ V', 'Gate D9: ___ V', 'Gate E2: ___ V', 'Gate F6: ___ V', 'Gate G4: ___ V', 'Gate H8: ___ V'],
      hint: '(Hint: H = 01001000 in binary, each bit needs specific voltage timing...)',
      giveUpText: "This is overwhelming... there must be a better way"
    },
    // What becomes possible at the NEXT level
    nextLevelUnlocks: null // First level, nothing before it
  },
  {
    level: 1,
    name: 'Machine Code',
    complexity: [
      'B8 04 00 00 00',
      'BB 01 00 00 00',
      'CD 80',
    ],
    question: 'Better! But want to memorize hundreds of hex codes?',
    noResponse: "Still cryptic...",
    insight: "Let's give those numbers human-readable names...",
    emoji: '🔢',
    challenge: {
      task: 'Write the machine code to print "Hi"',
      display: ['Byte 1: ___', 'Byte 2: ___', 'Byte 3: ___', 'Byte 4: ___', '(Look up: syscall numbers, register codes, ASCII values...)'],
      hint: '(You need to memorize: B8=mov eax, BB=mov ebx, CD=int...)',
      giveUpText: "I can't memorize all these codes..."
    },
    levelUnlocks: "You no longer manage individual transistors! 🎉"
  },
  {
    level: 2,
    name: 'Assembly',
    complexity: [
      'mov eax, 4',
      'mov ebx, 1',
      'int 0x80',
    ],
    question: 'Readable! But want to manage every register and memory address?',
    noResponse: "Getting better, but tedious.",
    insight: "What if the computer figured out the registers for you...",
    emoji: '⚙️',
    challenge: {
      task: 'Write assembly to print "Hello World"',
      display: ['section .data', '  msg db "Hello World",0xa', '  len equ $ - msg', 'section .text', '  global _start', '_start:', '  mov eax, ???', '  mov ebx, ???', '  mov ecx, ???', '  mov edx, ???', '  int 0x80'],
      hint: '(You need: syscall numbers, stdout fd, string address, length calculation...)',
      giveUpText: "So many details to track..."
    },
    levelUnlocks: "Hex codes are hidden! You can read the instructions now."
  },
  {
    level: 3,
    name: 'High-Level Code',
    complexity: [
      'print("Hello World")',
    ],
    question: 'ONE LINE! Does this feel better?',
    yesResponse: "That's it! The computer handles everything else!",
    insight: "But wait... we can go even higher...",
    emoji: '💻',
    isBreakthrough: true,
    levelUnlocks: "Memory, registers, syscalls - ALL hidden! Just say what you want.",
    newPowers: ['Write once, run anywhere', 'Automatic memory management', 'Error messages you can read', '1000x faster to write']
  },
  {
    level: 4,
    name: 'Frameworks',
    complexity: [
      '<Button onClick={sayHello}>',
      '  Say Hello',
      '</Button>',
    ],
    question: 'What if common patterns were pre-built?',
    yesResponse: "Thousands of lines of code, wrapped in simple components!",
    insight: "And now, the ultimate level...",
    emoji: '📦',
    isBreakthrough: true,
    levelUnlocks: "Browser compatibility, event handling, DOM manipulation - handled!",
    newPowers: ['Build in hours, not months', 'Stand on giants\' shoulders', 'Focus on YOUR unique idea']
  },
  {
    level: 5,
    name: 'AI / No-Code',
    complexity: [
      '"Make me a website',
      ' with a contact form"',
    ],
    question: 'What if you just... described what you want?',
    yesResponse: "You don't even need to know programming exists underneath!",
    insight: null,
    emoji: '🤖',
    isFinal: true,
    levelUnlocks: "ALL programming knowledge - optional! Just describe your vision.",
    newPowers: ['Anyone can create', 'Ideas → Reality in minutes', 'Focus purely on WHAT, not HOW']
  }
]

const DOMAINS = {
  programming: {
    id: 'programming',
    title: 'Programming',
    icon: '💻',
    journey: PROGRAMMING_JOURNEY,
    taskDescription: 'Print "Hello World"'
  },
  interfaces: {
    id: 'interfaces',
    title: 'Interfaces',
    icon: '🖥️',
    taskDescription: 'Set a 5-minute timer',
    journey: [
      {
        level: 0, name: 'Switches & Cards', emoji: '🔘',
        complexity: ['Flip switch A7', 'Punch card: ○●○●●'],
        question: 'Want to flip switches and punch cards to set a timer?',
        noResponse: "That's exhausting...",
        insight: "Let's type commands instead...",
        challenge: {
          task: 'Punch the right holes to encode "5 minutes"',
          display: ['Row 1: ○ ○ ○ ○ ○ ○ ○ ○', 'Row 2: ○ ○ ○ ○ ○ ○ ○ ○', 'Row 3: ○ ○ ○ ○ ○ ○ ○ ○', '(Which holes represent "5"? Which represent "minutes"? Which row is data vs control?)'],
          hint: '(You need the codebook to know which holes mean what...)',
          giveUpText: "I don't even know where to start..."
        }
      },
      {
        level: 1, name: 'Command Line', emoji: '⌨️',
        complexity: ['$ sleep 300 && echo "Timer done" && afplay /System/Library/Sounds/Glass.aiff'],
        question: 'Want to memorize command syntax?',
        noResponse: "Too much to remember...",
        insight: "What if you could just click...",
        challenge: {
          task: 'Type the command to set a 5-minute timer with sound',
          display: ['$ _______', '(What\'s the sleep command? How many seconds in 5 min? How to play sound? Which sound file?)'],
          hint: '(sleep uses seconds, so 5 min = ???, then chain with && ...)',
          giveUpText: "I have to calculate seconds AND know sound file paths?"
        },
        levelUnlocks: "No more physical cards! Just type words."
      },
      {
        level: 2, name: 'GUI', emoji: '🖱️',
        complexity: ['🖱️ Click Clock app', '➕ Click "+"', '⏱️ Set 5:00'],
        question: 'Click, drag, done. No memorization needed!',
        yesResponse: "A child could do this!",
        insight: "But we can go even simpler...",
        isBreakthrough: true,
        levelUnlocks: "Commands are hidden! Just click what you see.",
        newPowers: ['Discoverable interface', 'No memorization', 'Visual feedback']
      },
      {
        level: 3, name: 'Touch', emoji: '👆',
        complexity: ['👆 Tap Clock', '👆 Tap Timer', '👆 Tap 5:00'],
        question: 'Just tap with your finger!',
        yesResponse: "Toddlers figure this out!",
        insight: "One more level...",
        isBreakthrough: true,
        levelUnlocks: "No mouse needed! Use your fingers naturally.",
        newPowers: ['Intuitive gestures', 'Mobile anywhere', 'No hardware skills needed']
      },
      {
        level: 4, name: 'Voice', emoji: '🗣️',
        complexity: ['"Hey Siri,', 'set a timer', 'for 5 minutes"'],
        question: 'What if you just... talked?',
        yesResponse: "Zero learning required. Just speak!",
        isFinal: true,
        levelUnlocks: "All interface knowledge - unnecessary! Just speak naturally.",
        newPowers: ['Hands-free', 'Natural language', 'Accessible to everyone']
      }
    ]
  }
}

// Challenge screen component
function ChallengeScreen({ challenge, onGiveUp, taskName }) {
  const [seconds, setSeconds] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [showGiveUp, setShowGiveUp] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(s => s + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (seconds >= 3) setShowHint(true)
    if (seconds >= 6) setShowGiveUp(true)
  }, [seconds])

  return (
    <div className="challenge-screen">
      <div className="challenge-header">
        <span className="challenge-icon">💪</span>
        <h3>OK, let's try!</h3>
      </div>

      <div className="challenge-task">
        <span className="task-label">Your task:</span>
        <span className="task-name">{challenge.task}</span>
      </div>

      <div className="challenge-workspace">
        {challenge.display.map((line, i) => (
          <div key={i} className="workspace-line">{line}</div>
        ))}
      </div>

      {showHint && (
        <div className="challenge-hint">
          {challenge.hint}
        </div>
      )}

      <div className="challenge-timer">
        ⏱️ {seconds}s elapsed...
      </div>

      {showGiveUp && (
        <button className="give-up-btn" onClick={onGiveUp}>
          😅 {challenge.giveUpText}
        </button>
      )}
    </div>
  )
}

// What you unlocked display
function UnlocksDisplay({ unlocks, newPowers }) {
  return (
    <div className="unlocks-display">
      <div className="unlock-header">
        <span className="unlock-icon">🔓</span>
        <span>What this level hides:</span>
      </div>
      <p className="unlock-text">{unlocks}</p>

      {newPowers && newPowers.length > 0 && (
        <div className="new-powers">
          <span className="powers-label">✨ New abilities unlocked:</span>
          <ul className="powers-list">
            {newPowers.map((power, i) => (
              <li key={i} style={{ animationDelay: `${i * 0.15}s` }}>{power}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// Stack of previous abstractions
function AbstractionStack({ levels }) {
  if (levels.length === 0) return null

  return (
    <div className="abstraction-stack">
      <span className="stack-label">Hidden below:</span>
      {levels.map((lvl, i) => (
        <div
          key={lvl.level}
          className="stacked-level"
          style={{ opacity: 1 - (i * 0.12) }}
        >
          <span className="stack-emoji">{lvl.emoji}</span>
          <span className="stack-name">{lvl.name}</span>
        </div>
      ))}
    </div>
  )
}

function JourneyExplorer({ domain, onComplete, onBack }) {
  const [stage, setStage] = useState(0)
  const [phase, setPhase] = useState('show') // show, question, challenge, gaveUp, response, boxing, insight, unlocks
  const [boxedLevels, setBoxedLevels] = useState([])

  const currentStep = domain.journey[stage]

  const handleResponse = useCallback((answer) => {
    if (answer === 'no') {
      setPhase('response')
      setTimeout(() => {
        setPhase('boxing')
        setTimeout(() => {
          setBoxedLevels(prev => [...prev, currentStep])
          if (currentStep.insight) {
            setPhase('insight')
            setTimeout(() => advanceToNextLevel(), 2000)
          } else {
            advanceToNextLevel()
          }
        }, 1500)
      }, 1500)
    } else if (answer === 'yes-hard') {
      // They want to try - show the challenge!
      setPhase('challenge')
    } else if (answer === 'yes' && (currentStep.isBreakthrough || currentStep.isFinal)) {
      setPhase('response')
      setTimeout(() => {
        if (currentStep.isFinal) {
          setPhase('complete')
        } else {
          // Show what this level unlocked
          setPhase('unlocks')
          setTimeout(() => {
            setPhase('boxing')
            setTimeout(() => {
              setBoxedLevels(prev => [...prev, currentStep])
              if (currentStep.insight) {
                setPhase('insight')
                setTimeout(() => advanceToNextLevel(), 2000)
              } else {
                advanceToNextLevel()
              }
            }, 1500)
          }, 3000)
        }
      }, 1500)
    }
  }, [currentStep, stage])

  const handleGiveUp = useCallback(() => {
    setPhase('gaveUp')
    setTimeout(() => {
      setPhase('boxing')
      setTimeout(() => {
        setBoxedLevels(prev => [...prev, currentStep])
        // Show what the next level unlocks
        const nextStep = domain.journey[stage + 1]
        if (nextStep && nextStep.levelUnlocks) {
          setPhase('unlocks-next')
          setTimeout(() => advanceToNextLevel(), 3000)
        } else if (currentStep.insight) {
          setPhase('insight')
          setTimeout(() => advanceToNextLevel(), 2000)
        } else {
          advanceToNextLevel()
        }
      }, 1500)
    }, 1500)
  }, [currentStep, stage, domain.journey])

  const advanceToNextLevel = useCallback(() => {
    setStage(s => s + 1)
    setPhase('show')
  }, [])

  useEffect(() => {
    if (phase === 'show') {
      const timer = setTimeout(() => setPhase('question'), 1500)
      return () => clearTimeout(timer)
    }
  }, [phase, stage])

  if (phase === 'complete') {
    return (
      <div className="journey-complete">
        <div className="complete-visual">
          <div className="level-tower">
            {domain.journey.map((step, i) => (
              <div
                key={i}
                className="tower-level"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <span className="tower-emoji">{step.emoji}</span>
                <span className="tower-name">{step.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="complete-message">
          <h2>🎉 You Climbed the Abstraction Ladder!</h2>
          <p>Each level <strong>hid complexity</strong> AND <strong>unlocked new powers</strong>.</p>

          <div className="aha-final">
            <span className="aha-icon">💡</span>
            <p>
              <strong>The same task: "{domain.taskDescription}"</strong><br/><br/>
              At Level 0: Nearly impossible<br/>
              At Level {domain.journey.length - 1}: Trivially easy<br/><br/>
              <em>That's the power of abstraction.</em>
            </p>
          </div>
        </div>

        <div className="complete-actions">
          <button className="action-btn secondary" onClick={onBack}>
            ← Try Another Domain
          </button>
          <button className="action-btn primary" onClick={onComplete}>
            🧠 See The Big Picture
          </button>
        </div>
      </div>
    )
  }

  const nextStep = domain.journey[stage + 1]

  return (
    <div className="journey-explorer">
      <button className="back-button" onClick={onBack}>← Back</button>

      <div className="journey-progress">
        {domain.journey.map((_, i) => (
          <div
            key={i}
            className={`progress-dot ${i < stage ? 'done' : ''} ${i === stage ? 'current' : ''}`}
          />
        ))}
      </div>

      <AbstractionStack levels={[...boxedLevels].reverse()} />

      <div className="journey-stage">
        <div className="level-header">
          <span className="level-emoji">{currentStep.emoji}</span>
          <div className="level-info">
            <span className="level-badge">Level {currentStep.level}</span>
            <h2>{currentStep.name}</h2>
          </div>
        </div>

        {/* Current task reminder */}
        <div className="task-reminder">
          <span>Task: {domain.taskDescription}</span>
        </div>

        {phase === 'challenge' && currentStep.challenge && (
          <ChallengeScreen
            challenge={currentStep.challenge}
            onGiveUp={handleGiveUp}
            taskName={domain.taskDescription}
          />
        )}

        {phase !== 'challenge' && (
          <div className={`abstraction-box ${phase === 'boxing' ? 'boxing' : ''}`}>
            <div className="box-label">L{currentStep.level}</div>
            <div className={`complexity-display ${phase === 'boxing' ? 'hiding' : ''} ${currentStep.isBreakthrough || currentStep.isFinal ? 'simple' : ''}`}>
              {currentStep.complexity.map((item, i) => (
                <div key={i} className="complexity-line" style={{ animationDelay: `${i * 0.1}s` }}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}

        {phase === 'question' && (
          <div className="question-section">
            <p className="question-text">{currentStep.question}</p>
            <div className="response-buttons">
              {currentStep.isBreakthrough || currentStep.isFinal ? (
                <button className="response-btn yes" onClick={() => handleResponse('yes')}>
                  Yes! 🎉
                </button>
              ) : (
                <>
                  <button className="response-btn no" onClick={() => handleResponse('no')}>
                    No way 😅
                  </button>
                  <button className="response-btn yes-hard" onClick={() => handleResponse('yes-hard')}>
                    I'll try! 💪
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {phase === 'response' && (
          <div className="response-section">
            <p className="response-text">
              {currentStep.yesResponse || currentStep.noResponse}
            </p>
          </div>
        )}

        {phase === 'gaveUp' && (
          <div className="response-section gave-up">
            <p className="response-text">
              😌 It's OK! That's exactly why we build abstractions...
            </p>
          </div>
        )}

        {phase === 'insight' && currentStep.insight && (
          <div className="insight-section">
            <span className="insight-arrow">↑</span>
            <p className="insight-text">{currentStep.insight}</p>
          </div>
        )}

        {phase === 'unlocks' && currentStep.levelUnlocks && (
          <UnlocksDisplay
            unlocks={currentStep.levelUnlocks}
            newPowers={currentStep.newPowers}
          />
        )}

        {phase === 'unlocks-next' && nextStep && nextStep.levelUnlocks && (
          <UnlocksDisplay
            unlocks={nextStep.levelUnlocks}
            newPowers={nextStep.newPowers}
          />
        )}
      </div>
    </div>
  )
}

function Synthesis({ onBack }) {
  const [revealed, setRevealed] = useState(0)

  const insights = [
    { icon: '📦', title: 'Each Layer Hides & Enables', text: 'Abstraction isn\'t just hiding complexity—it UNLOCKS new abilities you couldn\'t have otherwise.' },
    { icon: '🎯', title: 'Same Task, Different Effort', text: 'The same goal can be trivial or impossible depending on your abstraction level.' },
    { icon: '🏗️', title: 'You Can Build Layers Too', text: 'Every function you write, every API you design—you\'re creating abstractions for others (or future you).' },
  ]

  return (
    <div className="synthesis-view">
      <button className="back-button" onClick={onBack}>← Back</button>

      <div className="synthesis-header">
        <span className="big-brain">🧠</span>
        <h1>The Big Picture</h1>
      </div>

      <div className="synthesis-insights">
        {insights.map((insight, i) => (
          <div
            key={i}
            className={`synthesis-card ${revealed > i ? 'revealed' : ''}`}
            onClick={() => setRevealed(Math.max(revealed, i + 1))}
          >
            {revealed > i ? (
              <>
                <span className="card-icon">{insight.icon}</span>
                <h3>{insight.title}</h3>
                <p>{insight.text}</p>
              </>
            ) : (
              <span className="tap-reveal">Tap to reveal insight {i + 1}</span>
            )}
          </div>
        ))}
      </div>

      {revealed >= 3 && (
        <div className="final-wisdom">
          <p className="wisdom-text">
            <strong>The real superpower:</strong><br/>
            Knowing which level to work at,<br/>
            when to peek beneath,<br/>
            and when to build new layers.
          </p>
          <p className="wisdom-call">
            Next time something feels impossibly complex—<br/>
            ask: "Is there a higher abstraction for this?" 🪜
          </p>
        </div>
      )}
    </div>
  )
}

export default function AbstractionExplorer() {
  const [view, setView] = useState('home')
  const [selectedDomain, setSelectedDomain] = useState(null)

  const startJourney = (domainId) => {
    setSelectedDomain(DOMAINS[domainId])
    setView('journey')
  }

  if (view === 'journey' && selectedDomain) {
    return (
      <JourneyExplorer
        domain={selectedDomain}
        onComplete={() => setView('synthesis')}
        onBack={() => setView('home')}
      />
    )
  }

  if (view === 'synthesis') {
    return <Synthesis onBack={() => setView('home')} />
  }

  return (
    <div className="abstraction-home">
      <div className="home-hero">
        <div className="hero-visual">
          <div className="layer-preview">
            <div className="preview-box l5">✨ Easy</div>
            <div className="preview-box l4">↑</div>
            <div className="preview-box l3">↑ abstractions</div>
            <div className="preview-box l2">↑</div>
            <div className="preview-box l1">↑</div>
            <div className="preview-box l0">😰 Hard</div>
          </div>
        </div>
        <h1>Abstraction Explorer</h1>
        <p className="hero-subtitle">
          Experience how layers of abstraction<br/>
          turn the impossible into the trivial
        </p>
      </div>

      <div className="domain-selection">
        <h2>Choose Your Journey</h2>
        <div className="domain-cards">
          {Object.values(DOMAINS).map(domain => (
            <button
              key={domain.id}
              className="domain-card"
              onClick={() => startJourney(domain.id)}
            >
              <span className="domain-icon">{domain.icon}</span>
              <div className="domain-text">
                <span className="domain-title">{domain.title}</span>
                <span className="domain-task">Task: {domain.taskDescription}</span>
              </div>
              <span className="domain-cta">→</span>
            </button>
          ))}
        </div>
      </div>

      <button className="skip-to-synthesis" onClick={() => setView('synthesis')}>
        Already explored? → See the big picture
      </button>
    </div>
  )
}
