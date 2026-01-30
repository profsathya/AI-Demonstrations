import DemoCard from '../components/DemoCard'
import { demos } from '../demos'
import './Home.css'

function Home() {
  const demoList = Object.entries(demos)

  return (
    <div className="container">
      <section className="hero">
        <h1>AI Capability Demonstrations</h1>
        <p>
          Interactive examples showcasing what AI and Claude Code can do.
          Built for educational purposes to help students understand modern AI capabilities.
        </p>
      </section>

      {demoList.length === 0 ? (
        <div className="empty-state">
          <h2>No demos yet</h2>
          <p>Demos will appear here once they are added to the project.</p>
          <code>src/demos/</code>
        </div>
      ) : (
        <section className="demos-grid">
          {demoList.map(([id, demo]) => (
            <DemoCard key={id} id={id} demo={demo} />
          ))}
        </section>
      )}
    </div>
  )
}

export default Home
