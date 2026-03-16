import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import './BigOExplorer.css'

// ============================
// SCENARIO DEFINITIONS
// ============================
const SCENARIOS = {
  social: {
    name: 'Social Media',
    icon: '📱',
    color: '#ec4899',
    tagline: 'How does Instagram handle millions of users?',
    bg: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
  },
  gaming: {
    name: 'Gaming',
    icon: '🎮',
    color: '#22c55e',
    tagline: 'How does Minecraft manage infinite worlds?',
    bg: 'linear-gradient(135deg, #22c55e, #06b6d4)',
  },
  music: {
    name: 'Music Streaming',
    icon: '🎵',
    color: '#6366f1',
    tagline: 'How does Spotify search 100M+ songs?',
    bg: 'linear-gradient(135deg, #6366f1, #ec4899)',
  },
  food: {
    name: 'Food Delivery',
    icon: '🍕',
    color: '#f59e0b',
    tagline: 'How does DoorDash optimize deliveries?',
    bg: 'linear-gradient(135deg, #f59e0b, #ef4444)',
  },
}

// ============================
// BIG O CONCEPTS WITH SCENARIO-SPECIFIC EXAMPLES
// ============================
const CONCEPTS = [
  {
    id: 'O1',
    notation: 'O(1)',
    name: 'Constant Time',
    emoji: '⚡',
    color: '#22c55e',
    description: 'No matter how much data, it takes the same time. Like flipping a light switch — one room or a thousand, one flip.',
    scenarios: {
      social: {
        example: 'Looking up a user profile by their @handle',
        visual: 'hashmap',
        analogy: 'Like knowing exactly which locker is yours — you go straight to it.',
      },
      gaming: {
        example: 'Accessing item in inventory slot #5',
        visual: 'hashmap',
        analogy: 'Like grabbing the sword from your hotbar — instant, no searching.',
      },
      music: {
        example: 'Pressing play on the current song',
        visual: 'hashmap',
        analogy: 'Like hitting the play button — the song is already loaded and ready.',
      },
      food: {
        example: 'Looking up a restaurant by its unique ID',
        visual: 'hashmap',
        analogy: 'Like checking your order status with a tracking number — direct lookup.',
      },
    },
    growth: [1, 1, 1, 1, 1, 1, 1, 1],
  },
  {
    id: 'Ologn',
    notation: 'O(log n)',
    name: 'Logarithmic',
    emoji: '🔍',
    color: '#3b82f6',
    description: 'Cuts the problem in half each step. Like finding a word in a dictionary — you don\'t read every page.',
    scenarios: {
      social: {
        example: 'Binary searching for a post by exact timestamp',
        visual: 'bsearch',
        analogy: 'Like finding a friend in an alphabetical follower list — jump to the middle, go left or right.',
      },
      gaming: {
        example: 'Finding an item in your sorted inventory',
        visual: 'bsearch',
        analogy: 'Like using a search bar to find "diamond" in a sorted chest — splits each time.',
      },
      music: {
        example: 'Searching for a song in an alphabetically sorted library',
        visual: 'bsearch',
        analogy: 'Like finding a CD in a sorted rack — check the middle, eliminate half.',
      },
      food: {
        example: 'Finding a restaurant in a list sorted by rating',
        visual: 'bsearch',
        analogy: 'Like narrowing down the perfect restaurant — "too expensive, too cheap, just right!"',
      },
    },
    growth: [1, 1, 2, 2, 3, 3, 3, 3],
  },
  {
    id: 'On',
    notation: 'O(n)',
    name: 'Linear',
    emoji: '📏',
    color: '#f59e0b',
    description: 'Time grows directly with data size. Check every item once. Double the data, double the time.',
    scenarios: {
      social: {
        example: 'Scrolling through every post to find one with a specific caption',
        visual: 'linear',
        analogy: 'Like reading every single story to find who posted about pizza.',
      },
      gaming: {
        example: 'Searching every chest in your base for a diamond',
        visual: 'linear',
        analogy: 'Like opening every chest one by one until you find it.',
      },
      music: {
        example: 'Scanning your entire playlist to count songs by an artist',
        visual: 'linear',
        analogy: 'Like going through every song on your playlist one by one.',
      },
      food: {
        example: 'Checking every restaurant to see which ones are open',
        visual: 'linear',
        analogy: 'Like calling every restaurant to ask "are you open?" — one by one.',
      },
    },
    growth: [1, 2, 3, 4, 5, 6, 7, 8],
  },
  {
    id: 'Onlogn',
    notation: 'O(n log n)',
    name: 'Linearithmic',
    emoji: '📊',
    color: '#8b5cf6',
    description: 'Efficient sorting. Slightly more than linear, but the best we can do for comparison-based sorting.',
    scenarios: {
      social: {
        example: 'Sorting your feed by engagement (likes + comments)',
        visual: 'mergesort',
        analogy: 'Like organizing your feed — divide into small groups, sort each, then merge them back.',
      },
      gaming: {
        example: 'Sorting the leaderboard by player scores',
        visual: 'mergesort',
        analogy: 'Like organizing a tournament bracket — split, rank, merge results.',
      },
      music: {
        example: 'Sorting 10,000 songs by play count for "Your Top Songs"',
        visual: 'mergesort',
        analogy: 'Like making your Wrapped playlist — split, rank, combine.',
      },
      food: {
        example: 'Sorting all nearby restaurants by distance',
        visual: 'mergesort',
        analogy: 'Like ranking restaurants by distance — split the list, sort each half, merge.',
      },
    },
    growth: [1, 2, 5, 8, 12, 16, 20, 24],
  },
  {
    id: 'On2',
    notation: 'O(n²)',
    name: 'Quadratic',
    emoji: '💥',
    color: '#ef4444',
    description: 'Compares everything to everything else. Double the data, 4x the time. Gets slow FAST.',
    scenarios: {
      social: {
        example: 'Checking every pair of users for mutual friends',
        visual: 'nested',
        analogy: 'Like introducing every student to every other student in class — it explodes!',
      },
      gaming: {
        example: 'Checking collision between every pair of entities',
        visual: 'nested',
        analogy: 'Like checking if any two of 100 players are touching — 100 × 100 checks!',
      },
      music: {
        example: 'Comparing every song pair to find duplicates',
        visual: 'nested',
        analogy: 'Like comparing every song to every other song for similarity — painful!',
      },
      food: {
        example: 'Matching every available driver with every pending order',
        visual: 'nested',
        analogy: 'Like trying every driver with every order to find the best match.',
      },
    },
    growth: [1, 4, 9, 16, 25, 36, 49, 64],
  },
  {
    id: 'O2n',
    notation: 'O(2ⁿ)',
    name: 'Exponential',
    emoji: '🔥',
    color: '#dc2626',
    description: 'Doubles with each new item. Practically impossible for large inputs. This is why some problems are "hard".',
    scenarios: {
      social: {
        example: 'Generating all possible friend group combinations',
        visual: 'exponential',
        analogy: 'Like figuring out every possible squad you could form — for each friend: in or out.',
      },
      gaming: {
        example: 'Finding all possible paths through a dungeon',
        visual: 'exponential',
        analogy: 'Like trying literally every possible route through a maze — it multiplies!',
      },
      music: {
        example: 'Generating all possible playlists from your library',
        visual: 'exponential',
        analogy: 'Like creating every possible combo of songs — each song is either in or out.',
      },
      food: {
        example: 'Finding the optimal route visiting all restaurants',
        visual: 'exponential',
        analogy: 'Like trying every delivery route order — adding one stop doubles the work!',
      },
    },
    growth: [1, 2, 4, 8, 16, 32, 64, 128],
  },
]

