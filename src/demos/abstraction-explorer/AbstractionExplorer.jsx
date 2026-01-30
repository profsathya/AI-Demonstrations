import { useState } from 'react'
import './AbstractionExplorer.css'

// Abstraction domains with layers
const DOMAINS = {
  programming: {
    id: 'programming',
    title: 'Programming Languages',
    icon: '💻',
    subtitle: 'From electricity to "Hello World"',
    description: 'How layers of abstraction let us write code without understanding transistors',
    layers: [
      {
        level: 0,
        name: 'Transistors & Circuits',
        simple: 'Tiny switches that turn on and off',
        detail: 'Billions of microscopic switches using electricity. Each can only be ON or OFF.',
        hidden: 'Voltage levels, electron flow, semiconductor physics',
        color: '#ef4444'
      },
      {
        level: 1,
        name: 'Machine Code',
        simple: 'Numbers the computer understands directly',
        detail: 'Binary instructions like 10110000 01100001 that directly control the hardware.',
        hidden: 'Which transistors to activate, memory addresses, CPU cycles',
        color: '#f59e0b'
      },
      {
        level: 2,
        name: 'Assembly Language',
        simple: 'Short commands like MOV and ADD',
        detail: 'Human-readable shortcuts that map directly to machine code. MOV A, 5 means "put 5 in slot A".',
        hidden: 'Binary encoding, register allocation, memory management',
        color: '#eab308'
      },
      {
        level: 3,
        name: 'High-Level Languages',
        simple: 'Code that reads almost like English',
        detail: 'Python, JavaScript, Java - write "print(hello)" and it just works.',
        hidden: 'Memory allocation, CPU instructions, hardware differences',
        color: '#22c55e'
      },
      {
        level: 4,
        name: 'Frameworks & Libraries',
        simple: 'Pre-built tools for common tasks',
        detail: 'Instead of writing 1000 lines, use React, Django, or TensorFlow.',
        hidden: 'Implementation details, optimization, cross-browser compatibility',
        color: '#06b6d4'
      },
      {
        level: 5,
        name: 'No-Code / AI Tools',
        simple: 'Describe what you want in plain words',
        detail: '"Make me a website with a contact form" - and it happens.',
        hidden: 'All programming, all frameworks, all languages',
        color: '#8b5cf6'
      }
    ],
    aha: 'Each layer lets you think at a higher level. A web developer doesn\'t need to know how transistors work - they\'re abstracted away!'
  },

  interfaces: {
    id: 'interfaces',
    title: 'Computer Interfaces',
    icon: '🖥️',
    subtitle: 'From punch cards to "Hey Siri"',
    description: 'How we went from needing a PhD to use a computer to toddlers using tablets',
    layers: [
      {
        level: 0,
        name: 'Punch Cards & Switches',
        simple: 'Physical cards with holes, actual switches to flip',
        detail: 'Early computers required physically creating cards with hole patterns or flipping switches.',
        hidden: 'Nothing! You dealt with the raw machine.',
        color: '#ef4444'
      },
      {
        level: 1,
        name: 'Command Line',
        simple: 'Type exact commands, get text responses',
        detail: 'Type "ls -la" to list files. Memorize hundreds of commands.',
        hidden: 'Hardware operations, memory management',
        color: '#f59e0b'
      },
      {
        level: 2,
        name: 'Graphical Interface (GUI)',
        simple: 'Click on icons, drag files, see pictures',
        detail: 'Windows, Mac, folders you can see and click. No commands to memorize.',
        hidden: 'Command line, file systems, processes',
        color: '#22c55e'
      },
      {
        level: 3,
        name: 'Touch & Gestures',
        simple: 'Tap, swipe, pinch with your fingers',
        detail: 'Smartphones and tablets. So intuitive that toddlers figure it out.',
        hidden: 'File systems, windows, even the concept of "files"',
        color: '#06b6d4'
      },
      {
        level: 4,
        name: 'Voice & Natural Language',
        simple: 'Just talk normally',
        detail: '"Hey Siri, set a timer for 10 minutes" - no learning required.',
        hidden: 'All interface concepts - just state your intent',
        color: '#8b5cf6'
      }
    ],
    aha: 'Better abstraction = more people can use technology. Your grandparents can video call, even if they can\'t type "ffmpeg -i input.mp4"!'
  },

  physics: {
    id: 'physics',
    title: 'Understanding the Universe',
    icon: '🌌',
    subtitle: 'From falling apples to quantum fields',
    description: 'How physics builds layers of understanding, each one "good enough" for certain situations',
    layers: [
      {
        level: 0,
        name: 'Everyday Intuition',
        simple: 'Things fall down, fire is hot, ice is cold',
        detail: 'What humans naturally observe. Works perfectly for daily life.',
        hidden: 'Why these things happen',
        color: '#ef4444'
      },
      {
        level: 1,
        name: 'Classical Mechanics',
        simple: 'Newton\'s laws: F = ma, gravity pulls things',
        detail: 'Equations that predict motion. Enough to land on the moon!',
        hidden: 'What gravity actually IS, behavior at light speed',
        color: '#f59e0b'
      },
      {
        level: 2,
        name: 'Electromagnetism',
        simple: 'Light, electricity, and magnetism are connected',
        detail: 'Maxwell\'s equations. Powers our entire electrical civilization.',
        hidden: 'Quantum nature of light, particle behavior',
        color: '#eab308'
      },
      {
        level: 3,
        name: 'Relativity',
        simple: 'Space and time bend; E = mc²',
        detail: 'Einstein\'s insight. Essential for GPS satellites to work correctly.',
        hidden: 'Quantum effects, behavior at tiny scales',
        color: '#22c55e'
      },
      {
        level: 4,
        name: 'Quantum Mechanics',
        simple: 'Particles can be waves, probability rules',
        detail: 'Explains atoms, chemistry, computer chips. Weird but works.',
        hidden: 'How to combine with gravity',
        color: '#06b6d4'
      },
      {
        level: 5,
        name: 'Quantum Field Theory',
        simple: 'Everything is excitations in fields',
        detail: 'The Standard Model. Most accurate theory ever tested.',
        hidden: 'Gravity at quantum scale, dark matter, dark energy',
        color: '#8b5cf6'
      }
    ],
    aha: 'You don\'t need quantum mechanics to play basketball! Each layer is "good enough" for its domain. Newton works fine for rockets.'
  },

  transportation: {
    id: 'transportation',
    title: 'Getting Around',
    icon: '🚗',
    subtitle: 'From walking to "navigate to coffee shop"',
    description: 'How transportation evolved to hide complexity and just get you there',
    layers: [
      {
        level: 0,
        name: 'Walking',
        simple: 'Use your own legs',
        detail: 'You control every muscle, feel every rock, navigate every turn.',
        hidden: 'Nothing - you experience everything directly',
        color: '#ef4444'
      },
      {
        level: 1,
        name: 'Horse & Carriage',
        simple: 'An animal does the walking',
        detail: 'Tell the horse where to go. Still need to feed it, direct it.',
        hidden: 'The physical effort of movement',
        color: '#f59e0b'
      },
      {
        level: 2,
        name: 'Driving a Car',
        simple: 'Push pedals, turn wheel',
        detail: 'Control speed and direction. Don\'t need to know how engines work.',
        hidden: 'Internal combustion, transmission, thousands of parts',
        color: '#22c55e'
      },
      {
        level: 3,
        name: 'Ride-Sharing',
        simple: 'Tap a button, car appears',
        detail: 'Uber/Lyft. Don\'t drive, don\'t own, don\'t park.',
        hidden: 'Driving, car ownership, maintenance, parking',
        color: '#06b6d4'
      },
      {
        level: 4,
        name: 'Self-Driving Future',
        simple: 'Tell it where, wake up when you arrive',
        detail: 'Full autonomy. The car handles everything.',
        hidden: 'All driving skills, navigation, traffic awareness',
        color: '#8b5cf6'
      }
    ],
    aha: 'Your Uber driver doesn\'t need to know how the engine works. You don\'t need to know how to drive. Abstraction lets us focus on the destination, not the journey mechanics.'
  },

  money: {
    id: 'money',
    title: 'Money & Payments',
    icon: '💳',
    subtitle: 'From trading chickens to tapping your phone',
    description: 'How we abstracted the complexity of exchanging value',
    layers: [
      {
        level: 0,
        name: 'Barter',
        simple: 'Trade my chickens for your wheat',
        detail: 'Direct exchange. Need "double coincidence of wants."',
        hidden: 'Nothing - you directly exchange goods',
        color: '#ef4444'
      },
      {
        level: 1,
        name: 'Coins & Precious Metals',
        simple: 'Gold and silver everyone agrees has value',
        detail: 'Portable, divisible, durable. Don\'t need to carry chickens.',
        hidden: 'The actual goods being traded',
        color: '#f59e0b'
      },
      {
        level: 2,
        name: 'Paper Money',
        simple: 'Paper that promises it\'s worth something',
        detail: 'Backed by governments. Lighter than gold!',
        hidden: 'Physical precious metals',
        color: '#eab308'
      },
      {
        level: 3,
        name: 'Credit Cards',
        simple: 'Swipe plastic, pay later',
        detail: 'Don\'t carry cash. Numbers move between banks.',
        hidden: 'Physical money, immediate payment',
        color: '#22c55e'
      },
      {
        level: 4,
        name: 'Digital Payments',
        simple: 'Tap phone or send money with a text',
        detail: 'Venmo, Apple Pay, tap to pay. Money is just numbers.',
        hidden: 'Cards, cash, banks (from user perspective)',
        color: '#06b6d4'
      }
    ],
    aha: 'When you tap your phone to pay for coffee, you\'re using 5 layers of abstraction over "I\'ll trade you my labor for this drink."'
  },

  communication: {
    id: 'communication',
    title: 'Human Communication',
    icon: '💬',
    subtitle: 'From smoke signals to instant global video',
    description: 'How we abstracted the complexity of sharing ideas across distance',
    layers: [
      {
        level: 0,
        name: 'Face to Face',
        simple: 'Talk to someone right in front of you',
        detail: 'Direct communication. Limited to shouting distance.',
        hidden: 'Nothing - pure direct communication',
        color: '#ef4444'
      },
      {
        level: 1,
        name: 'Written Messages',
        simple: 'Write it down, send it physically',
        detail: 'Letters, scrolls. Survives time and distance.',
        hidden: 'Need to be present, timing of delivery',
        color: '#f59e0b'
      },
      {
        level: 2,
        name: 'Telegraph & Phone',
        simple: 'Send voice or code through wires',
        detail: 'Instant long-distance communication!',
        hidden: 'Physical delivery, travel time',
        color: '#22c55e'
      },
      {
        level: 3,
        name: 'Email & Text',
        simple: 'Type and send instantly to anyone',
        detail: 'Asynchronous, multimedia, free.',
        hidden: 'Infrastructure, delivery mechanisms',
        color: '#06b6d4'
      },
      {
        level: 4,
        name: 'Video Call',
        simple: 'See and talk to anyone, anywhere, live',
        detail: 'Zoom, FaceTime. Almost like being there.',
        hidden: 'All technical complexity - it just works',
        color: '#8b5cf6'
      }
    ],
    aha: 'A video call to Tokyo involves satellites, fiber optics, codecs, and protocols. You just see Grandma\'s face. That\'s abstraction.'
  }
}

