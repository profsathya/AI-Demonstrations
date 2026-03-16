import { useState, useEffect, useRef } from 'react'
import './ThaiCooking.css'

// ============================
// SCENARIO (PATH) DEFINITIONS
// ============================
const PATHS = {
  street: {
    name: 'Street Food',
    icon: '🛒',
    color: '#f59e0b',
    tagline: 'Master the sizzling flavors of Thai street vendors',
    bg: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    dishes: ['Pad Thai', 'Satay', 'Som Tum', 'Mango Sticky Rice'],
  },
  curry: {
    name: 'Curry Master',
    icon: '🍛',
    color: '#22c55e',
    tagline: 'Unlock the secrets of authentic Thai curries',
    bg: 'linear-gradient(135deg, #22c55e, #14b8a6)',
    dishes: ['Green Curry', 'Red Curry', 'Massaman', 'Panang'],
  },
  soup: {
    name: 'Soups & Noodles',
    icon: '🍜',
    color: '#ec4899',
    tagline: 'Dive into the soul-warming world of Thai soups',
    bg: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
    dishes: ['Tom Yum', 'Tom Kha', 'Khao Soi', 'Boat Noodles'],
  },
  homecook: {
    name: 'Everyday Thai',
    icon: '🏠',
    color: '#6366f1',
    tagline: 'Simple, delicious Thai meals for your kitchen',
    bg: 'linear-gradient(135deg, #6366f1, #3b82f6)',
    dishes: ['Pad Kra Pao', 'Fried Rice', 'Larb', 'Thai Omelette'],
  },
}

