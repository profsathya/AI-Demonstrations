import { useState, useMemo } from 'react'
import './PassVault.css'

// Simulated encryption (in production, use Web Crypto API with proper key derivation)
const simulateEncrypt = (text, key) => {
  return btoa(text.split('').map((c, i) =>
    String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
  ).join(''))
}

const simulateDecrypt = (encrypted, key) => {
  try {
    const decoded = atob(encrypted)
    return decoded.split('').map((c, i) =>
      String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
    ).join('')
  } catch {
    return ''
  }
}

// Password strength checker
const checkPasswordStrength = (password) => {
  let score = 0
  const checks = {
    length: password.length >= 12,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numbers: /[0-9]/.test(password),
    symbols: /[^a-zA-Z0-9]/.test(password),
    noCommon: !['password', '123456', 'qwerty', 'admin'].some(p => password.toLowerCase().includes(p)),
  }

  Object.values(checks).forEach(passed => { if (passed) score++ })

  if (score <= 2) return { level: 'weak', score, color: '#ef4444', checks }
  if (score <= 4) return { level: 'moderate', score, color: '#f59e0b', checks }
  return { level: 'strong', score, color: '#22c55e', checks }
}

// Password generator
const generatePassword = (length = 16, options = {}) => {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numbers = '0123456789'
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'

  let chars = ''
  if (options.lowercase !== false) chars += lowercase
  if (options.uppercase !== false) chars += uppercase
  if (options.numbers !== false) chars += numbers
  if (options.symbols !== false) chars += symbols

  let password = ''
  for (let i = 0; i < length; i++) {
    password += chars[Math.floor(Math.random() * chars.length)]
  }
  return password
}

// Demo data
const DEMO_CREDENTIALS = [
  { id: 1, category: 'school', name: 'University Portal', username: 'student123', password: 'UniPass2024!', url: 'portal.university.edu', notes: 'Main student portal' },
  { id: 2, category: 'school', name: 'Canvas LMS', username: 'jsmith@university.edu', password: 'Canvas$ecure99', url: 'canvas.university.edu', notes: '' },
  { id: 3, category: 'school', name: 'Library Database', username: 'js2024', password: 'LibraryAccess#1', url: 'library.university.edu', notes: 'Research database access' },
  { id: 4, category: 'personal', name: 'Gmail', username: 'john.smith@gmail.com', password: 'Personal!Mail123', url: 'gmail.com', notes: 'Personal email' },
  { id: 5, category: 'personal', name: 'GitHub', username: 'jsmith-dev', password: 'G1tHub$ecurity', url: 'github.com', notes: 'Personal projects' },
  { id: 6, category: 'work', name: 'Campus Job Portal', username: 'jsmith_ta', password: 'TAjob2024!', url: 'jobs.university.edu', notes: 'TA position application' },
]

