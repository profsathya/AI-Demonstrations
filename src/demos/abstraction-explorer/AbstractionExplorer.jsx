import { useState, useEffect } from 'react'
import './AbstractionExplorer.css'

// Journey stages for the programming domain
const PROGRAMMING_JOURNEY = [
  {
    level: 0,
    name: 'Transistors',
    complexity: [
      '10110000 01100001 00000011',
      'MOV EAX, [0x7FFF0004]',
      'XOR ECX, ECX',
      'JNZ 0x00401000',
      'Voltage: 3.3V → 0V → 3.3V',
      'Clock cycle: 0.3 nanoseconds',
      'Cache miss penalty: 200 cycles',
      'Branch prediction: 95.2%',
    ],
    question: 'Want to write "Hello World" by controlling billions of tiny switches?',
    noResponse: "Yeah... that sounds impossible.",
    insight: "Let's hide all that and give you something simpler...",
    emoji: '🔌'
  },
  {
    level: 1,
    name: 'Machine Code',
    complexity: [
      '48 65 6C 6C 6F',
      'B8 04 00 00 00',
      'BB 01 00 00 00',
      'CD 80',
    ],
    question: 'How about memorizing hundreds of number codes?',
    noResponse: "Still pretty rough...",
    insight: "Let's give those numbers human-readable names...",
    emoji: '🔢'
  },
  {
    level: 2,
    name: 'Assembly',
    complexity: [
      'section .data',
      '  msg db "Hello"',
      'section .text',
      '  mov eax, 4',
      '  mov ebx, 1',
      '  int 0x80',
    ],
    question: 'Want to manually manage every memory address and register?',
    noResponse: "Getting better, but still tedious.",
    insight: "Let's make it read almost like English...",
    emoji: '⚙️'
  },
  {
    level: 3,
    name: 'High-Level Code',
    complexity: [
      'print("Hello World")',
    ],
    question: 'This is it! One line. Does this feel better?',
    yesResponse: "ONE LINE does what took dozens before!",
    insight: "But wait... we can go even higher...",
    emoji: '💻',
    isBreakthrough: true
  },
  {
    level: 4,
    name: 'Frameworks',
    complexity: [
      '<Button onClick={sayHello}>',
      '  Click Me',
      '</Button>',
    ],
    question: 'What if common patterns were pre-built for you?',
    yesResponse: "Thousands of lines, wrapped in simple components!",
    insight: "And now, the ultimate abstraction...",
    emoji: '📦'
  },
  {
    level: 5,
    name: 'AI / No-Code',
    complexity: [
      '"Make me a website',
      ' with a contact form"',
    ],
    question: 'What if you just... described what you want?',
    yesResponse: "You don't even need to know it's code underneath!",
    insight: null,
    emoji: '🤖',
    isFinal: true
  }
]

