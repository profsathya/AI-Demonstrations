/**
 * Demo Template
 *
 * Copy this folder to create a new demo:
 * 1. Copy _template folder and rename it (e.g., 'code-generation')
 * 2. Rename this file (e.g., 'CodeGenerationDemo.jsx')
 * 3. Update the component name and content
 * 4. Register in src/demos/index.js
 */

import './TemplateDemo.css'

function TemplateDemo() {
  return (
    <div className="template-demo">
      <section className="demo-section">
        <h2>Demo Section Title</h2>
        <p>
          Describe what this section demonstrates. Each demo can have multiple
          sections showing different aspects of the capability.
        </p>

        <div className="demo-interactive">
          {/* Add interactive elements here */}
          <p>Interactive demo content goes here</p>
        </div>
      </section>

      <section className="demo-section">
        <h2>How It Works</h2>
        <p>
          Explain the technology or capability being demonstrated.
        </p>

        <div className="demo-code-example">
          <pre>
            <code>
{`// Example code or output
function example() {
  return "Hello, World!"
}`}
            </code>
          </pre>
        </div>
      </section>
    </div>
  )
}

export default TemplateDemo
