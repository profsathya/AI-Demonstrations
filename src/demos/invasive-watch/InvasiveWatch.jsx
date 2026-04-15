import { useState, useMemo } from 'react'
import './InvasiveWatch.css'

// Simulated invasive species database
const INVASIVE_SPECIES = [
  {
    id: 1,
    name: 'Japanese Knotweed',
    scientificName: 'Reynoutria japonica',
    type: 'plant',
    threatLevel: 'high',
    image: '🌿',
    description: 'Fast-spreading plant that can damage foundations and infrastructure.',
    identificationTips: ['Hollow bamboo-like stems', 'Heart-shaped leaves', 'White flower clusters in late summer'],
    distribution: 'Widespread in urban and riparian areas',
    reportCount: 342,
  },
  {
    id: 2,
    name: 'Spotted Lanternfly',
    scientificName: 'Lycorma delicatula',
    type: 'insect',
    threatLevel: 'high',
    image: '🦋',
    description: 'Invasive planthopper that damages grapes, orchards, and hardwoods.',
    identificationTips: ['Gray wings with black spots', 'Red underwings when open', 'About 1 inch long'],
    distribution: 'Eastern United States, spreading west',
    reportCount: 1247,
  },
  {
    id: 3,
    name: 'Asian Giant Hornet',
    scientificName: 'Vespa mandarinia',
    type: 'insect',
    threatLevel: 'high',
    image: '🐝',
    description: 'Large hornet that preys on honeybees and can devastate colonies.',
    identificationTips: ['2 inches long', 'Orange head with large eyes', 'Black and yellow striped abdomen'],
    distribution: 'Pacific Northwest (limited)',
    reportCount: 89,
  },
  {
    id: 4,
    name: 'English Ivy',
    scientificName: 'Hedera helix',
    type: 'plant',
    threatLevel: 'medium',
    image: '🌱',
    description: 'Climbing vine that smothers native vegetation and trees.',
    identificationTips: ['Waxy dark green leaves', '3-5 pointed lobes', 'Aerial roots for climbing'],
    distribution: 'Common in forests and urban areas',
    reportCount: 521,
  },
  {
    id: 5,
    name: 'Zebra Mussel',
    scientificName: 'Dreissena polymorpha',
    type: 'aquatic',
    threatLevel: 'high',
    image: '🐚',
    description: 'Freshwater mussel that clogs water infrastructure and outcompetes native species.',
    identificationTips: ['D-shaped shell', 'Zigzag stripes', 'Up to 2 inches', 'Found in clusters'],
    distribution: 'Great Lakes, spreading to other water bodies',
    reportCount: 198,
  },
  {
    id: 6,
    name: 'Garlic Mustard',
    scientificName: 'Alliaria petiolata',
    type: 'plant',
    threatLevel: 'medium',
    image: '🌼',
    description: 'Biennial herb that invades forest understories and inhibits native plants.',
    identificationTips: ['Garlic odor when crushed', 'Heart-shaped leaves', 'White 4-petaled flowers'],
    distribution: 'Eastern and Midwestern forests',
    reportCount: 687,
  },
]

// Simulated user reports
const generateReports = () => {
  const reports = []
  const locations = ['Downtown Park', 'River Trail', 'University Campus', 'Forest Preserve', 'Lake Shore', 'Community Garden']

  for (let i = 0; i < 15; i++) {
    const species = INVASIVE_SPECIES[Math.floor(Math.random() * INVASIVE_SPECIES.length)]
    reports.push({
      id: i + 1,
      species: species.name,
      speciesImage: species.image,
      location: locations[Math.floor(Math.random() * locations.length)],
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      status: ['verified', 'pending', 'verified', 'verified'][Math.floor(Math.random() * 4)],
      reporter: ['JohnD', 'EcoWatch', 'NatureLover', 'BiologyClub'][Math.floor(Math.random() * 4)],
    })
  }
  return reports.sort((a, b) => new Date(b.date) - new Date(a.date))
}