const DOMAINS = {
  programming: {
    id: 'programming',
    title: 'Programming',
    icon: '💻',
    journey: PROGRAMMING_JOURNEY
  },
  interfaces: {
    id: 'interfaces',
    title: 'Interfaces',
    icon: '🖥️',
    journey: [
      {
        level: 0, name: 'Switches', emoji: '🔘',
        complexity: ['Flip switch A7', 'Flip switch B3', 'Read lamp C1', 'Punch card row 1: ○●○○●●○●'],
        question: 'Want to flip physical switches and punch holes in cards?',
        noResponse: "That's exhausting...",
        insight: "Let's type commands instead..."
      },
      {
        level: 1, name: 'Command Line', emoji: '⌨️',
        complexity: ['$ ls -la /home/user', '$ grep -r "error" ./logs', '$ chmod 755 script.sh'],
        question: 'Want to memorize hundreds of text commands?',
        noResponse: "Too much to remember...",
        insight: "What if you could just click on things..."
      },
      {
        level: 2, name: 'GUI', emoji: '🖱️',
        complexity: ['📁 Double-click folder', '🗑️ Drag to trash', '📋 Right-click → Copy'],
        question: 'Click, drag, drop. No commands to memorize!',
        yesResponse: "So intuitive a child can do it!",
        insight: "But we can go simpler...",
        isBreakthrough: true
      },
      {
        level: 3, name: 'Touch', emoji: '👆',
        complexity: ['👆 Tap', '👋 Swipe', '🤏 Pinch'],
        question: 'What about using your fingers directly?',
        yesResponse: "Toddlers figure this out instantly!",
        insight: "And even simpler..."
      },
      {
        level: 4, name: 'Voice', emoji: '🗣️',
        complexity: ['"Hey Siri,', 'set a timer', 'for 5 minutes"'],
        question: 'What if you just... talked?',
        yesResponse: "No learning required. Just speak naturally.",
        isFinal: true
      }
    ]
  },
  transportation: {
    id: 'transportation',
    title: 'Getting Around',
    icon: '🚗',
    journey: [
      {
        level: 0, name: 'Walking', emoji: '🚶',
        complexity: ['Left foot', 'Right foot', 'Watch for rocks', 'Feel the heat', 'Getting tired...'],
        question: 'Want to walk 20 miles to the next city?',
        noResponse: "My feet hurt just thinking about it...",
        insight: "Let an animal do the walking..."
      },
      {
        level: 1, name: 'Horse', emoji: '🐴',
        complexity: ['Feed the horse', 'Direct the reins', 'Find water', 'Rest the animal'],
        question: 'Better, but you still need to care for it. Worth it?',
        noResponse: "Still a lot of work...",
        insight: "What if the 'horse' never got tired..."
      },
      {
        level: 2, name: 'Driving', emoji: '🚗',
        complexity: ['Gas pedal', 'Brake pedal', 'Steering wheel', 'Check mirrors'],
        question: 'Push pedals, turn wheel. Simple enough?',
        yesResponse: "You don't need to know how engines work!",
        insight: "But you still have to drive...",
        isBreakthrough: true
      },
      {
        level: 3, name: 'Uber', emoji: '📱',
        complexity: ['📱 Tap', '🚗 Wait', '✨ Arrive'],
        question: 'What if you didn\'t even need to drive?',
        yesResponse: "The entire skill of driving: abstracted away!",
        insight: "And soon..."
      },
      {
        level: 4, name: 'Self-Driving', emoji: '🤖',
        complexity: ['"Take me to', 'the airport"', '💤 Sleep'],
        question: 'What if you just told it where and went to sleep?',
        yesResponse: "All driving knowledge: unnecessary.",
        isFinal: true
      }
    ]
  }
}

// Animated code rain effect for complexity
function ComplexityDisplay({ items, isHiding, isSimple }) {
  return (
    <div className={`complexity-display ${isHiding ? 'hiding' : ''} ${isSimple ? 'simple' : ''}`}>
      {items.map((item, i) => (
        <div
          key={i}
          className="complexity-line"
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          {item}
        </div>
      ))}
    </div>
  )
}

// The boxing animation when abstracting
function AbstractionBox({ children, level, isBoxing }) {
  return (
    <div className={`abstraction-box ${isBoxing ? 'boxing' : ''}`}>
      <div className="box-label">L{level}</div>
      {children}
    </div>
  )
}

