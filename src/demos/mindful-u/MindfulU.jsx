import { useState, useEffect, useRef } from 'react'
import './MindfulU.css'

// Mood options
const MOODS = [
  { id: 'great', emoji: '😊', label: 'Great', color: '#22c55e' },
  { id: 'good', emoji: '🙂', label: 'Good', color: '#84cc16' },
  { id: 'okay', emoji: '😐', label: 'Okay', color: '#f59e0b' },
  { id: 'low', emoji: '😔', label: 'Low', color: '#f97316' },
  { id: 'struggling', emoji: '😢', label: 'Struggling', color: '#ef4444' },
]

// Activity tags
const ACTIVITIES = [
  { id: 'sleep', emoji: '😴', label: 'Sleep' },
  { id: 'exercise', emoji: '🏃', label: 'Exercise' },
  { id: 'social', emoji: '👥', label: 'Social' },
  { id: 'study', emoji: '📚', label: 'Study' },
  { id: 'work', emoji: '💼', label: 'Work' },
  { id: 'nature', emoji: '🌳', label: 'Nature' },
  { id: 'creative', emoji: '🎨', label: 'Creative' },
  { id: 'relax', emoji: '🧘', label: 'Relaxation' },
]

// Campus resources
const RESOURCES = [
  { name: 'Counseling Center', phone: '555-123-4567', hours: 'Mon-Fri 8am-6pm', type: 'counseling' },
  { name: 'Crisis Hotline', phone: '988', hours: '24/7', type: 'crisis' },
  { name: 'Peer Support', phone: '555-234-5678', hours: 'Daily 6pm-12am', type: 'peer' },
  { name: 'Wellness Center', phone: '555-345-6789', hours: 'Mon-Fri 9am-5pm', type: 'wellness' },
]

// Generate sample mood history
const generateMoodHistory = () => {
  const history = []
  for (let i = 29; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    if (Math.random() > 0.3) { // 70% chance of entry
      history.push({
        date: date.toISOString().split('T')[0],
        mood: MOODS[Math.floor(Math.random() * MOODS.length)].id,
        activities: ACTIVITIES.slice(0, Math.floor(Math.random() * 4) + 1).map(a => a.id),
        note: '',
      })
    }
  }
  return history
}

