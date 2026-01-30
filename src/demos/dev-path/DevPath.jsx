import { useState, useEffect, useMemo } from 'react'
import './DevPath.css'

// Daily habits for CS students
const DAILY_HABITS = [
  { id: 'code', name: 'Write Code', description: 'Spend at least 1 hour coding (not tutorials)', icon: '💻', category: 'technical' },
  { id: 'learn', name: 'Learn Something New', description: 'Read docs, articles, or watch technical content', icon: '📚', category: 'growth' },
  { id: 'problem', name: 'Solve a Problem', description: 'LeetCode, HackerRank, or real-world debugging', icon: '🧩', category: 'technical' },
  { id: 'build', name: 'Work on Project', description: 'Contribute to personal or open-source project', icon: '🔨', category: 'portfolio' },
  { id: 'network', name: 'Connect with Others', description: 'Engage on LinkedIn, Discord, or meetups', icon: '🤝', category: 'career' },
  { id: 'ai-tool', name: 'Practice with AI Tools', description: 'Use Copilot, Claude, or similar effectively', icon: '🤖', category: 'ai-era' },
  { id: 'reflect', name: 'Reflect & Plan', description: 'Review progress and set tomorrow\'s goals', icon: '📝', category: 'growth' },
]

// Skill categories with competencies
const SKILL_TREE = [
  {
    id: 'fundamentals',
    name: 'CS Fundamentals',
    description: 'Core knowledge that never goes out of style',
    icon: '🎯',
    skills: [
      { id: 'dsa', name: 'Data Structures & Algorithms', importance: 'critical' },
      { id: 'oop', name: 'OOP Principles', importance: 'critical' },
      { id: 'system-design', name: 'System Design Basics', importance: 'high' },
      { id: 'databases', name: 'Database Fundamentals', importance: 'high' },
      { id: 'networking', name: 'Networking Concepts', importance: 'medium' },
      { id: 'os', name: 'Operating Systems', importance: 'medium' },
    ]
  },
  {
    id: 'ai-literacy',
    name: 'AI Literacy',
    description: 'Essential in the new landscape',
    icon: '🧠',
    skills: [
      { id: 'ai-tools', name: 'AI Coding Assistants', importance: 'critical' },
      { id: 'prompt-eng', name: 'Prompt Engineering', importance: 'critical' },
      { id: 'ml-basics', name: 'ML/AI Fundamentals', importance: 'high' },
      { id: 'ai-ethics', name: 'AI Ethics & Limitations', importance: 'high' },
      { id: 'ai-integration', name: 'Integrating AI in Apps', importance: 'medium' },
    ]
  },
  {
    id: 'practical',
    name: 'Practical Skills',
    description: 'What you actually do on the job',
    icon: '🛠️',
    skills: [
      { id: 'git', name: 'Git & Version Control', importance: 'critical' },
      { id: 'debugging', name: 'Debugging & Troubleshooting', importance: 'critical' },
      { id: 'testing', name: 'Testing & QA', importance: 'high' },
      { id: 'code-review', name: 'Code Review', importance: 'high' },
      { id: 'documentation', name: 'Technical Documentation', importance: 'medium' },
      { id: 'devops', name: 'Basic DevOps/CI-CD', importance: 'medium' },
    ]
  },
  {
    id: 'soft-skills',
    name: 'Human Skills',
    description: 'What AI cannot replace',
    icon: '💡',
    skills: [
      { id: 'communication', name: 'Technical Communication', importance: 'critical' },
      { id: 'problem-framing', name: 'Problem Framing', importance: 'critical' },
      { id: 'collaboration', name: 'Team Collaboration', importance: 'high' },
      { id: 'adaptability', name: 'Adaptability & Learning', importance: 'high' },
      { id: 'creativity', name: 'Creative Problem Solving', importance: 'high' },
      { id: 'ownership', name: 'Ownership & Initiative', importance: 'medium' },
    ]
  },
  {
    id: 'career',
    name: 'Career Building',
    description: 'Standing out in the market',
    icon: '🚀',
    skills: [
      { id: 'portfolio', name: 'Portfolio Projects', importance: 'critical' },
      { id: 'github', name: 'Active GitHub Profile', importance: 'high' },
      { id: 'linkedin', name: 'LinkedIn Presence', importance: 'high' },
      { id: 'interviewing', name: 'Interview Skills', importance: 'critical' },
      { id: 'networking', name: 'Professional Networking', importance: 'medium' },
      { id: 'personal-brand', name: 'Personal Branding', importance: 'medium' },
    ]
  },
]

