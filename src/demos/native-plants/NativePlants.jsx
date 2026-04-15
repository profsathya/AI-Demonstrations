import { useState, useMemo } from 'react'
import './NativePlants.css'

// Native plants database
const NATIVE_PLANTS = [
  {
    id: 1,
    name: 'California Poppy',
    scientificName: 'Eschscholzia californica',
    type: 'wildflower',
    region: 'West',
    image: '🌼',
    bloomTime: 'Spring - Summer',
    sunlight: 'Full sun',
    water: 'Drought tolerant',
    wildlife: ['Bees', 'Butterflies'],
    description: 'State flower of California with vibrant orange blooms.',
    growingTips: ['Self-seeds readily', 'Best in poor, well-drained soil', 'Direct sow in fall or early spring'],
    reportCount: 892,
  },
  {
    id: 2,
    name: 'Purple Coneflower',
    scientificName: 'Echinacea purpurea',
    type: 'wildflower',
    region: 'Central',
    image: '🌸',
    bloomTime: 'Summer - Fall',
    sunlight: 'Full sun to part shade',
    water: 'Medium',
    wildlife: ['Butterflies', 'Birds', 'Bees'],
    description: 'Popular prairie flower that attracts pollinators and goldfinches.',
    growingTips: ['Deadhead to prolong blooming', 'Leave seed heads for winter bird food', 'Divide every 3-4 years'],
    reportCount: 1245,
  },
  {
    id: 3,
    name: 'Red Maple',
    scientificName: 'Acer rubrum',
    type: 'tree',
    region: 'East',
    image: '🍁',
    bloomTime: 'Early Spring',
    sunlight: 'Full sun to part shade',
    water: 'Medium to wet',
    wildlife: ['Birds', 'Squirrels', 'Deer'],
    description: 'Fast-growing native tree with spectacular fall color.',
    growingTips: ['Tolerates wet soil', 'Brilliant red fall foliage', 'Good urban tree'],
    reportCount: 567,
  },
  {
    id: 4,
    name: 'Butterfly Weed',
    scientificName: 'Asclepias tuberosa',
    type: 'wildflower',
    region: 'Central',
    image: '🧡',
    bloomTime: 'Summer',
    sunlight: 'Full sun',
    water: 'Dry to medium',
    wildlife: ['Monarch butterflies', 'Bees', 'Hummingbirds'],
    description: 'Essential host plant for Monarch butterflies with bright orange flowers.',
    growingTips: ['Don\'t transplant - deep taproot', 'Slow to emerge in spring', 'Thrives in poor soil'],
    reportCount: 1678,
  },
  {
    id: 5,
    name: 'Eastern Redbud',
    scientificName: 'Cercis canadensis',
    type: 'tree',
    region: 'East',
    image: '🌺',
    bloomTime: 'Early Spring',
    sunlight: 'Full sun to part shade',
    water: 'Medium',
    wildlife: ['Bees', 'Hummingbirds', 'Butterflies'],
    description: 'Ornamental tree with stunning pink spring flowers before leaves emerge.',
    growingTips: ['Heart-shaped leaves', 'Flowers on bare branches', 'Excellent understory tree'],
    reportCount: 423,
  },
  {
    id: 6,
    name: 'Wild Bergamot',
    scientificName: 'Monarda fistulosa',
    type: 'wildflower',
    region: 'Central',
    image: '💜',
    bloomTime: 'Summer',
    sunlight: 'Full sun to part shade',
    water: 'Dry to medium',
    wildlife: ['Bees', 'Butterflies', 'Hummingbirds'],
    description: 'Fragrant lavender flowers attractive to many pollinators.',
    growingTips: ['Spreads by rhizomes', 'Mildew-resistant variety recommended', 'Tea can be made from leaves'],
    reportCount: 756,
  },
  {
    id: 7,
    name: 'Black-Eyed Susan',
    scientificName: 'Rudbeckia hirta',
    type: 'wildflower',
    region: 'Central',
    image: '🌻',
    bloomTime: 'Summer - Fall',
    sunlight: 'Full sun',
    water: 'Medium',
    wildlife: ['Bees', 'Butterflies', 'Birds'],
    description: 'Classic prairie wildflower with golden petals and dark centers.',
    growingTips: ['Short-lived perennial or biennial', 'Self-seeds prolifically', 'Deer resistant'],
    reportCount: 2341,
  },
  {
    id: 8,
    name: 'Virginia Creeper',
    scientificName: 'Parthenocissus quinquefolia',
    type: 'vine',
    region: 'East',
    image: '🍂',
    bloomTime: 'Spring (foliage plant)',
    sunlight: 'Full sun to full shade',
    water: 'Medium',
    wildlife: ['Birds', 'Bees', 'Small mammals'],
    description: 'Vigorous native vine with brilliant red fall foliage and berries for birds.',
    growingTips: ['5-leaflet leaves (not poison ivy!)', 'Can cover large areas', 'Great for wildlife habitat'],
    reportCount: 312,
  },
]