// ============================
// THAI COOKING CONCEPTS
// ============================
const CONCEPTS = [
  {
    id: 'flavors',
    name: 'The 5 Flavor Balance',
    emoji: '⚖️',
    color: '#f59e0b',
    description: 'Thai cooking is built on balancing 5 fundamental tastes. Every great Thai dish hits all 5 in harmony — no single flavor dominates.',
    tastes: [
      { name: 'Sweet', emoji: '🍯', source: 'Palm sugar, coconut milk', color: '#f59e0b' },
      { name: 'Sour', emoji: '🍋', source: 'Lime juice, tamarind', color: '#84cc16' },
      { name: 'Salty', emoji: '🧂', source: 'Fish sauce, soy sauce', color: '#6366f1' },
      { name: 'Spicy', emoji: '🌶️', source: 'Thai chilies, white pepper', color: '#ef4444' },
      { name: 'Umami', emoji: '🫙', source: 'Shrimp paste, oyster sauce', color: '#8b5cf6' },
    ],
    paths: {
      street: {
        example: 'Pad Thai balances tamarind (sour), palm sugar (sweet), fish sauce (salty), chili flakes (spicy), and dried shrimp (umami)',
        tip: 'Street vendors taste constantly — they adjust on the fly. You should too!',
        dish: 'Pad Thai',
      },
      curry: {
        example: 'Green Curry balances coconut milk (sweet), kaffir lime (sour), fish sauce (salty), green chilies (spicy), and shrimp paste (umami)',
        tip: 'A great curry is never just "spicy" — it should be complex and layered.',
        dish: 'Green Curry',
      },
      soup: {
        example: 'Tom Yum balances lime juice (sour), a pinch of sugar (sweet), fish sauce (salty), bird\'s eye chilies (spicy), and roasted chili paste (umami)',
        tip: 'Tom Yum is "sour-forward" but still needs all 5 flavors to taste right.',
        dish: 'Tom Yum',
      },
      homecook: {
        example: 'Pad Kra Pao balances oyster sauce (sweet/umami), fish sauce (salty), lime (sour), and fresh chilies (spicy) — all in one quick stir fry',
        tip: 'The "Thai Holy Trinity" of sauces: fish sauce, oyster sauce, and soy sauce.',
        dish: 'Pad Kra Pao',
      },
    },
  },
  {
    id: 'aromatics',
    name: 'The Aromatic Foundation',
    emoji: '🌿',
    color: '#22c55e',
    description: 'Thai cuisine uses a unique set of aromatics that create its distinctive fragrance. These herbs and roots are what make Thai food smell and taste like no other cuisine.',
    ingredients: [
      { name: 'Lemongrass', emoji: '🌾', use: 'Citrusy, fresh base note', tip: 'Bruise stalks to release oils' },
      { name: 'Galangal', emoji: '🫚', use: 'Sharp, piney warmth', tip: 'Slice thin — not the same as ginger!' },
      { name: 'Kaffir Lime Leaves', emoji: '🍃', use: 'Intense citrus perfume', tip: 'Tear leaves to release fragrance' },
      { name: 'Thai Basil', emoji: '🌱', use: 'Anise-like, peppery', tip: 'Add last — heat destroys flavor' },
      { name: 'Cilantro Root', emoji: '🌿', use: 'Earthy, concentrated', tip: 'The root is more flavorful than leaves' },
      { name: 'Shallots & Garlic', emoji: '🧄', use: 'Savory foundation', tip: 'Use together — never just one' },
    ],
    paths: {
      street: {
        example: 'A Som Tum vendor pounds garlic and chilies in a mortar, releasing aromatics before adding anything else',
        tip: 'Street food relies on freshly pounded aromatics — pre-ground loses the magic.',
        dish: 'Som Tum',
      },
      curry: {
        example: 'Curry paste starts with pounding lemongrass, galangal, and kaffir lime zest into a smooth, fragrant base',
        tip: 'The paste IS the aromatics — quality here determines everything.',
        dish: 'Green Curry Paste',
      },
      soup: {
        example: 'Tom Kha starts by simmering galangal, lemongrass, and kaffir lime leaves in coconut milk — infusing every drop',
        tip: 'These aromatics are not meant to be eaten — they flavor the broth.',
        dish: 'Tom Kha Gai',
      },
      homecook: {
        example: 'Pad Kra Pao starts by frying garlic and chilies in blazing hot oil until fragrant — 10 seconds max',
        tip: 'Thai basil goes in at the very end — just a quick wilt!',
        dish: 'Pad Kra Pao',
      },
    },
  },
  {
    id: 'paste',
    name: 'Curry Paste Secrets',
    emoji: '🧪',
    color: '#ef4444',
    description: 'The curry paste is the soul of Thai cooking. Understanding how to build paste — whether pounded or blended — unlocks dozens of dishes.',
    pasteTypes: [
      { name: 'Green (Prik Gaeng Khiao Wan)', color: '#22c55e', heat: '🌶️🌶️🌶️', key: 'Green chilies + Thai basil' },
      { name: 'Red (Prik Gaeng Phet)', color: '#ef4444', heat: '🌶️🌶️', key: 'Dried red chilies + shallots' },
      { name: 'Yellow (Prik Gaeng Karee)', color: '#f59e0b', heat: '🌶️', key: 'Turmeric + curry powder' },
      { name: 'Massaman', color: '#92400e', heat: '🌶️', key: 'Warm spices + cinnamon' },
    ],
    paths: {
      street: {
        example: 'Satay peanut sauce starts with a red curry paste base, blended with roasted peanuts and coconut cream',
        tip: 'Even street sauces start with a proper paste — it\'s never "just peanut butter."',
        dish: 'Satay Sauce',
      },
      curry: {
        example: 'A proper green curry paste uses 15+ fresh ingredients pounded in specific order: hard spices first, then wet ingredients',
        tip: 'Mortar and pestle > food processor. The crushing releases oils that blending doesn\'t.',
        dish: 'Green Curry',
      },
      soup: {
        example: 'Khao Soi uses a unique paste combining red curry base with turmeric, curry powder, and shrimp paste',
        tip: 'Fry the paste in oil first until fragrant — this is called "blooming."',
        dish: 'Khao Soi',
      },
      homecook: {
        example: 'Store-bought paste is fine for weeknight cooking! Jazz it up with fresh lemongrass and a spoon of shrimp paste',
        tip: 'No shame in store-bought — Thai home cooks use it too! Just fry it properly first.',
        dish: 'Quick Red Curry',
      },
    },
  },
  {
    id: 'wok',
    name: 'Wok Skills & Heat Control',
    emoji: '🔥',
    color: '#f97316',
    description: 'Thai cooking uses extreme heat ("wok hei") for stir-fries, gentle simmering for curries, and everything in between. Mastering heat is mastering Thai food.',
    techniques: [
      { name: 'Wok Hei', emoji: '🔥', desc: 'Blazing hot wok, fast toss — creates smoky flavor', temp: 'MAX' },
      { name: 'Stir & Toss', emoji: '🥘', desc: 'Constant motion prevents burning at high heat', temp: 'HIGH' },
      { name: 'Bloom Paste', emoji: '🫕', desc: 'Fry curry paste in oil until fragrant and darkened', temp: 'MED-HIGH' },
      { name: 'Gentle Simmer', emoji: '♨️', desc: 'Low bubbles for curries — never boil coconut milk hard', temp: 'LOW' },
    ],
    paths: {
      street: {
        example: 'Pad Thai cooks in under 2 minutes on a screaming hot wok — the noodles must char slightly but not burn',
        tip: 'Work in small batches. Overloading the wok drops the temperature and makes soggy noodles.',
        dish: 'Pad Thai',
      },
      curry: {
        example: 'First crack coconut cream over medium-high heat until oil separates, then bloom the curry paste in that oil',
        tip: '"Breaking" the coconut milk is the secret step most recipes skip — it deepens flavor enormously.',
        dish: 'Green Curry',
      },
      soup: {
        example: 'Tom Yum broth simmers gently — if you boil it hard, the aromatics turn bitter and the shrimp overcooks',
        tip: 'Add shrimp last and kill the heat — residual heat finishes cooking.',
        dish: 'Tom Yum Goong',
      },
      homecook: {
        example: 'Pad Kra Pao requires the HOTTEST possible wok — the garlic and chilies should smoke immediately',
        tip: 'If your wok isn\'t smoking before you add anything, it\'s not hot enough.',
        dish: 'Pad Kra Pao',
      },
    },
  },
  {
    id: 'rice',
    name: 'Rice & Noodle Mastery',
    emoji: '🍚',
    color: '#a78bfa',
    description: 'Rice and noodles are the backbone of every Thai meal. Each type has specific preparation methods and pairings — choosing wrong changes the entire dish.',
    types: [
      { name: 'Jasmine Rice', emoji: '🍚', pair: 'Curries, stir-fries', tip: 'Rinse 3x until water runs clear' },
      { name: 'Sticky Rice', emoji: '🍙', pair: 'Isaan food, grilled meats', tip: 'Soak 4+ hours, steam — never boil' },
      { name: 'Rice Noodles (Sen Lek)', emoji: '🍜', pair: 'Pad Thai, soups', tip: 'Soak in room-temp water, not hot!' },
      { name: 'Egg Noodles (Ba Mee)', emoji: '🍝', pair: 'Khao Soi, wonton soup', tip: 'Cook briefly — they firm up fast' },
      { name: 'Glass Noodles', emoji: '🫧', pair: 'Salads, hot pots', tip: 'Soak until pliable, cut with scissors' },
    ],
    paths: {
      street: {
        example: 'Pad Thai uses sen lek noodles soaked (never boiled!) until pliable, then cooked entirely in the wok',
        tip: 'Over-soaked noodles = mushy Pad Thai. 20–30 min room temp soak is perfect.',
        dish: 'Pad Thai',
      },
      curry: {
        example: 'Green Curry is always served over jasmine rice — the rice absorbs the sauce like a flavor sponge',
        tip: 'Slightly sticky jasmine rice is ideal. The grains should clump just enough to scoop with a spoon.',
        dish: 'Green Curry',
      },
      soup: {
        example: 'Khao Soi uses fresh egg noodles in the soup PLUS crispy fried egg noodles on top for crunch',
        tip: 'Two textures of the same noodle in one dish — that\'s Thai genius.',
        dish: 'Khao Soi',
      },
      homecook: {
        example: 'Thai fried rice uses DAY-OLD jasmine rice — fresh rice is too wet and steams instead of frying',
        tip: 'Cook rice the night before and refrigerate uncovered — dry grains = perfect fried rice.',
        dish: 'Khao Pad',
      },
    },
  },
  {
    id: 'presentation',
    name: 'Thai Plating & Garnish',
    emoji: '🎨',
    color: '#ec4899',
    description: 'Thai food is a feast for the eyes before it hits the mouth. Garnishing isn\'t decoration — it adds flavor, texture, and the final balancing touch.',
    garnishes: [
      { name: 'Fresh Herbs', emoji: '🌿', items: 'Thai basil, cilantro, mint', purpose: 'Brightness & aroma' },
      { name: 'Crunchy Bits', emoji: '🥜', items: 'Peanuts, fried shallots, garlic chips', purpose: 'Texture contrast' },
      { name: 'Citrus', emoji: '🍋', items: 'Lime wedges, kaffir lime zest', purpose: 'Last-second acid hit' },
      { name: 'Heat', emoji: '🌶️', items: 'Bird\'s eye chilies, chili oil, chili flakes', purpose: 'Customizable spice' },
      { name: 'Condiment Tray', emoji: '🍽️', items: 'Fish sauce, sugar, chili flakes, vinegar', purpose: 'Guest adjusts to taste' },
    ],
    paths: {
      street: {
        example: 'Pad Thai is topped with crushed peanuts, bean sprouts, chives, a lime wedge, and chili flakes — each adds something specific',
        tip: 'In Thailand, Pad Thai always comes with a condiment caddy: sugar, fish sauce, chili, vinegar.',
        dish: 'Pad Thai',
      },
      curry: {
        example: 'Green curry is finished with a swirl of thick coconut cream, torn Thai basil, and sliced red chili on top',
        tip: 'That coconut cream swirl isn\'t just pretty — it adds richness that cuts through the heat.',
        dish: 'Green Curry',
      },
      soup: {
        example: 'Tom Yum gets a final hit of fresh lime juice and cilantro OFF the heat — never cooked in',
        tip: 'The garnish IS the final flavor balance. Without it, the dish is incomplete.',
        dish: 'Tom Yum',
      },
      homecook: {
        example: 'Larb is served on lettuce cups with fresh mint, shallots, and toasted rice powder for crunch',
        tip: 'Toasted rice powder (khao khua) is the secret Thai ingredient — adds nutty crunch to salads.',
        dish: 'Larb',
      },
    },
  },
]