// Stack of previous abstractions
function AbstractionStack({ levels, currentLevel }) {
  return (
    <div className="abstraction-stack">
      {levels.slice(0, currentLevel).reverse().map((lvl, i) => (
        <div
          key={lvl.level}
          className="stacked-level"
          style={{
            '--stack-depth': i,
            opacity: 1 - (i * 0.15)
          }}
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
  const [phase, setPhase] = useState('show') // show, question, response, boxing, insight
  const [boxedLevels, setBoxedLevels] = useState([])

  const currentStep = domain.journey[stage]
  const isLastStage = stage === domain.journey.length - 1

  const handleResponse = (answer) => {
    if (answer === 'no' || (answer === 'yes' && currentStep.isBreakthrough)) {
      setPhase('response')
      setTimeout(() => {
        if (!currentStep.isFinal) {
          setPhase('boxing')
          setTimeout(() => {
            setBoxedLevels([...boxedLevels, currentStep])
            setPhase('insight')
            setTimeout(() => {
              setStage(stage + 1)
              setPhase('show')
            }, 2000)
          }, 1500)
        } else {
          setPhase('complete')
        }
      }, 1500)
    } else if (answer === 'yes' && !currentStep.isBreakthrough) {
      // They said yes to something hard - playful response
      setPhase('response')
      setTimeout(() => {
        setPhase('question')
      }, 2000)
    }
  }

  const showQuestion = () => {
    setPhase('question')
  }

  useEffect(() => {
    if (phase === 'show') {
      const timer = setTimeout(showQuestion, 2000)
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
          <h2>🎉 You Just Climbed the Abstraction Ladder!</h2>
          <p>Each level <strong>hid the complexity below</strong> so you could focus on what matters.</p>
          <div className="aha-final">
            <span className="aha-icon">💡</span>
            <p>
              You don't need to understand transistors to write code.<br/>
              You don't need to write code to build an app.<br/>
              <strong>That's the power of abstraction.</strong>
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

  return (
    <div className="journey-explorer">
      <button className="back-button" onClick={onBack}>
        ← Back
      </button>

      <div className="journey-progress">
        {domain.journey.map((_, i) => (
          <div
            key={i}
            className={`progress-dot ${i < stage ? 'done' : ''} ${i === stage ? 'current' : ''}`}
          />
        ))}
      </div>

      {boxedLevels.length > 0 && (
        <AbstractionStack levels={boxedLevels} currentLevel={boxedLevels.length} />
      )}

      <div className="journey-stage">
        <div className="level-header">
          <span className="level-emoji">{currentStep.emoji}</span>
          <div className="level-info">
            <span className="level-badge">Level {currentStep.level}</span>
            <h2>{currentStep.name}</h2>
          </div>
        </div>

        <AbstractionBox level={currentStep.level} isBoxing={phase === 'boxing'}>
          <ComplexityDisplay
            items={currentStep.complexity}
            isHiding={phase === 'boxing'}
            isSimple={currentStep.isBreakthrough || currentStep.isFinal}
          />
        </AbstractionBox>

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
                  <button className="response-btn yes-hard" onClick={() => handleResponse('yes')}>
                    I'll try... 💪
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

        {phase === 'insight' && currentStep.insight && (
          <div className="insight-section">
            <span className="insight-arrow">↑</span>
            <p className="insight-text">{currentStep.insight}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function Synthesis({ onBack }) {
  const [revealed, setRevealed] = useState(0)

  const insights = [
    { icon: '📦', title: 'Boxing Complexity', text: 'Each layer puts a "box" around the messy details, showing only what you need.' },
    { icon: '🎯', title: 'Right Level, Right Job', text: 'Work at the level that matches your task. Don\'t go lower than needed.' },
    { icon: '🔄', title: 'It\'s Everywhere', text: 'Money, cars, phones, physics—everything uses layers of abstraction.' },
  ]

  return (
    <div className="synthesis-view">
      <button className="back-button" onClick={onBack}>
        ← Back
      </button>

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
            <strong>The superpower isn't just using abstractions.</strong><br/>
            It's knowing when to peek beneath them,<br/>
            and when to build new ones.
          </p>
          <p className="wisdom-call">
            Next time you use anything without understanding its internals—<br/>
            smile. You're standing on layers of human ingenuity. 🏗️
          </p>
        </div>
      )}
    </div>
  )
}

export default function AbstractionExplorer() {
  const [view, setView] = useState('home') // home, journey, synthesis
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
            <div className="preview-box l5">Simple</div>
            <div className="preview-box l4">↑</div>
            <div className="preview-box l3">↑</div>
            <div className="preview-box l2">↑</div>
            <div className="preview-box l1">↑</div>
            <div className="preview-box l0">Complex</div>
          </div>
        </div>
        <h1>Abstraction Explorer</h1>
        <p className="hero-subtitle">
          Experience how layers of abstraction<br/>
          make the impossible feel easy
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
              <span className="domain-title">{domain.title}</span>
              <span className="domain-cta">Start Journey →</span>
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