// Breathing exercise component
function BreathingExercise({ onComplete }) {
  const [phase, setPhase] = useState('ready') // ready, inhale, hold, exhale, done
  const [count, setCount] = useState(0)
  const [cycles, setCycles] = useState(0)
  const totalCycles = 4

  useEffect(() => {
    if (phase === 'ready') return

    const duration = phase === 'inhale' ? 4 : phase === 'hold' ? 7 : phase === 'exhale' ? 8 : 0

    if (duration === 0) return

    const timer = setInterval(() => {
      setCount(c => {
        if (c >= duration) {
          if (phase === 'inhale') setPhase('hold')
          else if (phase === 'hold') setPhase('exhale')
          else if (phase === 'exhale') {
            if (cycles + 1 >= totalCycles) {
              setPhase('done')
            } else {
              setCycles(c => c + 1)
              setPhase('inhale')
            }
          }
          return 0
        }
        return c + 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [phase, cycles])

  if (phase === 'ready') {
    return (
      <div className="breathing-exercise">
        <h3>4-7-8 Breathing</h3>
        <p>This technique helps reduce anxiety and promote relaxation.</p>
        <div className="breathing-steps">
          <div className="step"><span>1</span> Inhale for 4 seconds</div>
          <div className="step"><span>2</span> Hold for 7 seconds</div>
          <div className="step"><span>3</span> Exhale for 8 seconds</div>
        </div>
        <button className="start-breathing-btn" onClick={() => { setPhase('inhale'); setCount(0); }}>
          Begin Exercise
        </button>
      </div>
    )
  }

  if (phase === 'done') {
    return (
      <div className="breathing-exercise">
        <div className="breathing-complete">
          <span className="complete-icon">✨</span>
          <h3>Great job!</h3>
          <p>You completed {totalCycles} breathing cycles.</p>
          <button className="done-btn" onClick={onComplete}>Done</button>
        </div>
      </div>
    )
  }

  return (
    <div className="breathing-exercise">
      <div className="cycle-indicator">Cycle {cycles + 1} of {totalCycles}</div>
      <div className={`breathing-circle ${phase}`}>
        <span className="breathing-text">
          {phase === 'inhale' ? 'Breathe In' : phase === 'hold' ? 'Hold' : 'Breathe Out'}
        </span>
        <span className="breathing-count">{count}</span>
      </div>
      <div className="phase-dots">
        <span className={phase === 'inhale' ? 'active' : ''}>Inhale (4s)</span>
        <span className={phase === 'hold' ? 'active' : ''}>Hold (7s)</span>
        <span className={phase === 'exhale' ? 'active' : ''}>Exhale (8s)</span>
      </div>
    </div>
  )
}

export default function MindfulU() {
  const [view, setView] = useState('home') // home, checkin, journal, breathing, insights, resources, about
  const [moodHistory, setMoodHistory] = useState(generateMoodHistory)
  const [todayMood, setTodayMood] = useState(null)
  const [selectedActivities, setSelectedActivities] = useState([])
  const [journalNote, setJournalNote] = useState('')

  const today = new Date().toISOString().split('T')[0]
  const todayEntry = moodHistory.find(e => e.date === today)

  const weekStreak = (() => {
    let streak = 0
    for (let i = 0; i < 7; i++) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      if (moodHistory.find(e => e.date === dateStr)) streak++
      else break
    }
    return streak
  })()

  const handleCheckin = () => {
    if (todayMood) {
      const newEntry = {
        date: today,
        mood: todayMood,
        activities: selectedActivities,
        note: journalNote,
      }
      setMoodHistory(prev => [...prev.filter(e => e.date !== today), newEntry])
      setView('home')
      setTodayMood(null)
      setSelectedActivities([])
      setJournalNote('')
    }
  }

  const getMoodColor = (moodId) => {
    return MOODS.find(m => m.id === moodId)?.color || '#94a3b8'
  }

  const getMoodEmoji = (moodId) => {
    return MOODS.find(m => m.id === moodId)?.emoji || '😐'
  }

  if (view === 'about') {
    return (
      <div className="mindful-u">
        <header className="mu-header">
          <button className="back-btn" onClick={() => setView('home')}>Back</button>
          <h1>About MindfulU</h1>
        </header>

        <div className="about-content">
          <section className="about-section">
            <h2>What is MindfulU?</h2>
            <p>
              MindfulU is a mental wellness tracker designed for students. It helps you monitor
              your emotional health, build healthy habits, and access support resources.
            </p>
          </section>

          <section className="about-section">
            <h2>Design Decisions for MVP</h2>
            <ul>
              <li><strong>Quick Check-ins:</strong> Simple mood selection + optional activities reduces friction</li>
              <li><strong>Activity Correlation:</strong> Track activities to identify patterns affecting mood</li>
              <li><strong>Breathing Exercises:</strong> Evidence-based 4-7-8 technique for immediate relief</li>
              <li><strong>Local Storage:</strong> All data stored locally - privacy first approach</li>
              <li><strong>Crisis Resources:</strong> Always-accessible hotline and support info</li>
              <li><strong>Streak Tracking:</strong> Gamification encourages daily engagement</li>
            </ul>
          </section>

          <section className="about-section">
            <h2>Privacy Notice</h2>
            <p>
              All mood data is stored locally on your device. Nothing is sent to any server.
              This is intentional - your mental health data is deeply personal.
            </p>
          </section>

          <section className="about-section">
            <h2>Production Requirements</h2>
            <ul>
              <li>End-to-end encrypted cloud sync (optional)</li>
              <li>Integration with university counseling scheduling</li>
              <li>AI-powered mood insights and trend analysis</li>
              <li>Guided meditation audio library</li>
              <li>Peer support matching (anonymous)</li>
              <li>Academic stress calendar integration</li>
              <li>Sleep tracking via device sensors</li>
              <li>Customizable reminder notifications</li>
            </ul>
          </section>

          <section className="about-section important">
            <h2>Important Note</h2>
            <p>
              This app is not a replacement for professional mental health support.
              If you're struggling, please reach out to a counselor or call 988.
            </p>
          </section>
        </div>
      </div>
    )
  }

  if (view === 'breathing') {
    return (
      <div className="mindful-u">
        <header className="mu-header">
          <button className="back-btn" onClick={() => setView('home')}>Back</button>
          <h1>Breathing</h1>
        </header>
        <div className="breathing-content">
          <BreathingExercise onComplete={() => setView('home')} />
        </div>
      </div>
    )
  }

  if (view === 'checkin') {
    return (
      <div className="mindful-u">
        <header className="mu-header">
          <button className="back-btn" onClick={() => setView('home')}>Cancel</button>
          <h1>Daily Check-in</h1>
        </header>

        <div className="checkin-content">
          <div className="mood-question">
            <h3>How are you feeling today?</h3>
            <div className="mood-options">
              {MOODS.map(mood => (
                <button
                  key={mood.id}
                  className={`mood-option ${todayMood === mood.id ? 'selected' : ''}`}
                  style={{ '--mood-color': mood.color }}
                  onClick={() => setTodayMood(mood.id)}
                >
                  <span className="mood-emoji">{mood.emoji}</span>
                  <span className="mood-label">{mood.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="activity-question">
            <h3>What have you done today?</h3>
            <div className="activity-options">
              {ACTIVITIES.map(activity => (
                <button
                  key={activity.id}
                  className={`activity-option ${selectedActivities.includes(activity.id) ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedActivities(prev =>
                      prev.includes(activity.id)
                        ? prev.filter(a => a !== activity.id)
                        : [...prev, activity.id]
                    )
                  }}
                >
                  <span>{activity.emoji}</span>
                  <span>{activity.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="journal-question">
            <h3>Anything on your mind? (optional)</h3>
            <textarea
              placeholder="Write a quick note..."
              value={journalNote}
              onChange={(e) => setJournalNote(e.target.value)}
            />
          </div>

          <button
            className="save-checkin-btn"
            onClick={handleCheckin}
            disabled={!todayMood}
          >
            Save Check-in
          </button>
        </div>
      </div>
    )
  }

  if (view === 'insights') {
    const last30 = moodHistory.slice(-30)
    const moodCounts = MOODS.reduce((acc, m) => {
      acc[m.id] = last30.filter(e => e.mood === m.id).length
      return acc
    }, {})
    const avgMood = last30.length > 0 ?
      last30.reduce((sum, e) => sum + MOODS.findIndex(m => m.id === e.mood), 0) / last30.length : 2

    return (
      <div className="mindful-u">
        <header className="mu-header">
          <button className="back-btn" onClick={() => setView('home')}>Back</button>
          <h1>Insights</h1>
        </header>

        <div className="insights-content">
          <div className="insight-card">
            <h3>Last 30 Days</h3>
            <div className="mood-breakdown">
              {MOODS.map(mood => (
                <div key={mood.id} className="mood-bar-item">
                  <span className="bar-emoji">{mood.emoji}</span>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{
                        width: `${(moodCounts[mood.id] / Math.max(...Object.values(moodCounts), 1)) * 100}%`,
                        backgroundColor: mood.color
                      }}
                    />
                  </div>
                  <span className="bar-count">{moodCounts[mood.id]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="insight-card">
            <h3>Calendar View</h3>
            <div className="mood-calendar">
              {Array.from({ length: 30 }, (_, i) => {
                const d = new Date()
                d.setDate(d.getDate() - (29 - i))
                const dateStr = d.toISOString().split('T')[0]
                const entry = moodHistory.find(e => e.date === dateStr)
                return (
                  <div
                    key={i}
                    className={`calendar-day ${entry ? 'has-entry' : ''}`}
                    style={{ backgroundColor: entry ? getMoodColor(entry.mood) : 'var(--surface)' }}
                    title={entry ? `${d.toLocaleDateString()}: ${entry.mood}` : d.toLocaleDateString()}
                  />
                )
              })}
            </div>
          </div>

          <div className="insight-card">
            <h3>Activity Patterns</h3>
            <div className="activity-correlation">
              {ACTIVITIES.slice(0, 4).map(activity => {
                const withActivity = last30.filter(e => e.activities?.includes(activity.id))
                const avgWithActivity = withActivity.length > 0 ?
                  withActivity.reduce((sum, e) => sum + MOODS.findIndex(m => m.id === e.mood), 0) / withActivity.length : null
                const impact = avgWithActivity !== null ? avgMood - avgWithActivity : null
                return (
                  <div key={activity.id} className="correlation-item">
                    <span className="corr-activity">{activity.emoji} {activity.label}</span>
                    {impact !== null && (
                      <span className={`corr-impact ${impact > 0 ? 'positive' : impact < 0 ? 'negative' : ''}`}>
                        {impact > 0 ? '👍 Helps' : impact < 0 ? '👎 May affect' : '➡️ Neutral'}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (view === 'resources') {
    return (
      <div className="mindful-u">
        <header className="mu-header">
          <button className="back-btn" onClick={() => setView('home')}>Back</button>
          <h1>Resources</h1>
        </header>

        <div className="resources-content">
          <div className="crisis-banner">
            <span className="crisis-icon">🆘</span>
            <div className="crisis-info">
              <span className="crisis-title">Need immediate help?</span>
              <span className="crisis-number">Call or text 988</span>
            </div>
          </div>

          <div className="resource-list">
            {RESOURCES.map((resource, i) => (
              <div key={i} className={`resource-card ${resource.type}`}>
                <span className="resource-type">
                  {resource.type === 'counseling' ? '💬' :
                   resource.type === 'crisis' ? '🆘' :
                   resource.type === 'peer' ? '🤝' : '🏥'}
                </span>
                <div className="resource-info">
                  <span className="resource-name">{resource.name}</span>
                  <span className="resource-phone">{resource.phone}</span>
                  <span className="resource-hours">{resource.hours}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="self-care-tips">
            <h3>Quick Self-Care Tips</h3>
            <ul>
              <li>💧 Stay hydrated</li>
              <li>🚶 Take a short walk</li>
              <li>📵 Limit screen time before bed</li>
              <li>🗣️ Talk to someone you trust</li>
              <li>📝 Write down 3 things you're grateful for</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  // Home view
  return (
    <div className="mindful-u">
      <header className="mu-header home-header">
        <h1>MindfulU</h1>
        <p className="tagline">Your wellness companion</p>
      </header>

      <div className="home-content">
        <div className="streak-card">
          <div className="streak-info">
            <span className="streak-number">{weekStreak}</span>
            <span className="streak-label">day streak</span>
          </div>
          <div className="streak-dots">
            {[...Array(7)].map((_, i) => {
              const d = new Date()
              d.setDate(d.getDate() - (6 - i))
              const dateStr = d.toISOString().split('T')[0]
              const entry = moodHistory.find(e => e.date === dateStr)
              return (
                <div
                  key={i}
                  className={`streak-dot ${entry ? 'filled' : ''}`}
                  style={{ backgroundColor: entry ? getMoodColor(entry.mood) : undefined }}
                >
                  {entry && getMoodEmoji(entry.mood)}
                </div>
              )
            })}
          </div>
        </div>

        {!todayEntry ? (
          <button className="checkin-btn" onClick={() => setView('checkin')}>
            <span>📝</span>
            <div>
              <span className="btn-title">Daily Check-in</span>
              <span className="btn-subtitle">How are you feeling?</span>
            </div>
          </button>
        ) : (
          <div className="today-summary">
            <span className="summary-emoji">{getMoodEmoji(todayEntry.mood)}</span>
            <div className="summary-info">
              <span className="summary-label">Today's check-in</span>
              <span className="summary-mood">{MOODS.find(m => m.id === todayEntry.mood)?.label}</span>
            </div>
            <button className="edit-btn" onClick={() => setView('checkin')}>Edit</button>
          </div>
        )}

        <div className="quick-actions">
          <button className="quick-action" onClick={() => setView('breathing')}>
            <span>🧘</span>
            <span>Breathe</span>
          </button>
          <button className="quick-action" onClick={() => setView('insights')}>
            <span>📊</span>
            <span>Insights</span>
          </button>
          <button className="quick-action" onClick={() => setView('resources')}>
            <span>💙</span>
            <span>Support</span>
          </button>
        </div>

        <div className="affirmation-card">
          <span className="affirmation-icon">✨</span>
          <p>"You don't have to have it all figured out to move forward."</p>
        </div>

        <button className="about-link" onClick={() => setView('about')}>
          About MindfulU
        </button>
      </div>
    </div>
  )
}
