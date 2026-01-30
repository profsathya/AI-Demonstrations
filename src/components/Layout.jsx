import { Link } from 'react-router-dom'
import './Layout.css'

function Layout({ children }) {
  return (
    <div className="layout">
      <header className="header">
        <div className="container">
          <Link to="/" className="logo">
            <span className="logo-icon">AI</span>
            <span className="logo-text">Capability Demos</span>
          </Link>
          <nav className="nav">
            <Link to="/">All Demos</Link>
            <a
              href="https://github.com/anthropics/claude-code"
              target="_blank"
              rel="noopener noreferrer"
            >
              Claude Code
            </a>
          </nav>
        </div>
      </header>

      <main className="main">
        {children}
      </main>

      <footer className="footer">
        <div className="container">
          <p>Educational demonstrations of AI capabilities</p>
        </div>
      </footer>
    </div>
  )
}

export default Layout
