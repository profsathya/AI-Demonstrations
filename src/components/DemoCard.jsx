import { Link } from 'react-router-dom'
import './DemoCard.css'

function DemoCard({ id, demo }) {
  return (
    <Link to={`/demo/${id}`} className="demo-card">
      <div className="demo-card-icon">
        {demo.icon || '🤖'}
      </div>
      <h3 className="demo-card-title">{demo.title}</h3>
      <p className="demo-card-description">{demo.description}</p>
      {demo.tags && (
        <div className="demo-card-tags">
          {demo.tags.slice(0, 3).map(tag => (
            <span key={tag} className="demo-card-tag">{tag}</span>
          ))}
        </div>
      )}
    </Link>
  )
}

export default DemoCard