// ============================
// QUIZ QUESTION GENERATOR
// ============================
function generateQuestions(scenario, learnedConcepts, difficulty, allConcepts) {
  const questions = []

  const learned = allConcepts.filter(c => learnedConcepts.includes(c.id))
  if (learned.length === 0) return questions

  // Type 1: "What's the Big O?" — given scenario example
  learned.forEach(concept => {
    const s = concept.scenarios[scenario]
    questions.push({
      type: 'identify',
      question: `What's the time complexity?\n"${s.example}"`,
      correct: concept.notation,
      options: getDistractors(concept, learned),
      conceptId: concept.id,
      difficulty: 1,
    })
  })

  // Type 2: "Which is faster?" — compare two complexities
  if (learned.length >= 2) {
    for (let i = 0; i < learned.length - 1; i++) {
      questions.push({
        type: 'compare',
        question: `Which is faster for large data?`,
        detail: `${learned[i].notation} vs ${learned[i + 1].notation}`,
        correct: learned[i].notation,
        options: [learned[i].notation, learned[i + 1].notation],
        conceptId: learned[i].id,
        difficulty: 2,
      })
    }
  }

  // Type 3: "What happens when n doubles?"
  learned.forEach(concept => {
    const answers = {
      'O1': 'Stays the same',
      'Ologn': 'Increases by 1 step',
      'On': 'Doubles',
      'Onlogn': 'Slightly more than doubles',
      'On2': 'Quadruples (4x)',
      'O2n': 'Squares (massively grows)',
    }
    questions.push({
      type: 'growth',
      question: `For ${concept.notation}, what happens when you double the input size?`,
      correct: answers[concept.id],
      options: shuffleArray([
        'Stays the same',
        'Increases by 1 step',
        'Doubles',
        'Quadruples (4x)',
      ].filter(a => a !== answers[concept.id]).slice(0, 3).concat([answers[concept.id]])),
      conceptId: concept.id,
      difficulty: 2,
    })
  })

  // Type 4: Match the analogy (harder)
  if (difficulty >= 2) {
    learned.forEach(concept => {
      const s = concept.scenarios[scenario]
      questions.push({
        type: 'analogy',
        question: 'Which complexity matches this analogy?',
        detail: `"${s.analogy}"`,
        correct: concept.notation,
        options: getDistractors(concept, learned),
        conceptId: concept.id,
        difficulty: 3,
      })
    })
  }

  // Filter by difficulty
  const filtered = questions.filter(q => q.difficulty <= difficulty)
  return shuffleArray(filtered)
}

