import { useState, useEffect, useCallback, useRef } from 'react'
import './NavAssist.css'

// Simulated sensor data for the wearable
const generateSensorData = () => {
  const obstacles = []
  const numObstacles = Math.floor(Math.random() * 4) + 1

  for (let i = 0; i < numObstacles; i++) {
    obstacles.push({
      id: i,
      type: ['wall', 'object', 'person', 'vehicle', 'stairs', 'door'][Math.floor(Math.random() * 6)],
      distance: Math.random() * 5 + 0.5, // 0.5m to 5.5m
      angle: Math.random() * 180 - 90, // -90 to 90 degrees
      height: Math.random() * 2 + 0.3, // 0.3m to 2.3m
    })
  }

  return {
    obstacles: obstacles.sort((a, b) => a.distance - b.distance),
    groundType: ['sidewalk', 'crosswalk', 'grass', 'stairs', 'ramp'][Math.floor(Math.random() * 5)],
    ambientLight: Math.random() * 100,
    gpsAccuracy: Math.random() * 5 + 1,
  }
}

// Haptic patterns for different alerts
const HAPTIC_PATTERNS = {
  warning: [100, 50, 100],
  danger: [200, 100, 200, 100, 200],
  success: [50],
  navigation: [50, 100, 50],
  obstacle: [150, 75, 150],
}

// Text-to-speech helper
const speak = (text, priority = 'polite') => {
  if ('speechSynthesis' in window) {
    // Cancel previous if urgent
    if (priority === 'assertive') {
      window.speechSynthesis.cancel()
    }
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 1.1
    utterance.pitch = 1
    window.speechSynthesis.speak(utterance)
  }
}

// Vibration helper
const vibrate = (pattern) => {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern)
  }
}

