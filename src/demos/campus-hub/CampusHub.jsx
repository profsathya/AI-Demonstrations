import { useState, useMemo } from 'react'
import './CampusHub.css'

// Resource categories and data
const RESOURCES = {
  academic: [
    { id: 1, name: 'Writing Center', icon: '✍️', location: 'Library 2nd Floor', hours: 'Mon-Thu 9am-8pm, Fri 9am-5pm', phone: '555-123-0001', description: 'Free tutoring for essays, research papers, and writing assignments.', tags: ['tutoring', 'writing'] },
    { id: 2, name: 'Math Tutoring Lab', icon: '🔢', location: 'Science Building 101', hours: 'Mon-Fri 10am-6pm', phone: '555-123-0002', description: 'Drop-in help for calculus, statistics, and math courses.', tags: ['tutoring', 'math'] },
    { id: 3, name: 'Academic Advising', icon: '🎓', location: 'Admin Building 200', hours: 'Mon-Fri 8am-5pm', phone: '555-123-0003', description: 'Course planning, major selection, and graduation requirements.', tags: ['advising', 'planning'] },
    { id: 4, name: 'Library Services', icon: '📚', location: 'Main Library', hours: '24/7 during semester', phone: '555-123-0004', description: 'Research assistance, interlibrary loans, and study rooms.', tags: ['research', 'study'] },
  ],
  health: [
    { id: 5, name: 'Health Center', icon: '🏥', location: 'Student Health Building', hours: 'Mon-Fri 8am-6pm', phone: '555-124-0001', description: 'Primary care, immunizations, and health education.', tags: ['medical', 'wellness'] },
    { id: 6, name: 'Counseling Center', icon: '💬', location: 'Wellness Center 3rd Floor', hours: 'Mon-Fri 8am-6pm', phone: '555-124-0002', description: 'Free mental health services for students.', tags: ['mental health', 'counseling'] },
    { id: 7, name: 'Recreation Center', icon: '🏋️', location: 'Rec Building', hours: 'Mon-Sun 6am-11pm', phone: '555-124-0003', description: 'Gym, pool, fitness classes, and intramural sports.', tags: ['fitness', 'sports'] },
  ],
  financial: [
    { id: 8, name: 'Financial Aid Office', icon: '💰', location: 'Admin Building 150', hours: 'Mon-Fri 8am-5pm', phone: '555-125-0001', description: 'Scholarships, grants, loans, and work-study programs.', tags: ['aid', 'scholarships'] },
    { id: 9, name: 'Student Employment', icon: '💼', location: 'Career Center', hours: 'Mon-Fri 9am-5pm', phone: '555-125-0002', description: 'On-campus jobs and part-time employment opportunities.', tags: ['jobs', 'employment'] },
    { id: 10, name: 'Emergency Fund', icon: '🆘', location: 'Dean of Students', hours: 'Mon-Fri 8am-5pm', phone: '555-125-0003', description: 'Emergency grants for unexpected financial hardships.', tags: ['emergency', 'aid'] },
  ],
  campus: [
    { id: 11, name: 'Student Union', icon: '🏛️', location: 'Student Union Building', hours: 'Mon-Sun 7am-11pm', phone: '555-126-0001', description: 'Dining, events, student organizations, and meeting rooms.', tags: ['events', 'food'] },
    { id: 12, name: 'IT Help Desk', icon: '💻', location: 'Tech Building Lobby', hours: 'Mon-Fri 8am-8pm, Sat 10am-4pm', phone: '555-126-0002', description: 'WiFi, software, email, and tech support.', tags: ['technology', 'support'] },
    { id: 13, name: 'Campus Safety', icon: '🚔', location: 'Safety Building', hours: '24/7', phone: '555-126-0003', description: 'Emergency response, escorts, lost and found.', tags: ['safety', 'emergency'] },
    { id: 14, name: 'Housing Office', icon: '🏠', location: 'Residential Life Building', hours: 'Mon-Fri 8am-5pm', phone: '555-126-0004', description: 'Dorm assignments, maintenance requests, and roommate issues.', tags: ['housing', 'dorms'] },
  ],
}

const ANNOUNCEMENTS = [
  { id: 1, type: 'alert', title: 'Campus Closure', message: 'Campus closed Monday for weather. Check email for updates.', time: '2 hours ago' },
  { id: 2, type: 'event', title: 'Career Fair Tomorrow', message: 'Spring Career Fair at Student Union, 10am-3pm. Bring resumes!', time: '5 hours ago' },
  { id: 3, type: 'info', title: 'Library Extended Hours', message: 'Library open 24/7 through finals week starting next Monday.', time: '1 day ago' },
]