function getDistractors(concept, learned) {
  const others = learned.filter(c => c.id !== concept.id).map(c => c.notation)
  const allNotations = ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)']
  const pool = [...new Set([...others, ...allNotations])].filter(n => n !== concept.notation)
  return shuffleArray([concept.notation, ...shuffleArray(pool).slice(0, 3)])
}

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ============================
// VISUAL COMPONENTS
// ============================
function GrowthChart({ concepts, highlightId }) {
  const maxY = 128
  const width = 280
  const height = 160
  const padding = { top: 10, right: 10, bottom: 25, left: 35 }
  const plotW = width - padding.left - padding.right
  const plotH = height - padding.top - padding.bottom

  return (
    <svg className="growth-chart" viewBox={`0 0 ${width} ${height}`}>
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => (
        <line key={i}
          x1={padding.left} y1={padding.top + plotH * pct}
          x2={width - padding.right} y2={padding.top + plotH * pct}
          stroke="var(--border)" strokeWidth="0.5" opacity="0.5"
        />
      ))}

      {/* Y axis label */}
      <text x={4} y={height / 2} fontSize="7" fill="var(--text-muted)" textAnchor="middle"
        transform={`rotate(-90, 4, ${height / 2})`}>Operations</text>
      <text x={width / 2} y={height - 2} fontSize="7" fill="var(--text-muted)" textAnchor="middle">
        Input size (n)
      </text>

      {/* Plot lines */}
      {concepts.map(concept => {
        const isHighlighted = highlightId === concept.id
        const points = concept.growth.map((val, i) => {
          const x = padding.left + (i / 7) * plotW
          const y = padding.top + plotH - (Math.min(val, maxY) / maxY) * plotH
          return `${x},${y}`
        }).join(' ')

        return (
          <g key={concept.id}>
            <polyline
              points={points}
              fill="none"
              stroke={concept.color}
              strokeWidth={isHighlighted ? 2.5 : 1}
              opacity={highlightId && !isHighlighted ? 0.2 : 1}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {isHighlighted && (
              <text
                x={padding.left + plotW + 2}
                y={padding.top + plotH - (Math.min(concept.growth[7], maxY) / maxY) * plotH}
                fontSize="7"
                fill={concept.color}
                fontWeight="600"
                dominantBaseline="middle"
              >
                {concept.notation}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

function AlgorithmVisual({ concept, scenario, animate }) {
  const [step, setStep] = useState(0)
  const [running, setRunning] = useState(false)
  const items = 8
  const timerRef = useRef(null)

  useEffect(() => {
    setStep(0)
    setRunning(false)
    if (timerRef.current) clearInterval(timerRef.current)
  }, [concept.id])

  const startVisualization = () => {
    setStep(0)
    setRunning(true)
    let s = 0
    timerRef.current = setInterval(() => {
      s++
      if (s >= getMaxSteps(concept.id)) {
        clearInterval(timerRef.current)
        setRunning(false)
      }
      setStep(s)
    }, 600)
  }

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  const getMaxSteps = (id) => {
    switch (id) {
      case 'O1': return 1
      case 'Ologn': return 3
      case 'On': return 8
      case 'Onlogn': return 6
      case 'On2': return 8
      case 'O2n': return 5
      default: return 8
    }
  }

  const icons = {
    social: ['👤','👩','👨','👧','👦','🧑','👱','👴'],
    gaming: ['⚔️','🛡️','💎','🏹','🔮','🧪','🗝️','🪓'],
    music: ['🎸','🎹','🥁','🎺','🎷','🎻','🎤','🪕'],
    food: ['🍕','🍔','🌮','🍣','🥗','🍜','🥘','🍝'],
  }

  const itemIcons = icons[scenario] || icons.social

  const renderItems = () => {
    const getItemState = (index) => {
      switch (concept.id) {
        case 'O1':
          return index === 3 ? (step >= 1 ? 'found' : 'idle') : 'idle'
        case 'Ologn': {
          const ranges = [
            { low: 0, high: 7, mid: 3 },
            { low: 4, high: 7, mid: 5 },
            { low: 4, high: 4, mid: 4 },
          ]
          if (step === 0) return 'idle'
          const range = ranges[Math.min(step - 1, ranges.length - 1)]
          if (index === range.mid) return step >= 3 && index === 4 ? 'found' : 'checking'
          if (index < range.low || index > range.high) return 'eliminated'
          return 'idle'
        }
        case 'On':
          if (index < step) return index === step - 1 ? 'checking' : 'checked'
          return 'idle'
        case 'Onlogn': {
          if (step === 0) return 'idle'
          if (step <= 2) return 'checking'
          if (step <= 4) return index < 4 ? 'sorted' : 'checking'
          return 'sorted'
        }
        case 'On2':
          return step > 0 ? 'checking' : 'idle'
        case 'O2n':
          return step > 0 ? 'checking' : 'idle'
        default:
          return 'idle'
      }
    }

    return (
      <div className="visual-items">
        {itemIcons.map((icon, i) => (
          <div key={i} className={`visual-item ${getItemState(i)}`}
            style={{ '--i': i, '--color': concept.color }}>
            <span className="item-icon">{icon}</span>
            <span className="item-index">{i}</span>
          </div>
        ))}
      </div>
    )
  }

  const renderStepInfo = () => {
    const maxSteps = getMaxSteps(concept.id)
    if (!running && step === 0) return null

    return (
      <div className="step-info">
        <div className="step-counter">
          Step {Math.min(step, maxSteps)} of {maxSteps}
        </div>
        <div className="step-bar">
          <div className="step-fill" style={{
            width: `${(Math.min(step, maxSteps) / maxSteps) * 100}%`,
            background: concept.color
          }} />
        </div>
      </div>
    )
  }

  return (
    <div className="algorithm-visual">
      <div className="visual-header">
        <span className="visual-label" style={{ color: concept.color }}>
          {concept.emoji} {concept.notation}
        </span>
        <button
          className="run-btn"
          onClick={startVisualization}
          disabled={running}
          style={{ '--color': concept.color }}
        >
          {running ? 'Running...' : step > 0 ? '↻ Run Again' : '▶ Visualize'}
        </button>
      </div>
      {renderItems()}
      {renderStepInfo()}

      {/* Nested loop visualization for O(n²) */}
      {concept.id === 'On2' && step > 0 && (
        <div className="nested-grid">
          {Array.from({ length: Math.min(items, 5) }).map((_, i) => (
            <div key={i} className="nested-row">
              {Array.from({ length: Math.min(items, 5) }).map((_, j) => (
                <div key={j} className={`nested-cell ${i <= step && j <= step ? 'active' : ''}`}
                  style={{ '--color': concept.color }} />
              ))}
            </div>
          ))}
          <div className="nested-label">Each item compared with every other</div>
        </div>
      )}

      {/* Exponential tree for O(2^n) */}
      {concept.id === 'O2n' && step > 0 && (
        <div className="expo-tree">
          {Array.from({ length: Math.min(step + 1, 4) }).map((_, level) => (
            <div key={level} className="expo-level">
              {Array.from({ length: Math.pow(2, level) }).map((_, i) => (
                <div key={i} className="expo-node" style={{ '--color': concept.color }}>
                  {level === 0 ? '🌳' : '🌿'}
                </div>
              ))}
            </div>
          ))}
          <div className="expo-label">Each level doubles the work</div>
        </div>
      )}
    </div>
  )
}

function QuizQuestion({ question, onAnswer, questionNum, totalQuestions }) {
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)

  const handleSelect = (option) => {
    if (revealed) return
    setSelected(option)
    setRevealed(true)
    setTimeout(() => {
      onAnswer(option === question.correct)
      setSelected(null)
      setRevealed(false)
    }, 1200)
  }

  return (
    <div className="quiz-question">
      <div className="quiz-progress">
        <span>Question {questionNum} of {totalQuestions}</span>
        <div className="quiz-progress-bar">
          <div className="quiz-progress-fill" style={{ width: `${(questionNum / totalQuestions) * 100}%` }} />
        </div>
      </div>

      <div className="quiz-prompt">
        <span className="quiz-type">
          {question.type === 'identify' && '🔍 Identify'}
          {question.type === 'compare' && '⚖️ Compare'}
          {question.type === 'growth' && '📈 Growth'}
          {question.type === 'analogy' && '💡 Analogy'}
        </span>
        <h3>{question.question}</h3>
        {question.detail && <p className="quiz-detail">{question.detail}</p>}
      </div>

      <div className="quiz-options">
        {question.options.map((option, i) => {
          let cls = 'quiz-option'
          if (revealed) {
            if (option === question.correct) cls += ' correct'
            else if (option === selected) cls += ' wrong'
          } else if (selected === option) {
            cls += ' selected'
          }

          return (
            <button key={i} className={cls} onClick={() => handleSelect(option)}
              style={{ '--delay': `${i * 0.1}s` }}>
              {option}
            </button>
          )
        })}
      </div>

      {revealed && (
        <div className={`quiz-feedback ${selected === question.correct ? 'correct' : 'wrong'}`}>
          {selected === question.correct ? (
            <span>✅ Correct!</span>
          ) : (
            <span>❌ The answer is <strong>{question.correct}</strong></span>
          )}
        </div>
      )}
    </div>
  )
}

function MasteryBar({ conceptId, mastery }) {
  const concept = CONCEPTS.find(c => c.id === conceptId)
  if (!concept) return null

  const level = mastery[conceptId] || 0
  const stars = Math.min(Math.floor(level / 2), 3)

  return (
    <div className="mastery-bar" style={{ '--color': concept.color }}>
      <span className="mastery-emoji">{concept.emoji}</span>
      <span className="mastery-notation">{concept.notation}</span>
      <div className="mastery-track">
        <div className="mastery-fill" style={{ width: `${Math.min(level * 16.7, 100)}%` }} />
      </div>
      <span className="mastery-stars">
        {'★'.repeat(stars)}{'☆'.repeat(3 - stars)}
      </span>
    </div>
  )
}

// ============================
// MAIN COMPONENT
// ============================
export default function BigOExplorer() {
  // Core state
  const [phase, setPhase] = useState('welcome') // welcome, learn, practice, review, complete
  const [scenario, setScenario] = useState(null)
  const [currentConceptIndex, setCurrentConceptIndex] = useState(0)
  const [learnedConcepts, setLearnedConcepts] = useState([])
  const [showingExample, setShowingExample] = useState(false)

  // Quiz state
  const [quizQuestions, setQuizQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [quizScore, setQuizScore] = useState(0)

  // Adaptive difficulty & mastery
  const [difficulty, setDifficulty] = useState(1)
  const [mastery, setMastery] = useState({})
  const [streak, setStreak] = useState(0)
  const [totalCorrect, setTotalCorrect] = useState(0)
  const [totalAnswered, setTotalAnswered] = useState(0)

  // Review tracking (spaced repetition)
  const [reviewQueue, setReviewQueue] = useState([])
  const [isReview, setIsReview] = useState(false)

  const currentConcept = CONCEPTS[currentConceptIndex]

  // Start learning a scenario
  const handleSelectScenario = (scenarioId) => {
    setScenario(scenarioId)
    setPhase('learn')
    setCurrentConceptIndex(0)
  }

  // Mark concept as learned and move to practice
  const handleConceptLearned = () => {
    const newLearned = [...learnedConcepts, currentConcept.id]
    setLearnedConcepts(newLearned)

    // Generate quiz questions (retrieval practice)
    const questions = generateQuestions(scenario, newLearned, difficulty, CONCEPTS)
    const selected = questions.slice(0, Math.min(4, questions.length))
    setQuizQuestions(selected)
    setCurrentQuestionIndex(0)
    setQuizScore(0)
    setIsReview(false)
    setPhase('practice')
  }

  // Handle quiz answer
  const handleQuizAnswer = (correct) => {
    const conceptId = quizQuestions[currentQuestionIndex]?.conceptId
    setTotalAnswered(prev => prev + 1)

    if (correct) {
      setQuizScore(prev => prev + 1)
      setTotalCorrect(prev => prev + 1)
      setStreak(prev => prev + 1)
      setMastery(prev => ({
        ...prev,
        [conceptId]: (prev[conceptId] || 0) + 1
      }))

      // Adaptive: increase difficulty after streak
      if (streak + 1 >= 3 && difficulty < 3) {
        setDifficulty(prev => Math.min(prev + 1, 3))
      }
    } else {
      setStreak(0)
      // Add to review queue for spaced repetition
      if (conceptId && !reviewQueue.includes(conceptId)) {
        setReviewQueue(prev => [...prev, conceptId])
      }
      // Adaptive: decrease difficulty after miss
      if (difficulty > 1) {
        setDifficulty(prev => Math.max(prev - 1, 1))
      }
    }

    // Next question or finish quiz
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      // Quiz complete - decide what's next
      setTimeout(() => {
        // Check if there's a review due (spaced interleaving)
        if (reviewQueue.length > 0 && learnedConcepts.length >= 3 && !isReview) {
          startReview()
        } else if (currentConceptIndex < CONCEPTS.length - 1) {
          // Move to next concept
          setCurrentConceptIndex(prev => prev + 1)
          setShowingExample(false)
          setPhase('learn')
        } else {
          // All concepts learned!
          setPhase('complete')
        }
      }, 800)
    }
  }

  // Start a review round (interleaved practice)
  const startReview = () => {
    setIsReview(true)
    const reviewConcepts = [...new Set([...reviewQueue, ...learnedConcepts])]
    const questions = generateQuestions(scenario, reviewConcepts, difficulty, CONCEPTS)
    const selected = shuffleArray(questions).slice(0, Math.min(5, questions.length))
    setQuizQuestions(selected)
    setCurrentQuestionIndex(0)
    setQuizScore(0)
    setReviewQueue([])
    setPhase('practice')
  }

  const handleContinueAfterQuiz = () => {
    if (currentConceptIndex < CONCEPTS.length - 1) {
      setCurrentConceptIndex(prev => prev + 1)
      setShowingExample(false)
      setPhase('learn')
    } else {
      setPhase('complete')
    }
  }

  const handleRestart = () => {
    setPhase('welcome')
    setScenario(null)
    setCurrentConceptIndex(0)
    setLearnedConcepts([])
    setShowingExample(false)
    setQuizQuestions([])
    setCurrentQuestionIndex(0)
    setQuizScore(0)
    setDifficulty(1)
    setMastery({})
    setStreak(0)
    setTotalCorrect(0)
    setTotalAnswered(0)
    setReviewQueue([])
    setIsReview(false)
  }

  // ============================
  // WELCOME PHASE
  // ============================
  if (phase === 'welcome') {
    return (
      <div className="bigo-explorer">
        <div className="welcome-screen">
          <div className="welcome-header">
            <h1>
              <span className="bigo-title">Big O</span>
              <span className="bigo-subtitle">Explorer</span>
            </h1>
            <p className="welcome-tagline">
              Master time complexity through real-world scenarios you care about
            </p>
          </div>

          <p className="choose-prompt">Choose a scenario that interests you:</p>

          <div className="scenario-grid">
            {Object.entries(SCENARIOS).map(([id, s], i) => (
              <button
                key={id}
                className="scenario-card"
                onClick={() => handleSelectScenario(id)}
                style={{ '--bg': s.bg, '--color': s.color, '--delay': `${i * 0.1}s` }}
              >
                <span className="scenario-icon">{s.icon}</span>
                <span className="scenario-name">{s.name}</span>
                <span className="scenario-tagline">{s.tagline}</span>
              </button>
            ))}
          </div>

          <div className="welcome-features">
            <div className="feature">
              <span>🧠</span> Retrieval practice
            </div>
            <div className="feature">
              <span>🔄</span> Spaced interleaving
            </div>
            <div className="feature">
              <span>📈</span> Adaptive difficulty
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ============================
  // LEARN PHASE
  // ============================
  if (phase === 'learn') {
    const scenarioData = SCENARIOS[scenario]
    const conceptScenario = currentConcept.scenarios[scenario]

    return (
      <div className="bigo-explorer">
        {/* Top bar */}
        <div className="top-bar">
          <div className="scenario-badge" style={{ '--color': scenarioData.color }}>
            <span>{scenarioData.icon}</span>
            <span>{scenarioData.name}</span>
          </div>
          <div className="progress-info">
            {currentConceptIndex + 1} / {CONCEPTS.length}
          </div>
        </div>

        {/* Concept header */}
        <div className="concept-header" style={{ '--color': currentConcept.color }}>
          <span className="concept-emoji">{currentConcept.emoji}</span>
          <div>
            <h2 className="concept-notation">{currentConcept.notation}</h2>
            <p className="concept-name">{currentConcept.name}</p>
          </div>
        </div>

        {/* Description */}
        <div className="concept-description">
          <p>{currentConcept.description}</p>
        </div>

        {/* Growth chart */}
        <div className="chart-section">
          <h3>How it grows</h3>
          <GrowthChart concepts={CONCEPTS.slice(0, currentConceptIndex + 1)} highlightId={currentConcept.id} />
        </div>

        {/* Scenario example */}
        {!showingExample ? (
          <button
            className="show-example-btn"
            onClick={() => setShowingExample(true)}
            style={{ '--color': currentConcept.color }}
          >
            <span>{scenarioData.icon}</span>
            See it in action: {scenarioData.name}
          </button>
        ) : (
          <div className="example-section" style={{ '--color': currentConcept.color }}>
            <div className="example-card">
              <h3>{scenarioData.icon} In {scenarioData.name}:</h3>
              <p className="example-text">{conceptScenario.example}</p>
              <p className="example-analogy">💡 {conceptScenario.analogy}</p>
            </div>

            {/* Interactive visualization */}
            <AlgorithmVisual concept={currentConcept} scenario={scenario} />

            <button className="got-it-btn" onClick={handleConceptLearned}
              style={{ '--color': currentConcept.color }}>
              Got it! Test me →
            </button>
          </div>
        )}

        {/* Mastery progress */}
        {learnedConcepts.length > 0 && (
          <div className="mastery-section">
            <h4>Your Mastery</h4>
            {learnedConcepts.map(id => (
              <MasteryBar key={id} conceptId={id} mastery={mastery} />
            ))}
          </div>
        )}
      </div>
    )
  }

  // ============================
  // PRACTICE PHASE (Quiz)
  // ============================
  if (phase === 'practice') {
    const quizDone = currentQuestionIndex >= quizQuestions.length
    const scenarioData = SCENARIOS[scenario]

    if (quizDone || quizQuestions.length === 0) {
      return (
        <div className="bigo-explorer">
          <div className="quiz-results">
            <div className="results-header">
              <h2>{isReview ? '🔄 Review Complete!' : '🎯 Practice Complete!'}</h2>
              <div className="score-display">
                <span className="score-big">{quizScore}</span>
                <span className="score-divider">/</span>
                <span className="score-total">{quizQuestions.length}</span>
              </div>
            </div>

            <div className="results-message">
              {quizScore === quizQuestions.length && <p className="perfect">🌟 Perfect! You're crushing it!</p>}
              {quizScore >= quizQuestions.length * 0.75 && quizScore < quizQuestions.length && <p>💪 Great job! Keep going!</p>}
              {quizScore < quizQuestions.length * 0.75 && quizScore > 0 && <p>📚 Good effort! Practice makes perfect.</p>}
              {quizScore === 0 && <p>🤔 Let's keep learning — you'll get there!</p>}
            </div>

            <div className="results-stats">
              <div className="results-stat">
                <span className="rs-value">{totalCorrect}</span>
                <span className="rs-label">Total Correct</span>
              </div>
              <div className="results-stat">
                <span className="rs-value">{streak}</span>
                <span className="rs-label">Current Streak</span>
              </div>
              <div className="results-stat">
                <span className="rs-value">Lv.{difficulty}</span>
                <span className="rs-label">Difficulty</span>
              </div>
            </div>

            {/* Mastery bars */}
            <div className="mastery-section compact">
              {learnedConcepts.map(id => (
                <MasteryBar key={id} conceptId={id} mastery={mastery} />
              ))}
            </div>

            <button className="continue-btn" onClick={handleContinueAfterQuiz}>
              {currentConceptIndex < CONCEPTS.length - 1 ?
                `Learn ${CONCEPTS[currentConceptIndex + 1].notation} →` :
                'See Your Results →'
              }
            </button>
          </div>
        </div>
      )
    }

    return (
      <div className="bigo-explorer">
        <div className="top-bar">
          <div className="scenario-badge" style={{ '--color': scenarioData.color }}>
            <span>{scenarioData.icon}</span>
            <span>{isReview ? '🔄 Review' : '🧠 Practice'}</span>
          </div>
          <div className="streak-badge">
            🔥 {streak}
          </div>
        </div>

        <QuizQuestion
          question={quizQuestions[currentQuestionIndex]}
          onAnswer={handleQuizAnswer}
          questionNum={currentQuestionIndex + 1}
          totalQuestions={quizQuestions.length}
        />
      </div>
    )
  }

  // ============================
  // COMPLETE PHASE
  // ============================
  if (phase === 'complete') {
    const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0

    return (
      <div className="bigo-explorer">
        <div className="complete-screen">
          <div className="complete-header">
            <h1>🎓 Journey Complete!</h1>
            <p>You explored all 6 Big O complexities through {SCENARIOS[scenario]?.name}</p>
          </div>

          <div className="final-chart">
            <h3>The Big Picture</h3>
            <GrowthChart concepts={CONCEPTS} highlightId={null} />
            <div className="chart-legend">
              {CONCEPTS.map(c => (
                <span key={c.id} className="legend-item" style={{ color: c.color }}>
                  {c.emoji} {c.notation}
                </span>
              ))}
            </div>
          </div>

          <div className="final-stats">
            <div className="final-stat">
              <span className="fs-value">{accuracy}%</span>
              <span className="fs-label">Accuracy</span>
            </div>
            <div className="final-stat">
              <span className="fs-value">{totalCorrect}</span>
              <span className="fs-label">Correct</span>
            </div>
            <div className="final-stat">
              <span className="fs-value">Lv.{difficulty}</span>
              <span className="fs-label">Difficulty</span>
            </div>
          </div>

          <div className="mastery-section">
            <h3>Your Mastery</h3>
            {CONCEPTS.map(c => (
              <MasteryBar key={c.id} conceptId={c.id} mastery={mastery} />
            ))}
          </div>

          <div className="key-takeaway">
            <h3>🔑 Key Takeaway</h3>
            <p>
              As data grows, the <em>choice of algorithm matters more than the speed of your computer</em>.
              An O(n²) algorithm on the fastest computer will lose to an O(n log n) algorithm on a phone
              once the data gets large enough.
            </p>
          </div>

          <button className="restart-btn" onClick={handleRestart}>
            Try Another Scenario
          </button>
        </div>
      </div>
    )
  }

  return null
}
