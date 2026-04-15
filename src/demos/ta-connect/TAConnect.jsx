import { useState, useMemo } from 'react'
import './TAConnect.css'

// Simulated course and TA data
const COURSES = [
  { id: 'cs101', code: 'CS 101', name: 'Intro to Programming', department: 'Computer Science' },
  { id: 'cs201', code: 'CS 201', name: 'Data Structures', department: 'Computer Science' },
  { id: 'cs301', code: 'CS 301', name: 'Algorithms', department: 'Computer Science' },
  { id: 'math151', code: 'MATH 151', name: 'Calculus I', department: 'Mathematics' },
  { id: 'math152', code: 'MATH 152', name: 'Calculus II', department: 'Mathematics' },
  { id: 'phys101', code: 'PHYS 101', name: 'Physics I', department: 'Physics' },
  { id: 'chem101', code: 'CHEM 101', name: 'General Chemistry', department: 'Chemistry' },
]

const TAS = [
  { id: 1, name: 'Alex Kim', avatar: '👨‍💻', courses: ['cs101', 'cs201'], email: 'akim@university.edu', rating: 4.8 },
  { id: 2, name: 'Sarah Chen', avatar: '👩‍💻', courses: ['cs201', 'cs301'], email: 'schen@university.edu', rating: 4.9 },
  { id: 3, name: 'Mike Johnson', avatar: '👨‍🔬', courses: ['math151', 'math152'], email: 'mjohnson@university.edu', rating: 4.7 },
  { id: 4, name: 'Emma Wilson', avatar: '👩‍🔬', courses: ['phys101'], email: 'ewilson@university.edu', rating: 4.6 },
  { id: 5, name: 'James Lee', avatar: '🧑‍🔬', courses: ['chem101'], email: 'jlee@university.edu', rating: 4.5 },
  { id: 6, name: 'Lisa Zhang', avatar: '👩‍🎓', courses: ['cs101'], email: 'lzhang@university.edu', rating: 4.9 },
]

const OFFICE_HOURS = [
  { id: 1, taId: 1, day: 'Monday', time: '2:00 PM - 4:00 PM', location: 'CS Building 302', type: 'in-person', currentQueue: 3 },
  { id: 2, taId: 1, day: 'Wednesday', time: '10:00 AM - 12:00 PM', location: 'Zoom', type: 'virtual', currentQueue: 5 },
  { id: 3, taId: 2, day: 'Tuesday', time: '3:00 PM - 5:00 PM', location: 'CS Building 401', type: 'in-person', currentQueue: 2 },
  { id: 4, taId: 2, day: 'Thursday', time: '1:00 PM - 3:00 PM', location: 'Zoom', type: 'virtual', currentQueue: 0 },
  { id: 5, taId: 3, day: 'Monday', time: '9:00 AM - 11:00 AM', location: 'Math Building 201', type: 'in-person', currentQueue: 4 },
  { id: 6, taId: 3, day: 'Friday', time: '2:00 PM - 4:00 PM', location: 'Zoom', type: 'virtual', currentQueue: 1 },
  { id: 7, taId: 4, day: 'Wednesday', time: '4:00 PM - 6:00 PM', location: 'Physics Building 105', type: 'in-person', currentQueue: 2 },
  { id: 8, taId: 5, day: 'Tuesday', time: '10:00 AM - 12:00 PM', location: 'Chemistry Building 220', type: 'in-person', currentQueue: 3 },
  { id: 9, taId: 6, day: 'Thursday', time: '11:00 AM - 1:00 PM', location: 'CS Building 302', type: 'in-person', currentQueue: 1 },
]

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