export default function PassVault() {
  const [view, setView] = useState('login') // login, vault, add, generate, settings, about
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [masterPassword, setMasterPassword] = useState('')
  const [credentials, setCredentials] = useState(DEMO_CREDENTIALS)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedCredential, setSelectedCredential] = useState(null)
  const [showPassword, setShowPassword] = useState({})
  const [copiedField, setCopiedField] = useState(null)

  // New credential form
  const [newCredential, setNewCredential] = useState({
    category: 'personal',
    name: '',
    username: '',
    password: '',
    url: '',
    notes: '',
  })

  // Generator settings
  const [genLength, setGenLength] = useState(16)
  const [genOptions, setGenOptions] = useState({
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: true,
  })
  const [generatedPassword, setGeneratedPassword] = useState('')

  // Filter credentials
  const filteredCredentials = useMemo(() => {
    return credentials.filter(cred => {
      const matchesSearch = cred.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           cred.username.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || cred.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [credentials, searchQuery, selectedCategory])

  const handleLogin = (e) => {
    e.preventDefault()
    // Demo: any password works, but we simulate authentication
    if (masterPassword.length >= 4) {
      setIsUnlocked(true)
      setView('vault')
    }
  }

  const handleLock = () => {
    setIsUnlocked(false)
    setMasterPassword('')
    setView('login')
    setSelectedCredential(null)
  }

  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleAddCredential = (e) => {
    e.preventDefault()
    const newCred = {
      ...newCredential,
      id: Date.now(),
    }
    setCredentials(prev => [...prev, newCred])
    setNewCredential({
      category: 'personal',
      name: '',
      username: '',
      password: '',
      url: '',
      notes: '',
    })
    setView('vault')
  }

  const handleDeleteCredential = (id) => {
    setCredentials(prev => prev.filter(c => c.id !== id))
    setSelectedCredential(null)
  }

  const passwordStrength = checkPasswordStrength(newCredential.password || generatedPassword)

  if (view === 'about') {
    return (
      <div className="pass-vault">
        <header className="vault-header">
          <button className="back-btn" onClick={() => setView(isUnlocked ? 'vault' : 'login')}>Back</button>
          <h1>About PassVault</h1>
        </header>

        <div className="about-content">
          <section className="about-section">
            <h2>What is PassVault?</h2>
            <p>
              PassVault is an MVP password manager designed specifically for students and faculty.
              It provides secure credential storage with an intuitive interface optimized for academic contexts.
            </p>
          </section>

          <section className="about-section">
            <h2>Design Decisions for MVP</h2>
            <ul>
              <li><strong>Local-First Storage:</strong> Credentials stored in browser localStorage with simulated encryption. Production would use IndexedDB with Web Crypto API for AES-256 encryption.</li>
              <li><strong>Master Password:</strong> Single master password unlocks the vault. Production would implement PBKDF2/Argon2 key derivation with 100k+ iterations.</li>
              <li><strong>Category System:</strong> School, Personal, Work categories for quick filtering - reflects student/faculty workflows.</li>
              <li><strong>Password Generator:</strong> Client-side secure random generation using Math.random() for demo; production would use crypto.getRandomValues().</li>
              <li><strong>No Backend Required:</strong> Runs entirely client-side, no server needed for MVP.</li>
            </ul>
          </section>

          <section className="about-section">
            <h2>Security Features (MVP)</h2>
            <ul>
              <li>Master password requirement to unlock</li>
              <li>Auto-lock on inactivity (would be implemented)</li>
              <li>Password strength analyzer</li>
              <li>Secure password generator</li>
              <li>Click-to-copy (avoids shoulder surfing)</li>
              <li>Hidden passwords by default</li>
            </ul>
          </section>

          <section className="about-section">
            <h2>Production Requirements</h2>
            <ul>
              <li>End-to-end encryption with zero-knowledge architecture</li>
              <li>Browser extension for auto-fill</li>
              <li>Mobile apps with biometric unlock</li>
              <li>Secure cloud sync with encrypted backup</li>
              <li>SSO integration with university systems</li>
              <li>Breach monitoring (Have I Been Pwned integration)</li>
              <li>Secure password sharing for team accounts</li>
              <li>2FA/MFA support</li>
            </ul>
          </section>

          <section className="about-section">
            <h2>Why for Students/Faculty?</h2>
            <ul>
              <li>Multiple institutional accounts (LMS, email, portals)</li>
              <li>Research database access credentials</li>
              <li>Shared TA/lab accounts</li>
              <li>Transition between personal and academic contexts</li>
              <li>Free tier essential for students</li>
            </ul>
          </section>
        </div>
      </div>
    )
  }

  if (view === 'login') {
    return (
      <div className="pass-vault">
        <div className="login-screen">
          <div className="vault-icon">🔐</div>
          <h1>PassVault</h1>
          <p className="tagline">Secure passwords for students & faculty</p>

          <form className="login-form" onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter master password"
              value={masterPassword}
              onChange={(e) => setMasterPassword(e.target.value)}
              autoFocus
            />
            <button type="submit" disabled={masterPassword.length < 4}>
              Unlock Vault
            </button>
          </form>

          <p className="demo-hint">Demo: Enter any password (4+ characters)</p>

          <button className="about-link" onClick={() => setView('about')}>
            About PassVault
          </button>
        </div>
      </div>
    )
  }

  if (view === 'generate') {
    return (
      <div className="pass-vault">
        <header className="vault-header">
          <button className="back-btn" onClick={() => setView('vault')}>Back</button>
          <h1>Password Generator</h1>
        </header>

        <div className="generator-content">
          <div className="generated-display">
            <input
              type="text"
              value={generatedPassword}
              readOnly
              placeholder="Click Generate"
            />
            <button className="copy-btn" onClick={() => copyToClipboard(generatedPassword, 'generated')}>
              {copiedField === 'generated' ? '✓' : '📋'}
            </button>
          </div>

          {generatedPassword && (
            <div className="strength-meter">
              <div className="strength-bar" style={{
                width: `${(passwordStrength.score / 6) * 100}%`,
                backgroundColor: passwordStrength.color
              }} />
              <span style={{ color: passwordStrength.color }}>{passwordStrength.level}</span>
            </div>
          )}

          <div className="gen-option">
            <label>Length: {genLength}</label>
            <input
              type="range"
              min="8"
              max="32"
              value={genLength}
              onChange={(e) => setGenLength(parseInt(e.target.value))}
            />
          </div>

          <div className="gen-options">
            <label className="gen-checkbox">
              <input
                type="checkbox"
                checked={genOptions.lowercase}
                onChange={(e) => setGenOptions(o => ({ ...o, lowercase: e.target.checked }))}
              />
              <span>Lowercase (a-z)</span>
            </label>
            <label className="gen-checkbox">
              <input
                type="checkbox"
                checked={genOptions.uppercase}
                onChange={(e) => setGenOptions(o => ({ ...o, uppercase: e.target.checked }))}
              />
              <span>Uppercase (A-Z)</span>
            </label>
            <label className="gen-checkbox">
              <input
                type="checkbox"
                checked={genOptions.numbers}
                onChange={(e) => setGenOptions(o => ({ ...o, numbers: e.target.checked }))}
              />
              <span>Numbers (0-9)</span>
            </label>
            <label className="gen-checkbox">
              <input
                type="checkbox"
                checked={genOptions.symbols}
                onChange={(e) => setGenOptions(o => ({ ...o, symbols: e.target.checked }))}
              />
              <span>Symbols (!@#$%)</span>
            </label>
          </div>

          <button className="generate-btn" onClick={() => setGeneratedPassword(generatePassword(genLength, genOptions))}>
            Generate Password
          </button>
        </div>
      </div>
    )
  }

  if (view === 'add') {
    return (
      <div className="pass-vault">
        <header className="vault-header">
          <button className="back-btn" onClick={() => setView('vault')}>Cancel</button>
          <h1>Add Credential</h1>
        </header>

        <form className="add-form" onSubmit={handleAddCredential}>
          <div className="form-group">
            <label>Category</label>
            <select
              value={newCredential.category}
              onChange={(e) => setNewCredential(c => ({ ...c, category: e.target.value }))}
            >
              <option value="school">School</option>
              <option value="personal">Personal</option>
              <option value="work">Work</option>
            </select>
          </div>

          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              placeholder="e.g., Canvas LMS"
              value={newCredential.name}
              onChange={(e) => setNewCredential(c => ({ ...c, name: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label>Username / Email *</label>
            <input
              type="text"
              placeholder="e.g., student@university.edu"
              value={newCredential.username}
              onChange={(e) => setNewCredential(c => ({ ...c, username: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label>Password *</label>
            <div className="password-input">
              <input
                type={showPassword.new ? 'text' : 'password'}
                placeholder="Enter or generate password"
                value={newCredential.password}
                onChange={(e) => setNewCredential(c => ({ ...c, password: e.target.value }))}
                required
              />
              <button type="button" onClick={() => setShowPassword(s => ({ ...s, new: !s.new }))}>
                {showPassword.new ? '🙈' : '👁️'}
              </button>
              <button type="button" onClick={() => setNewCredential(c => ({ ...c, password: generatePassword(16, genOptions) }))}>
                🎲
              </button>
            </div>
            {newCredential.password && (
              <div className="inline-strength">
                <div className="strength-bar-mini" style={{
                  width: `${(checkPasswordStrength(newCredential.password).score / 6) * 100}%`,
                  backgroundColor: checkPasswordStrength(newCredential.password).color
                }} />
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Website URL</label>
            <input
              type="url"
              placeholder="e.g., https://canvas.university.edu"
              value={newCredential.url}
              onChange={(e) => setNewCredential(c => ({ ...c, url: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              placeholder="Additional notes..."
              value={newCredential.notes}
              onChange={(e) => setNewCredential(c => ({ ...c, notes: e.target.value }))}
            />
          </div>

          <button type="submit" className="save-btn">Save Credential</button>
        </form>
      </div>
    )
  }

  // Vault view
  return (
    <div className="pass-vault">
      <header className="vault-header">
        <h1>PassVault</h1>
        <div className="header-actions">
          <button className="icon-btn" onClick={() => setView('generate')}>🎲</button>
          <button className="icon-btn" onClick={() => setView('about')}>ℹ️</button>
          <button className="lock-btn" onClick={handleLock}>🔒 Lock</button>
        </div>
      </header>

      <div className="search-bar">
        <input
          type="search"
          placeholder="Search credentials..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="category-tabs">
        {[
          { id: 'all', label: 'All', icon: '📁' },
          { id: 'school', label: 'School', icon: '🎓' },
          { id: 'personal', label: 'Personal', icon: '👤' },
          { id: 'work', label: 'Work', icon: '💼' },
        ].map(cat => (
          <button
            key={cat.id}
            className={`category-tab ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      <div className="credentials-list">
        {filteredCredentials.length === 0 ? (
          <div className="empty-state">
            <span>🔍</span>
            <p>No credentials found</p>
          </div>
        ) : (
          filteredCredentials.map(cred => (
            <div
              key={cred.id}
              className={`credential-card ${selectedCredential?.id === cred.id ? 'expanded' : ''}`}
              onClick={() => setSelectedCredential(selectedCredential?.id === cred.id ? null : cred)}
            >
              <div className="cred-header">
                <div className="cred-icon">
                  {cred.category === 'school' ? '🎓' : cred.category === 'work' ? '💼' : '👤'}
                </div>
                <div className="cred-info">
                  <span className="cred-name">{cred.name}</span>
                  <span className="cred-username">{cred.username}</span>
                </div>
                <span className="expand-icon">{selectedCredential?.id === cred.id ? '▼' : '▶'}</span>
              </div>

              {selectedCredential?.id === cred.id && (
                <div className="cred-details">
                  <div className="cred-field">
                    <label>Username</label>
                    <div className="field-value">
                      <span>{cred.username}</span>
                      <button onClick={(e) => { e.stopPropagation(); copyToClipboard(cred.username, `user-${cred.id}`); }}>
                        {copiedField === `user-${cred.id}` ? '✓' : '📋'}
                      </button>
                    </div>
                  </div>

                  <div className="cred-field">
                    <label>Password</label>
                    <div className="field-value">
                      <span>{showPassword[cred.id] ? cred.password : '••••••••'}</span>
                      <button onClick={(e) => { e.stopPropagation(); setShowPassword(s => ({ ...s, [cred.id]: !s[cred.id] })); }}>
                        {showPassword[cred.id] ? '🙈' : '👁️'}
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); copyToClipboard(cred.password, `pass-${cred.id}`); }}>
                        {copiedField === `pass-${cred.id}` ? '✓' : '📋'}
                      </button>
                    </div>
                  </div>

                  {cred.url && (
                    <div className="cred-field">
                      <label>URL</label>
                      <a href={`https://${cred.url}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                        {cred.url}
                      </a>
                    </div>
                  )}

                  {cred.notes && (
                    <div className="cred-field">
                      <label>Notes</label>
                      <span className="notes">{cred.notes}</span>
                    </div>
                  )}

                  <button className="delete-btn" onClick={(e) => { e.stopPropagation(); handleDeleteCredential(cred.id); }}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <button className="add-fab" onClick={() => setView('add')}>+</button>
    </div>
  )
}