const EVENTS = [
  { id: 1, name: 'Career Fair', date: 'Mar 15', time: '10am-3pm', location: 'Student Union', category: 'career' },
  { id: 2, name: 'Club Rush', date: 'Mar 18', time: '11am-2pm', location: 'Main Quad', category: 'social' },
  { id: 3, name: 'Study Abroad Info', date: 'Mar 20', time: '3pm', location: 'International Center', category: 'academic' },
  { id: 4, name: 'Free Movie Night', date: 'Mar 22', time: '7pm', location: 'Auditorium', category: 'entertainment' },
]

export default function CampusHub() {
  const [view, setView] = useState('home') // home, category, detail, events, search, about
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedResource, setSelectedResource] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [favorites, setFavorites] = useState([1, 6, 12])

  const allResources = Object.values(RESOURCES).flat()

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    const q = searchQuery.toLowerCase()
    return allResources.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.tags.some(t => t.includes(q))
    )
  }, [searchQuery])

  const toggleFavorite = (id) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }

  if (view === 'about') {
    return (
      <div className="campus-hub">
        <header className="ch-header">
          <button className="back-btn" onClick={() => setView('home')}>Back</button>
          <h1>About CampusHub</h1>
        </header>

        <div className="about-content">
          <section className="about-section">
            <h2>What is CampusHub?</h2>
            <p>
              CampusHub is a centralized directory for all campus and local resources.
              It helps students quickly find services, offices, and support.
            </p>
          </section>

          <section className="about-section">
            <h2>Design Decisions for MVP</h2>
            <ul>
              <li><strong>Category Organization:</strong> Academic, Health, Financial, Campus Life</li>
              <li><strong>Quick Search:</strong> Find resources by name, description, or tags</li>
              <li><strong>Favorites System:</strong> Save frequently used resources</li>
              <li><strong>Announcements Feed:</strong> Campus alerts and important info</li>
              <li><strong>Events Calendar:</strong> Upcoming campus events</li>
              <li><strong>Contact Info:</strong> Direct phone and location for each resource</li>
            </ul>
          </section>

          <section className="about-section">
            <h2>Production Requirements</h2>
            <ul>
              <li>Real-time data sync with university systems</li>
              <li>Push notifications for announcements</li>
              <li>Integration with campus maps and navigation</li>
              <li>Wait times and appointment scheduling</li>
              <li>User reviews and ratings</li>
              <li>Multilingual support</li>
              <li>Accessibility features (screen reader, high contrast)</li>
              <li>Offline mode for basic info</li>
            </ul>
          </section>

          <section className="about-section">
            <h2>Data Sources</h2>
            <p>
              Production version would integrate with university directory APIs,
              event management systems, and emergency notification platforms.
            </p>
          </section>
        </div>
      </div>
    )
  }

  if (view === 'search') {
    return (
      <div className="campus-hub">
        <header className="ch-header">
          <button className="back-btn" onClick={() => { setView('home'); setSearchQuery(''); }}>Back</button>
          <h1>Search</h1>
        </header>

        <div className="search-content">
          <input
            type="search"
            className="search-input"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />

          {searchQuery && (
            <div className="search-results">
              {searchResults.length === 0 ? (
                <div className="no-results">
                  <span>🔍</span>
                  <p>No resources found for "{searchQuery}"</p>
                </div>
              ) : (
                searchResults.map(resource => (
                  <div
                    key={resource.id}
                    className="resource-card"
                    onClick={() => { setSelectedResource(resource); setView('detail'); }}
                  >
                    <span className="resource-icon">{resource.icon}</span>
                    <div className="resource-info">
                      <span className="resource-name">{resource.name}</span>
                      <span className="resource-location">{resource.location}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  if (view === 'detail' && selectedResource) {
    const isFavorite = favorites.includes(selectedResource.id)
    return (
      <div className="campus-hub">
        <header className="ch-header">
          <button className="back-btn" onClick={() => setView(selectedCategory ? 'category' : 'home')}>Back</button>
          <h1>Resource</h1>
          <button className={`fav-btn ${isFavorite ? 'active' : ''}`} onClick={() => toggleFavorite(selectedResource.id)}>
            {isFavorite ? '★' : '☆'}
          </button>
        </header>

        <div className="detail-content">
          <div className="detail-hero">
            <span className="detail-icon">{selectedResource.icon}</span>
            <h2>{selectedResource.name}</h2>
          </div>

          <div className="detail-info">
            <div className="info-row">
              <span className="info-label">📍 Location</span>
              <span className="info-value">{selectedResource.location}</span>
            </div>
            <div className="info-row">
              <span className="info-label">🕐 Hours</span>
              <span className="info-value">{selectedResource.hours}</span>
            </div>
            <div className="info-row">
              <span className="info-label">📞 Phone</span>
              <a href={`tel:${selectedResource.phone}`} className="info-value phone">{selectedResource.phone}</a>
            </div>
          </div>

          <div className="detail-description">
            <h3>About</h3>
            <p>{selectedResource.description}</p>
          </div>

          <div className="detail-tags">
            {selectedResource.tags.map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>

          <div className="detail-actions">
            <button className="action-btn primary">
              <span>📞</span> Call
            </button>
            <button className="action-btn secondary">
              <span>🗺️</span> Directions
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (view === 'category' && selectedCategory) {
    const resources = RESOURCES[selectedCategory] || []
    const categoryNames = { academic: 'Academic', health: 'Health & Wellness', financial: 'Financial', campus: 'Campus Life' }

    return (
      <div className="campus-hub">
        <header className="ch-header">
          <button className="back-btn" onClick={() => setView('home')}>Back</button>
          <h1>{categoryNames[selectedCategory]}</h1>
        </header>

        <div className="category-content">
          {resources.map(resource => (
            <div
              key={resource.id}
              className="resource-card"
              onClick={() => { setSelectedResource(resource); setView('detail'); }}
            >
              <span className="resource-icon">{resource.icon}</span>
              <div className="resource-info">
                <span className="resource-name">{resource.name}</span>
                <span className="resource-hours">{resource.hours}</span>
              </div>
              <span className="resource-arrow">→</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (view === 'events') {
    return (
      <div className="campus-hub">
        <header className="ch-header">
          <button className="back-btn" onClick={() => setView('home')}>Back</button>
          <h1>Events</h1>
        </header>

        <div className="events-content">
          {EVENTS.map(event => (
            <div key={event.id} className="event-card">
              <div className="event-date">
                <span className="date-day">{event.date.split(' ')[1]}</span>
                <span className="date-month">{event.date.split(' ')[0]}</span>
              </div>
              <div className="event-info">
                <span className="event-name">{event.name}</span>
                <span className="event-time">{event.time} • {event.location}</span>
              </div>
              <span className={`event-category ${event.category}`}>
                {event.category === 'career' ? '💼' : event.category === 'social' ? '🎉' : event.category === 'academic' ? '🎓' : '🎬'}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Home view
  const favoriteResources = allResources.filter(r => favorites.includes(r.id))

  return (
    <div className="campus-hub">
      <header className="ch-header home-header">
        <h1>CampusHub</h1>
        <p className="tagline">All your resources, one place</p>
      </header>

      <div className="home-content">
        <button className="search-trigger" onClick={() => setView('search')}>
          <span>🔍</span>
          <span>Search resources...</span>
        </button>

        {ANNOUNCEMENTS.length > 0 && (
          <div className="announcements">
            {ANNOUNCEMENTS.slice(0, 2).map(ann => (
              <div key={ann.id} className={`announcement ${ann.type}`}>
                <span className="ann-icon">
                  {ann.type === 'alert' ? '⚠️' : ann.type === 'event' ? '📅' : 'ℹ️'}
                </span>
                <div className="ann-content">
                  <span className="ann-title">{ann.title}</span>
                  <span className="ann-message">{ann.message}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {favoriteResources.length > 0 && (
          <div className="favorites-section">
            <h3>Quick Access</h3>
            <div className="favorites-scroll">
              {favoriteResources.map(resource => (
                <div
                  key={resource.id}
                  className="favorite-card"
                  onClick={() => { setSelectedResource(resource); setView('detail'); }}
                >
                  <span className="fav-icon">{resource.icon}</span>
                  <span className="fav-name">{resource.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="categories">
          <h3>Browse by Category</h3>
          <div className="category-grid">
            {[
              { id: 'academic', name: 'Academic', icon: '📚', color: '#6366f1' },
              { id: 'health', name: 'Health', icon: '💚', color: '#22c55e' },
              { id: 'financial', name: 'Financial', icon: '💰', color: '#f59e0b' },
              { id: 'campus', name: 'Campus Life', icon: '🏛️', color: '#ec4899' },
            ].map(cat => (
              <button
                key={cat.id}
                className="category-card"
                style={{ '--cat-color': cat.color }}
                onClick={() => { setSelectedCategory(cat.id); setView('category'); }}
              >
                <span className="cat-icon">{cat.icon}</span>
                <span className="cat-name">{cat.name}</span>
                <span className="cat-count">{RESOURCES[cat.id].length} resources</span>
              </button>
            ))}
          </div>
        </div>

        <div className="events-preview">
          <div className="section-header">
            <h3>Upcoming Events</h3>
            <button onClick={() => setView('events')}>See all</button>
          </div>
          <div className="events-scroll">
            {EVENTS.slice(0, 3).map(event => (
              <div key={event.id} className="event-preview">
                <span className="ep-date">{event.date}</span>
                <span className="ep-name">{event.name}</span>
              </div>
            ))}
          </div>
        </div>

        <button className="about-link" onClick={() => setView('about')}>
          About CampusHub
        </button>
      </div>
    </div>
  )
}
