import { useState, useEffect } from 'react'
import './BuildStory.css'

const STORY_CHAPTERS = [
  {
    id: 'intro',
    phase: 'The Beginning',
    title: 'An Idea Takes Shape',
    role: 'human',
    content: {
      quote: "I want to make multiple demonstrations of your capabilities in this repo and deploy it on my Netlify account seamlessly. It will help my students see such demos so they understand the capabilities of this technology.",
      insight: "A professor with a vision: help students understand AI capabilities through hands-on, interactive demonstrations they can experience themselves.",
      visual: 'lightbulb'
    }
  },
  {
    id: 'infrastructure',
    phase: 'Foundation',
    title: 'Building the Infrastructure',
    role: 'ai',
    content: {
      decision: "Before building any demos, we need a solid foundation that makes adding new demos effortless.",
      approach: [
        { label: 'Framework', value: 'React + Vite', reason: 'Fast builds, hot reload, modern DX' },
        { label: 'Routing', value: 'React Router', reason: 'SPA navigation for seamless UX' },
        { label: 'Hosting', value: 'Netlify', reason: 'Git integration, auto-deploy on push' },
        { label: 'Architecture', value: 'Demo Registry', reason: 'Add demos by registering in one file' }
      ],
      codeSnippet: {
        title: 'Demo Registry Pattern',
        language: 'javascript',
        code: `// src/demos/index.js
export const demos = {
  'my-demo': {
    title: 'Demo Title',
    description: '...',
    icon: '🎯',
    component: MyDemoComponent
  }
}`
      },
      filesCreated: 23
    }
  },
  {
    id: 'netlify-setup',
    phase: 'Deployment',
    title: 'Seamless Deployment',
    role: 'collaboration',
    content: {
      humanAsk: "Can I deploy this now even though we haven't built anything?",
      aiResponse: "Absolutely. The infrastructure is a complete, working app. Deploying now verifies the pipeline works.",
      benefit: "This approach validates the deployment process early, so we can focus on building features knowing they'll deploy automatically.",
      steps: [
        'Connect GitHub repo to Netlify',
        'Build settings auto-detected from netlify.toml',
        'Every git push triggers auto-deployment',
        'Site live within minutes'
      ]
    }
  },
  {
    id: 'game-request',
    phase: 'First Demo',
    title: 'The Challenge',
    role: 'human',
    content: {
      quote: "Can you build an impressive game that will wow my students? It should have multiple levels with sufficient challenge, work on mobile phones, be intellectually engaging and at the same time just pure fun.",
      requirements: [
        { icon: '📱', text: 'Mobile-friendly' },
        { icon: '🧠', text: 'Intellectually engaging' },
        { icon: '🎮', text: 'Multiple levels' },
        { icon: '😄', text: 'Pure fun' },
        { icon: '🤯', text: 'Wow factor' }
      ]
    }
  },
  {
    id: 'game-design',
    phase: 'First Demo',
    title: 'Designing Mind Grid',
    role: 'ai',
    content: {
      concept: "A pattern memory game that evolves its rules as you progress, testing not just memory but spatial reasoning and adaptability.",
      mechanics: [
        { levels: '1-5', name: 'Basic', desc: 'Memorize and repeat patterns' },
        { levels: '6-10', name: 'Reverse', desc: 'Repeat patterns backwards' },
        { levels: '11-15', name: 'Mirror', desc: 'Flip patterns horizontally' },
        { levels: '16-20', name: 'Rotate', desc: 'Rotate patterns 90°' },
        { levels: '21-25', name: 'Colors', desc: 'Match position AND color' },
        { levels: '26-30', name: 'Speed', desc: 'Lightning fast display' }
      ],
      whyThisDesign: "Each mechanic builds on the previous, creating a learning curve that feels achievable yet challenging. The rules change, so players can't just memorize—they must adapt."
    }
  },
  {
    id: 'game-tech',
    phase: 'First Demo',
    title: 'Technical Implementation',
    role: 'ai',
    content: {
      highlights: [
        {
          title: 'Pattern Transformation',
          desc: 'Mathematical functions to mirror, rotate, and reverse patterns on the grid',
          code: `function transformPattern(pattern, mechanic, gridSize) {
  switch (mechanic) {
    case 'rotate':
      return pattern.map(item => {
        const row = Math.floor(item.position / gridSize)
        const col = item.position % gridSize
        const newRow = col
        const newCol = gridSize - 1 - row
        return { ...item, position: newRow * gridSize + newCol }
      })
    // ...
  }
}`
        },
        {
          title: 'Particle Effects',
          desc: 'Visual feedback with physics-based particles on every interaction',
          code: `const addParticles = (x, y, color, count = 10) => {
  const newParticles = Array.from({ length: count }, (_, i) => ({
    id: Date.now() + i,
    x, y, color,
    angle: (Math.PI * 2 * i) / count,
    speed: 2 + Math.random() * 3,
    life: 1
  }))
  setParticles(prev => [...prev, ...newParticles])
}`
        }
      ],
      stats: { levels: '30+', linesOfCode: 450, mechanics: 6 }
    }
  },
  {
    id: 'productivity-request',
    phase: 'Second Demo',
    title: 'A Different Challenge',
    role: 'human',
    content: {
      quote: "Can we build a productivity app for guiding CS students to develop the right habits and practices to prepare for the job market while things are changing due to AI?",
      insight: "The professor recognized that in an AI-transformed industry, students need guidance not just on technical skills, but on how to position themselves competitively.",
      themes: ['Career preparation', 'AI-era adaptation', 'Habit building', 'Skill development']
    }
  },
  {
    id: 'productivity-design',
    phase: 'Second Demo',
    title: 'Designing DevPath',
    role: 'ai',
    content: {
      concept: "A comprehensive habit and skill tracker specifically designed for CS students navigating the AI-transformed job market.",
      structure: [
        {
          name: 'Daily Habits',
          icon: '✓',
          items: ['Write Code', 'Learn Something New', 'Solve Problems', 'Build Projects', 'Network', 'Practice AI Tools', 'Reflect']
        },
        {
          name: 'Skill Roadmap',
          icon: '📈',
          items: ['CS Fundamentals', 'AI Literacy', 'Practical Skills', 'Human Skills', 'Career Building']
        },
        {
          name: 'Weekly Challenges',
          icon: '🎯',
          items: ['Actionable tasks', 'Point rewards', 'Rotating selection']
        }
      ],
      aiEraFocus: "Specifically includes AI tool proficiency, prompt engineering, and emphasizes human skills that AI cannot replace."
    }
  },
  {
    id: 'insights',
    phase: 'Second Demo',
    title: 'AI-Era Guidance',
    role: 'ai',
    content: {
      insights: [
        { title: "AI Won't Replace You", text: "But someone who knows how to use AI effectively might." },
        { title: "Fundamentals Matter More", text: "When AI writes boilerplate, understanding WHY becomes your differentiator." },
        { title: "Human Skills Are Your Moat", text: "Communication, empathy, and creative problem-framing are skills AI struggles with." },
        { title: "Quality Over Quantity", text: "One well-documented project beats 20 todo apps. Go deep." }
      ],
      whyIncluded: "These insights rotate in the app, providing continuous reinforcement of key mindset shifts students need."
    }
  },
  {
    id: 'summary',
    phase: 'The Result',
    title: 'What We Built Together',
    role: 'collaboration',
    content: {
      timeline: [
        { time: 'Request', item: 'Infrastructure for demos on Netlify' },
        { time: 'Built', item: '23 files, complete React app with routing' },
        { time: 'Request', item: 'Impressive mobile game with levels' },
        { time: 'Built', item: 'Mind Grid: 30+ levels, 6 mechanics, particle effects' },
        { time: 'Request', item: 'Productivity app for CS students' },
        { time: 'Built', item: 'DevPath: habits, skills, challenges, AI-era guidance' },
        { time: 'Request', item: 'Tell the story of this collaboration' },
        { time: 'Built', item: "You're looking at it right now" }
      ],
      technologies: ['React', 'Vite', 'React Router', 'CSS Animations', 'localStorage', 'Netlify'],
      totalCode: '2,500+ lines'
    }
  },
  {
    id: 'takeaways',
    phase: 'Reflection',
    title: 'Key Takeaways',
    role: 'lesson',
    content: {
      points: [
        {
          title: 'Start with Infrastructure',
          desc: 'A solid foundation makes everything easier. We deployed an empty shell first to validate the pipeline.'
        },
        {
          title: 'Iterate Quickly',
          desc: 'Each demo went from request to deployed in a single conversation. AI accelerates development cycles dramatically.'
        },
        {
          title: 'Human Ideas + AI Execution',
          desc: 'The professor provided vision and requirements. AI handled implementation details and technical decisions.'
        },
        {
          title: 'This Is the Future',
          desc: 'Understanding how to collaborate with AI—providing clear requirements, reviewing output, iterating—is the meta-skill of the AI era.'
        }
      ]
    }
  }
]

