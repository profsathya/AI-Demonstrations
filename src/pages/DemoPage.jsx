import { useParams, Link } from 'react-router-dom'
import { demos } from '../demos'
import './DemoPage.css'

function DemoPage() {
  const { demoId } = useParams()
  const demo = demos[demoId]

  if (!demo) {
    return (
      <div className="container">
        <div className="demo-not-found">
          <h1>Demo Not Found</h1>
          <p>The demo "{demoId}" doesn't exist.</p>
          <Link to="/" className="back-link">Back to all demos</Link>
        </div>
      </div>
    )
  }

  const DemoComponent = demo.component

  return (
    <div className="container">
      <div className="demo-header">
        <Link to="/" className="back-link">
          <span aria-hidden="true">&larr;</span> All Demos
        </Link>
        <h1>{demo.title}</h1>
        <p className="demo-description">{demo.description}</p>
        {demo.tags && (
          <div className="demo-tags">
            {demo.tags.map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        )}
      </div>

      <div className="demo-content">
        <DemoComponent />
      </div>
    </div>
  )
}

export default DemoPage
