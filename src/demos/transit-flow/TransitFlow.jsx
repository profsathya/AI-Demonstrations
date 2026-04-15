import { useState, useEffect } from 'react'
import './TransitFlow.css'

// Simulated transit data
const ROUTES = [
  { id: '1', name: 'Red Line', type: 'rail', color: '#ef4444' },
  { id: '2', name: 'Blue Line', type: 'rail', color: '#3b82f6' },
  { id: '3', name: 'Green Line', type: 'rail', color: '#22c55e' },
  { id: '10', name: 'Route 10', type: 'bus', color: '#f59e0b' },
  { id: '25', name: 'Route 25', type: 'bus', color: '#8b5cf6' },
  { id: '42', name: 'Route 42', type: 'bus', color: '#ec4899' },
]

const STOPS = [
  { id: 's1', name: 'Central Station', routes: ['1', '2', '3', '10'] },
  { id: 's2', name: 'University', routes: ['2', '25'] },
  { id: 's3', name: 'Downtown', routes: ['1', '3', '10', '42'] },
  { id: 's4', name: 'Airport', routes: ['2'] },
  { id: 's5', name: 'Tech Park', routes: ['3', '25'] },
  { id: 's6', name: 'Medical Center', routes: ['1', '42'] },
  { id: 's7', name: 'Shopping Mall', routes: ['10', '25', '42'] },
]

const generateArrivals = (routeId) => {
  const arrivals = []
  let time = Math.floor(Math.random() * 5) + 1
  for (let i = 0; i < 4; i++) {
    arrivals.push({
      time,
      destination: ['Central Station', 'Airport', 'Downtown', 'University'][Math.floor(Math.random() * 4)],
      crowding: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
      onTime: Math.random() > 0.2,
    })
    time += Math.floor(Math.random() * 10) + 5
  }
  return arrivals
}

const SAVED_TRIPS = [
  { id: 1, name: 'Work', from: 'Home', to: 'Tech Park', routes: ['2', '3'] },
  { id: 2, name: 'School', from: 'Home', to: 'University', routes: ['2'] },
]

const ALERTS = [
  { id: 1, type: 'delay', route: '1', message: 'Red Line: 10 min delays due to signal issues', time: '15 min ago' },
  { id: 2, type: 'info', route: '10', message: 'Route 10: Detour via Main St this weekend', time: '1 hour ago' },
]