export default function NavAssist() {
  const [view, setView] = useState('home') // home, navigation, scan, settings, about
  const [isActive, setIsActive] = useState(false)
  const [sensorData, setSensorData] = useState(null)
  const [destination, setDestination] = useState('')
  const [navigationStep, setNavigationStep] = useState(0)
  const [settings, setSettings] = useState({
    voiceEnabled: true,
    hapticEnabled: true,
    detectionRange: 3, // meters
    alertThreshold: 1.5, // meters
    voiceSpeed: 1,
    hapticIntensity: 'medium',
  })
  const [scanHistory, setScanHistory] = useState([])
  const scanIntervalRef = useRef(null)

  // Simulated navigation route
  const navigationRoute = [
    { instruction: 'Head north on Main Street', distance: 50 },
    { instruction: 'Turn right onto Oak Avenue', distance: 30 },
    { instruction: 'Cross the street at crosswalk', distance: 10 },
    { instruction: 'Continue straight for 100 meters', distance: 100 },
    { instruction: 'Destination on your left', distance: 5 },
  ]

  // Continuous sensor scanning
  useEffect(() => {
    if (isActive) {
      scanIntervalRef.current = setInterval(() => {
        const data = generateSensorData()
        setSensorData(data)

        // Check for immediate dangers
        const nearObstacles = data.obstacles.filter(o => o.distance < settings.alertThreshold)
        if (nearObstacles.length > 0 && settings.hapticEnabled) {
          vibrate(HAPTIC_PATTERNS.warning)
        }
        if (nearObstacles.length > 0 && settings.voiceEnabled) {
          const closest = nearObstacles[0]
          const direction = closest.angle < -30 ? 'left' : closest.angle > 30 ? 'right' : 'ahead'
          speak(`${closest.type} ${direction}, ${closest.distance.toFixed(1)} meters`, 'assertive')
        }
      }, 2000)
    }

    return () => {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current)
      }
    }
  }, [isActive, settings])

  const performScan = useCallback(() => {
    const data = generateSensorData()
    setSensorData(data)
    setScanHistory(prev => [{ ...data, timestamp: new Date() }, ...prev].slice(0, 10))

    if (settings.hapticEnabled) {
      vibrate(HAPTIC_PATTERNS.success)
    }

    if (settings.voiceEnabled) {
      const obstacleCount = data.obstacles.length
      const closestObstacle = data.obstacles[0]

      let announcement = `Scan complete. ${obstacleCount} obstacle${obstacleCount !== 1 ? 's' : ''} detected. `
      if (closestObstacle) {
        const direction = closestObstacle.angle < -30 ? 'to your left' : closestObstacle.angle > 30 ? 'to your right' : 'directly ahead'
        announcement += `Nearest: ${closestObstacle.type} ${direction} at ${closestObstacle.distance.toFixed(1)} meters. `
      }
      announcement += `Ground type: ${data.groundType}.`
      speak(announcement)
    }
  }, [settings])

  const startNavigation = () => {
    if (destination) {
      setView('navigation')
      setNavigationStep(0)
      if (settings.voiceEnabled) {
        speak(`Starting navigation to ${destination}. ${navigationRoute[0].instruction}`)
      }
      if (settings.hapticEnabled) {
        vibrate(HAPTIC_PATTERNS.navigation)
      }
    }
  }

  const nextStep = () => {
    if (navigationStep < navigationRoute.length - 1) {
      setNavigationStep(prev => prev + 1)
      if (settings.voiceEnabled) {
        speak(navigationRoute[navigationStep + 1].instruction)
      }
      if (settings.hapticEnabled) {
        vibrate(HAPTIC_PATTERNS.navigation)
      }
    } else {
      if (settings.voiceEnabled) {
        speak('You have arrived at your destination')
      }
      if (settings.hapticEnabled) {
        vibrate(HAPTIC_PATTERNS.success)
      }
    }
  }

  const renderObstacleRadar = () => {
    if (!sensorData) return null

    return (
      <div className="obstacle-radar">
        <div className="radar-circle outer" />
        <div className="radar-circle middle" />
        <div className="radar-circle inner" />
        <div className="radar-line" />
        <div className="user-position">You</div>

        {sensorData.obstacles.map((obstacle, i) => {
          const x = Math.sin(obstacle.angle * Math.PI / 180) * (obstacle.distance / 5) * 45
          const y = -Math.cos(obstacle.angle * Math.PI / 180) * (obstacle.distance / 5) * 45
          const color = obstacle.distance < 1.5 ? '#ef4444' : obstacle.distance < 3 ? '#f59e0b' : '#22c55e'

          return (
            <div
              key={i}
              className="obstacle-marker"
              style={{
                left: `calc(50% + ${x}%)`,
                top: `calc(50% + ${y}%)`,
                backgroundColor: color,
              }}
              title={`${obstacle.type}: ${obstacle.distance.toFixed(1)}m`}
            >
              {obstacle.type === 'person' ? '👤' :
               obstacle.type === 'vehicle' ? '🚗' :
               obstacle.type === 'stairs' ? '🪜' :
               obstacle.type === 'door' ? '🚪' :
               obstacle.type === 'wall' ? '🧱' : '📦'}
            </div>
          )
        })}
      </div>
    )
  }

  if (view === 'about') {
    return (
      <div className="nav-assist">
        <header className="nav-header">
          <button className="back-btn" onClick={() => setView('home')}>Back</button>
          <h1>About NavAssist</h1>
        </header>

        <div className="about-content">
          <section className="about-section">
            <h2>What is NavAssist?</h2>
            <p>
              NavAssist is a simulated MVP for a wearable navigation device designed to help
              visually impaired individuals navigate independently without a traditional cane.
            </p>
          </section>

          <section className="about-section">
            <h2>Hardware Simulation</h2>
            <p>This MVP simulates the following hardware components that would be present in the actual wearable:</p>
            <ul>
              <li><strong>LiDAR/Ultrasonic Sensors:</strong> For obstacle detection in a 180-degree field</li>
              <li><strong>Camera + ML Processor:</strong> For object recognition (people, vehicles, stairs, doors)</li>
              <li><strong>GPS Module:</strong> For outdoor navigation and location tracking</li>
              <li><strong>Bone Conduction Speakers:</strong> For audio feedback without blocking ambient sounds</li>
              <li><strong>Haptic Motors:</strong> For directional vibration feedback</li>
              <li><strong>IMU (Accelerometer/Gyroscope):</strong> For orientation and movement tracking</li>
            </ul>
          </section>

          <section className="about-section">
            <h2>Design Decisions for MVP</h2>
            <ul>
              <li><strong>Web Speech API:</strong> Used for voice announcements - production would use bone conduction</li>
              <li><strong>Vibration API:</strong> Demonstrates haptic patterns - production would have directional haptics</li>
              <li><strong>Simulated Sensors:</strong> Random data generation mimics real sensor behavior patterns</li>
              <li><strong>Radar Visualization:</strong> Shows how spatial data would be processed internally</li>
              <li><strong>Accessibility First:</strong> Large touch targets, high contrast, screen reader support</li>
            </ul>
          </section>

          <section className="about-section">
            <h2>Production Requirements</h2>
            <ul>
              <li>Custom hardware with 8+ ultrasonic sensors arranged in arc pattern</li>
              <li>Edge ML processor (like Google Coral) for real-time object detection</li>
              <li>Low-power Bluetooth for smartphone integration</li>
              <li>8+ hour battery life in lightweight form factor (glasses or headband)</li>
              <li>IP65 water resistance for outdoor use</li>
              <li>Integration with transit APIs, indoor mapping (beacons), and accessibility databases</li>
            </ul>
          </section>

          <section className="about-section">
            <h2>Key Features</h2>
            <ul>
              <li>Real-time obstacle detection with distance and direction</li>
              <li>Multi-modal feedback (voice + haptic)</li>
              <li>Turn-by-turn navigation with landmark descriptions</li>
              <li>Ground surface detection (stairs, curbs, crosswalks)</li>
              <li>Customizable alert thresholds and feedback preferences</li>
            </ul>
          </section>
        </div>
      </div>
    )
  }

  if (view === 'settings') {
    return (
      <div className="nav-assist">
        <header className="nav-header">
          <button className="back-btn" onClick={() => setView('home')}>Back</button>
          <h1>Settings</h1>
        </header>

        <div className="settings-content">
          <div className="setting-group">
            <h3>Audio Feedback</h3>
            <label className="setting-toggle">
              <span>Voice Announcements</span>
              <input
                type="checkbox"
                checked={settings.voiceEnabled}
                onChange={(e) => setSettings(s => ({ ...s, voiceEnabled: e.target.checked }))}
              />
              <span className="toggle-slider" />
            </label>
            <label className="setting-slider">
              <span>Voice Speed</span>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={settings.voiceSpeed}
                onChange={(e) => setSettings(s => ({ ...s, voiceSpeed: parseFloat(e.target.value) }))}
              />
              <span>{settings.voiceSpeed}x</span>
            </label>
          </div>

          <div className="setting-group">
            <h3>Haptic Feedback</h3>
            <label className="setting-toggle">
              <span>Vibration Alerts</span>
              <input
                type="checkbox"
                checked={settings.hapticEnabled}
                onChange={(e) => setSettings(s => ({ ...s, hapticEnabled: e.target.checked }))}
              />
              <span className="toggle-slider" />
            </label>
            <label className="setting-select">
              <span>Intensity</span>
              <select
                value={settings.hapticIntensity}
                onChange={(e) => setSettings(s => ({ ...s, hapticIntensity: e.target.value }))}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
          </div>

          <div className="setting-group">
            <h3>Detection</h3>
            <label className="setting-slider">
              <span>Detection Range</span>
              <input
                type="range"
                min="1"
                max="5"
                step="0.5"
                value={settings.detectionRange}
                onChange={(e) => setSettings(s => ({ ...s, detectionRange: parseFloat(e.target.value) }))}
              />
              <span>{settings.detectionRange}m</span>
            </label>
            <label className="setting-slider">
              <span>Alert Threshold</span>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.25"
                value={settings.alertThreshold}
                onChange={(e) => setSettings(s => ({ ...s, alertThreshold: parseFloat(e.target.value) }))}
              />
              <span>{settings.alertThreshold}m</span>
            </label>
          </div>
        </div>
      </div>
    )
  }

  if (view === 'scan') {
    return (
      <div className="nav-assist">
        <header className="nav-header">
          <button className="back-btn" onClick={() => setView('home')}>Back</button>
          <h1>Environment Scan</h1>
        </header>

        <div className="scan-content">
          {renderObstacleRadar()}

          {sensorData && (
            <div className="scan-details">
              <div className="scan-stat">
                <span className="stat-label">Ground</span>
                <span className="stat-value">{sensorData.groundType}</span>
              </div>
              <div className="scan-stat">
                <span className="stat-label">Obstacles</span>
                <span className="stat-value">{sensorData.obstacles.length}</span>
              </div>
              <div className="scan-stat">
                <span className="stat-label">Light</span>
                <span className="stat-value">{sensorData.ambientLight > 50 ? 'Bright' : 'Dim'}</span>
              </div>
            </div>
          )}

          {sensorData && sensorData.obstacles.length > 0 && (
            <div className="obstacle-list">
              <h3>Detected Objects</h3>
              {sensorData.obstacles.map((o, i) => (
                <div key={i} className={`obstacle-item ${o.distance < 1.5 ? 'danger' : o.distance < 3 ? 'warning' : 'safe'}`}>
                  <span className="obstacle-icon">
                    {o.type === 'person' ? '👤' :
                     o.type === 'vehicle' ? '🚗' :
                     o.type === 'stairs' ? '🪜' :
                     o.type === 'door' ? '🚪' :
                     o.type === 'wall' ? '🧱' : '📦'}
                  </span>
                  <span className="obstacle-info">
                    <strong>{o.type}</strong>
                    <span>{o.distance.toFixed(1)}m {o.angle < -30 ? 'left' : o.angle > 30 ? 'right' : 'ahead'}</span>
                  </span>
                </div>
              ))}
            </div>
          )}

          <button className="scan-btn" onClick={performScan}>
            Scan Environment
          </button>
        </div>
      </div>
    )
  }

  if (view === 'navigation') {
    return (
      <div className="nav-assist">
        <header className="nav-header">
          <button className="back-btn" onClick={() => { setView('home'); setIsActive(false); }}>Exit</button>
          <h1>Navigating</h1>
          <button
            className={`active-toggle ${isActive ? 'active' : ''}`}
            onClick={() => setIsActive(!isActive)}
          >
            {isActive ? 'Scanning' : 'Paused'}
          </button>
        </header>

        <div className="navigation-content">
          <div className="destination-display">
            <span className="dest-label">Destination</span>
            <span className="dest-name">{destination}</span>
          </div>

          <div className="nav-step-card">
            <div className="step-number">Step {navigationStep + 1} of {navigationRoute.length}</div>
            <div className="step-instruction">{navigationRoute[navigationStep].instruction}</div>
            <div className="step-distance">{navigationRoute[navigationStep].distance}m</div>
          </div>

          {renderObstacleRadar()}

          <div className="nav-controls">
            <button className="repeat-btn" onClick={() => speak(navigationRoute[navigationStep].instruction)}>
              Repeat
            </button>
            <button className="next-btn" onClick={nextStep}>
              {navigationStep < navigationRoute.length - 1 ? 'Next Step' : 'Arrived'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="nav-assist">
      <header className="nav-header home-header">
        <h1>NavAssist</h1>
        <p className="tagline">Navigate with confidence</p>
      </header>

      <div className="home-content">
        <div className="quick-scan">
          <button className="quick-scan-btn" onClick={() => { setView('scan'); performScan(); }}>
            <span className="scan-icon">📡</span>
            <span>Quick Scan</span>
          </button>
        </div>

        <div className="navigation-input">
          <label>Where would you like to go?</label>
          <input
            type="text"
            placeholder="Enter destination..."
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            aria-label="Destination input"
          />
          <button
            className="start-nav-btn"
            onClick={startNavigation}
            disabled={!destination}
          >
            Start Navigation
          </button>
        </div>

        <div className="quick-destinations">
          <h3>Quick Destinations</h3>
          <div className="dest-buttons">
            {['Home', 'Work', 'Grocery Store', 'Bus Stop'].map(dest => (
              <button
                key={dest}
                className="dest-btn"
                onClick={() => { setDestination(dest); }}
              >
                {dest}
              </button>
            ))}
          </div>
        </div>

        <nav className="home-nav">
          <button onClick={() => setView('scan')}>
            <span>📡</span>
            <span>Scan</span>
          </button>
          <button onClick={() => setView('settings')}>
            <span>⚙️</span>
            <span>Settings</span>
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
