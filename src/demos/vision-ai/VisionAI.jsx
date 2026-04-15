import { useState, useRef, useCallback } from 'react'
import './VisionAI.css'

// Simulated ML model predictions
const CATEGORIES = {
  objects: [
    { label: 'laptop', confidence: 0.94 },
    { label: 'keyboard', confidence: 0.89 },
    { label: 'coffee cup', confidence: 0.87 },
    { label: 'phone', confidence: 0.82 },
    { label: 'notebook', confidence: 0.78 },
    { label: 'pen', confidence: 0.71 },
    { label: 'monitor', confidence: 0.68 },
    { label: 'mouse', confidence: 0.65 },
  ],
  animals: [
    { label: 'golden retriever', confidence: 0.96 },
    { label: 'labrador', confidence: 0.89 },
    { label: 'dog', confidence: 0.99 },
    { label: 'domestic cat', confidence: 0.94 },
    { label: 'tabby cat', confidence: 0.88 },
    { label: 'bird', confidence: 0.82 },
  ],
  scenes: [
    { label: 'office workspace', confidence: 0.91 },
    { label: 'indoor', confidence: 0.97 },
    { label: 'modern interior', confidence: 0.84 },
    { label: 'beach sunset', confidence: 0.93 },
    { label: 'mountain landscape', confidence: 0.89 },
    { label: 'urban street', confidence: 0.86 },
  ],
  food: [
    { label: 'pizza', confidence: 0.95 },
    { label: 'salad', confidence: 0.88 },
    { label: 'coffee', confidence: 0.92 },
    { label: 'sandwich', confidence: 0.86 },
    { label: 'fruit bowl', confidence: 0.83 },
  ],
  text: [
    { label: 'English text detected', confidence: 0.98 },
    { label: 'printed text', confidence: 0.94 },
    { label: 'document', confidence: 0.89 },
    { label: 'sign', confidence: 0.82 },
  ],
}

const generatePredictions = () => {
  const categoryKeys = Object.keys(CATEGORIES)
  const primaryCategory = categoryKeys[Math.floor(Math.random() * categoryKeys.length)]
  const secondaryCategory = categoryKeys[Math.floor(Math.random() * categoryKeys.length)]

  const items = CATEGORIES[primaryCategory]
  const numPredictions = Math.floor(Math.random() * 3) + 3

  const predictions = items
    .slice(0, numPredictions)
    .map(item => ({
      ...item,
      confidence: Math.min(0.99, Math.max(0.5, item.confidence + (Math.random() - 0.5) * 0.2))
    }))
    .sort((a, b) => b.confidence - a.confidence)

  // Generate bounding boxes
  const boundingBoxes = predictions.slice(0, 3).map((pred, i) => ({
    label: pred.label,
    confidence: pred.confidence,
    x: 10 + Math.random() * 30,
    y: 10 + Math.random() * 30 + i * 20,
    width: 30 + Math.random() * 30,
    height: 25 + Math.random() * 25,
  }))

  // Generate scene tags
  const sceneTags = CATEGORIES.scenes
    .slice(0, 3)
    .map(s => ({ ...s, confidence: Math.min(0.99, s.confidence + (Math.random() - 0.5) * 0.15) }))

  // Detect colors
  const colors = [
    { name: 'blue', hex: '#3b82f6', percentage: 35 },
    { name: 'white', hex: '#f8fafc', percentage: 28 },
    { name: 'gray', hex: '#6b7280', percentage: 22 },
    { name: 'black', hex: '#1f2937', percentage: 15 },
  ]

  return {
    predictions,
    boundingBoxes,
    sceneTags,
    colors,
    metadata: {
      processingTime: Math.floor(Math.random() * 200) + 50,
      modelVersion: 'VisionAI v2.1',
      imageSize: '1920x1080',
      format: 'JPEG',
    }
  }
}

