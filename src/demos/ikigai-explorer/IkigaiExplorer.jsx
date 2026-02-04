import { useState, useEffect } from 'react'
import './IkigaiExplorer.css'

// Ikigai quadrant definitions with 6 levels of exploration each
const QUADRANTS = {
  love: {
    name: 'What You LOVE',
    color: '#ec4899',
    icon: '❤️',
    description: 'Activities that bring you joy and fulfillment',
    levels: [
      {
        question: "When you have free time, what type of activity draws you in?",
        choices: [
          { id: 'creating', label: 'Creating things', icon: '🎨', desc: 'Making art, writing, building, designing' },
          { id: 'helping', label: 'Helping others', icon: '🤝', desc: 'Teaching, mentoring, supporting, caring' },
          { id: 'analyzing', label: 'Solving puzzles', icon: '🧩', desc: 'Figuring things out, research, strategy' },
          { id: 'exploring', label: 'Exploring & learning', icon: '🔍', desc: 'Discovering new things, reading, traveling' },
          { id: 'performing', label: 'Performing & expressing', icon: '🎭', desc: 'Music, sports, speaking, entertaining' },
          { id: 'organizing', label: 'Organizing & planning', icon: '📋', desc: 'Making order, systems, coordinating' }
        ]
      },
      {
        question: "Within {prev}, what specifically excites you most?",
        choicesByPrev: {
          creating: [
            { id: 'visual', label: 'Visual arts', desc: 'Drawing, painting, photography, design' },
            { id: 'writing', label: 'Writing & storytelling', desc: 'Stories, poetry, articles, scripts' },
            { id: 'building', label: 'Building & making', desc: 'Crafts, woodwork, coding, engineering' },
            { id: 'music', label: 'Music & sound', desc: 'Composing, producing, instruments' }
          ],
          helping: [
            { id: 'teaching', label: 'Teaching & educating', desc: 'Sharing knowledge, explaining concepts' },
            { id: 'mentoring', label: 'Mentoring & guiding', desc: 'Personal growth, career advice' },
            { id: 'caring', label: 'Caring & healing', desc: 'Health, emotional support, wellness' },
            { id: 'advocating', label: 'Advocating & protecting', desc: 'Rights, causes, vulnerable groups' }
          ],
          analyzing: [
            { id: 'data', label: 'Data & patterns', desc: 'Numbers, trends, statistics' },
            { id: 'systems', label: 'Systems & processes', desc: 'How things work, optimization' },
            { id: 'strategy', label: 'Strategy & planning', desc: 'Chess-like thinking, long-term plans' },
            { id: 'debugging', label: 'Troubleshooting', desc: 'Finding root causes, fixing problems' }
          ],
          exploring: [
            { id: 'knowledge', label: 'Deep knowledge', desc: 'Becoming expert in specific topics' },
            { id: 'cultures', label: 'People & cultures', desc: 'Different perspectives, travel, languages' },
            { id: 'nature', label: 'Nature & science', desc: 'Natural world, experiments, discovery' },
            { id: 'ideas', label: 'Ideas & philosophy', desc: 'Big questions, theories, possibilities' }
          ],
          performing: [
            { id: 'athletic', label: 'Athletic performance', desc: 'Sports, physical challenges, competition' },
            { id: 'artistic', label: 'Artistic performance', desc: 'Acting, dancing, music performance' },
            { id: 'speaking', label: 'Public speaking', desc: 'Presentations, debates, inspiring others' },
            { id: 'entertaining', label: 'Entertainment', desc: 'Comedy, hosting, engaging audiences' }
          ],
          organizing: [
            { id: 'events', label: 'Events & experiences', desc: 'Bringing people together, celebrations' },
            { id: 'spaces', label: 'Spaces & environments', desc: 'Interior design, decluttering, feng shui' },
            { id: 'projects', label: 'Projects & teams', desc: 'Coordinating efforts, managing workflows' },
            { id: 'information', label: 'Information & knowledge', desc: 'Libraries, databases, documentation' }
          ]
        }
      },
      {
        question: "What feeling do you chase when doing this?",
        choices: [
          { id: 'flow', label: 'Complete absorption', desc: 'Losing track of time, being "in the zone"' },
          { id: 'connection', label: 'Deep connection', desc: 'Feeling bonded with others or something greater' },
          { id: 'mastery', label: 'Growing mastery', desc: 'Getting better, leveling up, improving' },
          { id: 'impact', label: 'Making a difference', desc: 'Seeing tangible results of your efforts' },
          { id: 'freedom', label: 'Freedom & expression', desc: 'Being authentically yourself, no constraints' },
          { id: 'discovery', label: 'Discovery & wonder', desc: 'That "aha!" moment, uncovering something new' }
        ]
      },
      {
        question: "Think of a time you were deeply happy doing something. What made it special?",
        choices: [
          { id: 'alone', label: 'I was in my own world', desc: 'Peaceful solitude, deep focus' },
          { id: 'together', label: 'I was with people I cared about', desc: 'Shared experience, collaboration' },
          { id: 'challenge', label: 'I was pushing my limits', desc: 'Growth through difficulty' },
          { id: 'helping', label: 'I was making someone\'s day better', desc: 'Their joy became my joy' },
          { id: 'creating', label: 'I was bringing something new into existence', desc: 'Creation from nothing' },
          { id: 'learning', label: 'I was understanding something profound', desc: 'Intellectual breakthrough' }
        ]
      },
      {
        question: "If money and judgment didn't exist, what would you spend your days doing?",
        choices: [
          { id: 'art', label: 'Creating art or content', desc: 'Writing, music, videos, crafts' },
          { id: 'community', label: 'Building community', desc: 'Bringing people together, hosting, organizing' },
          { id: 'adventure', label: 'Exploring the world', desc: 'Travel, nature, new experiences' },
          { id: 'knowledge', label: 'Pursuing deep knowledge', desc: 'Research, reading, understanding' },
          { id: 'service', label: 'Serving others', desc: 'Volunteering, helping, teaching' },
          { id: 'building', label: 'Building things', desc: 'Projects, businesses, inventions' }
        ]
      },
      {
        question: "Complete this sentence: 'I feel most alive when...'",
        choices: [
          { id: 'growth', label: '...I\'m growing and learning', desc: 'Continuous improvement energizes me' },
          { id: 'connect', label: '...I\'m connecting deeply with others', desc: 'Relationships are my fuel' },
          { id: 'create', label: '...I\'m creating something meaningful', desc: 'Making things is my purpose' },
          { id: 'solve', label: '...I\'m solving hard problems', desc: 'Challenges excite me' },
          { id: 'inspire', label: '...I\'m inspiring or helping others', desc: 'Impact drives me' },
          { id: 'explore', label: '...I\'m exploring new territory', desc: 'Novelty is my oxygen' }
        ]
      }
    ]
  },
  good: {
    name: 'What You\'re GOOD AT',
    color: '#f59e0b',
    icon: '⭐',
    description: 'Skills and talents that come naturally to you',
    levels: [
      {
        question: "What type of intelligence feels most natural to you?",
        choices: [
          { id: 'logical', label: 'Logical-Mathematical', icon: '🧮', desc: 'Numbers, patterns, reasoning' },
          { id: 'linguistic', label: 'Verbal-Linguistic', icon: '📝', desc: 'Words, writing, speaking' },
          { id: 'visual', label: 'Visual-Spatial', icon: '🎨', desc: 'Images, design, spatial thinking' },
          { id: 'interpersonal', label: 'Interpersonal', icon: '👥', desc: 'Understanding others, empathy' },
          { id: 'kinesthetic', label: 'Bodily-Kinesthetic', icon: '🏃', desc: 'Physical skills, hands-on' },
          { id: 'intrapersonal', label: 'Intrapersonal', icon: '🧘', desc: 'Self-awareness, reflection' }
        ]
      },
      {
        question: "People often come to you for help with...",
        choices: [
          { id: 'advice', label: 'Life advice & perspective', desc: 'They trust your judgment' },
          { id: 'technical', label: 'Technical problems', desc: 'You figure things out' },
          { id: 'creative', label: 'Creative ideas', desc: 'You think outside the box' },
          { id: 'emotional', label: 'Emotional support', desc: 'You listen and understand' },
          { id: 'organizing', label: 'Getting organized', desc: 'You bring order to chaos' },
          { id: 'motivation', label: 'Motivation & energy', desc: 'You inspire action' }
        ]
      },
      {
        question: "What do you do better than most people without trying hard?",
        choices: [
          { id: 'communicate', label: 'Communicate clearly', desc: 'Explaining complex things simply' },
          { id: 'empathize', label: 'Read people & situations', desc: 'Understanding unspoken dynamics' },
          { id: 'analyze', label: 'See patterns others miss', desc: 'Connecting dots, spotting trends' },
          { id: 'create', label: 'Generate new ideas', desc: 'Creative solutions, originality' },
          { id: 'execute', label: 'Get things done', desc: 'Action, follow-through, reliability' },
          { id: 'adapt', label: 'Adapt to anything', desc: 'Flexibility, learning quickly' }
        ]
      },
      {
        question: "When you\'ve achieved something you\'re proud of, what skill made it possible?",
        choices: [
          { id: 'persistence', label: 'Persistence', desc: 'You didn\'t give up when it got hard' },
          { id: 'creativity', label: 'Creative thinking', desc: 'You found an unusual solution' },
          { id: 'leadership', label: 'Bringing people together', desc: 'You rallied or inspired others' },
          { id: 'analysis', label: 'Deep analysis', desc: 'You understood the problem deeply' },
          { id: 'learning', label: 'Fast learning', desc: 'You picked up what you needed quickly' },
          { id: 'courage', label: 'Taking a risk', desc: 'You acted despite uncertainty' }
        ]
      },
      {
        question: "If you had to teach one skill to others, what would feel most natural?",
        choices: [
          { id: 'thinking', label: 'How to think critically', desc: 'Analysis, logic, problem-solving' },
          { id: 'creating', label: 'How to create', desc: 'Art, writing, building things' },
          { id: 'relating', label: 'How to connect with people', desc: 'Communication, empathy, relationships' },
          { id: 'achieving', label: 'How to achieve goals', desc: 'Productivity, discipline, success' },
          { id: 'wellbeing', label: 'How to be well', desc: 'Mental health, balance, self-care' },
          { id: 'leading', label: 'How to lead', desc: 'Influence, vision, team building' }
        ]
      },
      {
        question: "In 10 years, what skill would you love to be known as a master of?",
        choices: [
          { id: 'expert', label: 'Deep expertise in my field', desc: 'The go-to person for knowledge' },
          { id: 'innovator', label: 'Innovation & creativity', desc: 'Someone who creates new things' },
          { id: 'leader', label: 'Inspiring leadership', desc: 'Someone who elevates others' },
          { id: 'communicator', label: 'Powerful communication', desc: 'Someone who moves people' },
          { id: 'builder', label: 'Building things that last', desc: 'Businesses, organizations, products' },
          { id: 'wisdom', label: 'Wisdom & judgment', desc: 'Someone people seek for guidance' }
        ]
      }
    ]
  },
  needs: {
    name: 'What the World NEEDS',
    color: '#22c55e',
    icon: '🌍',
    description: 'Problems you want to help solve',
    levels: [
      {
        question: "When you see news about world problems, which makes you most want to act?",
        choices: [
          { id: 'environment', label: 'Environmental crisis', icon: '🌱', desc: 'Climate, nature, sustainability' },
          { id: 'education', label: 'Education gaps', icon: '📚', desc: 'Access to learning, skills, opportunity' },
          { id: 'health', label: 'Health & wellbeing', icon: '💊', desc: 'Physical, mental, healthcare access' },
          { id: 'inequality', label: 'Inequality & injustice', icon: '⚖️', desc: 'Poverty, discrimination, fairness' },
          { id: 'connection', label: 'Human disconnection', icon: '💔', desc: 'Loneliness, division, community loss' },
          { id: 'innovation', label: 'Lack of innovation', icon: '💡', desc: 'Stuck systems, outdated thinking' }
        ]
      },
      {
        question: "What scale of change excites you most?",
        choices: [
          { id: 'individual', label: 'One person at a time', desc: 'Deep individual transformation' },
          { id: 'community', label: 'Local community', desc: 'Neighborhood, city, region' },
          { id: 'organization', label: 'Organizations & companies', desc: 'Changing how groups work' },
          { id: 'national', label: 'National change', desc: 'Policy, culture, large populations' },
          { id: 'global', label: 'Global impact', desc: 'Worldwide reach and influence' },
          { id: 'future', label: 'Future generations', desc: 'Long-term, lasting legacy' }
        ]
      },
      {
        question: "How do you most want to contribute to change?",
        choices: [
          { id: 'direct', label: 'Direct service', desc: 'Hands-on helping, front lines' },
          { id: 'create', label: 'Creating solutions', desc: 'Building tools, products, systems' },
          { id: 'educate', label: 'Educating & awareness', desc: 'Teaching, communicating, spreading ideas' },
          { id: 'organize', label: 'Organizing & leading', desc: 'Mobilizing people, building movements' },
          { id: 'fund', label: 'Funding & resources', desc: 'Generating money for causes' },
          { id: 'research', label: 'Research & discovery', desc: 'Finding new knowledge, solutions' }
        ]
      },
      {
        question: "Why does this cause matter to YOU personally?",
        choices: [
          { id: 'experienced', label: 'I\'ve experienced this struggle', desc: 'Personal connection through hardship' },
          { id: 'witnessed', label: 'I\'ve seen others suffer', desc: 'Empathy from observation' },
          { id: 'inherited', label: 'It was passed down to me', desc: 'Family, culture, community values' },
          { id: 'logical', label: 'It\'s clearly important', desc: 'Rational analysis of needs' },
          { id: 'calling', label: 'I feel called to it', desc: 'Unexplainable pull, intuition' },
          { id: 'capable', label: 'I have unique ability to help', desc: 'Skills match the need' }
        ]
      },
      {
        question: "What would success look like for your contribution?",
        choices: [
          { id: 'stories', label: 'Individual stories of change', desc: '"I helped Maria achieve her dream"' },
          { id: 'numbers', label: 'Numbers that moved', desc: '"10,000 people were impacted"' },
          { id: 'systems', label: 'Systems that changed', desc: '"This policy now protects millions"' },
          { id: 'movements', label: 'Movements that grew', desc: '"People everywhere joined this cause"' },
          { id: 'innovations', label: 'Innovations that spread', desc: '"My solution is used globally"' },
          { id: 'culture', label: 'Culture that shifted', desc: '"People think differently now"' }
        ]
      },
      {
        question: "If you could be remembered for one contribution to humanity, what would it be?",
        choices: [
          { id: 'healed', label: '"They healed people"', desc: 'Physical, mental, emotional healing' },
          { id: 'taught', label: '"They opened minds"', desc: 'Education, awareness, enlightenment' },
          { id: 'built', label: '"They built something lasting"', desc: 'Organizations, systems, infrastructure' },
          { id: 'connected', label: '"They brought people together"', desc: 'Unity, community, understanding' },
          { id: 'protected', label: '"They protected the vulnerable"', desc: 'Defense, advocacy, safety' },
          { id: 'pioneered', label: '"They pioneered new paths"', desc: 'Innovation, first steps, breakthroughs' }
        ]
      }
    ]
  },
  paid: {
    name: 'What You Can Be PAID FOR',
    color: '#6366f1',
    icon: '💰',
    description: 'Value you can provide that others will pay for',
    levels: [
      {
        question: "What type of work environment energizes you?",
        choices: [
          { id: 'startup', label: 'Fast-paced startup', icon: '🚀', desc: 'Dynamic, risky, high growth' },
          { id: 'corporate', label: 'Established company', icon: '🏢', desc: 'Stable, structured, resources' },
          { id: 'freelance', label: 'Independent/Freelance', icon: '💻', desc: 'Freedom, variety, self-directed' },
          { id: 'nonprofit', label: 'Mission-driven org', icon: '❤️', desc: 'Purpose over profit' },
          { id: 'academic', label: 'Academic/Research', icon: '🎓', desc: 'Knowledge, discovery, teaching' },
          { id: 'entrepreneur', label: 'My own business', icon: '👑', desc: 'Building something mine' }
        ]
      },
      {
        question: "What role do you naturally gravitate toward?",
        choices: [
          { id: 'maker', label: 'The Maker', desc: 'Building products, writing code, creating content' },
          { id: 'connector', label: 'The Connector', desc: 'Networking, sales, partnerships' },
          { id: 'leader', label: 'The Leader', desc: 'Managing teams, setting vision' },
          { id: 'expert', label: 'The Expert', desc: 'Deep specialist knowledge' },
          { id: 'optimizer', label: 'The Optimizer', desc: 'Making things better, efficiency' },
          { id: 'communicator', label: 'The Communicator', desc: 'Marketing, teaching, explaining' }
        ]
      },
      {
        question: "What value do you most naturally provide?",
        choices: [
          { id: 'solve', label: 'Solving hard problems', desc: 'Technical, strategic, analytical' },
          { id: 'create', label: 'Creating new things', desc: 'Products, content, designs' },
          { id: 'grow', label: 'Growing revenue/impact', desc: 'Sales, marketing, expansion' },
          { id: 'operate', label: 'Running operations smoothly', desc: 'Efficiency, reliability, execution' },
          { id: 'develop', label: 'Developing people', desc: 'Training, coaching, mentoring' },
          { id: 'innovate', label: 'Bringing new ideas', desc: 'R&D, strategy, vision' }
        ]
      },
      {
        question: "What trade-off would you accept for meaningful work?",
        choices: [
          { id: 'less_money', label: 'Less money for more meaning', desc: 'Purpose over paycheck' },
          { id: 'more_hours', label: 'More hours for faster growth', desc: 'Intensity for opportunity' },
          { id: 'less_stability', label: 'Less stability for more freedom', desc: 'Risk for autonomy' },
          { id: 'remote', label: 'Remote for better life', desc: 'Flexibility over office perks' },
          { id: 'specialist', label: 'Narrow focus for depth', desc: 'Expertise over variety' },
          { id: 'none', label: 'I want it all', desc: 'Hold out for the right fit' }
        ]
      },
      {
        question: "What would make work feel like play?",
        choices: [
          { id: 'learning', label: 'Constant learning', desc: 'Always growing, new challenges' },
          { id: 'team', label: 'Amazing team', desc: 'People I love working with' },
          { id: 'impact', label: 'Visible impact', desc: 'Seeing my work matter' },
          { id: 'creativity', label: 'Creative freedom', desc: 'Space to do things my way' },
          { id: 'recognition', label: 'Recognition & growth', desc: 'Advancement, respect, rewards' },
          { id: 'autonomy', label: 'Full autonomy', desc: 'Control over my time and work' }
        ]
      },
      {
        question: "In 5 years, what career story would make you proud?",
        choices: [
          { id: 'founded', label: '"I founded something"', desc: 'Started a company, movement, or project' },
          { id: 'mastered', label: '"I mastered my craft"', desc: 'Became a recognized expert' },
          { id: 'led', label: '"I led a great team"', desc: 'Built and grew a successful team' },
          { id: 'transformed', label: '"I transformed an organization"', desc: 'Made a company or industry better' },
          { id: 'created', label: '"I created something loved"', desc: 'Product or content people value' },
          { id: 'helped', label: '"I helped many people grow"', desc: 'Mentored, taught, developed others' }
        ]
      }
    ]
  }
}