// Achievements for gamification
const ACHIEVEMENTS = [
  { id: 1, name: 'First Sighting', description: 'Report your first native plant', icon: '🌱', requirement: 1 },
  { id: 2, name: 'Budding Botanist', description: 'Report 10 different species', icon: '🌿', requirement: 10 },
  { id: 3, name: 'Pollinator Friend', description: 'Report 5 butterfly host plants', icon: '🦋', requirement: 5 },
  { id: 4, name: 'Tree Hugger', description: 'Report 5 native trees', icon: '🌳', requirement: 5 },
  { id: 5, name: 'Regional Expert', description: 'Report plants from all 3 regions', icon: '🗺️', requirement: 3 },
]

export default function NativePlants() {
  const [view, setView] = useState('home') // home, explore, detail, report, journal, about
  const [selectedType, setSelectedType] = useState('all')
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPlant, setSelectedPlant] = useState(null)
  const [journal, setJournal] = useState([
    { id: 1, plantId: 7, date: '2024-03-15', location: 'Local Park', notes: 'Found a patch near the creek', photo: true },
    { id: 2, plantId: 4, date: '2024-03-10', location: 'Backyard', notes: 'Saw monarchs visiting!', photo: true },
  ])
  const [newSighting, setNewSighting] = useState({ plantId: '', location: '', notes: '' })

  const filteredPlants = useMemo(() => {
    return NATIVE_PLANTS.filter(p => {
      const matchesType = selectedType === 'all' || p.type === selectedType
      const matchesRegion = selectedRegion === 'all' || p.region === selectedRegion
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           p.scientificName.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesType && matchesRegion && matchesSearch
    })
  }, [selectedType, selectedRegion, searchQuery])

  const stats = useMemo(() => {
    const speciesReported = new Set(journal.map(j => j.plantId)).size
    const totalSightings = journal.length
    const achievements = ACHIEVEMENTS.filter(a => {
      if (a.id === 1) return totalSightings >= 1
      if (a.id === 2) return speciesReported >= 10
      return false
    })
    return { speciesReported, totalSightings, achievements }
  }, [journal])

  const handleSubmitSighting = (e) => {
    e.preventDefault()
    if (newSighting.plantId && newSighting.location) {
      setJournal(prev => [
        {
          id: Date.now(),
          plantId: parseInt(newSighting.plantId),
          date: new Date().toISOString().split('T')[0],
          location: newSighting.location,
          notes: newSighting.notes,
          photo: false,
        },
        ...prev
      ])
      setNewSighting({ plantId: '', location: '', notes: '' })
      setView('journal')
    }
  }

  if (view === 'about') {
    return (
      <div className="native-plants">
        <header className="np-header">
          <button className="back-btn" onClick={() => setView('home')}>Back</button>
          <h1>About NativePlants</h1>
        </header>

        <div className="about-content">
          <section className="about-section">
            <h2>What is NativePlants?</h2>
            <p>
              NativePlants is a citizen science app for identifying, tracking, and reporting native
              plant species. It helps promote biodiversity and supports pollinator conservation.
            </p>
          </section>

          <section className="about-section">
            <h2>Design Decisions for MVP</h2>
            <ul>
              <li><strong>Regional Focus:</strong> Plants organized by East/Central/West regions for relevance</li>
              <li><strong>Wildlife Connections:</strong> Shows which animals benefit from each plant</li>
              <li><strong>Personal Journal:</strong> Track your own sightings and build a nature diary</li>
              <li><strong>Gamification:</strong> Achievements to encourage continued engagement</li>
              <li><strong>Growing Tips:</strong> Educational content for gardeners</li>
            </ul>
          </section>

          <section className="about-section">
            <h2>Production Requirements</h2>
            <ul>
              <li>Plant identification ML using iNaturalist or PlantNet API</li>
              <li>GPS-tagged photo uploads with EXIF data extraction</li>
              <li>Integration with native plant databases (USDA PLANTS, Lady Bird Johnson)</li>
              <li>Social features: follow other naturalists, comment on sightings</li>
              <li>Bloom calendar based on location</li>
              <li>Native plant nursery finder</li>
              <li>Garden planning tools</li>
              <li>Push notifications for bloom alerts</li>
            </ul>
          </section>

          <section className="about-section">
            <h2>Why Native Plants Matter</h2>
            <ul>
              <li>Support local ecosystems and food webs</li>
              <li>Essential for pollinators (96% of songbirds need insects)</li>
              <li>Require less water and maintenance than non-natives</li>
              <li>Preserve genetic diversity and local adaptations</li>
              <li>Combat climate change through carbon sequestration</li>
            </ul>
          </section>
        </div>
      </div>
    )
  }

  if (view === 'detail' && selectedPlant) {
    return (
      <div className="native-plants">
        <header className="np-header">
          <button className="back-btn" onClick={() => setView('explore')}>Back</button>
          <h1>Plant Detail</h1>
        </header>

        <div className="detail-content">
          <div className="plant-hero">
            <span className="hero-image">{selectedPlant.image}</span>
            <div className="hero-info">
              <h2>{selectedPlant.name}</h2>
              <p className="scientific">{selectedPlant.scientificName}</p>
              <div className="plant-badges">
                <span className="badge type">{selectedPlant.type}</span>
                <span className="badge region">{selectedPlant.region}</span>
              </div>
            </div>
          </div>

          <div className="plant-quick-facts">
            <div className="fact">
              <span className="fact-icon">🌞</span>
              <span>{selectedPlant.sunlight}</span>
            </div>
            <div className="fact">
              <span className="fact-icon">💧</span>
              <span>{selectedPlant.water}</span>
            </div>
            <div className="fact">
              <span className="fact-icon">🌸</span>
              <span>{selectedPlant.bloomTime}</span>
            </div>
          </div>

          <div className="detail-section">
            <h3>About</h3>
            <p>{selectedPlant.description}</p>
          </div>

          <div className="detail-section">
            <h3>Wildlife Supported</h3>
            <div className="wildlife-tags">
              {selectedPlant.wildlife.map((w, i) => (
                <span key={i} className="wildlife-tag">{w}</span>
              ))}
            </div>
          </div>

          <div className="detail-section">
            <h3>Growing Tips</h3>
            <ul className="tips-list">
              {selectedPlant.growingTips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>

          <div className="community-stats">
            <span className="sightings-count">{selectedPlant.reportCount.toLocaleString()}</span>
            <span className="sightings-label">Community Sightings</span>
          </div>

          <button className="log-sighting-btn" onClick={() => {
            setNewSighting(s => ({ ...s, plantId: selectedPlant.id.toString() }))
            setView('report')
          }}>
            Log a Sighting
          </button>
        </div>
      </div>
    )
  }

  if (view === 'explore') {
    return (
      <div className="native-plants">
        <header className="np-header">
          <button className="back-btn" onClick={() => setView('home')}>Back</button>
          <h1>Explore Plants</h1>
        </header>

        <div className="explore-content">
          <input
            type="search"
            className="plant-search"
            placeholder="Search plants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="filters">
            <div className="filter-group">
              <label>Type</label>
              <div className="filter-buttons">
                {['all', 'wildflower', 'tree', 'vine'].map(type => (
                  <button
                    key={type}
                    className={`filter-btn ${selectedType === type ? 'active' : ''}`}
                    onClick={() => setSelectedType(type)}
                  >
                    {type === 'all' ? 'All' : type}
                  </button>
                ))}
              </div>
            </div>
            <div className="filter-group">
              <label>Region</label>
              <div className="filter-buttons">
                {['all', 'East', 'Central', 'West'].map(region => (
                  <button
                    key={region}
                    className={`filter-btn ${selectedRegion === region ? 'active' : ''}`}
                    onClick={() => setSelectedRegion(region)}
                  >
                    {region === 'all' ? 'All' : region}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="plants-grid">
            {filteredPlants.map(plant => (
              <div
                key={plant.id}
                className="plant-card"
                onClick={() => { setSelectedPlant(plant); setView('detail'); }}
              >
                <span className="plant-image">{plant.image}</span>
                <span className="plant-name">{plant.name}</span>
                <span className="plant-type">{plant.type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (view === 'report') {
    return (
      <div className="native-plants">
        <header className="np-header">
          <button className="back-btn" onClick={() => setView('home')}>Cancel</button>
          <h1>Log Sighting</h1>
        </header>

        <form className="report-form" onSubmit={handleSubmitSighting}>
          <div className="form-group">
            <label>Plant Species *</label>
            <select
              value={newSighting.plantId}
              onChange={(e) => setNewSighting(s => ({ ...s, plantId: e.target.value }))}
              required
            >
              <option value="">Select plant</option>
              {NATIVE_PLANTS.map(p => (
                <option key={p.id} value={p.id}>{p.image} {p.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Location *</label>
            <input
              type="text"
              placeholder="e.g., Riverside Park Trail"
              value={newSighting.location}
              onChange={(e) => setNewSighting(s => ({ ...s, location: e.target.value }))}
              required
            />
            <button type="button" className="gps-btn">📍 Use GPS</button>
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              placeholder="Describe what you saw (bloom stage, wildlife visitors...)"
              value={newSighting.notes}
              onChange={(e) => setNewSighting(s => ({ ...s, notes: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label>Photo</label>
            <div className="photo-upload">
              <span>📸</span>
              <span>Add a photo</span>
            </div>
          </div>

          <button type="submit" className="submit-btn">Save to Journal</button>
        </form>
      </div>
    )
  }

  if (view === 'journal') {
    return (
      <div className="native-plants">
        <header className="np-header">
          <button className="back-btn" onClick={() => setView('home')}>Back</button>
          <h1>My Journal</h1>
        </header>

        <div className="journal-content">
          <div className="journal-stats">
            <div className="j-stat">
              <span className="j-stat-num">{stats.speciesReported}</span>
              <span className="j-stat-label">Species</span>
            </div>
            <div className="j-stat">
              <span className="j-stat-num">{stats.totalSightings}</span>
              <span className="j-stat-label">Sightings</span>
            </div>
            <div className="j-stat">
              <span className="j-stat-num">{stats.achievements.length}</span>
              <span className="j-stat-label">Badges</span>
            </div>
          </div>

          <div className="journal-entries">
            {journal.length === 0 ? (
              <div className="empty-journal">
                <span>🌱</span>
                <p>Start your nature journal!</p>
              </div>
            ) : (
              journal.map(entry => {
                const plant = NATIVE_PLANTS.find(p => p.id === entry.plantId)
                return (
                  <div key={entry.id} className="journal-entry">
                    <span className="entry-image">{plant?.image}</span>
                    <div className="entry-info">
                      <span className="entry-name">{plant?.name}</span>
                      <span className="entry-location">{entry.location}</span>
                      <span className="entry-date">{entry.date}</span>
                      {entry.notes && <span className="entry-notes">"{entry.notes}"</span>}
                    </div>
                    {entry.photo && <span className="entry-photo">📷</span>}
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    )
  }

  // Home view
  return (
    <div className="native-plants">
      <header className="np-header home-header">
        <h1>NativePlants</h1>
        <p className="tagline">Discover local flora</p>
      </header>

      <div className="home-content">
        <div className="welcome-card">
          <h3>Welcome, Naturalist!</h3>
          <p>Explore, identify, and track native plants in your area.</p>
          <div className="quick-stats">
            <span>🌱 {stats.speciesReported} species logged</span>
            <span>📍 {stats.totalSightings} sightings</span>
          </div>
        </div>

        <div className="action-buttons">
          <button className="action-btn primary" onClick={() => setView('explore')}>
            <span>🔍</span>
            <span>Explore Plants</span>
          </button>
          <button className="action-btn secondary" onClick={() => setView('report')}>
            <span>📍</span>
            <span>Log Sighting</span>
          </button>
        </div>

        <div className="featured-plants">
          <h3>Popular This Season</h3>
          <div className="featured-scroll">
            {NATIVE_PLANTS.slice(0, 4).map(plant => (
              <div
                key={plant.id}
                className="featured-card"
                onClick={() => { setSelectedPlant(plant); setView('detail'); }}
              >
                <span className="featured-image">{plant.image}</span>
                <span className="featured-name">{plant.name}</span>
              </div>
            ))}
          </div>
        </div>

        <nav className="home-nav">
          <button onClick={() => setView('journal')}>
            <span>📓</span>
            <span>My Journal</span>
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