export default function InvasiveWatch() {
  const [view, setView] = useState('home') // home, species, detail, report, reports, about
  const [selectedType, setSelectedType] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpecies, setSelectedSpecies] = useState(null)
  const [reports] = useState(generateReports)
  const [newReport, setNewReport] = useState({
    species: '',
    location: '',
    description: '',
    photo: null,
  })

  const filteredSpecies = useMemo(() => {
    return INVASIVE_SPECIES.filter(s => {
      const matchesType = selectedType === 'all' || s.type === selectedType
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           s.scientificName.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesType && matchesSearch
    })
  }, [selectedType, searchQuery])

  const handleSubmitReport = (e) => {
    e.preventDefault()
    alert('Report submitted! Local authorities will review your sighting. Thank you for helping protect our ecosystem!')
    setNewReport({ species: '', location: '', description: '', photo: null })
    setView('home')
  }

  if (view === 'about') {
    return (
      <div className="invasive-watch">
        <header className="iw-header">
          <button className="back-btn" onClick={() => setView('home')}>Back</button>
          <h1>About InvasiveWatch</h1>
        </header>

        <div className="about-content">
          <section className="about-section">
            <h2>What is InvasiveWatch?</h2>
            <p>
              InvasiveWatch is a citizen science platform for tracking and reporting invasive species
              sightings. It helps protect local ecosystems by enabling early detection and rapid response.
            </p>
          </section>

          <section className="about-section">
            <h2>Design Decisions for MVP</h2>
            <ul>
              <li><strong>Species Database:</strong> Curated list with identification tips, threat levels, and distribution info</li>
              <li><strong>Simulated GPS:</strong> Location field for reports - production would use device GPS</li>
              <li><strong>Photo Upload:</strong> Placeholder for camera integration - key for verification</li>
              <li><strong>Verification Status:</strong> Reports marked pending until expert review</li>
              <li><strong>Threat Level Indicators:</strong> Visual hierarchy for species danger</li>
            </ul>
          </section>

          <section className="about-section">
            <h2>Production Requirements</h2>
            <ul>
              <li>GPS integration for precise location tracking</li>
              <li>Image recognition ML for species identification assistance</li>
              <li>Integration with state/federal invasive species databases (EDDMapS, iNaturalist)</li>
              <li>Push notifications for nearby sightings</li>
              <li>Expert verification workflow</li>
              <li>GIS mapping with heatmaps and spread patterns</li>
              <li>Offline mode for field reporting</li>
              <li>Integration with local environmental agencies</li>
            </ul>
          </section>

          <section className="about-section">
            <h2>Why It Matters</h2>
            <ul>
              <li>Invasive species cost US economy $120+ billion annually</li>
              <li>Early detection prevents establishment and spread</li>
              <li>Citizen scientists expand monitoring coverage</li>
              <li>Data helps prioritize management resources</li>
              <li>Educational tool for environmental awareness</li>
            </ul>
          </section>
        </div>
      </div>
    )
  }

  if (view === 'detail' && selectedSpecies) {
    return (
      <div className="invasive-watch">
        <header className="iw-header">
          <button className="back-btn" onClick={() => setView('species')}>Back</button>
          <h1>Species Detail</h1>
        </header>

        <div className="detail-content">
          <div className="species-hero">
            <span className="hero-image">{selectedSpecies.image}</span>
            <div className="hero-info">
              <h2>{selectedSpecies.name}</h2>
              <p className="scientific">{selectedSpecies.scientificName}</p>
              <span className={`threat-badge ${selectedSpecies.threatLevel}`}>
                {selectedSpecies.threatLevel} threat
              </span>
            </div>
          </div>

          <div className="detail-section">
            <h3>Description</h3>
            <p>{selectedSpecies.description}</p>
          </div>

          <div className="detail-section">
            <h3>How to Identify</h3>
            <ul className="id-tips">
              {selectedSpecies.identificationTips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>

          <div className="detail-section">
            <h3>Distribution</h3>
            <p>{selectedSpecies.distribution}</p>
          </div>

          <div className="detail-stats">
            <div className="stat">
              <span className="stat-value">{selectedSpecies.reportCount}</span>
              <span className="stat-label">Reports</span>
            </div>
            <div className="stat">
              <span className="stat-value">{selectedSpecies.type}</span>
              <span className="stat-label">Type</span>
            </div>
          </div>

          <button className="report-sighting-btn" onClick={() => {
            setNewReport(r => ({ ...r, species: selectedSpecies.name }))
            setView('report')
          }}>
            Report a Sighting
          </button>
        </div>
      </div>
    )
  }

  if (view === 'species') {
    return (
      <div className="invasive-watch">
        <header className="iw-header">
          <button className="back-btn" onClick={() => setView('home')}>Back</button>
          <h1>Species Database</h1>
        </header>

        <div className="species-content">
          <input
            type="search"
            className="species-search"
            placeholder="Search species..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="type-filter">
            {[
              { id: 'all', label: 'All' },
              { id: 'plant', label: '🌿 Plants' },
              { id: 'insect', label: '🐛 Insects' },
              { id: 'aquatic', label: '🐟 Aquatic' },
            ].map(type => (
              <button
                key={type.id}
                className={`type-btn ${selectedType === type.id ? 'active' : ''}`}
                onClick={() => setSelectedType(type.id)}
              >
                {type.label}
              </button>
            ))}
          </div>

          <div className="species-list">
            {filteredSpecies.map(species => (
              <div
                key={species.id}
                className="species-card"
                onClick={() => { setSelectedSpecies(species); setView('detail'); }}
              >
                <span className="species-image">{species.image}</span>
                <div className="species-info">
                  <span className="species-name">{species.name}</span>
                  <span className="species-scientific">{species.scientificName}</span>
                </div>
                <span className={`threat-indicator ${species.threatLevel}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (view === 'report') {
    return (
      <div className="invasive-watch">
        <header className="iw-header">
          <button className="back-btn" onClick={() => setView('home')}>Cancel</button>
          <h1>Report Sighting</h1>
        </header>

        <form className="report-form" onSubmit={handleSubmitReport}>
          <div className="form-group">
            <label>Species *</label>
            <select
              value={newReport.species}
              onChange={(e) => setNewReport(r => ({ ...r, species: e.target.value }))}
              required
            >
              <option value="">Select species</option>
              {INVASIVE_SPECIES.map(s => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
              <option value="unknown">Unknown / Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Location *</label>
            <input
              type="text"
              placeholder="e.g., Central Park, near main fountain"
              value={newReport.location}
              onChange={(e) => setNewReport(r => ({ ...r, location: e.target.value }))}
              required
            />
            <button type="button" className="gps-btn">📍 Use Current Location</button>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              placeholder="Describe what you observed (size, quantity, condition...)"
              value={newReport.description}
              onChange={(e) => setNewReport(r => ({ ...r, description: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label>Photo</label>
            <div className="photo-upload">
              <span>📷</span>
              <span>Add a photo for verification</span>
            </div>
          </div>

          <button type="submit" className="submit-btn">Submit Report</button>
        </form>
      </div>
    )
  }

  if (view === 'reports') {
    return (
      <div className="invasive-watch">
        <header className="iw-header">
          <button className="back-btn" onClick={() => setView('home')}>Back</button>
          <h1>Recent Reports</h1>
        </header>

        <div className="reports-list">
          {reports.map(report => (
            <div key={report.id} className="report-card">
              <span className="report-species-icon">{report.speciesImage}</span>
              <div className="report-info">
                <span className="report-species">{report.species}</span>
                <span className="report-location">{report.location}</span>
                <span className="report-meta">{report.date} by {report.reporter}</span>
              </div>
              <span className={`report-status ${report.status}`}>
                {report.status === 'verified' ? '✓' : '○'}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Home view
  return (
    <div className="invasive-watch">
      <header className="iw-header home-header">
        <h1>InvasiveWatch</h1>
        <p className="tagline">Protect our ecosystems</p>
      </header>

      <div className="home-content">
        <div className="stats-banner">
          <div className="stat-item">
            <span className="stat-num">{INVASIVE_SPECIES.reduce((sum, s) => sum + s.reportCount, 0).toLocaleString()}</span>
            <span className="stat-text">Total Reports</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">{INVASIVE_SPECIES.length}</span>
            <span className="stat-text">Species Tracked</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">47</span>
            <span className="stat-text">Active Alerts</span>
          </div>
        </div>

        <button className="action-btn primary" onClick={() => setView('report')}>
          <span>📍</span>
          <span>Report a Sighting</span>
        </button>

        <div className="high-alert">
          <h3>⚠️ High Alert Species</h3>
          <div className="alert-species">
            {INVASIVE_SPECIES.filter(s => s.threatLevel === 'high').map(species => (
              <div
                key={species.id}
                className="alert-item"
                onClick={() => { setSelectedSpecies(species); setView('detail'); }}
              >
                <span>{species.image}</span>
                <span>{species.name}</span>
              </div>
            ))}
          </div>
        </div>

        <nav className="home-nav">
          <button onClick={() => setView('species')}>
            <span>📚</span>
            <span>Species Database</span>
          </button>
          <button onClick={() => setView('reports')}>
            <span>📋</span>
            <span>Recent Reports</span>
          </button>
          <button onClick={() => setView('about')}>
            <span>ℹ️</span>
            <span>About</span>
          </button>
        </nav>
      </div>
    </div>
  )
}