// ============================
// QUIZ QUESTION GENERATOR
// ============================
function generateQuestions(path, learnedIds, difficulty) {
  const questions = []
  const learned = CONCEPTS.filter(c => learnedIds.includes(c.id))
  if (!learned.length) return questions

  // Type 1: Identify ingredient/technique role
  learned.forEach(concept => {
    const p = concept.paths[path]
    if (concept.id === 'flavors') {
      concept.tastes.forEach(taste => {
        questions.push({
          type: 'identify',
          question: `What flavor does "${taste.source.split(',')[0]}" provide in Thai cooking?`,
          correct: taste.name,
          options: shuffle([taste.name, ...concept.tastes.filter(t => t.name !== taste.name).map(t => t.name).slice(0, 3)]),
          conceptId: concept.id,
          difficulty: 1,
        })
      })
    }
    if (concept.id === 'aromatics') {
      concept.ingredients.forEach(ing => {
        questions.push({
          type: 'identify',
          question: `What role does ${ing.name} play in Thai cooking?`,
          correct: ing.use,
          options: shuffle([ing.use, ...concept.ingredients.filter(i => i.name !== ing.name).map(i => i.use).slice(0, 3)]),
          conceptId: concept.id,
          difficulty: 1,
        })
      })
    }
  })

  // Type 2: True/False style tips
  learned.forEach(concept => {
    const p = concept.paths[path]
    if (concept.id === 'wok') {
      questions.push({
        type: 'truefalse',
        question: `For ${p.dish}, what's the correct approach?`,
        correct: p.tip,
        options: shuffle([
          p.tip,
          'Cook on low heat to avoid burning',
          'Add all ingredients at once to save time',
          'Use a non-stick pan instead of a wok',
        ].slice(0, 4)),
        conceptId: concept.id,
        difficulty: 2,
      })
    }
    if (concept.id === 'rice') {
      questions.push({
        type: 'truefalse',
        question: `What's the right way to prepare noodles/rice for ${p.dish}?`,
        correct: p.tip,
        options: shuffle([
          p.tip,
          'Boil noodles in salted water for 10 minutes',
          'Use freshly cooked rice straight from the pot',
          'Microwave leftover noodles with water',
        ].slice(0, 4)),
        conceptId: concept.id,
        difficulty: 2,
      })
    }
  })

  // Type 3: Match dish to concept
  learned.forEach(concept => {
    const p = concept.paths[path]
    questions.push({
      type: 'match',
      question: `Which concept is most critical for making great ${p.dish}?`,
      detail: `"${p.example}"`,
      correct: concept.name,
      options: shuffle([concept.name, ...learned.filter(c => c.id !== concept.id).map(c => c.name).slice(0, 3)]),
      conceptId: concept.id,
      difficulty: 2,
    })
  })

  // Type 4: Scenario application (harder)
  if (difficulty >= 2) {
    if (learnedIds.includes('flavors')) {
      questions.push({
        type: 'apply',
        question: 'Your Thai dish tastes flat and one-dimensional. What should you check FIRST?',
        correct: 'The 5 flavor balance — something is missing',
        options: shuffle([
          'The 5 flavor balance — something is missing',
          'Add more chili to make it spicier',
          'Cook it longer to develop flavor',
          'Add more salt until it tastes right',
        ]),
        conceptId: 'flavors',
        difficulty: 3,
      })
    }
    if (learnedIds.includes('paste')) {
      questions.push({
        type: 'apply',
        question: 'Your curry paste tastes raw and harsh. What step did you probably skip?',
        correct: 'Blooming the paste — frying it in oil until fragrant',
        options: shuffle([
          'Blooming the paste — frying it in oil until fragrant',
          'Adding more coconut milk to thin it out',
          'Cooking it longer on high heat',
          'Adding sugar to balance the raw flavor',
        ]),
        conceptId: 'paste',
        difficulty: 3,
      })
    }
    if (learnedIds.includes('wok')) {
      questions.push({
        type: 'apply',
        question: 'Your stir fry is watery and soggy instead of charred and smoky. Why?',
        correct: 'Wok not hot enough, or overcrowded — cook smaller batches',
        options: shuffle([
          'Wok not hot enough, or overcrowded — cook smaller batches',
          'Didn\'t add enough oil to the pan',
          'Cooked too fast and needed more time',
          'Should have used a regular frying pan instead',
        ]),
        conceptId: 'wok',
        difficulty: 3,
      })
    }
    if (learnedIds.includes('presentation')) {
      questions.push({
        type: 'apply',
        question: 'In Thailand, why does every table have a condiment tray with sugar, fish sauce, chili, and vinegar?',
        correct: 'So each diner can fine-tune the 5 flavor balance to their taste',
        options: shuffle([
          'So each diner can fine-tune the 5 flavor balance to their taste',
          'Because Thai food is always under-seasoned on purpose',
          'It\'s just tradition with no real purpose',
          'Because the chef doesn\'t season the food',
        ]),
        conceptId: 'presentation',
        difficulty: 3,
      })
    }
  }

  return shuffle(questions.filter(q => q.difficulty <= difficulty))
}