// Intersection insights
const INTERSECTIONS = {
  'love+good': { name: 'Passion', desc: 'Doing what you love AND are good at', color: '#f97316' },
  'good+paid': { name: 'Profession', desc: 'Skills the market values', color: '#a855f7' },
  'paid+needs': { name: 'Vocation', desc: 'Paid work that helps the world', color: '#14b8a6' },
  'needs+love': { name: 'Mission', desc: 'Purpose-driven passion', color: '#84cc16' }
}

function IkigaiExplorer() {
  const [phase, setPhase] = useState('intro') // intro, exploring, synthesis, complete
  const [currentQuadrant, setCurrentQuadrant] = useState(null)
  const [currentLevel, setCurrentLevel] = useState(0)
  const [selections, setSelections] = useState({
    love: [],
    good: [],
    needs: [],
    paid: []
  })
  const [completedQuadrants, setCompletedQuadrants] = useState([])
  const [animating, setAnimating] = useState(false)
  const [showInsight, setShowInsight] = useState(false)
  const [synthesisStep, setSynthesisStep] = useState(0)

  const quadrantOrder = ['love', 'good', 'needs', 'paid']

  const handleStartJourney = () => {
    setAnimating(true)
    setTimeout(() => {
      setPhase('exploring')
      setCurrentQuadrant('love')
      setCurrentLevel(0)
      setAnimating(false)
    }, 500)
  }

  const handleSelectChoice = (choice) => {
    setAnimating(true)

    // Record selection
    const newSelections = { ...selections }
    newSelections[currentQuadrant][currentLevel] = choice
    setSelections(newSelections)

    setTimeout(() => {
      const quadrantData = QUADRANTS[currentQuadrant]

      if (currentLevel < quadrantData.levels.length - 1) {
        // Move to next level
        setCurrentLevel(currentLevel + 1)
        setShowInsight(false)
      } else {
        // Complete this quadrant
        setCompletedQuadrants([...completedQuadrants, currentQuadrant])
        setShowInsight(true)
      }
      setAnimating(false)
    }, 400)
  }

  const handleNextQuadrant = () => {
    setAnimating(true)
    const currentIndex = quadrantOrder.indexOf(currentQuadrant)

    setTimeout(() => {
      if (currentIndex < quadrantOrder.length - 1) {
        setCurrentQuadrant(quadrantOrder[currentIndex + 1])
        setCurrentLevel(0)
        setShowInsight(false)
      } else {
        setPhase('synthesis')
        setSynthesisStep(0)
      }
      setAnimating(false)
    }, 500)
  }

  const handleSynthesisNext = () => {
    if (synthesisStep < 4) {
      setSynthesisStep(synthesisStep + 1)
    } else {
      setPhase('complete')
    }
  }

  const handleRestart = () => {
    setPhase('intro')
    setCurrentQuadrant(null)
    setCurrentLevel(0)
    setSelections({ love: [], good: [], needs: [], paid: [] })
    setCompletedQuadrants([])
    setShowInsight(false)
    setSynthesisStep(0)
  }

  const getCurrentChoices = () => {
    if (!currentQuadrant) return []
    const quadrant = QUADRANTS[currentQuadrant]
    const level = quadrant.levels[currentLevel]

    if (level.choicesByPrev && currentLevel > 0) {
      const prevChoice = selections[currentQuadrant][currentLevel - 1]
      return level.choicesByPrev[prevChoice?.id] || level.choicesByPrev[Object.keys(level.choicesByPrev)[0]]
    }
    return level.choices
  }

  const getQuestionText = () => {
    if (!currentQuadrant) return ''
    const quadrant = QUADRANTS[currentQuadrant]
    const level = quadrant.levels[currentLevel]
    let question = level.question

    if (question.includes('{prev}') && currentLevel > 0) {
      const prevChoice = selections[currentQuadrant][currentLevel - 1]
      question = question.replace('{prev}', prevChoice?.label?.toLowerCase() || 'this')
    }

    return question
  }

  const getQuadrantSummary = (quadrantId) => {
    const sel = selections[quadrantId]
    if (!sel.length) return null

    // Get the most meaningful selections
    const highlights = [sel[0], sel[sel.length - 1]].filter(Boolean)
    return highlights.map(s => s.label).join(' → ')
  }

  const renderIkigaiDiagram = (size = 'normal') => {
    const isSmall = size === 'small'
    const radius = isSmall ? 40 : 70
    const centerX = isSmall ? 80 : 140
    const centerY = isSmall ? 80 : 140
    const offset = isSmall ? 25 : 45

    const positions = {
      love: { x: centerX, y: centerY - offset },
      good: { x: centerX + offset, y: centerY },
      needs: { x: centerX, y: centerY + offset },
      paid: { x: centerX - offset, y: centerY }
    }

    return (
      <svg className={`ikigai-diagram ${size}`} viewBox={isSmall ? "0 0 160 160" : "0 0 280 280"}>
        {/* Quadrant circles */}
        {quadrantOrder.map((q) => {
          const pos = positions[q]
          const isComplete = completedQuadrants.includes(q)
          const isCurrent = currentQuadrant === q

          return (
            <g key={q}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r={radius}
                fill={isComplete ? `${QUADRANTS[q].color}40` : 'transparent'}
                stroke={QUADRANTS[q].color}
                strokeWidth={isCurrent ? 3 : 1.5}
                strokeDasharray={isComplete ? 'none' : '5,5'}
                className={isCurrent ? 'pulse-ring' : ''}
              />
              {!isSmall && (
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="diagram-label"
                  fill={QUADRANTS[q].color}
                >
                  {QUADRANTS[q].icon}
                </text>
              )}
            </g>
          )
        })}

        {/* Center - Ikigai */}
        {completedQuadrants.length === 4 && (
          <circle
            cx={centerX}
            cy={centerY}
            r={isSmall ? 15 : 25}
            fill="url(#ikigaiGradient)"
            className="ikigai-center"
          />
        )}

        <defs>
          <radialGradient id="ikigaiGradient">
            <stop offset="0%" stopColor="#fff" />
            <stop offset="100%" stopColor="#f0f0f0" />
          </radialGradient>
        </defs>
      </svg>
    )
  }

  // Intro Phase
  if (phase === 'intro') {
    return (
      <div className={`ikigai-explorer ${animating ? 'animating' : ''}`}>
        <div className="intro-screen">
          <div className="intro-visual">
            {renderIkigaiDiagram()}
            <div className="intro-glow"></div>
          </div>

          <h1>Discover Your <span className="highlight">Ikigai</span></h1>
          <p className="intro-meaning">
            生き甲斐 — "A reason for being"
          </p>

          <p className="intro-description">
            Ikigai is where four elements of your life intersect:
          </p>

          <div className="intro-quadrants">
            {quadrantOrder.map((q) => (
              <div key={q} className="intro-quadrant" style={{ '--color': QUADRANTS[q].color }}>
                <span className="q-icon">{QUADRANTS[q].icon}</span>
                <span className="q-name">{QUADRANTS[q].name}</span>
              </div>
            ))}
          </div>

          <p className="intro-promise">
            Through a series of guided choices, you'll explore each dimension
            and discover where your unique ikigai might be.
          </p>

          <button className="start-btn" onClick={handleStartJourney}>
            Begin Your Journey
            <span className="btn-arrow">→</span>
          </button>
        </div>
      </div>
    )
  }

  // Exploring Phase
  if (phase === 'exploring' && currentQuadrant) {
    const quadrant = QUADRANTS[currentQuadrant]
    const choices = getCurrentChoices()
    const progress = ((quadrantOrder.indexOf(currentQuadrant) * 6) + currentLevel + 1) / 24

    return (
      <div className={`ikigai-explorer ${animating ? 'animating' : ''}`}>
        {/* Progress indicator */}
        <div className="explore-progress">
          <div className="progress-fill" style={{ width: `${progress * 100}%` }}></div>
        </div>

        {/* Mini diagram */}
        <div className="explore-header">
          <div className="mini-diagram-container">
            {renderIkigaiDiagram('small')}
          </div>
          <div className="quadrant-info">
            <span className="quadrant-icon" style={{ color: quadrant.color }}>{quadrant.icon}</span>
            <span className="quadrant-name" style={{ color: quadrant.color }}>{quadrant.name}</span>
            <span className="level-indicator">Level {currentLevel + 1} of 6</span>
          </div>
        </div>

        {/* Question area */}
        {!showInsight ? (
          <div className="question-area">
            <h2 className="question-text">{getQuestionText()}</h2>

            <div className="choices-grid">
              {choices.map((choice, index) => (
                <button
                  key={choice.id}
                  className="choice-card"
                  onClick={() => handleSelectChoice(choice)}
                  style={{
                    '--delay': `${index * 0.1}s`,
                    '--color': quadrant.color
                  }}
                >
                  {choice.icon && <span className="choice-icon">{choice.icon}</span>}
                  <span className="choice-label">{choice.label}</span>
                  <span className="choice-desc">{choice.desc}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="insight-area">
            <div className="insight-icon" style={{ color: quadrant.color }}>{quadrant.icon}</div>
            <h2>You've explored {quadrant.name}</h2>

            <div className="insight-summary">
              <h3>Your journey through this dimension:</h3>
              <div className="selection-path">
                {selections[currentQuadrant].map((sel, i) => (
                  <div key={i} className="path-item" style={{ '--delay': `${i * 0.15}s` }}>
                    <span className="path-num">{i + 1}</span>
                    <span className="path-label">{sel.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="insight-reflection" style={{ '--color': quadrant.color }}>
              <p>
                {currentQuadrant === 'love' && "These choices reveal what genuinely excites and fulfills you — the activities you'd pursue even without external rewards."}
                {currentQuadrant === 'good' && "These patterns show your natural strengths — abilities that feel effortless to you but often impress others."}
                {currentQuadrant === 'needs' && "This reflects where you feel called to contribute — the problems that stir something deep in you."}
                {currentQuadrant === 'paid' && "These preferences shape your ideal work life — the environment where you can thrive and create value."}
              </p>
            </div>

            <button className="continue-btn" onClick={handleNextQuadrant} style={{ '--color': quadrant.color }}>
              {quadrantOrder.indexOf(currentQuadrant) < 3 ?
                `Continue to ${QUADRANTS[quadrantOrder[quadrantOrder.indexOf(currentQuadrant) + 1]].name}` :
                'See Your Ikigai'}
              <span className="btn-arrow">→</span>
            </button>
          </div>
        )}
      </div>
    )
  }

  // Synthesis Phase
  if (phase === 'synthesis') {
    const intersectionData = [
      { key: 'love+good', q1: 'love', q2: 'good' },
      { key: 'good+paid', q1: 'good', q2: 'paid' },
      { key: 'paid+needs', q1: 'paid', q2: 'needs' },
      { key: 'needs+love', q1: 'needs', q2: 'love' }
    ]

    return (
      <div className={`ikigai-explorer ${animating ? 'animating' : ''}`}>
        <div className="synthesis-screen">
          {synthesisStep === 0 && (
            <div className="synthesis-intro">
              <h1>Discovering Your Intersections</h1>
              <p>Your ikigai lies where all four dimensions meet. Let's explore what your choices reveal...</p>
              {renderIkigaiDiagram()}
              <button className="continue-btn" onClick={handleSynthesisNext}>
                Explore Intersections <span className="btn-arrow">→</span>
              </button>
            </div>
          )}

          {synthesisStep >= 1 && synthesisStep <= 4 && (
            <div className="intersection-reveal">
              {intersectionData.slice(0, synthesisStep).map((int, i) => {
                const intInfo = INTERSECTIONS[int.key]
                const q1 = QUADRANTS[int.q1]
                const q2 = QUADRANTS[int.q2]
                const sel1 = selections[int.q1][5] // Final selection from each
                const sel2 = selections[int.q2][5]

                return (
                  <div
                    key={int.key}
                    className={`intersection-card ${i === synthesisStep - 1 ? 'current' : ''}`}
                    style={{ '--color': intInfo.color, '--delay': `${i * 0.2}s` }}
                  >
                    <div className="int-header">
                      <span style={{ color: q1.color }}>{q1.icon}</span>
                      <span className="int-plus">+</span>
                      <span style={{ color: q2.color }}>{q2.icon}</span>
                    </div>
                    <h3 style={{ color: intInfo.color }}>{intInfo.name}</h3>
                    <p className="int-desc">{intInfo.desc}</p>
                    <div className="int-synthesis">
                      <em>"{sel1?.label}"</em> meets <em>"{sel2?.label}"</em>
                    </div>
                  </div>
                )
              })}

              {synthesisStep < 4 ? (
                <button className="continue-btn" onClick={handleSynthesisNext}>
                  Reveal Next Intersection <span className="btn-arrow">→</span>
                </button>
              ) : (
                <button className="continue-btn highlight" onClick={handleSynthesisNext}>
                  Discover Your Ikigai <span className="btn-arrow">→</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Complete Phase
  if (phase === 'complete') {
    return (
      <div className="ikigai-explorer">
        <div className="complete-screen">
          <div className="ikigai-reveal">
            <div className="reveal-glow"></div>
            {renderIkigaiDiagram()}
            <div className="ikigai-label">Your Ikigai</div>
          </div>

          <h1>Your Ikigai Journey</h1>

          <div className="final-summary">
            {quadrantOrder.map((q) => {
              const quadrant = QUADRANTS[q]
              const finalChoice = selections[q][5]
              return (
                <div key={q} className="summary-quadrant" style={{ '--color': quadrant.color }}>
                  <div className="sq-header">
                    <span className="sq-icon">{quadrant.icon}</span>
                    <span className="sq-name">{quadrant.name}</span>
                  </div>
                  <p className="sq-essence">"{finalChoice?.label}"</p>
                </div>
              )
            })}
          </div>

          <div className="ikigai-statement">
            <h2>Your Ikigai might be found where...</h2>
            <p>
              You pursue <strong style={{ color: QUADRANTS.love.color }}>{selections.love[5]?.label?.toLowerCase()}</strong> using
              your gift of <strong style={{ color: QUADRANTS.good.color }}>{selections.good[5]?.label?.toLowerCase()}</strong>,
              serving those who need <strong style={{ color: QUADRANTS.needs.color }}>{selections.needs[5]?.label?.toLowerCase()}</strong>,
              in a career of <strong style={{ color: QUADRANTS.paid.color }}>{selections.paid[5]?.label?.toLowerCase()}</strong>.
            </p>
          </div>

          <div className="reflection-prompt">
            <h3>Reflect on this...</h3>
            <p>
              Your ikigai isn't a destination — it's a compass. These insights point toward
              meaningful directions, but your unique path will unfold through action and experimentation.
            </p>
            <p className="reflection-question">
              What's one small step you could take this week to move toward your ikigai?
            </p>
          </div>

          <button className="restart-btn" onClick={handleRestart}>
            Explore Again
          </button>
        </div>
      </div>
    )
  }

  return null
}

export default IkigaiExplorer
