import { useState, useCallback } from 'react'
import './SecureScan.css'

// Security check definitions
const SECURITY_CHECKS = {
  https: {
    id: 'https',
    name: 'HTTPS Encryption',
    category: 'transport',
    description: 'Checks if the site uses HTTPS for secure data transmission',
    severity: 'critical',
    recommendation: 'Enable HTTPS with a valid SSL/TLS certificate'
  },
  hsts: {
    id: 'hsts',
    name: 'HTTP Strict Transport Security',
    category: 'headers',
    description: 'HSTS header forces browsers to use HTTPS connections',
    severity: 'high',
    recommendation: 'Add Strict-Transport-Security header with appropriate max-age'
  },
  contentSecurityPolicy: {
    id: 'contentSecurityPolicy',
    name: 'Content Security Policy',
    category: 'headers',
    description: 'CSP helps prevent XSS and data injection attacks',
    severity: 'high',
    recommendation: 'Implement a Content-Security-Policy header'
  },
  xFrameOptions: {
    id: 'xFrameOptions',
    name: 'X-Frame-Options',
    category: 'headers',
    description: 'Prevents clickjacking by controlling iframe embedding',
    severity: 'medium',
    recommendation: 'Set X-Frame-Options to DENY or SAMEORIGIN'
  },
  xContentTypeOptions: {
    id: 'xContentTypeOptions',
    name: 'X-Content-Type-Options',
    category: 'headers',
    description: 'Prevents MIME-type sniffing attacks',
    severity: 'medium',
    recommendation: 'Set X-Content-Type-Options: nosniff'
  },
  xssProtection: {
    id: 'xssProtection',
    name: 'X-XSS-Protection',
    category: 'headers',
    description: 'Browser built-in XSS filter (legacy but still useful)',
    severity: 'low',
    recommendation: 'Set X-XSS-Protection: 1; mode=block'
  },
  referrerPolicy: {
    id: 'referrerPolicy',
    name: 'Referrer Policy',
    category: 'headers',
    description: 'Controls how much referrer information is shared',
    severity: 'low',
    recommendation: 'Set Referrer-Policy to strict-origin-when-cross-origin or stricter'
  },
  permissionsPolicy: {
    id: 'permissionsPolicy',
    name: 'Permissions Policy',
    category: 'headers',
    description: 'Controls browser features and APIs available to the page',
    severity: 'low',
    recommendation: 'Implement Permissions-Policy to restrict unnecessary features'
  },
  serverHeader: {
    id: 'serverHeader',
    name: 'Server Header Exposure',
    category: 'information',
    description: 'Exposing server version can help attackers find vulnerabilities',
    severity: 'low',
    recommendation: 'Remove or obscure the Server header'
  },
  poweredBy: {
    id: 'poweredBy',
    name: 'X-Powered-By Header',
    category: 'information',
    description: 'Reveals technology stack information to attackers',
    severity: 'low',
    recommendation: 'Remove the X-Powered-By header'
  }
}

const SEVERITY_CONFIG = {
  critical: { color: '#ef4444', label: 'Critical', weight: 4 },
  high: { color: '#f59e0b', label: 'High', weight: 3 },
  medium: { color: '#eab308', label: 'Medium', weight: 2 },
  low: { color: '#22c55e', label: 'Low', weight: 1 }
}

const CATEGORIES = {
  transport: { name: 'Transport Security', icon: '🔒' },
  headers: { name: 'Security Headers', icon: '📋' },
  information: { name: 'Information Disclosure', icon: '🔍' }
}