function shuffle(arr) {
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
function FlavorWheel({ tastes, highlight }) {
  const cx = 100, cy = 100, r = 70
  return (
    <svg className="flavor-wheel" viewBox="0 0 200 200">
      {tastes.map((taste, i) => {
        const angle = (i / tastes.length) * Math.PI * 2 - Math.PI / 2
        const x = cx + Math.cos(angle) * r
        const y = cy + Math.sin(angle) * r
        const isHighlighted = highlight === taste.name || !highlight
        return (
          <g key={taste.name}>
            <line x1={cx} y1={cy} x2={x} y2={y} stroke={taste.color} strokeWidth={isHighlighted ? 2 : 0.5} opacity={isHighlighted ? 0.8 : 0.2} />
            <circle cx={x} cy={y} r={isHighlighted ? 18 : 12} fill={taste.color} opacity={isHighlighted ? 0.9 : 0.3} className={isHighlighted ? 'pulse-taste' : ''} />
            <text x={x} y={y - 1} textAnchor="middle" dominantBaseline="middle" fontSize={isHighlighted ? '14' : '10'}>{taste.emoji}</text>
            <text x={x} y={y + (i < 2 || i === 4 ? -24 : 24)} textAnchor="middle" fontSize="8" fill="var(--text-muted)" fontWeight="600">{taste.name}</text>
          </g>
        )
      })}
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize="10" fill="var(--text-muted)" fontWeight="700">BALANCE</text>
    </svg>
  )
}

function IngredientGrid({ items, type }) {
  return (
    <div className="ingredient-grid">
      {items.map((item, i) => (
        <div key={i} className="ingredient-card" style={{ '--delay': `${i * 0.1}s`, '--color': item.color || 'var(--primary)' }}>
          <span className="ing-emoji">{item.emoji}</span>
          <span className="ing-name">{item.name}</span>
          <span className="ing-desc">{item.use || item.desc || item.pair || item.items || item.key || ''}</span>
          {item.tip && <span className="ing-tip">💡 {item.tip}</span>}
        </div>
      ))}
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
    }, 1400)
  }

  return (
    <div className="tc-quiz-question">
      <div className="tc-quiz-progress">
        <span>Question {questionNum} of {totalQuestions}</span>
        <div className="tc-quiz-bar">
          <div className="tc-quiz-fill" style={{ width: `${(questionNum / totalQuestions) * 100}%` }} />
        </div>
      </div>
      <div className="tc-quiz-prompt">
        <span className="tc-quiz-type">
          {question.type === 'identify' && '🔍 Identify'}
          {question.type === 'truefalse' && '✅ Best Practice'}
          {question.type === 'match' && '🔗 Connect'}
          {question.type === 'apply' && '🧑‍🍳 Apply'}
        </span>
        <h3>{question.question}</h3>
        {question.detail && <p className="tc-quiz-detail">{question.detail}</p>}
      </div>
      <div className="tc-quiz-options">
        {question.options.map((option, i) => {
          let cls = 'tc-quiz-option'
          if (revealed) {
            if (option === question.correct) cls += ' correct'
            else if (option === selected) cls += ' wrong'
          }
          return (
            <button key={i} className={cls} onClick={() => handleSelect(option)}
              style={{ '--delay': `${i * 0.08}s` }}>
              {option}
            </button>
          )
        })}
      </div>
      {revealed && (
        <div className={`tc-quiz-feedback ${selected === question.correct ? 'correct' : 'wrong'}`}>
          {selected === question.correct
            ? <span>✅ Correct! Nice work, chef!</span>
            : <span>❌ Not quite — the answer is <strong>{question.correct}</strong></span>}
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
    <div className="tc-mastery-bar" style={{ '--color': concept.color }}>
      <span className="tc-mastery-emoji">{concept.emoji}</span>
      <span className="tc-mastery-name">{concept.name}</span>
      <div className="tc-mastery-track">
        <div className="tc-mastery-fill" style={{ width: `${Math.min(level * 16.7, 100)}%` }} />
      </div>
      <span className="tc-mastery-stars">{'★'.repeat(stars)}{'☆'.repeat(3 - stars)}</span>
    </div>
  )
}

// ============================
// MAIN COMPONENT
// ============================
export default function ThaiCooking() {
  const [phase, setPhase] = useState('welcome')
  const [path, setPath] = useState(null)
  const [conceptIndex, setConceptIndex] = useState(0)
  const [learnedConcepts, setLearnedConcepts] = useState([])
  const [showExample, setShowExample] = useState(false)

  const [quizQuestions, setQuizQuestions] = useState([])
  const [questionIndex, setQuestionIndex] = useState(0)
  const [quizScore, setQuizScore] = useState(0)

  const [difficulty, setDifficulty] = useState(1)
  const [mastery, setMastery] = useState({})
  const [streak, setStreak] = useState(0)
  const [totalCorrect, setTotalCorrect] = useState(0)
  const [totalAnswered, setTotalAnswered] = useState(0)
  const [reviewQueue, setReviewQueue] = useState([])
  const [isReview, setIsReview] = useState(false)

  const current = CONCEPTS[conceptIndex]

  const selectPath = (p) => {
    setPath(p)
    setPhase('learn')
    setConceptIndex(0)
  }

  const markLearned = () => {
    const newLearned = [...learnedConcepts, current.id]
    setLearnedConcepts(newLearned)
    const qs = generateQuestions(path, newLearned, difficulty)
    setQuizQuestions(qs.slice(0, Math.min(4, qs.length)))
    setQuestionIndex(0)
    setQuizScore(0)
    setIsReview(false)
    setPhase('practice')
  }

  const handleAnswer = (correct) => {
    const cid = quizQuestions[questionIndex]?.conceptId
    setTotalAnswered(p => p + 1)
    if (correct) {
      setQuizScore(p => p + 1)
      setTotalCorrect(p => p + 1)
      setStreak(p => p + 1)
      setMastery(p => ({ ...p, [cid]: (p[cid] || 0) + 1 }))
      if (streak + 1 >= 3 && difficulty < 3) setDifficulty(p => Math.min(p + 1, 3))
    } else {
      setStreak(0)
      if (cid && !reviewQueue.includes(cid)) setReviewQueue(p => [...p, cid])
      if (difficulty > 1) setDifficulty(p => Math.max(p - 1, 1))
    }
    if (questionIndex < quizQuestions.length - 1) {
      setQuestionIndex(p => p + 1)
    } else {
      setTimeout(() => {
        if (reviewQueue.length > 0 && learnedConcepts.length >= 3 && !isReview) {
          startReview()
        } else if (conceptIndex < CONCEPTS.length - 1) {
          setConceptIndex(p => p + 1)
          setShowExample(false)
          setPhase('learn')
        } else {
          setPhase('complete')
        }
      }, 800)
    }
  }

  const startReview = () => {
    setIsReview(true)
    const reviewConcepts = [...new Set([...reviewQueue, ...learnedConcepts])]
    const qs = generateQuestions(path, reviewConcepts, difficulty)
    setQuizQuestions(shuffle(qs).slice(0, Math.min(5, qs.length)))
    setQuestionIndex(0)
    setQuizScore(0)
    setReviewQueue([])
    setPhase('practice')
  }

  const continueAfterQuiz = () => {
    if (conceptIndex < CONCEPTS.length - 1) {
      setConceptIndex(p => p + 1)
      setShowExample(false)
      setPhase('learn')
    } else {
      setPhase('complete')
    }
  }

  const restart = () => {
    setPhase('welcome'); setPath(null); setConceptIndex(0)
    setLearnedConcepts([]); setShowExample(false)
    setQuizQuestions([]); setQuestionIndex(0); setQuizScore(0)
    setDifficulty(1); setMastery({}); setStreak(0)
    setTotalCorrect(0); setTotalAnswered(0); setReviewQueue([]); setIsReview(false)
  }

  // ============================
  // WELCOME
  // ============================
  if (phase === 'welcome') {
    return (
      <div className="thai-cooking">
        <div className="tc-welcome">
          <div className="tc-welcome-header">
            <h1>
              <span className="tc-title">Thai Cooking</span>
              <span className="tc-subtitle">Mastery</span>
            </h1>
            <p className="tc-tagline">Learn authentic Thai cooking through the path that excites you most</p>
          </div>
          <p className="tc-choose">Choose your journey:</p>
          <div className="tc-path-grid">
            {Object.entries(PATHS).map(([id, p], i) => (
              <button key={id} className="tc-path-card" onClick={() => selectPath(id)}
                style={{ '--bg': p.bg, '--color': p.color, '--delay': `${i * 0.1}s` }}>
                <span className="tc-path-icon">{p.icon}</span>
                <span className="tc-path-name">{p.name}</span>
                <span className="tc-path-tagline">{p.tagline}</span>
                <div className="tc-path-dishes">
                  {p.dishes.map((d, j) => <span key={j} className="tc-dish-tag">{d}</span>)}
                </div>
              </button>
            ))}
          </div>
          <div className="tc-features">
            <div className="tc-feat"><span>🧠</span> Retrieval practice</div>
            <div className="tc-feat"><span>🔄</span> Spaced interleaving</div>
            <div className="tc-feat"><span>📈</span> Adaptive difficulty</div>
          </div>
        </div>
      </div>
    )
  }

  // ============================
  // LEARN
  // ============================
  if (phase === 'learn') {
    const pathData = PATHS[path]
    const conceptPath = current.paths[path]
    const renderConceptVisual = () => {
      switch (current.id) {
        case 'flavors':
          return <FlavorWheel tastes={current.tastes} highlight={null} />
        case 'aromatics':
          return <IngredientGrid items={current.ingredients} type="aromatic" />
        case 'paste':
          return (
            <div className="paste-types">
              {current.pasteTypes.map((p, i) => (
                <div key={i} className="paste-card" style={{ '--color': p.color, '--delay': `${i * 0.1}s` }}>
                  <div className="paste-swatch" style={{ background: p.color }} />
                  <div className="paste-info">
                    <span className="paste-name">{p.name}</span>
                    <span className="paste-heat">{p.heat}</span>
                    <span className="paste-key">{p.key}</span>
                  </div>
                </div>
              ))}
            </div>
          )
        case 'wok':
          return (
            <div className="technique-list">
              {current.techniques.map((t, i) => (
                <div key={i} className="technique-card" style={{ '--delay': `${i * 0.1}s` }}>
                  <span className="tech-emoji">{t.emoji}</span>
                  <div className="tech-info">
                    <span className="tech-name">{t.name}</span>
                    <span className="tech-desc">{t.desc}</span>
                  </div>
                  <span className="tech-temp">{t.temp}</span>
                </div>
              ))}
            </div>
          )
        case 'rice':
          return <IngredientGrid items={current.types} type="rice" />
        case 'presentation':
          return <IngredientGrid items={current.garnishes} type="garnish" />
        default:
          return null
      }
    }

    return (
      <div className="thai-cooking">
        <div className="tc-topbar">
          <div className="tc-badge" style={{ '--color': pathData.color }}>
            <span>{pathData.icon}</span><span>{pathData.name}</span>
          </div>
          <div className="tc-progress-badge">{conceptIndex + 1} / {CONCEPTS.length}</div>
        </div>
        <div className="tc-concept-header" style={{ '--color': current.color }}>
          <span className="tc-concept-emoji">{current.emoji}</span>
          <div>
            <h2 className="tc-concept-notation">{current.name}</h2>
            <p className="tc-concept-sub">Lesson {conceptIndex + 1} of {CONCEPTS.length}</p>
          </div>
        </div>
        <div className="tc-concept-desc"><p>{current.description}</p></div>
        {renderConceptVisual()}
        {!showExample ? (
          <button className="tc-show-example" onClick={() => setShowExample(true)}
            style={{ '--color': current.color }}>
            <span>{pathData.icon}</span> See how this applies to {pathData.name}
          </button>
        ) : (
          <div className="tc-example-section" style={{ '--color': current.color }}>
            <div className="tc-example-card">
              <h3>{pathData.icon} {conceptPath.dish}</h3>
              <p className="tc-example-text">{conceptPath.example}</p>
              <div className="tc-tip-box">
                <span className="tc-tip-label">🧑‍🍳 Pro Tip:</span>
                <p>{conceptPath.tip}</p>
              </div>
            </div>
            <button className="tc-got-it" onClick={markLearned}
              style={{ '--color': current.color }}>
              Got it! Quiz me 🍴
            </button>
          </div>
        )}
        {learnedConcepts.length > 0 && (
          <div className="tc-mastery-section">
            <h4>Your Mastery</h4>
            {learnedConcepts.map(id => <MasteryBar key={id} conceptId={id} mastery={mastery} />)}
          </div>
        )}
      </div>
    )
  }

  // ============================
  // PRACTICE
  // ============================
  if (phase === 'practice') {
    const quizDone = questionIndex >= quizQuestions.length
    const pathData = PATHS[path]

    if (quizDone || !quizQuestions.length) {
      return (
        <div className="thai-cooking">
          <div className="tc-results">
            <div className="tc-results-header">
              <h2>{isReview ? '🔄 Review Complete!' : '🍽️ Practice Complete!'}</h2>
              <div className="tc-score-display">
                <span className="tc-score-big">{quizScore}</span>
                <span className="tc-score-div">/</span>
                <span className="tc-score-total">{quizQuestions.length}</span>
              </div>
            </div>
            <div className="tc-results-msg">
              {quizScore === quizQuestions.length && <p className="tc-perfect">🌟 Perfect! You're a natural chef!</p>}
              {quizScore >= quizQuestions.length * 0.75 && quizScore < quizQuestions.length && <p>💪 Great job! Your Thai instincts are growing!</p>}
              {quizScore < quizQuestions.length * 0.75 && quizScore > 0 && <p>📚 Keep going — every great chef started here!</p>}
              {quizScore === 0 && <p>🤔 Let's keep learning — flavor mastery takes practice!</p>}
            </div>
            <div className="tc-results-stats">
              <div className="tc-rs"><span className="tc-rsv">{totalCorrect}</span><span className="tc-rsl">Total Correct</span></div>
              <div className="tc-rs"><span className="tc-rsv">{streak}</span><span className="tc-rsl">Streak</span></div>
              <div className="tc-rs"><span className="tc-rsv">Lv.{difficulty}</span><span className="tc-rsl">Difficulty</span></div>
            </div>
            <div className="tc-mastery-section compact">
              {learnedConcepts.map(id => <MasteryBar key={id} conceptId={id} mastery={mastery} />)}
            </div>
            <button className="tc-continue" onClick={continueAfterQuiz}>
              {conceptIndex < CONCEPTS.length - 1
                ? `Next: ${CONCEPTS[conceptIndex + 1].emoji} ${CONCEPTS[conceptIndex + 1].name} →`
                : 'See Your Results →'}
            </button>
          </div>
        </div>
      )
    }

    return (
      <div className="thai-cooking">
        <div className="tc-topbar">
          <div className="tc-badge" style={{ '--color': pathData.color }}>
            <span>{pathData.icon}</span><span>{isReview ? '🔄 Review' : '🧠 Practice'}</span>
          </div>
          <div className="tc-streak-badge">🔥 {streak}</div>
        </div>
        <QuizQuestion
          question={quizQuestions[questionIndex]}
          onAnswer={handleAnswer}
          questionNum={questionIndex + 1}
          totalQuestions={quizQuestions.length}
        />
      </div>
    )
  }

  // ============================
  // COMPLETE
  // ============================
  if (phase === 'complete') {
    const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0
    const pathData = PATHS[path]
    return (
      <div className="thai-cooking">
        <div className="tc-complete">
          <div className="tc-complete-header">
            <h1>🎓 Journey Complete!</h1>
            <p>You've mastered the foundations of Thai cooking through {pathData.name}!</p>
          </div>
          <div className="tc-final-stats">
            <div className="tc-fstat"><span className="tc-fsv">{accuracy}%</span><span className="tc-fsl">Accuracy</span></div>
            <div className="tc-fstat"><span className="tc-fsv">{totalCorrect}</span><span className="tc-fsl">Correct</span></div>
            <div className="tc-fstat"><span className="tc-fsv">Lv.{difficulty}</span><span className="tc-fsl">Difficulty</span></div>
          </div>
          <div className="tc-mastery-section">
            <h3>Your Mastery</h3>
            {CONCEPTS.map(c => <MasteryBar key={c.id} conceptId={c.id} mastery={mastery} />)}
          </div>
          <div className="tc-takeaway">
            <h3>🔑 Key Takeaway</h3>
            <p>
              Thai cooking isn't about following recipes — it's about understanding <em>balance</em>.
              Once you feel the 5 flavors, know your aromatics, and respect the wok's heat,
              you can improvise any Thai dish with confidence. <strong>Taste constantly. Adjust fearlessly.</strong>
            </p>
          </div>
          <div className="tc-dishes-learned">
            <h3>Dishes You Explored</h3>
            <div className="tc-dish-grid">
              {CONCEPTS.map(c => {
                const p = c.paths[path]
                return (
                  <div key={c.id} className="tc-dish-card" style={{ '--color': c.color }}>
                    <span className="tc-dish-emoji">{c.emoji}</span>
                    <span className="tc-dish-name">{p.dish}</span>
                  </div>
                )
              })}
            </div>
          </div>
          <button className="tc-restart" onClick={restart}>Try Another Path</button>
        </div>
      </div>
    )
  }

  return null
}