// Demo images
const DEMO_IMAGES = [
  { id: 1, name: 'Office Desk', url: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect fill="#1e293b" width="400" height="300"/><rect fill="#334155" x="50" y="100" width="300" height="150" rx="5"/><rect fill="#475569" x="100" y="120" width="200" height="110"/><rect fill="#64748b" x="150" y="220" width="100" height="10"/><circle fill="#f59e0b" cx="320" cy="80" r="30"/><rect fill="#6366f1" x="60" y="130" width="30" height="20" rx="3"/></svg>') },
  { id: 2, name: 'Nature Scene', url: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect fill="#0ea5e9" width="400" height="180"/><rect fill="#22c55e" y="180" width="400" height="120"/><circle fill="#fbbf24" cx="320" cy="60" r="40"/><path fill="#15803d" d="M100 180 L130 120 L160 180 Z"/><path fill="#166534" d="M140 180 L180 100 L220 180 Z"/><path fill="#15803d" d="M200 180 L235 130 L270 180 Z"/></svg>') },
  { id: 3, name: 'Food Plate', url: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect fill="#fef3c7" width="400" height="300"/><ellipse fill="#fff" cx="200" cy="150" rx="140" ry="120"/><ellipse fill="#fcd34d" cx="200" cy="150" rx="120" ry="100"/><circle fill="#ef4444" cx="160" cy="130" r="30"/><circle fill="#22c55e" cx="220" cy="120" r="25"/><circle fill="#f97316" cx="240" cy="170" r="20"/><circle fill="#84cc16" cx="170" cy="180" r="22"/></svg>') },
]

export default function VisionAI() {
  const [view, setView] = useState('home') // home, analyze, results, about
  const [selectedImage, setSelectedImage] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState(null)
  const [activeTab, setActiveTab] = useState('objects')
  const fileInputRef = useRef(null)

  const analyzeImage = useCallback((image) => {
    setSelectedImage(image)
    setIsAnalyzing(true)
    setView('analyze')

    // Simulate ML processing time
    setTimeout(() => {
      const analysisResults = generatePredictions()
      setResults(analysisResults)
      setIsAnalyzing(false)
      setView('results')
    }, 1500 + Math.random() * 1000)
  }, [])

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        analyzeImage({ name: file.name, url: e.target.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const renderConfidenceBar = (confidence) => (
    <div className="confidence-bar">
      <div
        className="confidence-fill"
        style={{
          width: `${confidence * 100}%`,
          backgroundColor: confidence > 0.8 ? '#22c55e' : confidence > 0.6 ? '#f59e0b' : '#ef4444'
        }}
      />
    </div>
  )

  if (view === 'about') {
    return (
      <div className="vision-ai">
        <header className="vision-header">
          <button className="back-btn" onClick={() => setView('home')}>Back</button>
          <h1>About VisionAI</h1>
        </header>

        <div className="about-content">
          <section className="about-section">
            <h2>What is VisionAI?</h2>
            <p>
              VisionAI is an MVP image recognition system that demonstrates computer vision capabilities
              including object detection, scene classification, color analysis, and more.
            </p>
          </section>

          <section className="about-section">
            <h2>ML Simulation</h2>
            <p>This MVP simulates the following ML models that would be used in production:</p>
            <ul>
              <li><strong>Object Detection:</strong> YOLOv8 or Faster R-CNN for bounding box detection</li>
              <li><strong>Image Classification:</strong> ResNet-50 or EfficientNet for scene/object classification</li>
              <li><strong>OCR:</strong> Tesseract or Google Vision API for text extraction</li>
              <li><strong>Face Detection:</strong> MTCNN or RetinaFace for face localization</li>
              <li><strong>Color Analysis:</strong> K-means clustering on pixel values</li>
            </ul>
          </section>

          <section className="about-section">
            <h2>Design Decisions for MVP</h2>
            <ul>
              <li><strong>Simulated Predictions:</strong> Random generation mimics ML model output format with confidence scores</li>
              <li><strong>Processing Animation:</strong> Shows realistic loading states during "inference"</li>
              <li><strong>Bounding Boxes:</strong> Demonstrates object localization visualization</li>
              <li><strong>Multiple Analysis Types:</strong> Objects, scenes, colors, metadata - shows breadth of capabilities</li>
              <li><strong>File Upload + Demo Images:</strong> Both custom and pre-loaded options for testing</li>
            </ul>
          </section>

          <section className="about-section">
            <h2>Production Requirements</h2>
            <ul>
              <li>GPU-accelerated inference server (NVIDIA T4/A100)</li>
              <li>TensorFlow Serving or Triton Inference Server</li>
              <li>Model optimization (TensorRT, ONNX Runtime)</li>
              <li>Edge deployment options (TensorFlow Lite, Core ML)</li>
              <li>Batch processing for large-scale analysis</li>
              <li>Model versioning and A/B testing infrastructure</li>
              <li>Training pipeline for custom model fine-tuning</li>
            </ul>
          </section>

          <section className="about-section">
            <h2>Use Cases</h2>
            <ul>
              <li>Accessibility tools (image descriptions)</li>
              <li>Content moderation</li>
              <li>Product cataloging for e-commerce</li>
              <li>Medical image analysis</li>
              <li>Document digitization (OCR)</li>
              <li>Security and surveillance</li>
              <li>Augmented reality applications</li>
            </ul>
          </section>
        </div>
      </div>
    )
  }

  if (view === 'analyze') {
    return (
      <div className="vision-ai">
        <header className="vision-header">
          <button className="back-btn" onClick={() => setView('home')}>Cancel</button>
          <h1>Analyzing</h1>
        </header>

        <div className="analyze-content">
          <div className="image-preview">
            <img src={selectedImage?.url} alt="Analyzing" />
            {isAnalyzing && <div className="scan-overlay" />}
          </div>

          <div className="processing-info">
            <div className="processing-spinner" />
            <h3>Processing Image...</h3>
            <div className="processing-steps">
              <div className="step active">
                <span className="step-icon">✓</span>
                <span>Loading image</span>
              </div>
              <div className={`step ${isAnalyzing ? 'active' : ''}`}>
                <span className="step-icon">{isAnalyzing ? '⏳' : '○'}</span>
                <span>Running ML models</span>
              </div>
              <div className="step">
                <span className="step-icon">○</span>
                <span>Generating results</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (view === 'results' && results) {
    return (
      <div className="vision-ai">
        <header className="vision-header">
          <button className="back-btn" onClick={() => { setView('home'); setResults(null); }}>New Image</button>
          <h1>Analysis Results</h1>
        </header>

        <div className="results-content">
          <div className="image-with-boxes">
            <img src={selectedImage?.url} alt="Analyzed" />
            {results.boundingBoxes.map((box, i) => (
              <div
                key={i}
                className="bounding-box"
                style={{
                  left: `${box.x}%`,
                  top: `${box.y}%`,
                  width: `${box.width}%`,
                  height: `${box.height}%`,
                }}
              >
                <span className="box-label">{box.label} ({(box.confidence * 100).toFixed(0)}%)</span>
              </div>
            ))}
          </div>

          <div className="results-tabs">
            {['objects', 'scenes', 'colors', 'meta'].map(tab => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'objects' ? '🎯 Objects' :
                 tab === 'scenes' ? '🏞️ Scenes' :
                 tab === 'colors' ? '🎨 Colors' : '📊 Meta'}
              </button>
            ))}
          </div>

          <div className="tab-content">
            {activeTab === 'objects' && (
              <div className="predictions-list">
                {results.predictions.map((pred, i) => (
                  <div key={i} className="prediction-item">
                    <span className="pred-label">{pred.label}</span>
                    <div className="pred-confidence">
                      {renderConfidenceBar(pred.confidence)}
                      <span className="confidence-value">{(pred.confidence * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'scenes' && (
              <div className="scene-tags">
                {results.sceneTags.map((tag, i) => (
                  <div key={i} className="scene-tag">
                    <span className="tag-label">{tag.label}</span>
                    <span className="tag-confidence">{(tag.confidence * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'colors' && (
              <div className="color-palette">
                {results.colors.map((color, i) => (
                  <div key={i} className="color-item">
                    <div className="color-swatch" style={{ backgroundColor: color.hex }} />
                    <div className="color-info">
                      <span className="color-name">{color.name}</span>
                      <span className="color-hex">{color.hex}</span>
                    </div>
                    <span className="color-percentage">{color.percentage}%</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'meta' && (
              <div className="metadata-list">
                <div className="meta-item">
                  <span className="meta-label">Processing Time</span>
                  <span className="meta-value">{results.metadata.processingTime}ms</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Model Version</span>
                  <span className="meta-value">{results.metadata.modelVersion}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Image Size</span>
                  <span className="meta-value">{results.metadata.imageSize}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Format</span>
                  <span className="meta-value">{results.metadata.format}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Home view
  return (
    <div className="vision-ai">
      <header className="vision-header home-header">
        <h1>VisionAI</h1>
        <p className="tagline">See what AI sees</p>
      </header>

      <div className="home-content">
        <div className="upload-section">
          <div
            className="upload-dropzone"
            onClick={() => fileInputRef.current?.click()}
          >
            <span className="upload-icon">📷</span>
            <span className="upload-text">Click to upload an image</span>
            <span className="upload-hint">or drag and drop</span>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            hidden
          />
        </div>

        <div className="demo-images">
          <h3>Or try a demo image</h3>
          <div className="demo-grid">
            {DEMO_IMAGES.map(img => (
              <button
                key={img.id}
                className="demo-image-btn"
                onClick={() => analyzeImage(img)}
              >
                <img src={img.url} alt={img.name} />
                <span>{img.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="capabilities">
          <h3>What we can detect</h3>
          <div className="capability-tags">
            <span>🎯 Objects</span>
            <span>👤 Faces</span>
            <span>📝 Text (OCR)</span>
            <span>🏞️ Scenes</span>
            <span>🎨 Colors</span>
            <span>🐾 Animals</span>
          </div>
        </div>

        <button className="about-btn" onClick={() => setView('about')}>
          About VisionAI
        </button>
      </div>
    </div>
  )
}