export default function TransitFlow() {
  const [view, setView] = useState('home') // home, search, stop, route, trip, about
  const [selectedStop, setSelectedStop] = useState(null)
  const [selectedRoute, setSelectedRoute] = useState(null)
  const [arrivals, setArrivals] = useState([])
  const [searchFrom, setSearchFrom] = useState('')
  const [searchTo, setSearchTo] = useState('')
  const [tripResults, setTripResults] = useState(null)

  useEffect(() => {
    if (selectedRoute || selectedStop) {
      setArrivals(generateArrivals(selectedRoute?.id))
      const interval = setInterval(() => {
        setArrivals(prev => prev.map(a => ({ ...a, time: Math.max(0, a.time - 1) })))
      }, 60000) // Update every minute in real app
      return () => clearInterval(interval)
    }
  }, [selectedRoute, selectedStop])

  const searchTrip = () => {
    if (searchFrom && searchTo) {
      // Simulate trip planning
      setTripResults({
        duration: Math.floor(Math.random() * 30) + 15,
        transfers: Math.floor(Math.random() * 2),
        fare: (Math.random() * 2 + 1.5).toFixed(2),
        routes: ROUTES.slice(0, Math.floor(Math.random() * 2) + 1),
        steps: [
          { type: 'walk', instruction: 'Walk to Central Station', duration: 5 },
          { type: 'transit', route: ROUTES[0], instruction: 'Take Red Line towards Airport', duration: 12 },
          { type: 'transfer', instruction: 'Transfer at Downtown', duration: 3 },
          { type: 'transit', route: ROUTES[2], instruction: 'Take Green Line towards Tech Park', duration: 8 },
          { type: 'walk', instruction: 'Walk to destination', duration: 3 },
        ]
      })
      setView('trip')
    }
  }

  if (view === 'about') {
    return (
      <div className="transit-flow">
        <header className="tf-header">
          <button className="back-btn" onClick={() => setView('home')}>Back</button>
          <h1>About TransitFlow</h1>
        </header>

        <div className="about-content">
          <section className="about-section">
            <h2>What is TransitFlow?</h2>
            <p>
              TransitFlow is a next-generation public transit app designed to make
              commuting easier with real-time arrivals, trip planning, and service alerts.
            </p>
          </section>

          <section className="about-section">
            <h2>Design Decisions for MVP</h2>
            <ul>
              <li><strong>Real-time Arrivals:</strong> Countdown timers for next departures</li>
              <li><strong>Crowding Indicators:</strong> Know how full vehicles are before they arrive</li>
              <li><strong>Trip Planning:</strong> Multi-modal routing with walking + transit</li>
              <li><strong>Service Alerts:</strong> Delays and disruptions prominently displayed</li>
              <li><strong>Saved Trips:</strong> Quick access to frequent routes</li>
              <li><strong>Simulated Data:</strong> Random generation mimics GTFS real-time feeds</li>
            </ul>
          </section>

          <section className="about-section">
            <h2>Production Requirements</h2>
            <ul>
              <li>GTFS and GTFS-RT feed integration</li>
              <li>Real-time vehicle tracking via AVL systems</li>
              <li>Push notifications for alerts</li>
              <li>Offline schedules and maps</li>
              <li>Accessibility features (screen reader, high contrast)</li>
              <li>Integration with payment systems (mobile fare)</li>
              <li>Bike/scooter share integration</li>
              <li>AR wayfinding for stations</li>
            </ul>
          </section>

          <section className="about-section">
            <h2>What Makes It Better?</h2>
            <ul>
              <li>Crowding predictions help avoid packed trains</li>
              <li>Cleaner UI focused on quick info access</li>
              <li>Proactive alerts before you leave</li>
              <li>Multi-modal trip planning (transit + walking + bikes)</li>
              <li>Fare estimates upfront</li>
            </ul>
          </section>
        </div>
      </div>
    )
  }

  if (view === 'trip' && tripResults) {
    return (
      <div className="transit-flow">
        <header className="tf-header">
          <button className="back-btn" onClick={() => setView('search')}>Back</button>
          <h1>Trip Details</h1>
        </header>

        <div className="trip-content">
          <div className="trip-summary">
            <div className="trip-endpoints">
              <span className="endpoint from">{searchFrom}</span>
              <span className="endpoint-arrow">→</span>
              <span className="endpoint to">{searchTo}</span>
            </div>
            <div className="trip-stats">
              <div className="stat">
                <span className="stat-value">{tripResults.duration}</span>
                <span className="stat-label">min</span>
              </div>
              <div className="stat">
                <span className="stat-value">{tripResults.transfers}</span>
                <span className="stat-label">transfers</span>
              </div>
              <div className="stat">
                <span className="stat-value">${tripResults.fare}</span>
                <span className="stat-label">fare</span>
              </div>
            </div>
          </div>

          <div className="trip-steps">
            {tripResults.steps.map((step, i) => (
              <div key={i} className={`trip-step ${step.type}`}>
                <div className="step-indicator">
                  {step.type === 'walk' ? '🚶' : step.type === 'transit' ? '🚇' : '🔄'}
                </div>
                <div className="step-content">
                  <span className="step-instruction">{step.instruction}</span>
                  <span className="step-duration">{step.duration} min</span>
                  {step.route && (
                    <span className="step-route" style={{ backgroundColor: step.route.color }}>
                      {step.route.name}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button className="start-btn">Start Navigation</button>
        </div>
      </div>
    )
  }

  if (view === 'search') {
    return (
      <div className="transit-flow">
        <header className="tf-header">
          <button className="back-btn" onClick={() => setView('home')}>Back</button>
          <h1>Plan Trip</h1>
        </header>

        <div className="search-content">
          <div className="search-inputs">
            <div className="input-group">
              <span className="input-icon">📍</span>
              <input
                type="text"
                placeholder="From"
                value={searchFrom}
                onChange={(e) => setSearchFrom(e.target.value)}
                list="stops-from"
              />
              <datalist id="stops-from">
                {STOPS.map(s => <option key={s.id} value={s.name} />)}
              </datalist>
            </div>
            <div className="input-group">
              <span className="input-icon">🎯</span>
              <input
                type="text"
                placeholder="To"
                value={searchTo}
                onChange={(e) => setSearchTo(e.target.value)}
                list="stops-to"
              />
              <datalist id="stops-to">
                {STOPS.map(s => <option key={s.id} value={s.name} />)}
              </datalist>
            </div>
            <button className="swap-btn">⇅</button>
          </div>

          <button
            className="search-btn"
            onClick={searchTrip}
            disabled={!searchFrom || !searchTo}
          >
            Find Routes
          </button>

          <div className="saved-trips">
            <h3>Saved Trips</h3>
            {SAVED_TRIPS.map(trip => (
              <button
                key={trip.id}
                className="saved-trip"
                onClick={() => { setSearchFrom(trip.from); setSearchTo(trip.to); }}
              >
                <span className="trip-icon">⭐</span>
                <div className="trip-info">
                  <span className="trip-name">{trip.name}</span>
                  <span className="trip-route">{trip.from} → {trip.to}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (view === 'stop' && selectedStop) {
    const stopRoutes = ROUTES.filter(r => selectedStop.routes.includes(r.id))

    return (
      <div className="transit-flow">
        <header className="tf-header">
          <button className="back-btn" onClick={() => setView('home')}>Back</button>
          <h1>{selectedStop.name}</h1>
        </header>

        <div className="stop-content">
          <div className="stop-routes">
            {stopRoutes.map(route => (
              <span key={route.id} className="route-badge" style={{ backgroundColor: route.color }}>
                {route.name}
              </span>
            ))}
          </div>

          <div className="arrivals-list">
            <h3>Next Arrivals</h3>
            {arrivals.map((arr, i) => (
              <div key={i} className="arrival-item">
                <div className="arrival-time">
                  <span className="time-value">{arr.time}</span>
                  <span className="time-unit">min</span>
                </div>
                <div className="arrival-info">
                  <span className="arrival-dest">to {arr.destination}</span>
                  <div className="arrival-meta">
                    <span className={`crowding ${arr.crowding}`}>
                      {arr.crowding === 'low' ? '😌 Not crowded' :
                       arr.crowding === 'medium' ? '😐 Some seats' : '😬 Standing only'}
                    </span>
                    {!arr.onTime && <span className="delayed">Delayed</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Home view
  return (
    <div className="transit-flow">
      <header className="tf-header home-header">
        <h1>TransitFlow</h1>
        <p className="tagline">Smarter commuting</p>
      </header>

      <div className="home-content">
        <button className="trip-planner" onClick={() => setView('search')}>
          <span>🗺️</span>
          <span>Plan a Trip</span>
        </button>

        {ALERTS.length > 0 && (
          <div className="alerts-section">
            {ALERTS.map(alert => (
              <div key={alert.id} className={`alert-item ${alert.type}`}>
                <span className="alert-icon">{alert.type === 'delay' ? '⚠️' : 'ℹ️'}</span>
                <span className="alert-message">{alert.message}</span>
              </div>
            ))}
          </div>
        )}

        <div className="nearby-section">
          <h3>Nearby Stops</h3>
          <div className="stops-list">
            {STOPS.slice(0, 4).map(stop => (
              <button
                key={stop.id}
                className="stop-item"
                onClick={() => { setSelectedStop(stop); setArrivals(generateArrivals()); setView('stop'); }}
              >
                <div className="stop-info">
                  <span className="stop-name">{stop.name}</span>
                  <div className="stop-routes-preview">
                    {stop.routes.slice(0, 3).map(rId => {
                      const route = ROUTES.find(r => r.id === rId)
                      return route ? (
                        <span key={rId} className="route-dot" style={{ backgroundColor: route.color }} />
                      ) : null
                    })}
                    {stop.routes.length > 3 && <span className="more-routes">+{stop.routes.length - 3}</span>}
                  </div>
                </div>
                <span className="stop-distance">0.{Math.floor(Math.random() * 5) + 1} mi</span>
              </button>
            ))}
          </div>
        </div>

        <div className="routes-section">
          <h3>All Routes</h3>
          <div className="routes-grid">
            {ROUTES.map(route => (
              <button
                key={route.id}
                className="route-card"
                style={{ borderColor: route.color }}
              >
                <span className="route-icon" style={{ backgroundColor: route.color }}>
                  {route.type === 'rail' ? '🚇' : '🚌'}
                </span>
                <span className="route-name">{route.name}</span>
              </button>
            ))}
          </div>
        </div>

        <button className="about-link" onClick={() => setView('about')}>
          About TransitFlow
        </button>
      </div>
    </div>
  )
}