export default function BuildStory() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const currentChapter = STORY_CHAPTERS[currentIndex]
  const progress = ((currentIndex + 1) / STORY_CHAPTERS.length) * 100

  const navigate = (direction) => {
    if (isAnimating) return

    const newIndex = direction === 'next'
      ? Math.min(currentIndex + 1, STORY_CHAPTERS.length - 1)
      : Math.max(currentIndex - 1, 0)

    if (newIndex !== currentIndex) {
      setIsAnimating(true)
      setCurrentIndex(newIndex)
      setTimeout(() => setIsAnimating(false), 500)
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
  }, [currentIndex, isAnimating])

  const renderContent = () => {
    const { content, role } = currentChapter

    if (currentChapter.id === 'intro') {
      return (
        <div className="slide-intro">
          <div className="quote-block">
            <span className="quote-mark">"</span>
            <p>{content.quote}</p>
          </div>
          <p className="insight">{content.insight}</p>
          <div className={`visual-icon ${content.visual}`}>💡</div>
        </div>
      )
    }

    if (currentChapter.id === 'infrastructure') {
      return (
        <div className="slide-infrastructure">
          <p className="decision">{content.decision}</p>
          <div className="approach-grid">
            {content.approach.map((item, i) => (
              <div key={i} className="approach-card">
                <span className="approach-label">{item.label}</span>
                <span className="approach-value">{item.value}</span>
                <span className="approach-reason">{item.reason}</span>
              </div>
            ))}
          </div>
          <div className="code-block">
            <div className="code-header">{content.codeSnippet.title}</div>
            <pre><code>{content.codeSnippet.code}</code></pre>
          </div>
          <div className="stat-badge">{content.filesCreated} files created</div>
        </div>
      )
    }

    if (currentChapter.id === 'netlify-setup') {
      return (
        <div className="slide-netlify">
          <div className="conversation">
            <div className="message human">
              <span className="msg-role">Professor</span>
              <p>{content.humanAsk}</p>
            </div>
            <div className="message ai">
              <span className="msg-role">Claude</span>
              <p>{content.aiResponse}</p>
            </div>
          </div>
          <p className="benefit">{content.benefit}</p>
          <div className="steps">
            {content.steps.map((step, i) => (
              <div key={i} className="step">
                <span className="step-num">{i + 1}</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )
    }

    if (currentChapter.id === 'game-request') {
      return (
        <div className="slide-request">
          <div className="quote-block">
            <span className="quote-mark">"</span>
            <p>{content.quote}</p>
          </div>
          <div className="requirements">
            {content.requirements.map((req, i) => (
              <div key={i} className="requirement">
                <span className="req-icon">{req.icon}</span>
                <span>{req.text}</span>
              </div>
            ))}
          </div>
        </div>
      )
    }

    if (currentChapter.id === 'game-design') {
      return (
        <div className="slide-game-design">
          <p className="concept">{content.concept}</p>
          <div className="mechanics-table">
            {content.mechanics.map((m, i) => (
              <div key={i} className="mechanic-row">
                <span className="levels">Levels {m.levels}</span>
                <span className="mech-name">{m.name}</span>
                <span className="mech-desc">{m.desc}</span>
              </div>
            ))}
          </div>
          <p className="why-design">{content.whyThisDesign}</p>
        </div>
      )
    }

    if (currentChapter.id === 'game-tech') {
      return (
        <div className="slide-tech">
          {content.highlights.map((h, i) => (
            <div key={i} className="tech-highlight">
              <h4>{h.title}</h4>
              <p>{h.desc}</p>
              <pre><code>{h.code}</code></pre>
            </div>
          ))}
          <div className="tech-stats">
            <div className="tech-stat">
              <span className="ts-value">{content.stats.levels}</span>
              <span className="ts-label">Levels</span>
            </div>
            <div className="tech-stat">
              <span className="ts-value">{content.stats.linesOfCode}</span>
              <span className="ts-label">Lines of Code</span>
            </div>
            <div className="tech-stat">
              <span className="ts-value">{content.stats.mechanics}</span>
              <span className="ts-label">Mechanics</span>
            </div>
          </div>
        </div>
      )
    }

    if (currentChapter.id === 'productivity-request') {
      return (
        <div className="slide-request">
          <div className="quote-block">
            <span className="quote-mark">"</span>
            <p>{content.quote}</p>
          </div>
          <p className="insight">{content.insight}</p>
          <div className="themes">
            {content.themes.map((theme, i) => (
              <span key={i} className="theme-tag">{theme}</span>
            ))}
          </div>
        </div>
      )
    }

    if (currentChapter.id === 'productivity-design') {
      return (
        <div className="slide-devpath-design">
          <p className="concept">{content.concept}</p>
          <div className="structure-cards">
            {content.structure.map((s, i) => (
              <div key={i} className="structure-card">
                <div className="sc-header">
                  <span className="sc-icon">{s.icon}</span>
                  <span className="sc-name">{s.name}</span>
                </div>
                <ul>
                  {s.items.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="ai-focus">{content.aiEraFocus}</p>
        </div>
      )
    }

    if (currentChapter.id === 'insights') {
      return (
        <div className="slide-insights">
          <div className="insights-grid">
            {content.insights.map((ins, i) => (
              <div key={i} className="insight-card">
                <h4>{ins.title}</h4>
                <p>{ins.text}</p>
              </div>
            ))}
          </div>
          <p className="why-included">{content.whyIncluded}</p>
        </div>
      )
    }

    if (currentChapter.id === 'summary') {
      return (
        <div className="slide-summary">
          <div className="timeline">
            {content.timeline.map((item, i) => (
              <div key={i} className={`timeline-item ${item.time.toLowerCase()}`}>
                <span className="tl-marker">{item.time === 'Request' ? '💬' : '✨'}</span>
                <span className="tl-text">{item.item}</span>
              </div>
            ))}
          </div>
          <div className="tech-used">
            {content.technologies.map((tech, i) => (
              <span key={i} className="tech-badge">{tech}</span>
            ))}
          </div>
          <div className="total-code">{content.totalCode} of code written</div>
        </div>
      )
    }

    if (currentChapter.id === 'takeaways') {
      return (
        <div className="slide-takeaways">
          {content.points.map((point, i) => (
            <div key={i} className="takeaway">
              <div className="takeaway-num">{i + 1}</div>
              <div className="takeaway-content">
                <h4>{point.title}</h4>
                <p>{point.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )
    }

    return null
  }

  return (
    <div className="build-story">
      {/* Progress bar */}
      <div className="story-progress">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Chapter indicator */}
      <div className="chapter-indicator">
        <span className="chapter-phase">{currentChapter.phase}</span>
        <span className="chapter-count">{currentIndex + 1} / {STORY_CHAPTERS.length}</span>
      </div>

      {/* Main slide area */}
      <div className={`slide ${currentChapter.role} ${isAnimating ? 'animating' : ''}`}>
        <h2 className="slide-title">{currentChapter.title}</h2>
        <div className="slide-content">
          {renderContent()}
        </div>
      </div>

      {/* Navigation */}
      <div className="story-nav">
        <button
          className="nav-btn prev"
          onClick={() => navigate('prev')}
          disabled={currentIndex === 0}
        >
          ← Previous
        </button>
        <div className="nav-dots">
          {STORY_CHAPTERS.map((_, i) => (
            <button
              key={i}
              className={`nav-dot ${i === currentIndex ? 'active' : ''} ${i < currentIndex ? 'visited' : ''}`}
              onClick={() => {
                if (!isAnimating) {
                  setIsAnimating(true)
                  setCurrentIndex(i)
                  setTimeout(() => setIsAnimating(false), 500)
                }
              }}
            />
          ))}
        </div>
        <button
          className="nav-btn next"
          onClick={() => navigate('next')}
          disabled={currentIndex === STORY_CHAPTERS.length - 1}
        >
          Next →
        </button>
      </div>

      {/* Keyboard hint */}
      <div className="keyboard-hint">
        Use ← → arrow keys or swipe to navigate
      </div>
    </div>
  )
}