// Weekly challenges
const WEEKLY_CHALLENGES = [
  { id: 1, task: 'Complete 5 LeetCode problems (any difficulty)', category: 'technical', points: 50 },
  { id: 2, task: 'Contribute to an open-source project (even docs)', category: 'portfolio', points: 75 },
  { id: 3, task: 'Build a small feature using AI pair programming', category: 'ai-era', points: 50 },
  { id: 4, task: 'Write a blog post or LinkedIn article about what you learned', category: 'career', points: 60 },
  { id: 5, task: 'Review someone else\'s code (friend, GitHub, etc.)', category: 'practical', points: 40 },
  { id: 6, task: 'Learn a new tool or framework basics', category: 'growth', points: 45 },
  { id: 7, task: 'Have a coffee chat with someone in tech', category: 'career', points: 55 },
  { id: 8, task: 'Refactor old code you wrote using best practices', category: 'practical', points: 50 },
  { id: 9, task: 'Explain a technical concept to a non-technical person', category: 'soft-skills', points: 40 },
  { id: 10, task: 'Set up a new project with proper Git workflow', category: 'practical', points: 35 },
  { id: 11, task: 'Research a company you\'d like to work for', category: 'career', points: 30 },
  { id: 12, task: 'Practice a mock interview (behavioral or technical)', category: 'career', points: 65 },
]

// AI-era insights
const INSIGHTS = [
  { title: 'AI Won\'t Replace You', content: 'But someone who knows how to use AI effectively might. Learn to leverage AI tools as multipliers for your productivity.' },
  { title: 'Fundamentals Matter More', content: 'When AI can write boilerplate, your understanding of WHY code works becomes your differentiator. Double down on fundamentals.' },
  { title: 'Build in Public', content: 'Document your learning journey. Companies want to see how you think and grow, not just finished products.' },
  { title: 'Human Skills Are Your Moat', content: 'Communication, empathy, and creative problem-framing are skills AI struggles with. Develop them intentionally.' },
  { title: 'Quality Over Quantity', content: 'One well-documented, thoughtful project beats 20 todo apps. Go deep, solve real problems.' },
  { title: 'Stay Curious, Not Anxious', content: 'The industry has always evolved. Those who adapt with curiosity rather than fear always thrive.' },
  { title: 'Network Authentically', content: 'Genuine connections beat mass applications. Help others, share knowledge, build relationships.' },
  { title: 'Understand the Full Stack', content: 'Even if you specialize, understanding how systems connect end-to-end makes you invaluable.' },
]

// Helper functions
function getToday() {
  return new Date().toISOString().split('T')[0]
}

function getWeekNumber() {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 1)
  const diff = now - start
  const oneWeek = 604800000
  return Math.floor(diff / oneWeek)
}

function getStorageKey(key) {
  return `devpath-${key}`
}

function loadData(key, defaultValue) {
  try {
    const saved = localStorage.getItem(getStorageKey(key))
    return saved ? JSON.parse(saved) : defaultValue
  } catch {
    return defaultValue
  }
}

function saveData(key, value) {
  localStorage.setItem(getStorageKey(key), JSON.stringify(value))
}