function validateUrl(string) {
  try {
    const url = new URL(string)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function analyzeUrl(urlString) {
  const url = new URL(urlString)
  const results = {}

  // Check HTTPS
  results.https = {
    ...SECURITY_CHECKS.https,
    status: url.protocol === 'https:' ? 'pass' : 'fail',
    details: url.protocol === 'https:'
      ? 'Site uses HTTPS encryption'
      : 'Site uses insecure HTTP connection'
  }

  return results
}

// Simulated scan for demo purposes (since we can't access arbitrary headers from browser)
function simulateScan(urlString) {
  const url = new URL(urlString)
  const isHttps = url.protocol === 'https:'
  const domain = url.hostname

  // Create realistic results based on common patterns
  const isWellKnownSecure = ['google.com', 'github.com', 'microsoft.com', 'apple.com', 'cloudflare.com']
    .some(d => domain.includes(d))

  const results = {}

  // HTTPS check (real)
  results.https = {
    ...SECURITY_CHECKS.https,
    status: isHttps ? 'pass' : 'fail',
    details: isHttps
      ? 'Site uses HTTPS encryption'
      : 'Site uses insecure HTTP - all data transmitted in plain text'
  }

  // Simulated header checks with realistic patterns
  const headerChecks = [
    { key: 'hsts', passRate: isWellKnownSecure ? 0.95 : 0.4 },
    { key: 'contentSecurityPolicy', passRate: isWellKnownSecure ? 0.9 : 0.25 },
    { key: 'xFrameOptions', passRate: isWellKnownSecure ? 0.95 : 0.6 },
    { key: 'xContentTypeOptions', passRate: isWellKnownSecure ? 0.98 : 0.5 },
    { key: 'xssProtection', passRate: isWellKnownSecure ? 0.7 : 0.4 },
    { key: 'referrerPolicy', passRate: isWellKnownSecure ? 0.85 : 0.3 },
    { key: 'permissionsPolicy', passRate: isWellKnownSecure ? 0.6 : 0.15 },
  ]

  // Use domain hash for consistent results per domain
  const domainHash = domain.split('').reduce((a, c) => a + c.charCodeAt(0), 0)

  headerChecks.forEach(({ key, passRate }) => {
    const check = SECURITY_CHECKS[key]
    const seed = (domainHash + key.length) % 100
    const passes = seed < passRate * 100

    results[key] = {
      ...check,
      status: passes ? 'pass' : 'fail',
      details: passes
        ? `${check.name} header is properly configured`
        : `${check.name} header is missing or misconfigured`
    }
  })

  // Information disclosure checks
  const serverExposed = (domainHash % 3) !== 0
  results.serverHeader = {
    ...SECURITY_CHECKS.serverHeader,
    status: serverExposed ? 'warn' : 'pass',
    details: serverExposed
      ? 'Server header reveals version information'
      : 'Server header is hidden or obscured'
  }

  const poweredByExposed = (domainHash % 4) === 0
  results.poweredBy = {
    ...SECURITY_CHECKS.poweredBy,
    status: poweredByExposed ? 'warn' : 'pass',
    details: poweredByExposed
      ? 'X-Powered-By header reveals technology stack'
      : 'X-Powered-By header is not exposed'
  }

  return results
}

function calculateScore(results) {
  const checks = Object.values(results)
  let totalWeight = 0
  let passedWeight = 0

  checks.forEach(check => {
    const weight = SEVERITY_CONFIG[check.severity].weight
    totalWeight += weight
    if (check.status === 'pass') {
      passedWeight += weight
    } else if (check.status === 'warn') {
      passedWeight += weight * 0.5
    }
  })

  return Math.round((passedWeight / totalWeight) * 100)
}

function getScoreGrade(score) {
  if (score >= 90) return { grade: 'A', color: '#22c55e', label: 'Excellent' }
  if (score >= 80) return { grade: 'B', color: '#84cc16', label: 'Good' }
  if (score >= 70) return { grade: 'C', color: '#eab308', label: 'Fair' }
  if (score >= 60) return { grade: 'D', color: '#f59e0b', label: 'Poor' }
  return { grade: 'F', color: '#ef4444', label: 'Critical' }
}

export default function SecureScan() {
  const [url, setUrl] = useState('')
  const [isScanning, setIsScanning] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const handleScan = useCallback(async () => {
    setError('')
    setResults(null)

    // Validate URL
    let targetUrl = url.trim()
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl
    }

    if (!validateUrl(targetUrl)) {
      setError('Please enter a valid URL')
      return
    }

    setIsScanning(true)

    // Simulate scan delay for realistic feel
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000))

    try {
      const scanResults = simulateScan(targetUrl)
      setResults({
        url: targetUrl,
        timestamp: new Date().toISOString(),
        checks: scanResults,
        score: calculateScore(scanResults)
      })
    } catch (err) {
      setError('Failed to scan URL. Please check the URL and try again.')
    }

    setIsScanning(false)
  }, [url])

  const filteredChecks = results
    ? Object.values(results.checks).filter(check =>
        activeCategory === 'all' || check.category === activeCategory
      )
    : []

  const stats = results ? {
    pass: Object.values(results.checks).filter(c => c.status === 'pass').length,
    warn: Object.values(results.checks).filter(c => c.status === 'warn').length,
    fail: Object.values(results.checks).filter(c => c.status === 'fail').length
  } : null

  const scoreInfo = results ? getScoreGrade(results.score) : null

  return (
    <div className="secure-scan">
      {/* Header */}
      <div className="scan-header">
        <h1>
          <span className="header-icon">🛡️</span>
          SecureScan
        </h1>
        <p>Analyze website security headers and configuration</p>
      </div>

      {/* URL Input */}
      <div className="scan-input-section">
        <div className="url-input-wrapper">
          <span className="url-prefix">https://</span>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="example.com"
            className="url-input"
            onKeyDown={(e) => e.key === 'Enter' && handleScan()}
            disabled={isScanning}
          />
          <button
            onClick={handleScan}
            disabled={isScanning || !url.trim()}
            className="scan-button"
          >
            {isScanning ? (
              <>
                <span className="spinner" />
                Scanning...
              </>
            ) : (
              <>
                <span>🔍</span>
                Scan
              </>
            )}
          </button>
        </div>
        {error && <p className="error-message">{error}</p>}
      </div>

      {/* Scanning animation */}
      {isScanning && (
        <div className="scanning-animation">
          <div className="scan-line" />
          <p>Analyzing security configuration...</p>
        </div>
      )}

      {/* Results Dashboard */}
      {results && !isScanning && (
        <div className="results-dashboard">
          {/* Score Overview */}
          <div className="score-section">
            <div className="score-card">
              <div
                className="score-circle"
                style={{ '--score-color': scoreInfo.color }}
              >
                <span className="score-grade">{scoreInfo.grade}</span>
                <span className="score-value">{results.score}</span>
              </div>
              <div className="score-info">
                <h3>Security Score</h3>
                <p className="score-label" style={{ color: scoreInfo.color }}>
                  {scoreInfo.label}
                </p>
                <p className="score-url">{new URL(results.url).hostname}</p>
              </div>
            </div>

            <div className="stats-cards">
              <div className="stat-card pass">
                <span className="stat-icon">✓</span>
                <span className="stat-num">{stats.pass}</span>
                <span className="stat-label">Passed</span>
              </div>
              <div className="stat-card warn">
                <span className="stat-icon">!</span>
                <span className="stat-num">{stats.warn}</span>
                <span className="stat-label">Warnings</span>
              </div>
              <div className="stat-card fail">
                <span className="stat-icon">✗</span>
                <span className="stat-num">{stats.fail}</span>
                <span className="stat-label">Failed</span>
              </div>
            </div>
          </div>

          {/* Category Filters */}
          <div className="category-filters">
            <button
              className={`category-btn ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              All Checks
            </button>
            {Object.entries(CATEGORIES).map(([key, cat]) => (
              <button
                key={key}
                className={`category-btn ${activeCategory === key ? 'active' : ''}`}
                onClick={() => setActiveCategory(key)}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>

          {/* Check Results */}
          <div className="checks-list">
            {filteredChecks.map((check, index) => (
              <div
                key={check.id}
                className={`check-card ${check.status}`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="check-status">
                  {check.status === 'pass' && <span className="status-icon pass">✓</span>}
                  {check.status === 'warn' && <span className="status-icon warn">!</span>}
                  {check.status === 'fail' && <span className="status-icon fail">✗</span>}
                </div>
                <div className="check-content">
                  <div className="check-header">
                    <h4>{check.name}</h4>
                    <span
                      className="severity-badge"
                      style={{ backgroundColor: SEVERITY_CONFIG[check.severity].color }}
                    >
                      {SEVERITY_CONFIG[check.severity].label}
                    </span>
                  </div>
                  <p className="check-description">{check.description}</p>
                  <p className="check-details">{check.details}</p>
                  {check.status !== 'pass' && (
                    <div className="check-recommendation">
                      <strong>Recommendation:</strong> {check.recommendation}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <div className="disclaimer">
            <p>
              <strong>Note:</strong> This is a demonstration tool that simulates security header analysis.
              For comprehensive security testing, use professional tools like Mozilla Observatory,
              Security Headers, or conduct proper penetration testing.
            </p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!results && !isScanning && (
        <div className="empty-state">
          <div className="empty-icon">🔐</div>
          <h3>Enter a URL to scan</h3>
          <p>We'll analyze the security headers and configuration</p>
          <div className="check-preview">
            <h4>What we check:</h4>
            <ul>
              <li>🔒 HTTPS encryption</li>
              <li>📋 Security headers (CSP, HSTS, X-Frame-Options...)</li>
              <li>🔍 Information disclosure risks</li>
              <li>⚡ Best practices compliance</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