const CORE_INSIGHT = {
  title: 'The Big Idea',
  points: [
    {
      icon: '🎭',
      title: 'Abstraction Hides Complexity',
      text: 'Each layer hides the messy details below, showing only what you need.'
    },
    {
      icon: '🎯',
      title: 'Focus on What Matters',
      text: 'You can solve problems at the right level without drowning in details.'
    },
    {
      icon: '🔄',
      title: 'The Pattern is Universal',
      text: 'Once you see abstraction, you\'ll recognize it everywhere - that\'s the real superpower.'
    }
  ]
}

function LayerStack({ layers, expanded, onToggle }) {
  return (
    <div className="layer-stack">
      {[...layers].reverse().map((layer, index) => (
        <div
          key={layer.level}
          className={`layer-card ${expanded === layer.level ? 'expanded' : ''}`}
          style={{
            '--layer-color': layer.color,
            '--stack-index': index,
            zIndex: layers.length - index
          }}
          onClick={() => onToggle(layer.level)}
        >
          <div className="layer-header">
            <span className="layer-level">L{layer.level}</span>
            <span className="layer-name">{layer.name}</span>
            <span className="layer-toggle">{expanded === layer.level ? '−' : '+'}</span>
          </div>
          <div className="layer-simple">{layer.simple}</div>

          {expanded === layer.level && (
            <div className="layer-details">
              <p className="layer-detail">{layer.detail}</p>
              <div className="layer-hidden">
                <span className="hidden-label">🙈 Hidden from this layer:</span>
                <span className="hidden-text">{layer.hidden}</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function DomainExplorer({ domain, onBack }) {
  const [expandedLayer, setExpandedLayer] = useState(null)
  const [showAha, setShowAha] = useState(false)

  return (
    <div className="domain-explorer">
      <button className="back-button" onClick={onBack}>
        ← Back to Topics
      </button>

      <div className="domain-header">
        <span className="domain-icon">{domain.icon}</span>
        <div>
          <h2>{domain.title}</h2>
          <p className="domain-subtitle">{domain.subtitle}</p>
        </div>
      </div>

      <p className="domain-description">{domain.description}</p>

      <div className="explore-instruction">
        <span>👆</span> Tap any layer to explore what it hides
      </div>

      <LayerStack
        layers={domain.layers}
        expanded={expandedLayer}
        onToggle={(level) => setExpandedLayer(expandedLayer === level ? null : level)}
      />

      {!showAha ? (
        <button className="aha-trigger" onClick={() => setShowAha(true)}>
          💡 Show me the insight
        </button>
      ) : (
        <div className="aha-moment">
          <div className="aha-icon">💡</div>
          <p>{domain.aha}</p>
        </div>
      )}
    </div>
  )
}

function Synthesis({ onBack }) {
  const [revealed, setRevealed] = useState([])

  const toggleReveal = (index) => {
    setRevealed(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  return (
    <div className="synthesis">
      <button className="back-button" onClick={onBack}>
        ← Back to Topics
      </button>

      <div className="synthesis-header">
        <span className="synthesis-icon">🧠</span>
        <h2>{CORE_INSIGHT.title}</h2>
      </div>

      <div className="insight-cards">
        {CORE_INSIGHT.points.map((point, index) => (
          <div
            key={index}
            className={`insight-card ${revealed.includes(index) ? 'revealed' : ''}`}
            onClick={() => toggleReveal(index)}
          >
            <div className="insight-front">
              <span className="insight-icon">{point.icon}</span>
              <span>Tap to reveal</span>
            </div>
            <div className="insight-back">
              <h3>{point.title}</h3>
              <p>{point.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="final-message">
        <h3>Now You See It Everywhere</h3>
        <p>
          Every time you use something without understanding its internals,
          you're benefiting from abstraction. Every time you create a function,
          name a variable, or explain something simply - you're <em>creating</em> abstraction.
        </p>
        <p className="call-to-action">
          The power isn't just in using abstractions.<br />
          It's in knowing when to peek beneath them,<br />
          and when to build new ones.
        </p>
      </div>
    </div>
  )
}

export default function AbstractionExplorer() {
  const [activeView, setActiveView] = useState('home') // home, domain, synthesis
  const [activeDomain, setActiveDomain] = useState(null)

  const openDomain = (domainId) => {
    setActiveDomain(DOMAINS[domainId])
    setActiveView('domain')
  }

  const goHome = () => {
    setActiveView('home')
    setActiveDomain(null)
  }

  if (activeView === 'domain' && activeDomain) {
    return <DomainExplorer domain={activeDomain} onBack={goHome} />
  }

  if (activeView === 'synthesis') {
    return <Synthesis onBack={goHome} />
  }

  return (
    <div className="abstraction-explorer">
      <div className="intro-section">
        <h1>
          <span className="title-icon">🧅</span>
          Abstraction Explorer
        </h1>
        <p className="intro-text">
          Abstraction is like an onion - layers that hide complexity.
          Each layer shows you only what you need, hiding the messy details below.
        </p>

        <div className="core-definition">
          <div className="definition-box">
            <span className="def-term">Abstraction</span>
            <span className="def-meaning">
              Hiding unnecessary details to focus on what matters at your level
            </span>
          </div>
        </div>
      </div>

      <h2 className="section-title">Explore Abstraction In...</h2>

      <div className="domain-grid">
        {Object.values(DOMAINS).map(domain => (
          <button
            key={domain.id}
            className="domain-card"
            onClick={() => openDomain(domain.id)}
          >
            <span className="card-icon">{domain.icon}</span>
            <span className="card-title">{domain.title}</span>
            <span className="card-subtitle">{domain.subtitle}</span>
            <span className="card-layers">{domain.layers.length} layers</span>
          </button>
        ))}
      </div>

      <button className="synthesis-button" onClick={() => setActiveView('synthesis')}>
        🧠 I've explored - show me the big picture
      </button>

      <div className="hint-section">
        <p>💡 <strong>Hint:</strong> Explore at least 2-3 topics before reading the synthesis!</p>
      </div>
    </div>
  )
}