export default function DevPath() {
  const [activeTab, setActiveTab] = useState('habits')
  const [todayHabits, setTodayHabits] = useState(() => loadData(`habits-${getToday()}`, {}))
  const [skillProgress, setSkillProgress] = useState(() => loadData('skills', {}))
  const [completedChallenges, setCompletedChallenges] = useState(() => loadData(`challenges-week-${getWeekNumber()}`, []))
  const [streak, setStreak] = useState(() => loadData('streak', { count: 0, lastDate: null }))
  const [totalPoints, setTotalPoints] = useState(() => loadData('totalPoints', 0))
  const [currentInsight, setCurrentInsight] = useState(0)

  // Rotate insights
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentInsight(i => (i + 1) % INSIGHTS.length)
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  // Save data on changes
  useEffect(() => {
    saveData(`habits-${getToday()}`, todayHabits)
  }, [todayHabits])

  useEffect(() => {
    saveData('skills', skillProgress)
  }, [skillProgress])

  useEffect(() => {
    saveData(`challenges-week-${getWeekNumber()}`, completedChallenges)
  }, [completedChallenges])

  useEffect(() => {
    saveData('streak', streak)
  }, [streak])

  useEffect(() => {
    saveData('totalPoints', totalPoints)
  }, [totalPoints])

  // Check and update streak
  useEffect(() => {
    const today = getToday()
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

    if (streak.lastDate === today) return

    const completedCount = Object.values(todayHabits).filter(Boolean).length
    if (completedCount >= 3) {
      if (streak.lastDate === yesterday || streak.lastDate === today) {
        setStreak({ count: streak.count + 1, lastDate: today })
      } else {
        setStreak({ count: 1, lastDate: today })
      }
    }
  }, [todayHabits, streak])

  const toggleHabit = (habitId) => {
    const wasComplete = todayHabits[habitId]
    setTodayHabits(prev => ({ ...prev, [habitId]: !prev[habitId] }))
    if (!wasComplete) {
      setTotalPoints(p => p + 10)
    }
  }

  const toggleSkill = (skillId) => {
    setSkillProgress(prev => {
      const current = prev[skillId] || 0
      const next = current >= 3 ? 0 : current + 1
      if (next > current) {
        setTotalPoints(p => p + 25)
      }
      return { ...prev, [skillId]: next }
    })
  }

  const toggleChallenge = (challengeId) => {
    const challenge = WEEKLY_CHALLENGES.find(c => c.id === challengeId)
    if (completedChallenges.includes(challengeId)) {
      setCompletedChallenges(prev => prev.filter(id => id !== challengeId))
      setTotalPoints(p => p - challenge.points)
    } else {
      setCompletedChallenges(prev => [...prev, challengeId])
      setTotalPoints(p => p + challenge.points)
    }
  }

  const habitsCompletedToday = Object.values(todayHabits).filter(Boolean).length
  const habitsProgress = Math.round((habitsCompletedToday / DAILY_HABITS.length) * 100)

  const totalSkills = SKILL_TREE.reduce((acc, cat) => acc + cat.skills.length, 0)
  const masteredSkills = Object.values(skillProgress).filter(v => v === 3).length
  const skillsProgress = Math.round((masteredSkills / totalSkills) * 100)

  const weeklyProgress = Math.round((completedChallenges.length / 3) * 100) // Goal: 3 per week

  // Get 3 random challenges for this week (seeded by week number)
  const weeklyChallenges = useMemo(() => {
    const week = getWeekNumber()
    const shuffled = [...WEEKLY_CHALLENGES].sort((a, b) => {
      const hashA = (a.id * 31 + week) % 100
      const hashB = (b.id * 31 + week) % 100
      return hashA - hashB
    })
    return shuffled.slice(0, 3)
  }, [])

  return (
    <div className="devpath">
      {/* Header Stats */}
      <div className="devpath-header">
        <div className="header-stat">
          <span className="stat-icon">🔥</span>
          <span className="stat-value">{streak.count}</span>
          <span className="stat-label">Day Streak</span>
        </div>
        <div className="header-stat primary">
          <span className="stat-icon">⭐</span>
          <span className="stat-value">{totalPoints.toLocaleString()}</span>
          <span className="stat-label">Total Points</span>
        </div>
        <div className="header-stat">
          <span className="stat-icon">🎯</span>
          <span className="stat-value">{masteredSkills}</span>
          <span className="stat-label">Skills Mastered</span>
        </div>
      </div>

      {/* Insight Banner */}
      <div className="insight-banner">
        <div className="insight-content" key={currentInsight}>
          <h4>{INSIGHTS[currentInsight].title}</h4>
          <p>{INSIGHTS[currentInsight].content}</p>
        </div>
        <div className="insight-dots">
          {INSIGHTS.map((_, i) => (
            <button
              key={i}
              className={`dot ${i === currentInsight ? 'active' : ''}`}
              onClick={() => setCurrentInsight(i)}
            />
          ))}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-nav">
        <button
          className={`tab-btn ${activeTab === 'habits' ? 'active' : ''}`}
          onClick={() => setActiveTab('habits')}
        >
          <span className="tab-icon">✓</span>
          <span>Daily</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'skills' ? 'active' : ''}`}
          onClick={() => setActiveTab('skills')}
        >
          <span className="tab-icon">📈</span>
          <span>Skills</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'challenges' ? 'active' : ''}`}
          onClick={() => setActiveTab('challenges')}
        >
          <span className="tab-icon">🎯</span>
          <span>Weekly</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'habits' && (
          <div className="habits-tab">
            <div className="section-header">
              <h2>Daily Habits</h2>
              <div className="progress-ring" style={{ '--progress': habitsProgress }}>
                <span>{habitsCompletedToday}/{DAILY_HABITS.length}</span>
              </div>
            </div>
            <p className="section-desc">Complete at least 3 habits daily to maintain your streak</p>

            <div className="habits-list">
              {DAILY_HABITS.map(habit => (
                <button
                  key={habit.id}
                  className={`habit-item ${todayHabits[habit.id] ? 'completed' : ''}`}
                  onClick={() => toggleHabit(habit.id)}
                >
                  <span className="habit-icon">{habit.icon}</span>
                  <div className="habit-info">
                    <span className="habit-name">{habit.name}</span>
                    <span className="habit-desc">{habit.description}</span>
                  </div>
                  <div className={`habit-check ${todayHabits[habit.id] ? 'checked' : ''}`}>
                    {todayHabits[habit.id] && '✓'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="skills-tab">
            <div className="section-header">
              <h2>Skill Roadmap</h2>
              <div className="progress-ring" style={{ '--progress': skillsProgress }}>
                <span>{masteredSkills}/{totalSkills}</span>
              </div>
            </div>
            <p className="section-desc">Track your progress: tap skills to advance (0 → Learning → Practicing → Mastered)</p>

            <div className="skill-categories">
              {SKILL_TREE.map(category => (
                <div key={category.id} className="skill-category">
                  <div className="category-header">
                    <span className="category-icon">{category.icon}</span>
                    <div>
                      <h3>{category.name}</h3>
                      <p>{category.description}</p>
                    </div>
                  </div>
                  <div className="skills-grid">
                    {category.skills.map(skill => {
                      const level = skillProgress[skill.id] || 0
                      const levelNames = ['Not Started', 'Learning', 'Practicing', 'Mastered']
                      return (
                        <button
                          key={skill.id}
                          className={`skill-item level-${level} importance-${skill.importance}`}
                          onClick={() => toggleSkill(skill.id)}
                        >
                          <span className="skill-name">{skill.name}</span>
                          <div className="skill-progress">
                            {[0, 1, 2].map(i => (
                              <div key={i} className={`progress-dot ${i < level ? 'filled' : ''}`} />
                            ))}
                          </div>
                          <span className="skill-level">{levelNames[level]}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'challenges' && (
          <div className="challenges-tab">
            <div className="section-header">
              <h2>Weekly Challenges</h2>
              <div className="progress-ring" style={{ '--progress': Math.min(weeklyProgress, 100) }}>
                <span>{completedChallenges.length}/3</span>
              </div>
            </div>
            <p className="section-desc">Complete 3 challenges this week to level up</p>

            <div className="challenges-list">
              {weeklyChallenges.map(challenge => (
                <button
                  key={challenge.id}
                  className={`challenge-item ${completedChallenges.includes(challenge.id) ? 'completed' : ''}`}
                  onClick={() => toggleChallenge(challenge.id)}
                >
                  <div className={`challenge-check ${completedChallenges.includes(challenge.id) ? 'checked' : ''}`}>
                    {completedChallenges.includes(challenge.id) && '✓'}
                  </div>
                  <div className="challenge-info">
                    <span className="challenge-task">{challenge.task}</span>
                    <span className="challenge-meta">
                      <span className="challenge-category">{challenge.category}</span>
                      <span className="challenge-points">+{challenge.points} pts</span>
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="all-challenges">
              <h3>All Available Challenges</h3>
              <p>Extra challenges you can complete anytime</p>
              <div className="challenges-list extra">
                {WEEKLY_CHALLENGES.filter(c => !weeklyChallenges.find(wc => wc.id === c.id)).map(challenge => (
                  <button
                    key={challenge.id}
                    className={`challenge-item small ${completedChallenges.includes(challenge.id) ? 'completed' : ''}`}
                    onClick={() => toggleChallenge(challenge.id)}
                  >
                    <div className={`challenge-check ${completedChallenges.includes(challenge.id) ? 'checked' : ''}`}>
                      {completedChallenges.includes(challenge.id) && '✓'}
                    </div>
                    <span className="challenge-task">{challenge.task}</span>
                    <span className="challenge-points">+{challenge.points}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