export default function TAConnect() {
  const [view, setView] = useState('home') // home, course, ta, schedule, join, about
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [selectedTA, setSelectedTA] = useState(null)
  const [selectedOfficeHour, setSelectedOfficeHour] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterDay, setFilterDay] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [inQueue, setInQueue] = useState(null)

  const filteredOfficeHours = useMemo(() => {
    return OFFICE_HOURS.filter(oh => {
      const matchesDay = filterDay === 'all' || oh.day === filterDay
      const matchesType = filterType === 'all' || oh.type === filterType
      return matchesDay && matchesType
    })
  }, [filterDay, filterType])

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return { courses: [], tas: [] }
    const q = searchQuery.toLowerCase()
    return {
      courses: COURSES.filter(c =>
        c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)
      ),
      tas: TAS.filter(t => t.name.toLowerCase().includes(q))
    }
  }, [searchQuery])

  const joinQueue = (officeHour) => {
    setInQueue({
      officeHour,
      position: officeHour.currentQueue + 1,
      estimatedWait: (officeHour.currentQueue + 1) * 10
    })
    setView('join')
  }

  if (view === 'about') {
    return (
      <div className="ta-connect">
        <header className="tac-header">
          <button className="back-btn" onClick={() => setView('home')}>Back</button>
          <h1>About TAConnect</h1>
        </header>

        <div className="about-content">
          <section className="about-section">
            <h2>What is TAConnect?</h2>
            <p>
              TAConnect is a centralized directory for TA office hours, helping students
              find help quickly and TAs manage their time effectively.
            </p>
          </section>

          <section className="about-section">
            <h2>Design Decisions for MVP</h2>
            <ul>
              <li><strong>Course-based Navigation:</strong> Find TAs by the course you need help with</li>
              <li><strong>Real-time Queue:</strong> See how many students are waiting</li>
              <li><strong>Schedule View:</strong> Browse all office hours by day</li>
              <li><strong>Virtual/In-person Filter:</strong> Choose your preferred format</li>
              <li><strong>TA Profiles:</strong> See ratings and contact info</li>
              <li><strong>Queue Joining:</strong> Virtual waiting room with position tracking</li>
            </ul>
          </section>

          <section className="about-section">
            <h2>Production Requirements</h2>
            <ul>
              <li>Integration with course registration system</li>
              <li>Real-time queue updates via WebSocket</li>
              <li>Calendar sync (Google Calendar, Outlook)</li>
              <li>Video conferencing integration (Zoom, Teams)</li>
              <li>Push notifications when it's your turn</li>
              <li>TA dashboard for managing hours and queue</li>
              <li>Analytics for TAs (popular times, avg session length)</li>
              <li>Student feedback/rating system</li>
              <li>Recurring appointment booking</li>
            </ul>
          </section>

          <section className="about-section">
            <h2>Problems Solved</h2>
            <ul>
              <li>Students waste time going to empty office hours</li>
              <li>TAs don't know how many students to expect</li>
              <li>Decentralized info across syllabi, websites, LMS</li>
              <li>No visibility into current wait times</li>
              <li>Difficulty finding help across multiple courses</li>
            </ul>
          </section>
        </div>
      </div>
    )
  }

  if (view === 'join' && inQueue) {
    const ta = TAS.find(t => t.id === inQueue.officeHour.taId)

    return (
      <div className="ta-connect">
        <header className="tac-header">
          <button className="back-btn" onClick={() => { setInQueue(null); setView('home'); }}>Leave Queue</button>
          <h1>In Queue</h1>
        </header>

        <div className="queue-content">
          <div className="queue-status">
            <div className="position-circle">
              <span className="position-number">{inQueue.position}</span>
              <span className="position-label">in line</span>
            </div>
          </div>

          <div className="queue-details">
            <div className="queue-ta">
              <span className="ta-avatar">{ta?.avatar}</span>
              <span className="ta-name">{ta?.name}</span>
            </div>
            <div className="queue-info">
              <div className="info-item">
                <span className="info-label">Day</span>
                <span className="info-value">{inQueue.officeHour.day}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Time</span>
                <span className="info-value">{inQueue.officeHour.time}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Location</span>
                <span className="info-value">{inQueue.officeHour.location}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Est. Wait</span>
                <span className="info-value highlight">~{inQueue.estimatedWait} min</span>
              </div>
            </div>
          </div>

          <div className="queue-notice">
            <span>🔔</span>
            <p>We'll notify you when it's almost your turn. Stay nearby!</p>
          </div>

          {inQueue.officeHour.type === 'virtual' && (
            <button className="join-call-btn">
              <span>📹</span> Join Video Call When Ready
            </button>
          )}
        </div>
      </div>
    )
  }

  if (view === 'ta' && selectedTA) {
    const taCourses = COURSES.filter(c => selectedTA.courses.includes(c.id))
    const taHours = OFFICE_HOURS.filter(oh => oh.taId === selectedTA.id)

    return (
      <div className="ta-connect">
        <header className="tac-header">
          <button className="back-btn" onClick={() => setView('home')}>Back</button>
          <h1>TA Profile</h1>
        </header>

        <div className="ta-detail">
          <div className="ta-profile">
            <span className="profile-avatar">{selectedTA.avatar}</span>
            <h2>{selectedTA.name}</h2>
            <div className="profile-rating">
              <span>⭐</span> {selectedTA.rating}
            </div>
            <a href={`mailto:${selectedTA.email}`} className="profile-email">{selectedTA.email}</a>
          </div>

          <div className="ta-courses">
            <h3>Courses</h3>
            <div className="course-tags">
              {taCourses.map(course => (
                <span key={course.id} className="course-tag">{course.code}</span>
              ))}
            </div>
          </div>

          <div className="ta-hours">
            <h3>Office Hours</h3>
            {taHours.map(oh => (
              <div key={oh.id} className="hour-card">
                <div className="hour-time">
                  <span className="hour-day">{oh.day}</span>
                  <span className="hour-range">{oh.time}</span>
                </div>
                <div className="hour-info">
                  <span className="hour-location">{oh.location}</span>
                  <span className={`hour-type ${oh.type}`}>
                    {oh.type === 'virtual' ? '💻 Virtual' : '📍 In-person'}
                  </span>
                </div>
                <div className="hour-queue">
                  <span className="queue-count">{oh.currentQueue} waiting</span>
                  <button className="join-btn" onClick={() => joinQueue(oh)}>Join</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (view === 'course' && selectedCourse) {
    const courseTAs = TAS.filter(ta => ta.courses.includes(selectedCourse.id))

    return (
      <div className="ta-connect">
        <header className="tac-header">
          <button className="back-btn" onClick={() => setView('home')}>Back</button>
          <h1>{selectedCourse.code}</h1>
        </header>

        <div className="course-detail">
          <div className="course-info">
            <h2>{selectedCourse.name}</h2>
            <span className="course-dept">{selectedCourse.department}</span>
          </div>

          <div className="course-tas">
            <h3>Teaching Assistants</h3>
            {courseTAs.map(ta => (
              <div
                key={ta.id}
                className="ta-card"
                onClick={() => { setSelectedTA(ta); setView('ta'); }}
              >
                <span className="ta-avatar">{ta.avatar}</span>
                <div className="ta-info">
                  <span className="ta-name">{ta.name}</span>
                  <span className="ta-rating">⭐ {ta.rating}</span>
                </div>
                <span className="ta-arrow">→</span>
              </div>
            ))}
          </div>

          <div className="course-hours">
            <h3>All Office Hours</h3>
            {OFFICE_HOURS.filter(oh => courseTAs.some(ta => ta.id === oh.taId)).map(oh => {
              const ta = TAS.find(t => t.id === oh.taId)
              return (
                <div key={oh.id} className="hour-item">
                  <div className="hour-main">
                    <span className="hour-ta">{ta?.name}</span>
                    <span className="hour-schedule">{oh.day} {oh.time}</span>
                  </div>
                  <span className={`hour-badge ${oh.type}`}>
                    {oh.type === 'virtual' ? '💻' : '📍'}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  if (view === 'schedule') {
    return (
      <div className="ta-connect">
        <header className="tac-header">
          <button className="back-btn" onClick={() => setView('home')}>Back</button>
          <h1>Schedule</h1>
        </header>

        <div className="schedule-content">
          <div className="filters">
            <select value={filterDay} onChange={(e) => setFilterDay(e.target.value)}>
              <option value="all">All Days</option>
              {DAYS.map(day => <option key={day} value={day}>{day}</option>)}
            </select>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="all">All Types</option>
              <option value="in-person">In-person</option>
              <option value="virtual">Virtual</option>
            </select>
          </div>

          <div className="schedule-list">
            {filteredOfficeHours.map(oh => {
              const ta = TAS.find(t => t.id === oh.taId)
              const courses = COURSES.filter(c => ta?.courses.includes(c.id))
              return (
                <div key={oh.id} className="schedule-card">
                  <div className="sched-time">
                    <span className="sched-day">{oh.day}</span>
                    <span className="sched-range">{oh.time}</span>
                  </div>
                  <div className="sched-details">
                    <span className="sched-ta">{ta?.name}</span>
                    <span className="sched-courses">{courses.map(c => c.code).join(', ')}</span>
                    <span className="sched-location">{oh.location}</span>
                  </div>
                  <div className="sched-actions">
                    <span className="sched-queue">{oh.currentQueue} 👥</span>
                    <button className="sched-join" onClick={() => joinQueue(oh)}>Join</button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // Home view
  return (
    <div className="ta-connect">
      <header className="tac-header home-header">
        <h1>TAConnect</h1>
        <p className="tagline">Find help, fast</p>
      </header>

      <div className="home-content">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="search"
            placeholder="Search courses or TAs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {searchQuery && (searchResults.courses.length > 0 || searchResults.tas.length > 0) && (
          <div className="search-results">
            {searchResults.courses.map(course => (
              <div
                key={course.id}
                className="result-item"
                onClick={() => { setSelectedCourse(course); setView('course'); setSearchQuery(''); }}
              >
                <span>📚</span>
                <span>{course.code}: {course.name}</span>
              </div>
            ))}
            {searchResults.tas.map(ta => (
              <div
                key={ta.id}
                className="result-item"
                onClick={() => { setSelectedTA(ta); setView('ta'); setSearchQuery(''); }}
              >
                <span>{ta.avatar}</span>
                <span>{ta.name}</span>
              </div>
            ))}
          </div>
        )}

        <div className="quick-actions">
          <button className="quick-action" onClick={() => setView('schedule')}>
            <span>📅</span>
            <span>Today's Hours</span>
            <span className="action-badge">{OFFICE_HOURS.filter(oh => oh.day === 'Monday').length} available</span>
          </button>
        </div>

        <div className="my-courses">
          <h3>My Courses</h3>
          <div className="course-list">
            {COURSES.slice(0, 4).map(course => (
              <div
                key={course.id}
                className="course-card"
                onClick={() => { setSelectedCourse(course); setView('course'); }}
              >
                <span className="course-code">{course.code}</span>
                <span className="course-name">{course.name}</span>
                <span className="course-ta-count">
                  {TAS.filter(t => t.courses.includes(course.id)).length} TAs
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="happening-now">
          <h3>Happening Now</h3>
          {OFFICE_HOURS.filter(oh => oh.day === 'Monday').slice(0, 2).map(oh => {
            const ta = TAS.find(t => t.id === oh.taId)
            return (
              <div key={oh.id} className="now-card">
                <span className="now-avatar">{ta?.avatar}</span>
                <div className="now-info">
                  <span className="now-ta">{ta?.name}</span>
                  <span className="now-time">{oh.time} • {oh.location}</span>
                </div>
                <button className="now-join" onClick={() => joinQueue(oh)}>
                  {oh.currentQueue} in queue
                </button>
              </div>
            )
          })}
        </div>

        <button className="about-link" onClick={() => setView('about')}>
          About TAConnect
        </button>
      </div>
    </div>
  )
}
